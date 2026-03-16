// CondomX Job Deduplication Engine
// Prevents dispatching multiple techs to the same job when it appears
// across multiple DMG Pro accounts (broadcast to all qualified contractors).

import { createHash } from 'node:crypto';
import type { WorkOrder } from '../core/types.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('brain:dedup');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DedupResult {
  isDuplicate: boolean;
  originalWorkOrderId: string | null;
  originalAccountId: string | null;
  matchConfidence: number; // 0-1
  matchedFields: string[]; // which fields matched
}

interface HashEntry {
  hash: string;
  workOrderId: string;
  accountId: string;
  address: string;
  tradeType: string;
  dateKey: string;
  nteAmount: number;
  seenByAccounts: Set<string>;
  createdAt: number; // epoch ms
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_EXPIRY_HOURS = 48;
const NTE_TOLERANCE = 0.10; // +/- 10%

// ---------------------------------------------------------------------------
// In-memory hash store
// ---------------------------------------------------------------------------

// Primary index: hash -> entry
const hashStore = new Map<string, HashEntry>();
// Secondary index: workOrderId -> hash (for lookups by WO ID)
const woToHash = new Map<string, string>();
// Duplicate suppression log: workOrderId -> DedupResult[]
const duplicateHistory = new Map<string, DedupResult[]>();

// ---------------------------------------------------------------------------
// Hash computation
// ---------------------------------------------------------------------------

/**
 * Normalize address for comparison:
 * - lowercase, trim whitespace
 * - strip unit/apt/suite numbers (they vary across accounts)
 * - collapse whitespace
 * - strip trailing punctuation
 */
function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .trim()
    .replace(/\b(apt|suite|ste|unit|#)\s*\S+/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/[.,]+$/g, '')
    .trim();
}

/**
 * Extract the date portion (YYYY-MM-DD) from an ISO timestamp or date string.
 */
function extractDateKey(dateStr: string): string {
  // Handle ISO strings, plain dates, etc.
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    // Fallback: take first 10 chars if it looks like a date
    return dateStr.slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Build the dedup hash from: normalized address + trade type + date.
 * NTE is NOT part of the hash — it's checked separately with tolerance
 * because different accounts may show slightly different NTE amounts.
 */
function buildHash(address: string, tradeType: string, dateKey: string): string {
  const normalized = normalizeAddress(address);
  const input = `${normalized}|${tradeType.toLowerCase()}|${dateKey}`;
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

/**
 * Check if two NTE amounts are within tolerance (default +/- 10%).
 * Returns the confidence level based on how close they are.
 */
function nteMatch(a: number, b: number): { matches: boolean; confidence: number } {
  if (a === 0 && b === 0) {
    return { matches: true, confidence: 0.8 }; // both zero — probable match but lower confidence
  }

  if (a === 0 || b === 0) {
    return { matches: false, confidence: 0 };
  }

  const ratio = Math.abs(a - b) / Math.max(a, b);

  if (ratio === 0) {
    return { matches: true, confidence: 1.0 };
  }
  if (ratio <= NTE_TOLERANCE) {
    // Within tolerance — confidence decreases as ratio increases
    return { matches: true, confidence: 1.0 - (ratio / NTE_TOLERANCE) * 0.3 };
  }

  return { matches: false, confidence: 0 };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check if a work order is a duplicate of a previously registered job.
 * Does NOT register the job — call registerJob() separately if it's not a duplicate.
 */
export function checkForDuplicate(workOrder: WorkOrder): DedupResult {
  const address = workOrder.location.address;
  const tradeType = workOrder.tradeType;
  const dateKey = extractDateKey(workOrder.createdAt);
  const hash = buildHash(address, tradeType, dateKey);

  const existing = hashStore.get(hash);

  if (!existing) {
    return {
      isDuplicate: false,
      originalWorkOrderId: null,
      originalAccountId: null,
      matchConfidence: 0,
      matchedFields: [],
    };
  }

  // Hash matched (address + trade + date). Now check NTE tolerance.
  const nteResult = nteMatch(workOrder.estimatedPay, existing.nteAmount);

  const matchedFields: string[] = ['address', 'tradeType', 'date'];
  let confidence = 0.7; // base confidence from address + trade + date match

  if (nteResult.matches) {
    matchedFields.push('nteAmount');
    // NTE match boosts confidence
    confidence = 0.7 + 0.3 * nteResult.confidence;
  } else {
    // Address + trade + date match but NTE doesn't — still likely duplicate
    // (different accounts may show different NTE)
    confidence = 0.6;
  }

  const result: DedupResult = {
    isDuplicate: true,
    originalWorkOrderId: existing.workOrderId,
    originalAccountId: existing.accountId,
    matchConfidence: Math.round(confidence * 100) / 100,
    matchedFields,
  };

  // Record in duplicate history
  const history = duplicateHistory.get(workOrder.id) ?? [];
  history.push(result);
  duplicateHistory.set(workOrder.id, history);

  log.info('Duplicate detected', {
    duplicateWorkOrderId: workOrder.id,
    originalWorkOrderId: existing.workOrderId,
    duplicateAccountId: workOrder.accountId,
    originalAccountId: existing.accountId,
    confidence,
    matchedFields: matchedFields.join(','),
    hash,
  });

  return result;
}

/**
 * Register a job in the dedup store. Call this AFTER confirming
 * the job is not a duplicate (or is the first occurrence).
 */
export function registerJob(workOrder: WorkOrder, accountId: string): void {
  const address = workOrder.location.address;
  const tradeType = workOrder.tradeType;
  const dateKey = extractDateKey(workOrder.createdAt);
  const hash = buildHash(address, tradeType, dateKey);

  const existing = hashStore.get(hash);

  if (existing) {
    // Job already registered — just track that this account also saw it
    existing.seenByAccounts.add(accountId);
    log.debug('Account added to existing hash', {
      workOrderId: workOrder.id,
      accountId,
      hash,
      totalAccounts: existing.seenByAccounts.size,
    });
    return;
  }

  const entry: HashEntry = {
    hash,
    workOrderId: workOrder.id,
    accountId,
    address: normalizeAddress(address),
    tradeType,
    dateKey,
    nteAmount: workOrder.estimatedPay,
    seenByAccounts: new Set([accountId]),
    createdAt: Date.now(),
  };

  hashStore.set(hash, entry);
  woToHash.set(workOrder.id, hash);

  log.info('Job registered in dedup store', {
    workOrderId: workOrder.id,
    accountId,
    hash,
    address: entry.address,
    tradeType,
    dateKey,
    nteAmount: workOrder.estimatedPay,
  });
}

/**
 * Get the duplicate detection history for a given work order ID.
 */
export function getDuplicateHistory(workOrderId: string): DedupResult[] {
  return duplicateHistory.get(workOrderId) ?? [];
}

/**
 * Clear hashes older than the specified number of hours.
 * Returns the number of entries removed.
 */
export function clearOldHashes(olderThanHours: number = DEFAULT_EXPIRY_HOURS): number {
  const cutoff = Date.now() - olderThanHours * 60 * 60 * 1000;
  let removed = 0;

  for (const [hash, entry] of hashStore) {
    if (entry.createdAt < cutoff) {
      hashStore.delete(hash);
      woToHash.delete(entry.workOrderId);
      duplicateHistory.delete(entry.workOrderId);
      removed++;
    }
  }

  if (removed > 0) {
    log.info('Cleared old dedup hashes', {
      removed,
      olderThanHours,
      remaining: hashStore.size,
    });
  }

  return removed;
}

// ---------------------------------------------------------------------------
// Internal helpers exposed for testing
// ---------------------------------------------------------------------------

/** Reset all stores — for tests only. */
export function _resetForTesting(): void {
  hashStore.clear();
  woToHash.clear();
  duplicateHistory.clear();
}

/** Get current store size — for monitoring. */
export function getStoreSize(): number {
  return hashStore.size;
}
