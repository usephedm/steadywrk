// Dispatch Orchestrator — bridges state machine, matching engine, and dispatch flow
//
// When a work order arrives:
// 1. Create XState actor (state machine)
// 2. Evaluate profitability (QANAT: min 30% margin)
// 3. Find candidates via H3 geo matching
// 4. Execute outreach via BullMQ dispatch flow
// 5. Handle responses (accept/decline/no-response)
// 6. Track through completion

import { Queue, Worker, type JobsOptions } from 'bullmq';
import { createActor, type Actor } from 'xstate';
import { workOrderMachine } from './state-machine.js';
import { findCandidates, selectOutreachBatch, type MatchCandidate } from './matching.js';
import { executeDispatchOutreach, type DispatchOutreachResult } from '../comms/dispatch-flow.js';
import { checkForDuplicate, registerJob } from './dedup.js';
import { checkFatigue, recordContact as recordFatigueContact } from './fatigue-guard.js';
import { calculateMargin, lockMargin } from './margin-calc.js';
import { isWithinCallingWindow, canContactTechnician, recordContact as recordSchedulerContact } from './scheduler.js';
import { initiatePostAcceptFlow } from '../comms/post-accept.js';
import { createProtection } from './no-show-protection.js';
import { recordMetric } from '../core/analytics.js';
import type { WorkOrder, Account, Technician } from '../core/types.js';
import { config } from '../core/config.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('brain:orchestrator');

// ── Types ───────────────────────────────────────────────────────────

export interface OrchestratorConfig {
  minMarginPercent: number;       // QANAT: 30%
  maxSearchDistanceKm: number;    // Default: 50km
  maxCandidates: number;          // Default: 20
  maxOutreachRounds: number;      // Before escalating
}

export interface DispatchSession {
  workOrderId: string;
  accountId: string;
  actor: Actor<typeof workOrderMachine>;
  candidates: MatchCandidate[];
  currentBatchIndex: number;
  outreachRound: number;
  startedAt: string;
  techBudget: number;
  result: 'dispatched' | 'escalated' | 'rejected' | 'cancelled' | null;
}

const DEFAULT_CONFIG: OrchestratorConfig = {
  minMarginPercent: 30,
  maxSearchDistanceKm: 50,
  maxCandidates: 20,
  maxOutreachRounds: 3,
};

// ── Active Sessions ─────────────────────────────────────────────────

const activeSessions = new Map<string, DispatchSession>();

export function getSession(workOrderId: string): DispatchSession | undefined {
  return activeSessions.get(workOrderId);
}

export function getActiveSessions(): DispatchSession[] {
  return [...activeSessions.values()];
}

// ── Profitability Check (powered by margin-calc) ────────────────────

interface ProfitabilityResult {
  profitable: boolean;
  estimatedMargin: number;
  reason?: string;
}

export function evaluateProfitability(
  workOrder: WorkOrder,
  cfg: OrchestratorConfig,
): ProfitabilityResult {
  if (workOrder.estimatedPay <= 0) {
    return { profitable: false, estimatedMargin: 0, reason: 'No pay estimate' };
  }

  // Use dynamic margin calculator — accounts for trade complexity,
  // time-of-day premium, and staleness escalation
  const techPayout = workOrder.estimatedPay * 0.60;
  const marginResult = calculateMargin(workOrder, techPayout, 15); // 15km avg distance
  const marginPercent = marginResult.marginPercent;

  if (marginPercent < cfg.minMarginPercent) {
    return {
      profitable: false,
      estimatedMargin: Math.round(marginPercent * 10) / 10,
      reason: `Margin ${marginPercent.toFixed(1)}% below minimum ${cfg.minMarginPercent}% (adjusted min: ${marginResult.adjustedMinimum}%)`,
    };
  }

  return { profitable: true, estimatedMargin: Math.round(marginPercent * 10) / 10 };
}

// ── Main Orchestration ──────────────────────────────────────────────

