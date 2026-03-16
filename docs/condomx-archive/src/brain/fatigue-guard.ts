// Technician Fatigue Prevention & Intelligent Contact Rotation
//
// Prevents tech burnout by tracking cross-account contacts, enforcing persona
// consistency, learning per-tech active windows, implementing weighted rotation,
// and managing cold/dormant number lifecycle.

import { createLogger } from '../infra/logger.js';

const log = createLogger('brain:fatigue-guard');

// ── Types ───────────────────────────────────────────────────────────────────

export interface ContactEvent {
  techId: string;
  accountId: string;
  channel: 'voice' | 'sms';
  timestamp: string;
  outcome: 'accepted' | 'declined' | 'no_response' | 'voicemail';
}

export interface TechContactProfile {
  techId: string;
  primaryAccountId: string;
  totalContacts24h: number;
  lastContactedAt: string | null;
  lastDeclinedAt: string | null;
  activeWindow: { startHour: number; endHour: number } | null;
  status: 'active' | 'cooling' | 'cold' | 'dormant';
  coldSince: string | null;
}

export interface FatigueCheckResult {
  canContact: boolean;
  reason?: string;
  nextAvailableAt?: string;
  recommendedChannel?: 'voice' | 'sms';
  recommendedAccountId?: string;
}

// ── Constants ───────────────────────────────────────────────────────────────

/** Max contacts to a single tech across ALL accounts in 24 hours */
const GLOBAL_LIMIT_24H = 3;

/** Max contacts to a single tech from ONE account in 12 hours */
const PER_ACCOUNT_LIMIT_12H = 1;

/** Minimum cooldown after a tech declines (milliseconds) */
const DECLINE_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

/** Number of unanswered calls in 7 days before a number is flagged cold */
const COLD_THRESHOLD_CALLS = 5;

/** Window for counting unanswered calls (milliseconds) */
const COLD_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Cold numbers get SMS-only for this duration before re-attempting voice */
const COLD_QUARANTINE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/** 24 hours in ms */
const MS_24H = 24 * 60 * 60 * 1000;

/** 12 hours in ms */
const MS_12H = 12 * 60 * 60 * 1000;

/** Minimum response events to learn an active window */
const MIN_RESPONSES_FOR_WINDOW = 5;

// ── In-Memory State ─────────────────────────────────────────────────────────

/** Full event log — periodically pruned to keep only relevant history */
const eventLog: ContactEvent[] = [];

/** techId -> accountId that "owns" the relationship */
const personaMap = new Map<string, string>();

/** techId -> response hours for active-window learning */
const responseHours = new Map<string, number[]>();

/** techId -> status overrides */
const statusOverrides = new Map<string, 'cold' | 'dormant'>();

/** techId -> ISO timestamp when marked cold */
const coldTimestamps = new Map<string, string>();

// ── Helpers ─────────────────────────────────────────────────────────────────

function now(): number {
  return Date.now();
}

function isoNow(): string {
  return new Date().toISOString();
}

function msAgo(ms: number): number {
  return now() - ms;
}

/** Prune events older than 7 days to bound memory */
function pruneOldEvents(): void {
  const cutoff = msAgo(COLD_WINDOW_MS);
  let i = 0;
  while (i < eventLog.length) {
    const ev = eventLog[i];
    if (ev && new Date(ev.timestamp).getTime() < cutoff) {
      eventLog.splice(i, 1);
    } else {
      i++;
    }
  }
}

function getEventsForTech(techId: string): ContactEvent[] {
  return eventLog.filter((e) => e.techId === techId);
}

function getRecentEvents(techId: string, windowMs: number): ContactEvent[] {
  const cutoff = msAgo(windowMs);
  return eventLog.filter(
    (e) => e.techId === techId && new Date(e.timestamp).getTime() >= cutoff,
  );
}

function getRecentEventsForAccount(
  techId: string,
  accountId: string,
  windowMs: number,
): ContactEvent[] {
  const cutoff = msAgo(windowMs);
  return eventLog.filter(
    (e) =>
      e.techId === techId &&
      e.accountId === accountId &&
      new Date(e.timestamp).getTime() >= cutoff,
  );
}

/**
 * Compute the active window (start/end hour) from observed response times.
 * Uses the interquartile range of response hours for robustness.
 */
function computeActiveWindow(
  hours: number[],
): { startHour: number; endHour: number } | null {
  if (hours.length < MIN_RESPONSES_FOR_WINDOW) return null;

  const sorted = [...hours].sort((a, b) => a - b);
  const q1Idx = Math.floor(sorted.length * 0.25);
  const q3Idx = Math.floor(sorted.length * 0.75);
  const startHour = sorted[q1Idx];
  const endHour = sorted[q3Idx];

  if (startHour === undefined || endHour === undefined) return null;

  // Ensure at least a 1-hour window
  return {
    startHour,
    endHour: endHour === startHour ? (endHour + 1) % 24 : endHour,
  };
}

/**
 * Extract the hour from an ISO timestamp in UTC.
 * In production you'd use the tech's timezone, but UTC is a reasonable default
 * since the scheduler already handles TCPA timezone logic.
 */
