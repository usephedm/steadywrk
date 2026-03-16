// No-Show Protection Engine — battle-hardened arrival confirmation & backup activation
//
// The #1 profit killer in dispatching: tech says YES then never shows up.
// This engine wraps every dispatch with a multi-stage confirmation flow:
//
// 1. Confirmation check (SMS 30 min before, voice call if no reply in 15 min)
// 2. Backup tech pre-staging (top 2 alternates kept warm per dispatch)
// 3. ETA tracking with natural language parsing
// 4. Arrival check-in with escalation on missed windows
// 5. No-show penalty integration with reputation engine + audit trail

import type { WorkOrder, Technician, Account } from '../core/types.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('no-show-protection');

// ── Types ───────────────────────────────────────────────────────────

export interface DispatchProtection {
  workOrderId: string;
  primaryTechId: string;
  backupTechIds: string[];
  expectedArrival: string | null;
  confirmationStatus: 'pending' | 'confirmed' | 'no_response' | 'no_show';
  arrivalStatus: 'waiting' | 'confirmed' | 'late' | 'no_show';
  createdAt: string;
  confirmedAt: string | null;
  arrivedAt: string | null;
}

export interface NoShowRecord {
  techId: string;
  workOrderId: string;
  accountId: string;
  expectedArrival: string;
  detectedAt: string;
  backupActivated: boolean;
  backupTechId: string | null;
}

interface ScheduledAction {
  workOrderId: string;
  type: 'confirmation_sms' | 'confirmation_voice' | 'backup_activation' | 'eta_check' | 'arrival_check';
  scheduledFor: number; // epoch ms
  timer: ReturnType<typeof setTimeout>;
}

interface NoShowPattern {
  hourOfDay: Map<number, number>;    // hour -> count
  dayOfWeek: Map<number, number>;    // 0=Sun -> count
  tradeType: Map<string, number>;    // trade -> count
  total: number;
}

// ── Constants ───────────────────────────────────────────────────────

/** Time before expected arrival to send confirmation SMS */
const CONFIRMATION_LEAD_MS = 30 * 60 * 1000; // 30 minutes

/** Time to wait for SMS reply before escalating to voice call */
const SMS_REPLY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/** Time after expected arrival to send arrival check-in SMS */
const ARRIVAL_CHECK_DELAY_MS = 0; // immediately at expected arrival time

/** Time after ETA to trigger escalation if no arrival check-in */
const ARRIVAL_GRACE_MS = 30 * 60 * 1000; // 30 minutes past ETA

/** Maximum number of backup techs to pre-stage per dispatch */
const MAX_BACKUPS = 2;

// ── In-Memory Stores ────────────────────────────────────────────────

const protections = new Map<string, DispatchProtection>();
const noShowHistory = new Map<string, NoShowRecord[]>(); // techId -> records
const scheduledActions = new Map<string, ScheduledAction[]>(); // workOrderId -> actions
const noShowPatterns = new Map<string, NoShowPattern>(); // techId -> patterns

// Store work order + tech + account references for callbacks
interface ProtectionContext {
  workOrder: WorkOrder;
  tech: Technician;
  account: Account;
}
const protectionContexts = new Map<string, ProtectionContext>();

// ── Callbacks (injected for decoupling from comms layer) ─────────────

export type SendSMSCallback = (to: string, from: string, body: string) => Promise<void>;
export type InitiateVoiceCallback = (to: string, from: string, metadata: Record<string, string>) => Promise<void>;
export type PenalizeNoShowCallback = (techId: string) => void;
export type AuditLogCallback = (entry: {
  action: string;
  entityType: string;
  entityId: string;
  accountId: string;
  details: Record<string, unknown>;
}) => void;

let _sendSMS: SendSMSCallback = async () => {
  log.warn('sendSMS callback not registered — SMS will not be sent');
};
let _initiateVoice: InitiateVoiceCallback = async () => {
  log.warn('initiateVoice callback not registered — voice calls will not be made');
};
let _penalizeNoShow: PenalizeNoShowCallback = () => {
  log.warn('penalizeNoShow callback not registered — penalty not applied');
};
let _auditLog: AuditLogCallback = () => {
  log.warn('auditLog callback not registered — audit entry not recorded');
};

