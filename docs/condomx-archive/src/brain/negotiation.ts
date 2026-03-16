// CondomX Price Negotiation Engine
//
// Phase 9: Scale — Advanced Negotiation Strategies
// Handles parsing and evaluating price counter-offers from technicians.

import { createLogger } from '../infra/logger.js';
import type { WorkOrder } from '../core/types.js';

const log = createLogger('brain:negotiation');

export interface NegotiationResult {
  accepted: boolean;
  counterAmount?: number;
  reason?: string;
}

/**
 * Extracts a dollar amount from a technician's response.
 * e.g. "I can do it for $200" -> 200
 */
export function extractCounterOffer(text: string): number | null {
  // Remove commas for parsing (e.g. $1,200 -> $1200)
  const cleanText = text.replace(/,/g, '');

  // 1. Explicit dollar sign match (Highest confidence)
  const match = cleanText.match(/\$[\s]*(\d+(?:\.\d{2})?)/);
  if (match && match[1]) {
    return parseFloat(match[1]);
  }

  // 2. Look for numbers following "for", "at", "pay" or "need"
  const contextMatch = cleanText.match(/\b(?:for|at|pay|need|want|get)\b\s*(\d{2,4}(?:\.\d{2})?)\b/i);
  if (contextMatch && contextMatch[1]) {
    return parseFloat(contextMatch[1]);
  }

  // 3. Fallback: match any 2-4 digit number that doesn't look like a year or zip
  const matchNoSign = cleanText.match(/\b(\d{2,4}(?:\.\d{2})?)\b/);
  if (matchNoSign && matchNoSign[1]) {
    const val = parseFloat(matchNoSign[1]);

    // Ignore current/near future years
    if (val >= 2020 && val <= 2030) return null;

    // Ignore common zip codes (very rough)
    if (val >= 10000) return null;

    if (val >= 50 && val <= 5000) {
      return val;
    }
  }

  return null;
}

/**
 * Evaluates if a counter-offer from a technician is acceptable.
 *
 * Rules:
 * 1. Calculate margin: (Revenue - (Payout + Platform Fee + Comms)) / Revenue
 * 2. Standard: Min 30% margin
 * 3. Emergency: Min 20% margin (willing to take less profit for speed)
 * 4. Flexible: Min 40% margin (patient, can wait for better price)
 */
export function evaluateCounterOffer(
  workOrder: WorkOrder,
  counterAmount: number,
  minMarginOverride?: number
): NegotiationResult {
  const revenue = workOrder.estimatedPay; // This is what the client (DMG Pro) pays us

  if (revenue <= 0) {
    return { accepted: false, reason: 'Original revenue is unknown' };
  }

  // Estimated platform costs
  const platformCost = revenue * 0.05;
  const commsCost = 0.50;
  const totalCost = platformCost + commsCost + counterAmount;

  const margin = ((revenue - totalCost) / revenue) * 100;

  let requiredMargin = 30; // Default

  switch (workOrder.urgency) {
    case 'EMERGENCY':
      requiredMargin = 20;
      break;
    case 'FLEXIBLE':
      requiredMargin = 40;
      break;
  }

  if (minMarginOverride !== undefined) {
    requiredMargin = minMarginOverride;
  }

  const accepted = margin >= requiredMargin;

  log.info('Evaluating counter offer', {
    workOrderId: workOrder.id,
    revenue,
    counter: counterAmount,
    margin: margin.toFixed(1),
    required: requiredMargin,
    accepted,
  });

  return {
    accepted,
    counterAmount,
    reason: accepted ? undefined : `Margin ${margin.toFixed(1)}% below required ${requiredMargin}%`,
  };
}
