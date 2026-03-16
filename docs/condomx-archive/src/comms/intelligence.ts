// CondomX Communication Intelligence — LLM-based analysis
//
// P1.3: Communication Engine (ADR-003)
// Handles natural language understanding for SMS/Voice responses.

import { createLogger } from '../infra/logger.js';
import type { OptOutResult } from './sms.js';

const log = createLogger('comms:intelligence');

/**
 * Analyzes inbound SMS text to detect if the user wants to opt out or stop.
 *
 * In production, this would call an LLM (OpenAI/Anthropic) with a prompt like:
 * "Does this text indicate the user wants to stop receiving messages or be removed from the list? Respond only with OPT_OUT, SOFT_DECLINE, or NONE."
 */
export async function analyzeInboundText(text: string): Promise<OptOutResult> {
  const normalized = text.trim().toLowerCase();

  // 1. Check for standard carrier keywords (STOP, CANCEL, etc.)
  const exactKeywords = ['stop', 'unsubscribe', 'cancel', 'end', 'quit'];
  if (exactKeywords.includes(normalized)) {
    return 'OPT_OUT';
  }

  // 2. Simulated LLM logic for natural language
  // This is a robust heuristic that mimics LLM classification
  const softDeclinePhrases = [
    'no more', 'don\'t text', 'remove me', 'leave me alone',
    'wrong number', 'not interested', 'take me off', 'stop texting',
    'i\'m busy', 'stop bothering', 'unsub',
  ];

  if (softDeclinePhrases.some(phrase => normalized.includes(phrase))) {
    log.info('Detected soft decline via intelligence', { text });
    return 'SOFT_DECLINE';
  }

  // 3. Check for specific "stop" context
  if (/\b(stop|don't)\s+(text|message|call|contact|send)\b/i.test(text)) {
    log.info('Detected opt-out pattern via intelligence', { text });
    return 'OPT_OUT';
  }

  return 'NONE';
}

/**
 * Classifies the intent of an inbound SMS.
 */
export async function classifySmsIntent(text: string): Promise<'ACCEPT' | 'DECLINE' | 'COUNTER' | 'AMBIGUOUS'> {
  const normalized = text.trim().toUpperCase();

  // Acceptance patterns
  if (/^(YES|Y|YEAH|YEP|YA|SURE|OK|ACCEPT|CLAIM|I CAN DO IT|ON MY WAY)$/.test(normalized)) {
    return 'ACCEPT';
  }

  // Decline patterns
  if (/^(NO|N|NOPE|NAH|DECLINE|I CAN'T|PASS|BUSY)$/.test(normalized)) {
    return 'DECLINE';
  }

  // Counter-offer patterns
  if (/\b(\$|dollars|bucks|for)\b.*\d+/.test(normalized) || /\d+.*\b(\$|dollars|bucks)\b/.test(normalized)) {
    return 'COUNTER';
  }

  // LLM-like natural language detection for acceptance
  if (/\b(yes|accept|claim|available|take|do it|on my way|send details)\b/i.test(text)) {
    // But check for negatives
    if (/\b(can't|cannot|won't|don't|not)\b/i.test(text)) {
      return 'DECLINE';
    }
    return 'ACCEPT';
  }

  return 'AMBIGUOUS';
}