export async function handleNewWorkOrder(
  workOrder: WorkOrder,
  account: Account,
  configOverrides?: Partial<OrchestratorConfig>,
): Promise<DispatchSession> {
  const cfg = { ...DEFAULT_CONFIG, ...configOverrides };

  // ── 0. Deduplication check ──────────────────────────────────────
  // Same job may appear across 14 DMG Pro accounts — only dispatch once
  const dedup = checkForDuplicate(workOrder);
  if (dedup.isDuplicate) {
    log.info('Duplicate job detected — skipping', {
      workOrderId: workOrder.id,
      accountId: account.id,
      originalWorkOrderId: dedup.originalWorkOrderId,
      originalAccountId: dedup.originalAccountId,
      confidence: dedup.matchConfidence,
    });
    recordMetric('jobs_deduplicated', 1);
    // Return a "rejected" session without starting a state machine
    return {
      workOrderId: workOrder.id,
      accountId: account.id,
      actor: null as unknown as DispatchSession['actor'],
      candidates: [],
      currentBatchIndex: 0,
      outreachRound: 0,
      techBudget: 0,
      startedAt: new Date().toISOString(),
      result: 'rejected',
    };
  }
  // Register this job in the dedup store as the canonical instance
  registerJob(workOrder, account.id);

  // ── 1. Create state machine actor ───────────────────────────────
  const actor = createActor(workOrderMachine, {
    input: { workOrderId: workOrder.id, accountId: account.id },
  });
  actor.start();

  const session: DispatchSession = {
    workOrderId: workOrder.id,
    accountId: account.id,
    actor,
    candidates: [],
    currentBatchIndex: 0,
    outreachRound: 0,
    techBudget: 0,
    startedAt: new Date().toISOString(),
    result: null,
  };
  activeSessions.set(workOrder.id, session);

  recordMetric('jobs_received', 1);
  log.info('New work order received', {
    workOrderId: workOrder.id,
    accountId: account.id,
    trade: workOrder.tradeType,
    urgency: workOrder.urgency,
    estimatedPay: workOrder.estimatedPay,
  });

  // ── 2. Lock margin — compute tech budget (never reject) ────────
  actor.send({ type: 'EVALUATE' });

  const marginLock = lockMargin(workOrder, cfg.minMarginPercent, 15); // 15km avg distance
  session.techBudget = marginLock.techBudget;

  if (marginLock.needsNegotiation) {
    log.warn('Job accepted but needs DMG Pro negotiation — margin too thin', {
      workOrderId: workOrder.id,
      techBudget: marginLock.techBudget,
      marginPercent: marginLock.marginPercent,
      targetMargin: cfg.minMarginPercent,
    });
    recordMetric('jobs_needs_negotiation', 1);
  } else {
    log.info('Margin locked', {
      workOrderId: workOrder.id,
      techBudget: marginLock.techBudget,
      marginPercent: marginLock.marginPercent,
    });
  }

  // ── 3. Accept and find candidates ───────────────────────────────
  actor.send({ type: 'ACCEPT' });
  actor.send({ type: 'MATCH' });

  const candidates = findCandidates(workOrder, {
    maxDistance: cfg.maxSearchDistanceKm,
    maxResults: cfg.maxCandidates,
  });

  if (candidates.length === 0) {
    log.warn('No candidates found', { workOrderId: workOrder.id });
    actor.send({ type: 'ESCALATE', reason: 'No technicians in range' });
    session.result = 'escalated';
    recordMetric('jobs_escalated', 1);
    return session;
  }

  session.candidates = candidates;
  log.info('Candidates found', {
    workOrderId: workOrder.id,
    count: candidates.length,
    topScore: candidates[0]?.score,
  });

  // ── 4. Execute outreach rounds (with fatigue + TCPA guards) ─────
  await executeOutreachRounds(session, workOrder, account, cfg);

  return session;
}

// ── Outreach Loop ───────────────────────────────────────────────────

