/**
 * Append-only audit log.
 * Every compliance-relevant action is recorded immutably.
 * Entries are never updated or deleted.
 */

import type { AuditEntry, AuditFilters } from '../core/types.js';

// Append-only in-memory store — will be backed by better-sqlite3 WAL mode
const auditStore: AuditEntry[] = [];

let auditIdCounter = 0;

/**
 * Generate a monotonically increasing audit ID.
 */
function nextAuditId(): string {
  auditIdCounter++;
  return `aud_${auditIdCounter.toString(36).padStart(8, '0')}`;
}

/**
 * Log an audit entry. Append-only — entries are never modified or deleted.
 *
 * @param entry - The audit event to record
 * @param agentId - The calling module/agent ID for traceability
 */
export function logAudit(
  entry: {
    action: string;
    entityType: string;
    entityId: string;
    accountId: string;
    details: Record<string, unknown>;
  },
  agentId: string = 'compliance',
): void {
  const record: AuditEntry = {
    id: nextAuditId(),
    timestamp: new Date().toISOString(),
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    accountId: entry.accountId,
    agentId,
    details: entry.details,
  };

  auditStore.push(record);
}

/**
 * Query the audit log with optional filters.
 * Results are always ordered by timestamp descending (most recent first).
 */
export function queryAudit(filters: AuditFilters = {}): AuditEntry[] {
  let results = auditStore;

  if (filters.entityId !== undefined) {
    results = results.filter(e => e.entityId === filters.entityId);
  }

  if (filters.accountId !== undefined) {
    results = results.filter(e => e.accountId === filters.accountId);
  }

  if (filters.action !== undefined) {
    results = results.filter(e => e.action === filters.action);
  }

  if (filters.since !== undefined) {
    const sinceISO = filters.since.toISOString();
    results = results.filter(e => e.timestamp >= sinceISO);
  }

  if (filters.until !== undefined) {
    const untilISO = filters.until.toISOString();
    results = results.filter(e => e.timestamp <= untilISO);
  }

  // Return a copy sorted by timestamp descending
  return [...results].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/**
 * Get total count of audit entries (for monitoring).
 */
export function getAuditCount(): number {
  return auditStore.length;
}
