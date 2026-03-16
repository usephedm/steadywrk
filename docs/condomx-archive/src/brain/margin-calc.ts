// Dynamic Margin Calculator — multi-factor pricing beyond the 60% payout model

import type { WorkOrder } from '../core/types.js';
import { TradeType } from '../core/types.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('margin-calc');

// --- Types ---

export interface MarginCalculation {
  grossPay: number;
  techPayout: number;
  platformFee: number;
  commsCost: number;
  travelEstimate: number;
  netMargin: number;
  marginPercent: number;
  meetsMinimum: boolean;
  adjustedMinimum: number; // may be higher than 30% for stale jobs
}

// --- Constants ---

/** Base minimum margin percentage */
const BASE_MIN_MARGIN_PERCENT = 30;

/** Default tech payout ratio (60% to tech) */
const DEFAULT_PAYOUT_RATIO = 0.6;

/** Average fuel cost per km (USD) */
const FUEL_COST_PER_KM = 0.15;

/** Per-outreach comms cost estimate (voice call + SMS follow-up) */
const COMMS_COST_PER_ATTEMPT = 0.12;

/** Average number of outreach attempts before dispatch */
const AVG_OUTREACH_ATTEMPTS = 3;

/** Hours after which a stale-job margin bump kicks in */
const STALE_THRESHOLD_HOURS = 2;

/** Additional margin percentage per hour of staleness beyond the threshold */
const STALE_MARGIN_BUMP_PER_HOUR = 5;

/** Maximum adjusted minimum margin (cap at 50%) */
const MAX_ADJUSTED_MARGIN = 50;

// --- Trade complexity multipliers ---
// Higher complexity = higher platform fee justified

const TRADE_COMPLEXITY: Record<TradeType, number> = {
  [TradeType.PLUMBING]: 1.15,
  [TradeType.ELECTRICAL]: 1.2,
  [TradeType.HVAC]: 1.25,
  [TradeType.GENERAL]: 1.0,
  [TradeType.CARPENTRY]: 1.05,
  [TradeType.PAINTING]: 0.95,
  [TradeType.LOCKSMITH]: 1.1,
  [TradeType.ROOFING]: 1.3,
  [TradeType.FLOORING]: 1.05,
};

// --- Time-of-day premium multipliers ---

/**
 * Get a premium multiplier based on when the work order was created.
 * Night/weekend jobs warrant higher margins because techs charge more.
 */
function getTimeOfDayPremium(createdAt: string): number {
  const date = new Date(createdAt);
  const hour = date.getUTCHours();
  const dayOfWeek = date.getUTCDay();

  // Weekend premium
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 1.2;
  }

  // Night premium (before 7am or after 7pm)
  if (hour < 7 || hour >= 19) {
    return 1.15;
  }

  // Early morning / evening premium (7-8am or 6-7pm)
  if (hour < 8 || hour >= 18) {
    return 1.05;
  }

  // Standard business hours
  return 1.0;
}

/**
 * Estimate the area completion rate penalty.
 * Areas with historically low completion rates justify higher margins
 * to offset the risk of no-shows and re-dispatches.
 *
 * For now, returns a static multiplier. Will be backed by real data
 * once the analytics pipeline is live.
 */
function getAreaCompletionFactor(_workOrder: WorkOrder): number {
  // TODO: integrate with analytics DB for per-H3-cell completion rates
  // For now, use a neutral 1.0 — no adjustment
  return 1.0;
}

/**
 * Calculate how many hours a work order has been open.
 */
function getHoursOpen(workOrder: WorkOrder, now?: Date): number {
  const created = new Date(workOrder.createdAt);
  const current = now ?? new Date();
  return (current.getTime() - created.getTime()) / (1000 * 60 * 60);
}

/**
 * Calculate the adjusted minimum margin percentage.
 * Stale jobs (open > 2 hours) get a progressively higher minimum
 * to compensate for increased urgency and operational overhead.
 */
function getAdjustedMinimumMargin(workOrder: WorkOrder, now?: Date): number {
  const hoursOpen = getHoursOpen(workOrder, now);

  if (hoursOpen <= STALE_THRESHOLD_HOURS) {
    return BASE_MIN_MARGIN_PERCENT;
  }

  const extraHours = hoursOpen - STALE_THRESHOLD_HOURS;
  const bump = Math.floor(extraHours) * STALE_MARGIN_BUMP_PER_HOUR;
  const adjusted = BASE_MIN_MARGIN_PERCENT + bump;

  return Math.min(adjusted, MAX_ADJUSTED_MARGIN);
}

// --- Exported function ---

/**
 * Calculate the full margin breakdown for a work order.
 *
 * @param workOrder - The work order to price
 * @param techPayout - The amount paid to the technician
 * @param distanceKm - Estimated travel distance in kilometers
 * @param now - Optional current time (for testing)
 */
