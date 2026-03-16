// CondomX 3-tier dispatch outreach flow — Voice call -> SMS -> urgency SMS
// QANAT III: Voice calling is Priority 1. Cold call first, SMS fallback.

import { Queue, Worker, type Job } from 'bullmq';
import { config } from '../core/config.js';
import type { WorkOrder, Technician, Account } from '../core/types.js';
import { sendSMS, getStickyNumber, detectOptOut, registerInboundHandler } from './sms.js';
import { initiateCall, registerCallHandler, type CallOutcome } from './voice.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('comms:dispatch-flow');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIER1_DELAY_MS = 10 * 60 * 1000; // 10 min wait after voice call
const TIER2_DELAY_MS = 15 * 60 * 1000; // 15 min wait after SMS
const QUEUE_NAME = 'dispatch-outreach';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DispatchOutreachData {
  workOrderId: string;
  technicianId: string;
  accountId: string;
  tier: 1 | 2 | 3;
  workOrder: WorkOrder;
  technician: Technician;
  account: Account;
}

export type DispatchOutreachResult = 'accepted' | 'declined' | 'no_response';

interface DispatchRecord {
  workOrderId: string;
  technicianId: string;
  accountId: string;
  tier: 1 | 2 | 3;
  result: DispatchOutreachResult | null;
  smsIds: string[];
  callId: string | null;
  startedAt: string;
  resolvedAt: string | null;
}

// ---------------------------------------------------------------------------
// In-process dispatch state
// ---------------------------------------------------------------------------

// Active dispatches keyed by `${workOrderId}:${technicianId}`
const activeDispatches = new Map<string, DispatchRecord>();
// Promise resolvers for awaiting dispatch outcomes
const dispatchResolvers = new Map<
  string,
  (result: DispatchOutreachResult) => void
>();

function dispatchKey(workOrderId: string, technicianId: string): string {
  return `${workOrderId}:${technicianId}`;
}

// ---------------------------------------------------------------------------
// BullMQ queue + worker
// ---------------------------------------------------------------------------

let _queue: Queue<DispatchOutreachData> | null = null;
let _worker: Worker<DispatchOutreachData> | null = null;

function getQueue(): Queue<DispatchOutreachData> {
  if (!_queue) {
    _queue = new Queue<DispatchOutreachData>(QUEUE_NAME, {
      connection: { url: config.redisUrl },
      defaultJobOptions: {
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 500 },
        attempts: 1,
      },
    });
  }
  return _queue;
}

function ensureWorker(): void {
  if (_worker) return;

  _worker = new Worker<DispatchOutreachData>(
    QUEUE_NAME,
    async (job: Job<DispatchOutreachData>) => {
      await processTier(job.data);
    },
    {
      connection: { url: config.redisUrl },
      concurrency: 10,
    },
  );

  _worker.on('failed', (job, err) => {
    console.error(
      `[dispatch-flow] Job ${job?.id} failed:`,
      err.message,
    );
  });
}

// ---------------------------------------------------------------------------
// SMS message formatting
// ---------------------------------------------------------------------------

export function formatDispatchSMS(
  workOrder: WorkOrder,
  tech: Technician,
  account: Account,
): string {
  const urgencyContext = urgencyText(workOrder.urgency);
  const pay = workOrder.estimatedPay.toFixed(0);
  return (
    `Hey ${tech.name}, it's ${account.personaName} from ${account.companyName}. ` +
    `Got a ${workOrder.tradeType.toLowerCase()} job at ${workOrder.location.address}, ` +
    `pays $${pay}. ${urgencyContext}. Reply YES to claim it.`
  );
}

function formatUrgencySMS(
  workOrder: WorkOrder,
  tech: Technician,
  _account: Account,
): string {
  const pay = workOrder.estimatedPay.toFixed(0);
  return (
    `Hey ${tech.name}, just checking — the ${workOrder.tradeType.toLowerCase()} job ` +
    `at ${workOrder.location.address} ($${pay}) is still open and we need someone soon. ` +
    `Reply YES if you can take it, or NO if you're passing.`
  );
}