async function executeOutreachRounds(
  session: DispatchSession,
  workOrder: WorkOrder,
  account: Account,
  cfg: OrchestratorConfig,
): Promise<void> {
  while (
    session.outreachRound < cfg.maxOutreachRounds &&
    session.currentBatchIndex < session.candidates.length &&
    !session.result
  ) {
    session.outreachRound++;

    const batch = selectOutreachBatch(
      session.candidates.slice(session.currentBatchIndex),
      workOrder.urgency,
    );

    if (batch.length === 0) break;

    log.info('Starting outreach round', {
      workOrderId: workOrder.id,
      round: session.outreachRound,
      batchSize: batch.length,
    });

    // Filter batch through fatigue guard + TCPA window before outreach
    const contactableBatch = batch.filter((candidate) => {
      const tech = candidate.technician;

      // TCPA compliance: no calls outside 8am-9pm recipient local time
      if (!isWithinCallingWindow(tech.timezone)) {
        log.debug('Skipping tech — outside TCPA window', {
          techId: tech.id,
          timezone: tech.timezone,
        });
        return false;
      }

      // Scheduler cooling: max 3 contacts per tech per 24h
      if (!canContactTechnician(tech.id)) {
        log.debug('Skipping tech — scheduler cooling period', { techId: tech.id });
        return false;
      }

      // Fatigue guard: cross-account limits + persona consistency
      const fatigue = checkFatigue(tech.id, account.id);
      if (!fatigue.canContact) {
        log.debug('Skipping tech — fatigue guard', {
          techId: tech.id,
          reason: fatigue.reason,
        });
        return false;
      }

      return true;
    });

    if (contactableBatch.length === 0) {
      log.info('All techs in batch blocked by guards — advancing', {
        workOrderId: workOrder.id,
        round: session.outreachRound,
        originalBatchSize: batch.length,
      });
      session.currentBatchIndex += batch.length;
      continue;
    }

    // Execute outreach to each contactable tech (parallel for emergencies)
    const results = await Promise.all(
      contactableBatch.map(async (candidate) => {
        const tech = candidate.technician;
        session.actor.send({ type: 'OUTREACH_START', technicianId: tech.id });

        // Record contact in both scheduler and fatigue guard
        recordSchedulerContact(tech.id, 'voice');
        recordFatigueContact({
          techId: tech.id,
          accountId: account.id,
          channel: 'voice',
          timestamp: new Date().toISOString(),
          outcome: 'no_response', // updated below if they respond
        });

        const result = await executeDispatchOutreach(
          workOrder.id,
          tech.id,
          account.id,
          workOrder,
          tech,
          account,
        );

        return { tech, result };
      }),
    );

    // Process results
    for (const { tech, result } of results) {
      if (result === 'accepted') {
        session.actor.send({ type: 'TECH_ACCEPTED', technicianId: tech.id });
        session.result = 'dispatched';
        recordMetric('jobs_dispatched', 1);

        // Update fatigue record to reflect acceptance
        recordFatigueContact({
          techId: tech.id,
          accountId: account.id,
          channel: 'voice',
          timestamp: new Date().toISOString(),
          outcome: 'accepted',
        });

        log.info('Technician accepted', {
          workOrderId: workOrder.id,
          technicianId: tech.id,
          techName: tech.name,
          round: session.outreachRound,
        });

        // ── Post-accept lifecycle ──────────────────────────────
        // Sends confirmation SMS + schedules ETA request
        initiatePostAcceptFlow(workOrder, tech, account);

        // ── No-show protection ─────────────────────────────────
        // Pre-stages backup techs, schedules confirmation checks
        const remainingCandidates = session.candidates
          .slice(session.currentBatchIndex)
          .filter((c) => c.technician.id !== tech.id);
        const backupTechIds = remainingCandidates.slice(0, 2).map((c) => c.technician.id);

        createProtection(workOrder.id, tech.id, backupTechIds, account);

        return;
      }

      // Record decline in fatigue guard
      recordFatigueContact({
        techId: tech.id,
        accountId: account.id,
        channel: 'voice',
        timestamp: new Date().toISOString(),
        outcome: result === 'declined' ? 'declined' : 'no_response',
      });

      session.actor.send({ type: 'TECH_DECLINED', technicianId: tech.id });
    }

    session.currentBatchIndex += batch.length;
  }

  // All rounds exhausted — escalate
  if (!session.result) {
    log.warn('All outreach rounds exhausted', {
      workOrderId: workOrder.id,
      rounds: session.outreachRound,
      candidatesContacted: session.currentBatchIndex,
    });
    session.actor.send({ type: 'NO_TECHS' });
    session.result = 'escalated';
  }
}

// ── Lifecycle Events ────────────────────────────────────────────────

export function markTechArrived(workOrderId: string): void {
  const session = activeSessions.get(workOrderId);
  if (session) {
    session.actor.send({ type: 'TECH_ARRIVED' });
    log.info('Tech arrived', { workOrderId });
  }
}

export function markWorkDone(workOrderId: string): void {
  const session = activeSessions.get(workOrderId);
  if (session) {
    session.actor.send({ type: 'WORK_DONE' });
    log.info('Work completed', { workOrderId });
  }
}

export function submitInvoice(workOrderId: string, amount: number): void {
  const session = activeSessions.get(workOrderId);
  if (session) {
    session.actor.send({ type: 'SUBMIT_INVOICE', amount });
    log.info('Invoice submitted', { workOrderId, amount });
  }
}

export function markPaymentReceived(workOrderId: string, amount: number): void {
  const session = activeSessions.get(workOrderId);
  if (session) {
    session.actor.send({ type: 'PAYMENT_RECEIVED', amount });
    log.info('Payment received', { workOrderId, amount });
    // Session complete — clean up
    activeSessions.delete(workOrderId);
  }
}

export function cancelWorkOrder(workOrderId: string, reason: string): void {
  const session = activeSessions.get(workOrderId);
  if (session) {
    session.actor.send({ type: 'CANCEL', reason });
    session.result = 'cancelled';
    activeSessions.delete(workOrderId);
    log.info('Work order cancelled', { workOrderId, reason });
  }
}

// ── Dependency Injection (for testing) ──────────────────────────────

export type ExecuteOutreach = (
  workOrderId: string,
  technicianId: string,
  accountId: string,
  workOrder: WorkOrder,
  technician: Technician,
  account: Account,
) => Promise<DispatchOutreachResult>;

export interface DispatchOrchestrationDeps {
  executeOutreach: ExecuteOutreach;
}