function hourFromTimestamp(iso: string): number {
  return new Date(iso).getUTCHours();
}

/**
 * Determine the effective status of a tech considering cold/dormant overrides
 * and decline-based cooling.
 */
function effectiveStatus(
  techId: string,
): 'active' | 'cooling' | 'cold' | 'dormant' {
  const override = statusOverrides.get(techId);
  if (override) return override;

  // Check for recent decline -> cooling
  const events = getEventsForTech(techId);
  const lastDecline = events
    .filter((e) => e.outcome === 'declined')
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )[0];

  if (lastDecline) {
    const declineTime = new Date(lastDecline.timestamp).getTime();
    if (now() - declineTime < DECLINE_COOLDOWN_MS) {
      return 'cooling';
    }
  }

  // Auto-detect cold based on unanswered call history
  const recent7d = getRecentEvents(techId, COLD_WINDOW_MS);
  const voiceCalls = recent7d.filter((e) => e.channel === 'voice');
  const unanswered = voiceCalls.filter(
    (e) => e.outcome === 'no_response' || e.outcome === 'voicemail',
  );
  if (voiceCalls.length >= COLD_THRESHOLD_CALLS && unanswered.length === voiceCalls.length) {
    return 'cold';
  }

  return 'active';
}

// ── Exported API ────────────────────────────────────────────────────────────

/**
 * Record a contact event. Updates persona mapping, response-hour tracking,
 * and the event log.
 */
export function recordContact(event: ContactEvent): void {
  eventLog.push(event);

  // Establish persona relationship on first contact
  if (!personaMap.has(event.techId)) {
    personaMap.set(event.techId, event.accountId);
    log.info('Persona relationship established', {
      techId: event.techId,
      accountId: event.accountId,
    });
  }

  // Track response hours for active-window learning
  if (event.outcome === 'accepted') {
    const hours = responseHours.get(event.techId) ?? [];
    hours.push(hourFromTimestamp(event.timestamp));
    responseHours.set(event.techId, hours);

    // If was cold/dormant and they accepted, reactivate
    if (statusOverrides.has(event.techId)) {
      log.info('Tech responded — reactivating', { techId: event.techId });
      statusOverrides.delete(event.techId);
      coldTimestamps.delete(event.techId);
    }
  }

  log.debug('Contact event recorded', {
    techId: event.techId,
    accountId: event.accountId,
    channel: event.channel,
    outcome: event.outcome,
  });

  // Periodic pruning
  if (eventLog.length > 1000) {
    pruneOldEvents();
  }
}

/**
 * Check whether a tech can be contacted right now from a given account.
 * Returns detailed reasoning and recommendations.
 */
export function checkFatigue(
  techId: string,
  accountId: string,
): FatigueCheckResult {
  const status = effectiveStatus(techId);
  const recommendedAccount = getRecommendedPersona(techId) ?? accountId;

  // Dormant — no contact at all
  if (status === 'dormant') {
    return {
      canContact: false,
      reason: 'Tech is dormant — no outreach until manually reactivated',
      recommendedAccountId: recommendedAccount,
    };
  }

  // Cold — SMS only, check quarantine
  if (status === 'cold') {
    const coldSince = coldTimestamps.get(techId);
    if (coldSince) {
      const coldTime = new Date(coldSince).getTime();
      const quarantineEnd = coldTime + COLD_QUARANTINE_MS;
      if (now() < quarantineEnd) {
        return {
          canContact: true,
          reason: 'Tech is cold — SMS only until quarantine ends',
          recommendedChannel: 'sms',
          recommendedAccountId: recommendedAccount,
          nextAvailableAt: new Date(quarantineEnd).toISOString(),
        };
      }
      // Quarantine expired — allow one voice attempt
      return {
        canContact: true,
        reason: 'Cold quarantine expired — one voice re-attempt allowed',
        recommendedChannel: 'voice',
        recommendedAccountId: recommendedAccount,
      };
    }
    // Auto-detected cold (not manually marked) — SMS only
    return {
      canContact: true,
      reason: 'Tech auto-detected as cold — SMS only',
      recommendedChannel: 'sms',
      recommendedAccountId: recommendedAccount,
    };
  }

  // Cooling after decline
  if (status === 'cooling') {
    const events = getEventsForTech(techId);
    const lastDecline = events
      .filter((e) => e.outcome === 'declined')
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )[0];

    const cooldownEnd = lastDecline
      ? new Date(new Date(lastDecline.timestamp).getTime() + DECLINE_COOLDOWN_MS)
      : new Date(now() + DECLINE_COOLDOWN_MS);

    return {
      canContact: false,
      reason: 'Tech recently declined — in cooldown period',
      nextAvailableAt: cooldownEnd.toISOString(),
      recommendedAccountId: recommendedAccount,
    };
  }

  // Check global 24h limit
  const contacts24h = getRecentEvents(techId, MS_24H);
  if (contacts24h.length >= GLOBAL_LIMIT_24H) {
    // Find when the oldest contact in the window expires
    const oldest = contacts24h
      .map((e) => new Date(e.timestamp).getTime())
      .sort((a, b) => a - b)[0];
    const nextAvailable = oldest !== undefined ? oldest + MS_24H : now() + MS_24H;

    return {
      canContact: false,
      reason: `Global 24h limit reached (${contacts24h.length}/${GLOBAL_LIMIT_24H})`,
      nextAvailableAt: new Date(nextAvailable).toISOString(),
      recommendedAccountId: recommendedAccount,
    };
  }

  // Check per-account 12h limit
  const contactsPerAccount12h = getRecentEventsForAccount(
    techId,
    accountId,
    MS_12H,
  );
  if (contactsPerAccount12h.length >= PER_ACCOUNT_LIMIT_12H) {
    const oldest = contactsPerAccount12h
      .map((e) => new Date(e.timestamp).getTime())
      .sort((a, b) => a - b)[0];
    const nextAvailable = oldest !== undefined ? oldest + MS_12H : now() + MS_12H;

    return {
      canContact: false,
      reason: `Per-account 12h limit reached for account ${accountId}`,
      nextAvailableAt: new Date(nextAvailable).toISOString(),
      recommendedAccountId: recommendedAccount,
    };
  }

  // Persona mismatch warning — still allow but recommend the right account
  if (recommendedAccount !== accountId) {
    return {
      canContact: true,
      reason: `Persona mismatch — tech should be contacted via account ${recommendedAccount}`,
      recommendedChannel: 'voice',
      recommendedAccountId: recommendedAccount,
    };
  }

  // All clear
  return {
    canContact: true,
    recommendedChannel: 'voice',
    recommendedAccountId: recommendedAccount,
  };
}