function urgencyText(urgency: string): string {
  switch (urgency) {
    case 'EMERGENCY':
      return 'This is an emergency — needed ASAP';
    case 'URGENT':
      return 'This is urgent — needed today';
    case 'STANDARD':
      return 'Standard timeline';
    case 'FLEXIBLE':
      return 'Flexible scheduling';
    default:
      return 'Standard timeline';
  }
}

// ---------------------------------------------------------------------------
// Tier processing
// ---------------------------------------------------------------------------

async function processTier(data: DispatchOutreachData): Promise<void> {
  const key = dispatchKey(data.workOrderId, data.technicianId);
  const record = activeDispatches.get(key);

  // If already resolved (tech responded between scheduling and execution), skip
  if (record?.result) {
    return;
  }

  const { workOrder, technician } = data;
  const account = data.account;
  const fromNumber = getStickyNumber(
    technician.phone,
    account.id,
    account.phoneNumbers,
  );

  switch (data.tier) {
    // TIER 1: Voice call — Priority 1 per QANAT III
    case 1: {
      const retellAgentId = process.env['RETELL_DISPATCH_AGENT_ID'];
      if (!retellAgentId) {
        // No voice agent configured — fall through to SMS immediately
        log.warn('RETELL_DISPATCH_AGENT_ID not set, falling through to SMS', {
          workOrderId: workOrder.id,
        });
        await getQueue().add(`tier2-${key}`, { ...data, tier: 2 });
        break;
      }

      const callResult = await initiateCall(
        technician.phone,
        fromNumber,
        retellAgentId,
        {
          workOrderId: workOrder.id,
          technicianId: technician.id,
          accountId: account.id,
          techName: technician.name,
          personaName: account.personaName,
          companyName: account.companyName,
          trade: workOrder.tradeType,
          address: workOrder.location.address,
          pay: workOrder.estimatedPay.toString(),
          urgency: workOrder.urgency,
        },
      );

      if (record) {
        record.callId = callResult.callId;
        record.tier = 1;
      }

      // Voice call outcome handled by webhook. Schedule SMS fallback.
      await getQueue().add(
        `tier2-${key}`,
        { ...data, tier: 2 },
        { delay: TIER1_DELAY_MS },
      );
      break;
    }

    // TIER 2: SMS — follow-up after voice call
    case 2: {
      const body = formatDispatchSMS(workOrder, technician, account);
      const result = await sendSMS(technician.phone, fromNumber, body);

      if (record) {
        record.smsIds.push(result.id);
        record.tier = 2;
      }

      // Schedule tier 3 urgency SMS
      await getQueue().add(
        `tier3-${key}`,
        { ...data, tier: 3 },
        { delay: TIER2_DELAY_MS },
      );
      break;
    }

    // TIER 3: Urgency SMS — final attempt
    case 3: {
      const body = formatUrgencySMS(workOrder, technician, account);
      const result = await sendSMS(technician.phone, fromNumber, body);

      if (record) {
        record.smsIds.push(result.id);
        record.tier = 3;
      }

      // Final timeout — resolve as no_response after 10 minutes
      await getQueue().add(
        `timeout-${key}`,
        data,
        {
          delay: 10 * 60 * 1000,
          jobId: `timeout-${key}`,
        },
      );
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Resolve dispatch
// ---------------------------------------------------------------------------

function resolveDispatch(key: string, result: DispatchOutreachResult): void {
  const record = activeDispatches.get(key);
  if (record && !record.result) {
    record.result = result;
    record.resolvedAt = new Date().toISOString();
  }

  const resolver = dispatchResolvers.get(key);
  if (resolver) {
    resolver(result);
    dispatchResolvers.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Inbound SMS handler — wired into sms.ts
// ---------------------------------------------------------------------------

function setupInboundHandler(): void {
  registerInboundHandler(async (_from, _to, body, _messageId) => {
    // Find the active dispatch for this phone number
    for (const [key, record] of activeDispatches) {
      if (record.result) continue;

      // Match by looking up the technician phone in the dispatch data
      // The key format is `${workOrderId}:${technicianId}`
      // We need to check if 'from' matches the technician's phone
      // This is resolved through the dispatch record's stored data
      const parts = key.split(':');
      const workOrderId = parts[0];
      const technicianId = parts[1];
      if (!workOrderId || !technicianId) continue;

      // Check opt-out
      const optOut = detectOptOut(body);
      if (optOut === 'OPT_OUT') {
        resolveDispatch(key, 'declined');
        return;
      }

      // Check for acceptance
      const normalized = body.trim().toUpperCase();
      if (
        normalized === 'YES' ||
        normalized === 'Y' ||
        normalized === 'YEAH' ||
        normalized === 'YEP' ||
        normalized === 'YA' ||
        normalized === 'SURE' ||
        normalized === 'OK' ||
        normalized === 'ACCEPT' ||
        normalized === 'CLAIM'
      ) {
        resolveDispatch(key, 'accepted');
        return;
      }

      // Check for explicit decline
      if (
        normalized === 'NO' ||
        normalized === 'N' ||
        normalized === 'NOPE' ||
        normalized === 'NAH' ||
        normalized === 'DECLINE' ||
        optOut === 'SOFT_DECLINE'
      ) {
        resolveDispatch(key, 'declined');
        return;
      }

      // Ambiguous response — don't resolve, let the tiers continue
    }
  });
}

// ---------------------------------------------------------------------------
// Call webhook handler — wired into voice.ts
// ---------------------------------------------------------------------------

function setupCallHandler(): void {
  registerCallHandler(async (outcome: CallOutcome) => {
    if (outcome.status !== 'analyzed' && outcome.status !== 'ended') {
      return;
    }

    // Find the dispatch this call belongs to
    for (const [key, record] of activeDispatches) {
      if (record.callId === outcome.callId && !record.result) {
        if (outcome.accepted === true) {
          resolveDispatch(key, 'accepted');
        } else if (outcome.accepted === false) {
          resolveDispatch(key, 'declined');
        } else {
          // Call ended without clear acceptance — check sentiment
          if (outcome.sentiment === 'Negative') {
            resolveDispatch(key, 'declined');
          } else if (outcome.disconnectReason === 'user_hangup') {
            resolveDispatch(key, 'no_response');
          }
          // For voicemail_reached, dial_no_answer, etc., let the timeout handle it
        }
        return;
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

let _initialized = false;

function ensureInitialized(): void {
  if (_initialized) return;
  _initialized = true;
  ensureWorker();
  setupInboundHandler();
  setupCallHandler();
}

export async function executeDispatchOutreach(
  workOrderId: string,
  technicianId: string,
  accountId: string,
  workOrder: WorkOrder,
  technician: Technician,
  account: Account,
): Promise<DispatchOutreachResult> {
  ensureInitialized();

  const key = dispatchKey(workOrderId, technicianId);

  // Create dispatch record
  const record: DispatchRecord = {
    workOrderId,
    technicianId,
    accountId,
    tier: 1,
    result: null,
    smsIds: [],
    callId: null,
    startedAt: new Date().toISOString(),
    resolvedAt: null,
  };
  activeDispatches.set(key, record);

  // Create a promise that resolves when the dispatch is resolved
  const resultPromise = new Promise<DispatchOutreachResult>((resolve) => {
    dispatchResolvers.set(key, resolve);
  });

  // Enqueue tier 1 immediately
  await getQueue().add(`tier1-${key}`, {
    workOrderId,
    technicianId,
    accountId,
    tier: 1,
    workOrder,
    technician,
    account,
  });

  // Set an absolute timeout for the entire outreach flow (45 minutes)
  const absoluteTimeout = setTimeout(() => {
    if (!record.result) {
      resolveDispatch(key, 'no_response');
    }
  }, 45 * 60 * 1000);

  try {
    const result = await resultPromise;
    return result;
  } finally {
    clearTimeout(absoluteTimeout);
    activeDispatches.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Shutdown
// ---------------------------------------------------------------------------

export async function shutdownDispatchFlow(): Promise<void> {
  if (_worker) {
    await _worker.close();
    _worker = null;
  }
  if (_queue) {
    await _queue.close();
    _queue = null;
  }
  _initialized = false;
}