export function calculateMargin(
  workOrder: WorkOrder,
  techPayout: number,
  distanceKm: number,
  now?: Date,
): MarginCalculation {
  // Complexity multiplier for the trade type
  const complexityMultiplier = TRADE_COMPLEXITY[workOrder.tradeType];

  // Time-of-day premium
  const timePremium = getTimeOfDayPremium(workOrder.createdAt);

  // Area completion factor (risk adjustment)
  const areaFactor = getAreaCompletionFactor(workOrder);

  // Compute ideal gross pay based on tech payout and all factors
  const adjustedPayout = techPayout * complexityMultiplier * timePremium * areaFactor;
  const grossPay = Math.max(workOrder.estimatedPay, adjustedPayout / DEFAULT_PAYOUT_RATIO);

  // Costs
  const travelEstimate = distanceKm * FUEL_COST_PER_KM;
  const commsCost = COMMS_COST_PER_ATTEMPT * AVG_OUTREACH_ATTEMPTS;
  const platformFee = grossPay - techPayout;

  // Net margin after all costs
  const netMargin = platformFee - commsCost - travelEstimate;
  const marginPercent = grossPay > 0 ? (netMargin / grossPay) * 100 : 0;

  // Adjusted minimum for stale jobs
  const adjustedMinimum = getAdjustedMinimumMargin(workOrder, now);
  const meetsMinimum = marginPercent >= adjustedMinimum;

  const result: MarginCalculation = {
    grossPay: round2(grossPay),
    techPayout: round2(techPayout),
    platformFee: round2(platformFee),
    commsCost: round2(commsCost),
    travelEstimate: round2(travelEstimate),
    netMargin: round2(netMargin),
    marginPercent: round2(marginPercent),
    meetsMinimum,
    adjustedMinimum,
  };

  log.info('Margin calculated', {
    workOrderId: workOrder.id,
    tradeType: workOrder.tradeType,
    grossPay: result.grossPay,
    netMargin: result.netMargin,
    marginPercent: result.marginPercent,
    meetsMinimum,
    adjustedMinimum,
  });

  return result;
}

// --- Lock Margin (never-reject model) ---

export interface LockMarginResult {
  techBudget: number;
  marginPercent: number;
  needsNegotiation: boolean;
}

/**
 * Compute the maximum tech payout that preserves the target margin.
 *
 * Formula (solving for techBudget):
 *   netMargin = (grossPay - techBudget) - commsCost - travelCost
 *   marginPercent = netMargin / grossPay * 100
 *   targetMargin = grossPay * (targetMarginPercent / 100)
 *   techBudget = grossPay - targetMargin - commsCost - travelCost
 *            = grossPay * (1 - targetMarginPercent/100) - commsCost - travelCost
 *
 * If techBudget <= 0, we still accept the job but flag needsNegotiation
 * (the revenue from DMG Pro may need to be renegotiated upward).
 */
export function lockMargin(
  workOrder: WorkOrder,
  targetMarginPercent: number,
  distanceKm: number,
): LockMarginResult {
  const grossPay = workOrder.estimatedPay;
  const commsCost = round2(COMMS_COST_PER_ATTEMPT * AVG_OUTREACH_ATTEMPTS);
  const travelCost = round2(distanceKm * FUEL_COST_PER_KM);

  // Maximum we can pay the tech while keeping our target margin
  const techBudget = round2(
    grossPay * (1 - targetMarginPercent / 100) - commsCost - travelCost,
  );

  if (techBudget <= 0) {
    // Even at $0 tech payout we can't hit the target margin,
    // or the job pay is too low. Accept anyway, flag for negotiation.
    log.warn('Tech budget non-positive — needs negotiation with DMG Pro', {
      workOrderId: workOrder.id,
      grossPay,
      targetMarginPercent,
      computedBudget: techBudget,
    });
    // Actual margin if tech works for free (best-case floor)
    const bestCaseMargin = grossPay > 0
      ? round2(((grossPay - commsCost - travelCost) / grossPay) * 100)
      : 0;
    return {
      techBudget: 0,
      marginPercent: bestCaseMargin,
      needsNegotiation: true,
    };
  }

  // Verify actual margin with this tech budget
  const netMargin = grossPay - techBudget - commsCost - travelCost;
  const actualMarginPercent = grossPay > 0
    ? round2((netMargin / grossPay) * 100)
    : 0;

  log.info('Margin locked', {
    workOrderId: workOrder.id,
    grossPay,
    techBudget,
    marginPercent: actualMarginPercent,
    targetMarginPercent,
  });

  return {
    techBudget,
    marginPercent: actualMarginPercent,
    needsNegotiation: false,
  };
}

/** Round to 2 decimal places */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