/**
 * Get the full contact profile for a tech.
 */
export function getTechProfile(techId: string): TechContactProfile | undefined {
  const events = getEventsForTech(techId);
  if (events.length === 0) return undefined;

  const primary = personaMap.get(techId);
  if (!primary) return undefined;

  const contacts24h = getRecentEvents(techId, MS_24H);

  const sorted = events.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const lastContacted = sorted[0]?.timestamp ?? null;

  const lastDecline = sorted.find((e) => e.outcome === 'declined');
  const lastDeclinedAt = lastDecline?.timestamp ?? null;

  const hours = responseHours.get(techId) ?? [];
  const activeWindow = computeActiveWindow(hours);

  const status = effectiveStatus(techId);
  const coldSince = coldTimestamps.get(techId) ?? null;

  return {
    techId,
    primaryAccountId: primary,
    totalContacts24h: contacts24h.length,
    lastContactedAt: lastContacted,
    lastDeclinedAt: lastDeclinedAt,
    activeWindow,
    status,
    coldSince,
  };
}

/**
 * Get the recommended persona (account ID) for contacting a tech.
 * Returns the account that first established the relationship, or null if unknown.
 */
export function getRecommendedPersona(techId: string): string | null {
  return personaMap.get(techId) ?? null;
}

/**
 * Select a candidate from a scored list using weighted random selection.
 * Higher-scored techs are more likely to be chosen, but lower-scored techs
 * still get opportunities — preventing burnout of top performers.
 *
 * Uses the top 5 candidates by score, weighted proportionally.
 */
export function selectWeightedCandidate(
  candidates: Array<{ techId: string; score: number }>,
): string {
  if (candidates.length === 0) {
    throw new Error('Cannot select from empty candidate list');
  }

  // Take top 5 by score
  const pool = [...candidates]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Ensure all scores are positive for weighting
  const minScore = Math.min(...pool.map((c) => c.score));
  const offset = minScore < 0 ? Math.abs(minScore) + 1 : 0;

  const totalWeight = pool.reduce((sum, c) => sum + c.score + offset, 0);
  if (totalWeight <= 0) {
    // All scores zero or negative — equal chance
    const idx = Math.floor(Math.random() * pool.length);
    const pick = pool[idx];
    if (!pick) throw new Error('Unexpected empty pool');
    return pick.techId;
  }

  const roll = Math.random() * totalWeight;
  let cumulative = 0;
  for (const candidate of pool) {
    cumulative += candidate.score + offset;
    if (roll <= cumulative) {
      log.debug('Weighted candidate selected', {
        techId: candidate.techId,
        score: candidate.score,
        poolSize: pool.length,
      });
      return candidate.techId;
    }
  }

  // Fallback (floating point edge case)
  const last = pool[pool.length - 1];
  if (!last) throw new Error('Unexpected empty pool');
  return last.techId;
}

/**
 * Manually mark a tech as cold. Starts the 30-day SMS-only quarantine.
 */
export function markCold(techId: string): void {
  statusOverrides.set(techId, 'cold');
  coldTimestamps.set(techId, isoNow());
  log.info('Tech marked cold', { techId });
}

/**
 * Mark a tech as dormant. No outreach of any kind until reactivated.
 */
export function markDormant(techId: string): void {
  statusOverrides.set(techId, 'dormant');
  log.info('Tech marked dormant', { techId });
}

/**
 * Reactivate a cold or dormant tech back to active status.
 */
export function reactivate(techId: string): void {
  statusOverrides.delete(techId);
  coldTimestamps.delete(techId);
  log.info('Tech reactivated', { techId });
}
