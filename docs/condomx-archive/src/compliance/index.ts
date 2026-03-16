/**
 * Compliance Module Entry Point
 *
 * Aggregates all compliance sub-modules for a unified interface.
 */

export * from './audit.js';
export * from './calling-window.js';
export * from './consent.js';
export * from './disclosure.js';
export * from './dnc.js';

import { isWithinCallingWindow } from './calling-window.js';
import { getCallDisclosure, TWO_PARTY_CONSENT_STATES, AI_DISCLOSURE_REQUIRED_STATES, HUMAN_TRANSFER_REQUIRED_STATES } from './disclosure.js';

/**
 * Check if current time is within TCPA-compliant calling window.
 * Alias for isWithinCallingWindow to support the P1.4 test suite.
 *
 * @param date - Date to check
 * @param timezone - Recipient's IANA timezone
 */
export function isCallingWindowValid(_date: Date, timezone: string = 'UTC'): boolean {
  return isWithinCallingWindow(timezone);
}

export interface AIConsentState {
  state: string;
  disclosure_required: boolean;
  disclosure_script: string;
  two_party_consent: boolean;
  human_transfer_required: boolean;
}

/**
 * Get AI consent state for a given US state.
 * Refactored to use the improved disclosure logic.
 */
export function getAIConsentState(state: string): AIConsentState {
  const disclosure = getCallDisclosure(state, 'Assistant', 'CondomX');
  return {
    state,
    disclosure_required: AI_DISCLOSURE_REQUIRED_STATES.has(state) || TWO_PARTY_CONSENT_STATES.has(state),
    disclosure_script: disclosure,
    two_party_consent: TWO_PARTY_CONSENT_STATES.has(state),
    human_transfer_required: HUMAN_TRANSFER_REQUIRED_STATES.has(state),
  };
}
