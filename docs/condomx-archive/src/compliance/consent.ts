/**
 * Consent management system.
 * Append-only consent records with opt-out tracking.
 * TCPA / A2P 10DLC compliant consent lifecycle.
 */

import { db, getTechnician } from '../memory/database.js';
import { logAudit } from './audit.js';
import type { ConsentType } from '../core/types.js';

/**
 * Build a composite key for consent lookups.
 * Used for in-memory cache of active consents for performance.
 */
function consentKey(techId: string, consentType: string): string {
  return `${techId}:${consentType}`;
}

// In-memory cache of active consents to avoid DB overhead on every dispatch decision.
// This should be initialized from DB on startup in a real system.
const activeConsentsCache = new Set<string>();

/**
 * Record explicit consent from a technician.
 * Append-only — records are never deleted.
 */
export async function recordConsent(
  techId: string,
  consentType: ConsentType,
  method: string,
  accountId: string,
  ipAddress: string | null = null,
): Promise<void> {
  const timestamp = new Date().toISOString();

  // 1. Log to audit log (append-only history)
  logAudit({
    action: 'consent_collected',
    entityType: 'technician',
    entityId: techId,
    accountId,
    details: {
      consentType,
      method,
      ipAddress,
      timestamp,
    },
  }, 'compliance:consent');

  // 2. Update technician record for quick "last consent" reference
  db.prepare('UPDATE technicians SET consent_given_at = ?, opted_out = 0 WHERE id = ?')
    .run(timestamp, techId);

  // 3. Update cache
  activeConsentsCache.add(consentKey(techId, consentType));
}

/**
 * Check if a technician has valid, non-revoked consent for a given type.
 */
export function hasValidConsent(techId: string, consentType: string): boolean {
  const tech = getTechnician(techId);
  if (!tech || tech.optedOut) {
    return false;
  }

  // Check cache first
  if (activeConsentsCache.has(consentKey(techId, consentType))) {
    return true;
  }

  // Fallback: check audit logs for this tech+type
  // In a high-traffic system, the cache should be pre-warmed.
  const auditEntries = db.prepare(
    "SELECT * FROM audit_log WHERE entity_type = 'technician' AND entity_id = ? AND action = 'consent_collected' AND details LIKE ?"
  ).all(techId, `%${consentType}%`);

  if (auditEntries.length > 0) {
    activeConsentsCache.add(consentKey(techId, consentType));
    return true;
  }

  return false;
}

/**
 * Record an opt-out request from a technician.
 * Honored immediately (TCPA requires within 10 business days; we do it instantly).
 * Invalidates all consent types for this tech.
 */
export async function recordOptOut(
  techId: string,
  source: string,
  rawMessage: string,
  accountId: string,
): Promise<void> {
  const timestamp = new Date().toISOString();

  // 1. Log to audit log
  logAudit({
    action: 'opt_out_received',
    entityType: 'technician',
    entityId: techId,
    accountId,
    details: {
      source,
      rawMessage,
      timestamp,
    },
  }, 'compliance:consent');

  // 2. Update technician record
  db.prepare('UPDATE technicians SET opted_out = 1 WHERE id = ?').run(techId);

  // 3. Clear cache for this tech
  const keysToRemove = Array.from(activeConsentsCache).filter(key => key.startsWith(`${techId}:`));
  for (const key of keysToRemove) {
    activeConsentsCache.delete(key);
  }
}

/**
 * Check if a tech has opted out.
 */
export function isOptedOut(techId: string): boolean {
  const tech = getTechnician(techId);
  return tech?.optedOut ?? false;
}