// ── BullMQ Queue Integration ────────────────────────────────────────

export interface DispatchOrchestrationInput {
  workOrder: WorkOrder;
  account: Account;
  candidates: MatchCandidate[];
}

export interface DispatchAttempt {
  technicianId: string;
  result: DispatchOutreachResult;
  batchNumber: number;
}

export interface DispatchOrchestrationResult {
  finalState: string;
  acceptedTechnicianId: string | null;
  attempts: DispatchAttempt[];
}

export const DISPATCH_QUEUE_NAME = 'brain-dispatch-orchestration';

let _queue: Queue<DispatchOrchestrationInput, DispatchOrchestrationResult> | null = null;
let _worker: Worker<DispatchOrchestrationInput, DispatchOrchestrationResult> | null = null;

function getStateLabel(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join('.');
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).map(getStateLabel).join('.');
  }
  return 'unknown';
}

export function buildOutreachBatches(
  candidates: MatchCandidate[],
  urgency: WorkOrder['urgency'],
): MatchCandidate[][] {
  const { parallelOutreach } = selectOutreachBatch(candidates, urgency).length
    ? { parallelOutreach: selectOutreachBatch(candidates, urgency).length }
    : { parallelOutreach: 1 };
  const batches: MatchCandidate[][] = [];
  for (let i = 0; i < candidates.length; i += parallelOutreach) {
    batches.push(candidates.slice(i, i + parallelOutreach));
  }
  return batches;
}

export async function orchestrateDispatch(
  input: DispatchOrchestrationInput,
  deps: DispatchOrchestrationDeps = { executeOutreach: executeDispatchOutreach },
): Promise<DispatchOrchestrationResult> {
  const { workOrder, account, candidates } = input;
  const actor = createActor(workOrderMachine, {
    input: { workOrderId: workOrder.id, accountId: account.id },
  });
  const attempts: DispatchAttempt[] = [];

  actor.start();
  actor.send({ type: 'EVALUATE' });
  actor.send({ type: 'ACCEPT' });
  actor.send({ type: 'MATCH' });

  if (candidates.length === 0) {
    actor.send({ type: 'ESCALATE', reason: 'No candidate technicians available' });
    return { finalState: getStateLabel(actor.getSnapshot().value), acceptedTechnicianId: null, attempts };
  }

  const batches = buildOutreachBatches(candidates, workOrder.urgency);

  for (const [batchIndex, batch] of batches.entries()) {
    for (const candidate of batch) {
      actor.send({ type: 'OUTREACH_START', technicianId: candidate.technician.id });

      const result = await deps.executeOutreach(
        workOrder.id, candidate.technician.id, account.id,
        workOrder, candidate.technician, account,
      );

      attempts.push({ technicianId: candidate.technician.id, result, batchNumber: batchIndex + 1 });

      if (result === 'accepted') {
        actor.send({ type: 'TECH_ACCEPTED', technicianId: candidate.technician.id });
        return { finalState: getStateLabel(actor.getSnapshot().value), acceptedTechnicianId: candidate.technician.id, attempts };
      }

      actor.send({ type: 'TECH_DECLINED', technicianId: candidate.technician.id });

      if (getStateLabel(actor.getSnapshot().value) === 'escalated') {
        return { finalState: 'escalated', acceptedTechnicianId: null, attempts };
      }
    }
  }

  actor.send({ type: 'ESCALATE', reason: 'All candidate technicians declined or timed out' });
  return { finalState: getStateLabel(actor.getSnapshot().value), acceptedTechnicianId: null, attempts };
}

export function ensureDispatchWorker(
  deps: DispatchOrchestrationDeps = { executeOutreach: executeDispatchOutreach },
): Worker<DispatchOrchestrationInput, DispatchOrchestrationResult> {
  if (!_worker) {
    _worker = new Worker(DISPATCH_QUEUE_NAME,
      async (job) => orchestrateDispatch(job.data, deps),
      { connection: { url: config.redisUrl }, concurrency: 10 },
    );
  }
  return _worker;
}

export async function enqueueDispatch(
  input: DispatchOrchestrationInput,
  options: JobsOptions = {},
) {
  if (!_queue) {
    _queue = new Queue(DISPATCH_QUEUE_NAME, {
      connection: { url: config.redisUrl },
      defaultJobOptions: { removeOnComplete: { count: 1000 }, removeOnFail: { count: 500 }, attempts: 1 },
    });
  }
  return _queue.add(`dispatch-${input.workOrder.id}`, input, { jobId: `dispatch-${input.workOrder.id}`, ...options });
}

export async function shutdownDispatchQueue(): Promise<void> {
  if (_worker) { await _worker.close(); _worker = null; }
  if (_queue) { await _queue.close(); _queue = null; }
}
