// Smart Scheduling Engine — TCPA-compliant outreach scheduling with cooling periods

import type { WorkOrder } from '../core/types.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('scheduler');

// --- Types ---

export interface SchedulingStrategy {
  batchSize: number;
  intervalMs: number;
  maxRounds: number;
  voiceFirst: boolean; // always true per QANAT
}

export interface ContactRecord {
  techId: string;
  contactedAt: Date;
  channel: 'voice' | 'sms';
}

// --- Constants ---

/** TCPA mandates: no calls before 8am or after 9pm in recipient's local time */
const TCPA_START_HOUR = 8;
const TCPA_END_HOUR = 21; // 9pm = 21:00 (calls must stop before this)

/** Maximum contacts to same technician within the cooling window */
const MAX_CONTACTS_IN_WINDOW = 3;

/** Cooling window duration in milliseconds (24 hours) */
const COOLING_WINDOW_MS = 24 * 60 * 60 * 1000;

// --- In-memory contact ledger ---

const contactLedger: ContactRecord[] = [];

// --- Scheduling strategies by urgency ---

const STRATEGIES: Record<WorkOrder['urgency'], SchedulingStrategy> = {
  EMERGENCY: {
    batchSize: Infinity, // blast all candidates immediately
    intervalMs: 0,
    maxRounds: 1,
    voiceFirst: true,
  },
  URGENT: {
    batchSize: 3,
    intervalMs: 5 * 60 * 1000, // 5 minutes
    maxRounds: 10,
    voiceFirst: true,
  },
  STANDARD: {
    batchSize: 2,
    intervalMs: 15 * 60 * 1000, // 15 minutes
    maxRounds: 15,
    voiceFirst: true,
  },
  FLEXIBLE: {
    batchSize: 1,
    intervalMs: 30 * 60 * 1000, // 30 minutes
    maxRounds: 20,
    voiceFirst: true,
  },
};

// --- Helpers ---

/**
 * Get the current hour in a given IANA timezone.
 * Falls back to UTC if the timezone is unrecognized.
 */
function getCurrentHourInTimezone(timezone: string, now?: Date): number {
  const date = now ?? new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((p) => p.type === 'hour');
    return hourPart ? parseInt(hourPart.value, 10) : date.getUTCHours();
  } catch {
    log.warn('Invalid timezone, falling back to UTC', { timezone });
    return date.getUTCHours();
  }
}

/**
 * Get the current minute in a given IANA timezone.
 */
function getCurrentMinuteInTimezone(timezone: string, now?: Date): number {
  const date = now ?? new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      minute: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const minutePart = parts.find((p) => p.type === 'minute');
    return minutePart ? parseInt(minutePart.value, 10) : date.getUTCMinutes();
  } catch {
    return date.getUTCMinutes();
  }
}

/**
 * Prune contact records older than the cooling window.
 */
function pruneStaleRecords(): void {
  const cutoff = Date.now() - COOLING_WINDOW_MS;
  let i = 0;
  while (i < contactLedger.length) {
    const record = contactLedger[i];
    if (record && record.contactedAt.getTime() < cutoff) {
      contactLedger.splice(i, 1);
    } else {
      i++;
    }
  }
}

// --- Exported functions ---

/**
 * Check if the current time falls within the TCPA-compliant calling window
 * for the given timezone (8am-9pm local time).
 */
export function isWithinCallingWindow(techTimezone: string, now?: Date): boolean {
  const hour = getCurrentHourInTimezone(techTimezone, now);
  const within = hour >= TCPA_START_HOUR && hour < TCPA_END_HOUR;
  if (!within) {
    log.debug('Outside TCPA calling window', { techTimezone, hour });
  }
  return within;
}

/**
 * Check if a technician can be contacted (respects the 3-in-24h cooling period).
 */
export function canContactTechnician(techId: string, now?: Date): boolean {
  pruneStaleRecords();
  const cutoff = (now ?? new Date()).getTime() - COOLING_WINDOW_MS;
  const recentContacts = contactLedger.filter(
    (r) => r.techId === techId && r.contactedAt.getTime() >= cutoff
  );
  const allowed = recentContacts.length < MAX_CONTACTS_IN_WINDOW;
  if (!allowed) {
    log.info('Technician in cooling period', {
      techId,
      contactsInWindow: recentContacts.length,
    });
  }
  return allowed;
}

/**
 * Find the next available slot when a technician in the given timezone
 * can be contacted (i.e., the next time the TCPA window opens).
 * If already within the window, returns now.
 */
export function getNextAvailableSlot(techTimezone: string, now?: Date): Date {
  const date = now ?? new Date();

  if (isWithinCallingWindow(techTimezone, date)) {
    return date;
  }

  const hour = getCurrentHourInTimezone(techTimezone, date);
  const minute = getCurrentMinuteInTimezone(techTimezone, date);

  // Calculate how many hours until 8am
  let hoursUntilOpen: number;
  if (hour >= TCPA_END_HOUR) {
    // After 9pm — next window opens at 8am tomorrow
    hoursUntilOpen = 24 - hour + TCPA_START_HOUR;
  } else {
    // Before 8am — window opens at 8am today
    hoursUntilOpen = TCPA_START_HOUR - hour;
  }

  const msUntilOpen = (hoursUntilOpen * 60 - minute) * 60 * 1000;
  const nextSlot = new Date(date.getTime() + msUntilOpen);

  log.debug('Next available calling slot computed', {
    techTimezone,
    currentHour: hour,
    nextSlot: nextSlot.toISOString(),
  });

  return nextSlot;
}

/**
 * Record that a technician was contacted. This feeds the cooling period logic.
 */
export function recordContact(techId: string, channel: 'voice' | 'sms' = 'voice', now?: Date): void {
  const record: ContactRecord = {
    techId,
    contactedAt: now ?? new Date(),
    channel,
  };
  contactLedger.push(record);
  log.info('Contact recorded', { techId, channel });
}

/**
 * Get the scheduling strategy for a given urgency level.
 * Controls batch size, interval between rounds, and maximum rounds.
 */
export function getSchedulingStrategy(urgency: WorkOrder['urgency']): SchedulingStrategy {
  const strategy = STRATEGIES[urgency];
  log.debug('Scheduling strategy selected', {
    urgency,
    batchSize: strategy.batchSize,
    intervalMs: strategy.intervalMs,
  });
  return strategy;
}

/**
 * Get the number of recent contacts for a technician within the cooling window.
 * Useful for UI/monitoring.
 */
export function getContactCount(techId: string, now?: Date): number {
  pruneStaleRecords();
  const cutoff = (now ?? new Date()).getTime() - COOLING_WINDOW_MS;
  return contactLedger.filter(
    (r) => r.techId === techId && r.contactedAt.getTime() >= cutoff
  ).length;
}

/**
 * Clear all contact records (for testing).
 */
export function clearContactLedger(): void {
  contactLedger.length = 0;
}