/**
 * Wire up the no-show protection engine to the comms and compliance layers.
 * Must be called at startup before any protections are created.
 */
export function initNoShowProtection(deps: {
  sendSMS: SendSMSCallback;
  initiateVoice: InitiateVoiceCallback;
  penalizeNoShow: PenalizeNoShowCallback;
  auditLog: AuditLogCallback;
}): void {
  _sendSMS = deps.sendSMS;
  _initiateVoice = deps.initiateVoice;
  _penalizeNoShow = deps.penalizeNoShow;
  _auditLog = deps.auditLog;
  log.info('no-show protection engine initialized');
}

// ── Timer Management ────────────────────────────────────────────────

function scheduleAction(
  workOrderId: string,
  type: ScheduledAction['type'],
  delayMs: number,
  handler: () => void,
): void {
  const timer = setTimeout(() => {
    removeAction(workOrderId, type);
    handler();
  }, delayMs);

  // Prevent timer from keeping the process alive
  if (typeof timer === 'object' && 'unref' in timer) {
    timer.unref();
  }

  const action: ScheduledAction = {
    workOrderId,
    type,
    scheduledFor: Date.now() + delayMs,
    timer,
  };

  let actions = scheduledActions.get(workOrderId);
  if (!actions) {
    actions = [];
    scheduledActions.set(workOrderId, actions);
  }
  actions.push(action);

  log.debug('Action scheduled', {
    workOrderId,
    type,
    scheduledFor: new Date(action.scheduledFor).toISOString(),
  });
}

function removeAction(workOrderId: string, type: ScheduledAction['type']): void {
  const actions = scheduledActions.get(workOrderId);
  if (!actions) return;

  const idx = actions.findIndex((a) => a.type === type);
  if (idx !== -1) {
    actions.splice(idx, 1);
  }

  if (actions.length === 0) {
    scheduledActions.delete(workOrderId);
  }
}

function cancelAllActions(workOrderId: string): void {
  const actions = scheduledActions.get(workOrderId);
  if (!actions) return;

  for (const action of actions) {
    clearTimeout(action.timer);
  }
  scheduledActions.delete(workOrderId);

  log.debug('All scheduled actions cancelled', { workOrderId });
}

// ── ETA Parsing ─────────────────────────────────────────────────────

/**
 * Parse natural language ETA responses into a target Date.
 * Handles: "45 min", "2pm", "2:30pm", "1 hour", "30 minutes", "3:00 PM", etc.
 */
