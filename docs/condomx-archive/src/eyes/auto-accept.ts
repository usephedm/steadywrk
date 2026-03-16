// Auto-Accept Decision Engine — evaluates work orders for automatic acceptance
// Extracted from agent:ghost. DOM interaction removed (speculative selectors).
// Business logic only — wired into pipeline.ts via handleNewWorkOrder.

import { createLogger } from '../infra/logger.js';

const log = createLogger('eyes:auto-accept');

export interface AutoAcceptConfig {
  minMarginPercent: number;
  maxNTEAutoAccept: number;
  autoAcceptTrades: string[];
  escalateTrades: string[];
  confidenceThreshold: number;
}

const DEFAULT_CONFIG: AutoAcceptConfig = {
  minMarginPercent: 30,
  maxNTEAutoAccept: 500,
  autoAcceptTrades: ['PLUMBING', 'HVAC', 'ELECTRICAL', 'GENERAL', 'LOCKSMITH', 'HANDYMAN'],
  escalateTrades: ['ROOFING', 'FIRE_DAMAGE', 'HAZMAT'],
  confidenceThreshold: 0.7,
};

export interface AutoAcceptDecision {
  autoAccept: boolean;
  confidence: number;
  reason: string;
  escalate: boolean;
  estimatedMargin: number;
}

const RED_FLAGS = ['asbestos', 'mold', 'hazmat', 'structural', 'permit required', 'lead paint', 'sewage backup'];

export function evaluateWorkOrder(
  rawWorkOrder: {
    tradeType: string;
    urgency: string;
    estimatedPay?: number;
    description: string;
  },
  config: AutoAcceptConfig = DEFAULT_CONFIG,
): AutoAcceptDecision {
  let confidence = 0.5;
  const reasons: string[] = [];

  const trade = rawWorkOrder.tradeType.toUpperCase();
  if (config.escalateTrades.some(t => trade.includes(t))) {
    return {
      autoAccept: false,
      confidence: 0.3,
      reason: `Trade type ${trade} requires manual review`,
      escalate: true,
      estimatedMargin: 0,
    };
  }

  if (config.autoAcceptTrades.some(t => trade.includes(t))) {
    confidence += 0.2;
    reasons.push(`Known trade ${trade}`);
  }

  const urgency = rawWorkOrder.urgency.toUpperCase();
  if (urgency.includes('EMERGENCY') || urgency.includes('URGENT')) {
    confidence += 0.15;
    reasons.push('High urgency');
  }

  const nte = rawWorkOrder.estimatedPay || 0;
  if (nte <= 0) {
    return {
      autoAccept: false,
      confidence: 0.1,
      reason: 'No NTE specified',
      escalate: true,
      estimatedMargin: 0,
    };
  }

  if (nte <= config.maxNTEAutoAccept) {
    confidence += 0.15;
    reasons.push(`NTE $${nte} within limit`);
  } else {
    confidence -= 0.2;
    reasons.push(`NTE $${nte} exceeds $${config.maxNTEAutoAccept} limit`);
  }

  // Estimate margin: 35% baseline for known trades
  const estimatedMargin = 35;
  if (estimatedMargin >= config.minMarginPercent) {
    confidence += 0.1;
    reasons.push(`Est. margin ${estimatedMargin}% OK`);
  }

  const desc = rawWorkOrder.description.toLowerCase();
  if (RED_FLAGS.some(flag => desc.includes(flag))) {
    return {
      autoAccept: false,
      confidence: 0.2,
      reason: 'Description contains high-risk keywords',
      escalate: true,
      estimatedMargin,
    };
  }

  const autoAccept = confidence >= config.confidenceThreshold;
  const reason = reasons.join('; ');

  log.info('Work order evaluated', { autoAccept, confidence: Math.min(confidence, 1), reason });

  return {
    autoAccept,
    confidence: Math.min(confidence, 1.0),
    reason,
    escalate: !autoAccept && confidence >= 0.4,
    estimatedMargin,
  };
}