export function parseETAResponse(text: string, now?: Date): Date | null {
  const trimmed = text.trim().toLowerCase();
  const baseTime = now ?? new Date();

  // Pattern: relative minutes — "45 min", "30 minutes", "20 mins"
  const minuteMatch = trimmed.match(/^(\d+)\s*(?:min(?:ute)?s?)$/);
  if (minuteMatch?.[1]) {
    const minutes = parseInt(minuteMatch[1], 10);
    if (minutes > 0 && minutes <= 480) { // cap at 8 hours
      return new Date(baseTime.getTime() + minutes * 60 * 1000);
    }
  }

  // Pattern: relative hours — "1 hour", "2 hours", "1.5 hours", "1 hr"
  const hourMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:hour|hr)s?$/);
  if (hourMatch?.[1]) {
    const hours = parseFloat(hourMatch[1]);
    if (hours > 0 && hours <= 8) {
      return new Date(baseTime.getTime() + hours * 60 * 60 * 1000);
    }
  }

  // Pattern: clock time — "2pm", "2:30pm", "2:30 PM", "14:00", "3:00 pm"
  const clockMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (clockMatch?.[1]) {
    let hour = parseInt(clockMatch[1], 10);
    const minute = clockMatch[2] ? parseInt(clockMatch[2], 10) : 0;
    const period = clockMatch[3];

    if (period === 'pm' && hour < 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;

    // If no am/pm given, assume 24h format
    if (!period && hour < 24 && minute < 60) {
      // Valid 24h time
    } else if (period && hour <= 23 && minute < 60) {
      // Valid 12h time with period
    } else {
      return null;
    }

    const target = new Date(baseTime);
    target.setHours(hour, minute, 0, 0);

    // If the target time is in the past, assume they mean tomorrow
    if (target.getTime() <= baseTime.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    return target;
  }

  return null;
}

// ── No-Show Pattern Tracking ────────────────────────────────────────

function recordNoShowPattern(techId: string, detectedAt: Date, tradeType: string): void {
  let pattern = noShowPatterns.get(techId);
  if (!pattern) {
    pattern = {
      hourOfDay: new Map(),
      dayOfWeek: new Map(),
      tradeType: new Map(),
      total: 0,
    };
    noShowPatterns.set(techId, pattern);
  }

  pattern.total++;

  const hour = detectedAt.getHours();
  pattern.hourOfDay.set(hour, (pattern.hourOfDay.get(hour) ?? 0) + 1);

  const day = detectedAt.getDay();
  pattern.dayOfWeek.set(day, (pattern.dayOfWeek.get(day) ?? 0) + 1);

  pattern.tradeType.set(tradeType, (pattern.tradeType.get(tradeType) ?? 0) + 1);
}

/**
 * Get no-show pattern analysis for a technician.
 * Useful for predicting risk on future dispatches.
 */
export function getNoShowPatterns(techId: string): {
  total: number;
  peakHour: number | null;
  peakDay: number | null;
  worstTrade: string | null;
} | null {
  const pattern = noShowPatterns.get(techId);
  if (!pattern || pattern.total === 0) return null;

  const findPeak = <T>(map: Map<T, number>): T | null => {
    let maxKey: T | null = null;
    let maxVal = 0;
    for (const [key, val] of map) {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    }
    return maxKey;
  };

  return {
    total: pattern.total,
    peakHour: findPeak(pattern.hourOfDay),
    peakDay: findPeak(pattern.dayOfWeek),
    worstTrade: findPeak(pattern.tradeType),
  };
}

// ── Core No-Show Detection ──────────────────────────────────────────

function handleNoShow(workOrderId: string): void {
  const protection = protections.get(workOrderId);
  if (!protection) return;

  const ctx = protectionContexts.get(workOrderId);
  if (!ctx) return;

  // Already flagged — don't double-process
  if (protection.confirmationStatus === 'no_show' || protection.arrivalStatus === 'no_show') {
    return;
  }

  const now = new Date();

  protection.confirmationStatus = 'no_show';
  protection.arrivalStatus = 'no_show';

  log.warn('NO-SHOW DETECTED', {
    workOrderId,
    techId: protection.primaryTechId,
    techName: ctx.tech.name,
    expectedArrival: protection.expectedArrival,
  });

  // 1. Flag the tech in the scoring system
  _penalizeNoShow(protection.primaryTechId);

  // 2. Record the incident for compliance
  const record: NoShowRecord = {
    techId: protection.primaryTechId,
    workOrderId,
    accountId: ctx.account.id,
    expectedArrival: protection.expectedArrival ?? now.toISOString(),
    detectedAt: now.toISOString(),
    backupActivated: false,
    backupTechId: null,
  };

  let techHistory = noShowHistory.get(protection.primaryTechId);
  if (!techHistory) {
    techHistory = [];
    noShowHistory.set(protection.primaryTechId, techHistory);
  }
  techHistory.push(record);

  // Track patterns
  recordNoShowPattern(protection.primaryTechId, now, ctx.workOrder.tradeType);

  // Audit trail
  _auditLog({
    action: 'NO_SHOW_DETECTED',
    entityType: 'dispatch_protection',
    entityId: workOrderId,
    accountId: ctx.account.id,
    details: {
      techId: protection.primaryTechId,
      techName: ctx.tech.name,
      expectedArrival: protection.expectedArrival,
      detectedAt: now.toISOString(),
      totalNoShows: techHistory.length,
    },
  });

  // 3. Auto-dispatch to backup
  void activateBackup(workOrderId).then((backupId) => {
    if (backupId) {
      record.backupActivated = true;
      record.backupTechId = backupId;
    }
  });

  // Cancel any remaining scheduled actions
  cancelAllActions(workOrderId);
}

// ── Confirmation Flow ───────────────────────────────────────────────

async function sendConfirmationSMS(workOrderId: string): Promise<void> {
  const protection = protections.get(workOrderId);
  if (!protection || protection.confirmationStatus !== 'pending') return;

  const ctx = protectionContexts.get(workOrderId);
  if (!ctx) return;

  const address = ctx.workOrder.location.address;
  const trade = ctx.workOrder.tradeType.toLowerCase();
  const techName = ctx.tech.name.split(' ')[0] ?? ctx.tech.name;

  const body =
    `Hey ${techName}, just confirming you're heading to ${address} for the ${trade} job. ` +
    `Reply YES if on track.`;

  try {
    const fromNumber = ctx.account.phoneNumbers[0];
    if (!fromNumber) {
      log.error('No phone number in account pool for confirmation SMS', {
        workOrderId,
        accountId: ctx.account.id,
      });
      return;
    }

    await _sendSMS(ctx.tech.phone, fromNumber, body);

    log.info('Confirmation SMS sent', {
      workOrderId,
      techId: protection.primaryTechId,
    });

    // Schedule voice call escalation if no reply in 15 min
    scheduleAction(workOrderId, 'confirmation_voice', SMS_REPLY_TIMEOUT_MS, () => {
      void escalateToVoiceCall(workOrderId);
    });
  } catch (err) {
    log.error('Failed to send confirmation SMS', {
      workOrderId,
      error: err instanceof Error ? err.message : String(err),
    });
    // Fall through to voice call immediately
    void escalateToVoiceCall(workOrderId);
  }
}

async function escalateToVoiceCall(workOrderId: string): Promise<void> {
  const protection = protections.get(workOrderId);
  if (!protection || protection.confirmationStatus !== 'pending') return;

  const ctx = protectionContexts.get(workOrderId);
  if (!ctx) return;

  protection.confirmationStatus = 'no_response';

  log.info('Escalating to voice confirmation', {
    workOrderId,
    techId: protection.primaryTechId,
  });

  try {
    const fromNumber = ctx.account.phoneNumbers[0];
    if (!fromNumber) {
      log.error('No phone number for voice escalation', { workOrderId });
      handleNoShow(workOrderId);
      return;
    }

    await _initiateVoice(ctx.tech.phone, fromNumber, {
      workOrderId,
      techId: protection.primaryTechId,
      purpose: 'confirmation',
      address: ctx.workOrder.location.address,
      trade: ctx.workOrder.tradeType,
    });

    // Schedule backup activation if still no confirmation after voice call
    // Give 10 minutes after the voice call attempt
    const voiceGraceMs = 10 * 60 * 1000;
    scheduleAction(workOrderId, 'backup_activation', voiceGraceMs, () => {
      const p = protections.get(workOrderId);
      if (p && p.confirmationStatus !== 'confirmed') {
        log.warn('No confirmation after voice call — activating backup', { workOrderId });
        handleNoShow(workOrderId);
      }
    });
  } catch (err) {
    log.error('Failed to initiate voice confirmation', {
      workOrderId,
      error: err instanceof Error ? err.message : String(err),
    });
    // Voice call failed — trigger no-show immediately
    handleNoShow(workOrderId);
  }
}

async function sendETARequest(workOrderId: string): Promise<void> {
  const protection = protections.get(workOrderId);
  if (!protection) return;

  const ctx = protectionContexts.get(workOrderId);
  if (!ctx) return;

  const body = `Great! Reply with your ETA (e.g., '45 min' or '2pm')`;

  try {
    const fromNumber = ctx.account.phoneNumbers[0];
    if (!fromNumber) return;

    await _sendSMS(ctx.tech.phone, fromNumber, body);

    log.info('ETA request SMS sent', {
      workOrderId,
      techId: protection.primaryTechId,
    });
  } catch (err) {
    log.error('Failed to send ETA request', {
      workOrderId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function sendArrivalCheckIn(workOrderId: string): Promise<void> {
  const protection = protections.get(workOrderId);
  if (!protection || protection.arrivalStatus !== 'waiting') return;

  const ctx = protectionContexts.get(workOrderId);
  if (!ctx) return;

  const address = ctx.workOrder.location.address;
  const body = `Have you arrived at ${address}? Reply YES when on-site.`;

  try {
    const fromNumber = ctx.account.phoneNumbers[0];
    if (!fromNumber) return;

    await _sendSMS(ctx.tech.phone, fromNumber, body);

    log.info('Arrival check-in SMS sent', {
      workOrderId,
      techId: protection.primaryTechId,
    });

    // Schedule escalation if no check-in within grace period
    scheduleAction(workOrderId, 'arrival_check', ARRIVAL_GRACE_MS, () => {
      const p = protections.get(workOrderId);
      if (p && p.arrivalStatus === 'waiting') {
        p.arrivalStatus = 'late';
        log.warn('Arrival overdue — no check-in received', {
          workOrderId,
          techId: p.primaryTechId,
          expectedArrival: p.expectedArrival,
        });
        handleNoShow(workOrderId);
      }
    });
  } catch (err) {
    log.error('Failed to send arrival check-in', {
      workOrderId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Create a dispatch protection record for a work order.
 * Call this immediately after a tech accepts a dispatch.
 */
export function createProtection(
  workOrderId: string,
  primaryTechId: string,
  backups: string[],
  account: Account,
): DispatchProtection {
  // Cancel any existing protection for this work order
  const existing = protections.get(workOrderId);
  if (existing) {
    cancelAllActions(workOrderId);
    log.info('Replacing existing protection', { workOrderId, previousTechId: existing.primaryTechId });
  }

  const protection: DispatchProtection = {
    workOrderId,
    primaryTechId,
    backupTechIds: backups.slice(0, MAX_BACKUPS),
    expectedArrival: null,
    confirmationStatus: 'pending',
    arrivalStatus: 'waiting',
    createdAt: new Date().toISOString(),
    confirmedAt: null,
    arrivedAt: null,
  };

  protections.set(workOrderId, protection);

  log.info('Dispatch protection created', {
    workOrderId,
    primaryTechId,
    backupCount: protection.backupTechIds.length,
    backupTechIds: protection.backupTechIds,
  });

  _auditLog({
    action: 'PROTECTION_CREATED',
    entityType: 'dispatch_protection',
    entityId: workOrderId,
    accountId: account.id,
    details: {
      primaryTechId,
      backupTechIds: protection.backupTechIds,
    },
  });

  return protection;
}

/**
 * Schedule the confirmation check flow for a dispatch.
 * Sends SMS 30 min before expected arrival, escalates to voice if no reply.
 *
 * If no expected arrival time is set, the confirmation SMS is sent immediately.
 */
export function scheduleConfirmationCheck(
  protection: DispatchProtection,
  workOrder: WorkOrder,
  tech: Technician,
  account: Account,
): void {
  // Store context for async callbacks
  protectionContexts.set(protection.workOrderId, { workOrder, tech, account });

  const now = Date.now();

  if (protection.expectedArrival) {
    const arrivalTime = new Date(protection.expectedArrival).getTime();
    const confirmationTime = arrivalTime - CONFIRMATION_LEAD_MS;
    const delay = Math.max(0, confirmationTime - now);

    // Schedule confirmation SMS
    scheduleAction(protection.workOrderId, 'confirmation_sms', delay, () => {
      void sendConfirmationSMS(protection.workOrderId);
    });

    // Schedule arrival check-in at expected arrival time
    const arrivalDelay = Math.max(0, arrivalTime + ARRIVAL_CHECK_DELAY_MS - now);
    scheduleAction(protection.workOrderId, 'eta_check', arrivalDelay, () => {
      void sendArrivalCheckIn(protection.workOrderId);
    });

    log.info('Confirmation check scheduled', {
      workOrderId: protection.workOrderId,
      confirmationIn: `${Math.round(delay / 60000)}min`,
      arrivalCheckIn: `${Math.round(arrivalDelay / 60000)}min`,
    });
  } else {
    // No expected arrival time — send confirmation SMS immediately
    scheduleAction(protection.workOrderId, 'confirmation_sms', 0, () => {
      void sendConfirmationSMS(protection.workOrderId);
    });

    log.info('Confirmation SMS scheduled immediately (no ETA set)', {
      workOrderId: protection.workOrderId,
    });
  }
}

/**
 * Handle a tech's confirmation response (from inbound SMS or voice webhook).
 *
 * If confirmed, sends an ETA request.
 * If not confirmed, triggers the no-show flow.
 */
export function handleConfirmationResponse(workOrderId: string, confirmed: boolean): void {
  const protection = protections.get(workOrderId);
  if (!protection) {
    log.warn('handleConfirmationResponse: no protection found', { workOrderId });
    return;
  }

  if (protection.confirmationStatus === 'confirmed') {
    log.debug('Already confirmed', { workOrderId });
    return;
  }

  if (confirmed) {
    protection.confirmationStatus = 'confirmed';
    protection.confirmedAt = new Date().toISOString();

    // Cancel the voice escalation and backup activation timers
    const actions = scheduledActions.get(workOrderId);
    if (actions) {
      for (const action of actions) {
        if (action.type === 'confirmation_voice' || action.type === 'backup_activation') {
          clearTimeout(action.timer);
        }
      }
      const remaining = actions.filter(
        (a) => a.type !== 'confirmation_voice' && a.type !== 'backup_activation',
      );
      if (remaining.length > 0) {
        scheduledActions.set(workOrderId, remaining);
      } else {
        scheduledActions.delete(workOrderId);
      }
    }

    log.info('Tech confirmed', {
      workOrderId,
      techId: protection.primaryTechId,
    });

    // Ask for ETA
    void sendETARequest(workOrderId);
  } else {
    log.warn('Tech declined confirmation', {
      workOrderId,
      techId: protection.primaryTechId,
    });
    handleNoShow(workOrderId);
  }
}

/**
 * Handle an arrival check-in response from the tech.
 * Marks the tech as arrived and cancels all remaining escalation timers.
 */
export function handleArrivalCheckIn(workOrderId: string): void {
  const protection = protections.get(workOrderId);
  if (!protection) {
    log.warn('handleArrivalCheckIn: no protection found', { workOrderId });
    return;
  }

  if (protection.arrivalStatus === 'confirmed') {
    log.debug('Already checked in', { workOrderId });
    return;
  }

  protection.arrivalStatus = 'confirmed';
  protection.arrivedAt = new Date().toISOString();

  // Cancel all remaining escalation timers — tech is on-site
  cancelAllActions(workOrderId);

  log.info('Tech arrived and checked in', {
    workOrderId,
    techId: protection.primaryTechId,
    arrivedAt: protection.arrivedAt,
  });

  const ctx = protectionContexts.get(workOrderId);
  if (ctx) {
    _auditLog({
      action: 'TECH_ARRIVED',
      entityType: 'dispatch_protection',
      entityId: workOrderId,
      accountId: ctx.account.id,
      details: {
        techId: protection.primaryTechId,
        arrivedAt: protection.arrivedAt,
        expectedArrival: protection.expectedArrival,
      },
    });
  }
}

/**
 * Handle a tech's ETA response. Parses natural language and updates the protection.
 * Reschedules the arrival check-in to match the new ETA.
 */
export function handleETAResponse(workOrderId: string, etaText: string): void {
  const protection = protections.get(workOrderId);
  if (!protection) {
    log.warn('handleETAResponse: no protection found', { workOrderId });
    return;
  }

  const eta = parseETAResponse(etaText);
  if (!eta) {
    log.warn('Could not parse ETA response', {
      workOrderId,
      etaText,
      techId: protection.primaryTechId,
    });
    return;
  }

  protection.expectedArrival = eta.toISOString();

  log.info('ETA received and parsed', {
    workOrderId,
    techId: protection.primaryTechId,
    etaText,
    parsedETA: protection.expectedArrival,
  });

  // Cancel existing arrival check and reschedule based on new ETA
  const actions = scheduledActions.get(workOrderId);
  if (actions) {
    const toCancel = actions.filter((a) => a.type === 'eta_check' || a.type === 'arrival_check');
    for (const action of toCancel) {
      clearTimeout(action.timer);
    }
    const remaining = actions.filter((a) => a.type !== 'eta_check' && a.type !== 'arrival_check');
    if (remaining.length > 0) {
      scheduledActions.set(workOrderId, remaining);
    } else {
      scheduledActions.delete(workOrderId);
    }
  }

  // Schedule arrival check-in at the new ETA
  const delay = Math.max(0, eta.getTime() + ARRIVAL_CHECK_DELAY_MS - Date.now());
  scheduleAction(workOrderId, 'eta_check', delay, () => {
    void sendArrivalCheckIn(workOrderId);
  });
}

/**
 * Activate the next backup tech for a work order.
 * Shifts through the backup list. Returns the activated backup tech ID, or null.
 */
export async function activateBackup(workOrderId: string): Promise<string | null> {
  const protection = protections.get(workOrderId);
  if (!protection) {
    log.warn('activateBackup: no protection found', { workOrderId });
    return null;
  }

  if (protection.backupTechIds.length === 0) {
    log.warn('No backup techs available', {
      workOrderId,
      primaryTechId: protection.primaryTechId,
    });
    return null;
  }

  const backupTechId = protection.backupTechIds.shift()!;

  log.info('BACKUP ACTIVATED', {
    workOrderId,
    failedTechId: protection.primaryTechId,
    backupTechId,
    remainingBackups: protection.backupTechIds.length,
  });

  const ctx = protectionContexts.get(workOrderId);
  if (ctx) {
    _auditLog({
      action: 'BACKUP_ACTIVATED',
      entityType: 'dispatch_protection',
      entityId: workOrderId,
      accountId: ctx.account.id,
      details: {
        failedTechId: protection.primaryTechId,
        backupTechId,
        remainingBackups: protection.backupTechIds.length,
      },
    });
  }

  return backupTechId;
}

/**
 * Get the current protection status for a work order.
 */
export function getProtectionStatus(workOrderId: string): DispatchProtection | undefined {
  return protections.get(workOrderId);
}

/**
 * Get the complete no-show history for a technician.
 */
export function getNoShowHistory(techId: string): NoShowRecord[] {
  return noShowHistory.get(techId) ?? [];
}

// ── Lifecycle & Cleanup ─────────────────────────────────────────────

/**
 * Remove protection for a completed or cancelled work order.
 * Cancels all pending timers and cleans up stored context.
 */
export function removeProtection(workOrderId: string): void {
  cancelAllActions(workOrderId);
  protections.delete(workOrderId);
  protectionContexts.delete(workOrderId);
  log.debug('Protection removed', { workOrderId });
}

/**
 * Get counts of active protections by status (for monitoring/dashboard).
 */
export function getProtectionStats(): {
  total: number;
  pending: number;
  confirmed: number;
  noResponse: number;
  noShow: number;
} {
  let pending = 0;
  let confirmed = 0;
  let noResponse = 0;
  let noShow = 0;

  for (const p of protections.values()) {
    switch (p.confirmationStatus) {
      case 'pending': pending++; break;
      case 'confirmed': confirmed++; break;
      case 'no_response': noResponse++; break;
      case 'no_show': noShow++; break;
    }
  }

  return { total: protections.size, pending, confirmed, noResponse, noShow };
}

/**
 * Clear all state (for testing).
 */
export function clearProtectionState(): void {
  for (const workOrderId of scheduledActions.keys()) {
    cancelAllActions(workOrderId);
  }
  protections.clear();
  protectionContexts.clear();
  noShowHistory.clear();
  scheduledActions.clear();
  noShowPatterns.clear();
}
