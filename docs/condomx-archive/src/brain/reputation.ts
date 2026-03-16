// CondomX Technician Reputation Engine
// Dynamically updates composite scores based on real performance data.

import { createLogger } from '../infra/logger.js';
import type { Technician } from '../core/types.js';

const log = createLogger('reputation');

// ── Types ───────────────────────────────────────────────────────────

export interface JobOutcome {
  techId: string;
  workOrderId: string;
  arrived: boolean;
  arrivedOnTime: boolean;
  completed: boolean;
  responseTimeMs: number;
  callbackRequired: boolean;
  customerRating?: number; // 1-5
}

export interface ScoreBreakdown {
  techId: string;
  composite: number;
  reliability: {
    score: number;
    completionRate: number;
    onTimeRate: number;
    noShowCount: number;
  };
  quality: {
    score: number;
    callbackRate: number;
    avgRating: number;
  };
  responsiveness: {
    score: number;
    avgResponseTime: number;
    acceptRate: number;
  };
  compliance: {
    score: number;
    consentFresh: boolean;
    violations: number;
  };
  lastUpdated: string;
  totalJobs: number;
  isNewTech: boolean;
}

// ── Internal tracking state ─────────────────────────────────────────

interface TechStats {
  totalJobs: number;
  completedJobs: number;
  arrivedJobs: number;
  onTimeArrivals: number;
  noShowCount: number;
  callbackJobs: number;
  totalResponseTimeMs: number;
  acceptedDispatches: number;
  totalDispatches: number;
  ratingSum: number;
  ratingCount: number;
  complianceViolations: number;
  newTechBoostUntil: string | null;
  lastUpdated: string;
}

const statsStore = new Map<string, TechStats>();

// ── Constants ───────────────────────────────────────────────────────

const WEIGHTS = {
  reliability: 0.3,
  quality: 0.25,
  responsiveness: 0.2,
  compliance: 0.1,
  // distance (0.15) is computed at query time in matching.ts, not here
} as const;

const NEW_TECH_BOOST_DAYS = 30;
const NEW_TECH_BOOST_AMOUNT = 15; // points added to composite during boost
const NO_SHOW_PENALTY = 0.2; // 20% drop in reliability
const DECAY_RATE_PER_DAY = 0.001; // 0.1% daily decay for inactive techs
const CONSENT_FRESHNESS_DAYS = 365;
const COLD_START_THRESHOLD = 5;

// Responsiveness benchmarks (in ms)
const RESPONSE_TIME_EXCELLENT = 5 * 60 * 1000; // 5 minutes
const RESPONSE_TIME_POOR = 60 * 60 * 1000; // 60 minutes

// ── Tech resolver (injected for decoupling) ─────────────────────────

type TechResolver = (techId: string) => Technician | undefined;
type TechUpdater = (techId: string, scores: TechScoreUpdate) => void;

interface TechScoreUpdate {
  compositeScore: number;
  reliabilityScore: number;
  qualityScore: number;
  responsivenessScore: number;
  complianceScore: number;
  completedJobs: number;
  noShowCount: number;
}

let resolveTech: TechResolver = () => undefined;
let updateTech: TechUpdater = () => {};

/**
 * Wire up the reputation engine to the technician store.
 * Call this at startup after the tech index is populated.
 */
export function initReputation(resolver: TechResolver, updater: TechUpdater): void {
  resolveTech = resolver;
  updateTech = updater;
  log.info('reputation engine initialized');
}

// ── Stats helpers ───────────────────────────────────────────────────

function getOrCreateStats(techId: string): TechStats {
  let stats = statsStore.get(techId);
  if (!stats) {
    stats = {
      totalJobs: 0,
      completedJobs: 0,
      arrivedJobs: 0,
      onTimeArrivals: 0,
      noShowCount: 0,
      callbackJobs: 0,
      totalResponseTimeMs: 0,
      acceptedDispatches: 0,
      totalDispatches: 0,
      ratingSum: 0,
      ratingCount: 0,
      complianceViolations: 0,
      newTechBoostUntil: null,
      lastUpdated: new Date().toISOString(),
    };
    statsStore.set(techId, stats);
  }
  return stats;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

// ── Score computation ───────────────────────────────────────────────

function computeReliability(stats: TechStats): number {
  if (stats.totalJobs === 0) return 0.5; // neutral default

  const completionRate = stats.completedJobs / stats.totalJobs;
  const onTimeRate = stats.arrivedJobs > 0
    ? stats.onTimeArrivals / stats.arrivedJobs
    : 0.5;
  const noShowPenalty = Math.min(stats.noShowCount * 0.05, 0.4); // cap at 40% penalty

  // 50% completion, 35% on-time, 15% no-show penalty
  return clamp(completionRate * 0.5 + onTimeRate * 0.35 - noShowPenalty);
}

function computeQuality(stats: TechStats): number {
  if (stats.totalJobs === 0) return 0.5;

  // Callback rate (lower is better): 0 callbacks = 1.0, 100% callbacks = 0.0
  const callbackRate = stats.totalJobs > 0
    ? stats.callbackJobs / stats.totalJobs
    : 0;
  const callbackScore = 1 - callbackRate;

  // Average rating normalized to 0-1
  const avgRating = stats.ratingCount > 0
    ? stats.ratingSum / stats.ratingCount
    : 3; // neutral default
  const ratingScore = (avgRating - 1) / 4; // 1-5 -> 0-1

  // 40% callback avoidance, 60% customer rating
  return clamp(callbackScore * 0.4 + ratingScore * 0.6);
}

function computeResponsiveness(stats: TechStats): number {
  if (stats.totalDispatches === 0) return 0.5;

  // Accept rate
  const acceptRate = stats.acceptedDispatches / stats.totalDispatches;

  // Average response time score (faster = higher)
  const avgResponseMs = stats.totalDispatches > 0
    ? stats.totalResponseTimeMs / stats.totalDispatches
    : RESPONSE_TIME_POOR;
  const responseScore = clamp(
    1 - (avgResponseMs - RESPONSE_TIME_EXCELLENT) /
      (RESPONSE_TIME_POOR - RESPONSE_TIME_EXCELLENT),
  );

  // 50% accept rate, 50% response speed
  return clamp(acceptRate * 0.5 + responseScore * 0.5);
}

function computeCompliance(techId: string, stats: TechStats): number {
  const tech = resolveTech(techId);

  // Consent freshness check
  let consentFresh = false;
  if (tech?.consentGivenAt) {
    const consentDate = new Date(tech.consentGivenAt);
    const daysSinceConsent = (Date.now() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
    consentFresh = daysSinceConsent <= CONSENT_FRESHNESS_DAYS;
  }

  const consentScore = consentFresh ? 1 : 0;
  const violationPenalty = Math.min(stats.complianceViolations * 0.1, 0.5);

  // 60% consent freshness, 40% violation-free history
  return clamp(consentScore * 0.6 + (1 - violationPenalty) * 0.4);
}

function computeComposite(
  reliability: number,
  quality: number,
  responsiveness: number,
  compliance: number,
  stats: TechStats,
): number {
  let composite =
    reliability * WEIGHTS.reliability +
    quality * WEIGHTS.quality +
    responsiveness * WEIGHTS.responsiveness +
    compliance * WEIGHTS.compliance;

  // Normalize: the weights above sum to 0.85 (distance excluded).
  // Scale to full 0-1 range based on available dimensions.
  composite = composite / (WEIGHTS.reliability + WEIGHTS.quality + WEIGHTS.responsiveness + WEIGHTS.compliance);

  // Apply new tech boost if active
  if (stats.newTechBoostUntil) {
    const boostEnd = new Date(stats.newTechBoostUntil);
    if (boostEnd > new Date()) {
      const daysRemaining = (boostEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      const boostFraction = daysRemaining / NEW_TECH_BOOST_DAYS;
      composite = clamp(composite + (NEW_TECH_BOOST_AMOUNT / 100) * boostFraction);
    }
  }

  return Math.round(composite * 1000) / 1000; // 3 decimal places
}

function recalcAndPersist(techId: string): void {
  const stats = statsStore.get(techId);
  if (!stats) return;

  const reliability = computeReliability(stats);
  const quality = computeQuality(stats);
  const responsiveness = computeResponsiveness(stats);
  const compliance = computeCompliance(techId, stats);
  const composite = computeComposite(reliability, quality, responsiveness, compliance, stats);

  stats.lastUpdated = new Date().toISOString();

  updateTech(techId, {
    compositeScore: composite,
    reliabilityScore: reliability,
    qualityScore: quality,
    responsivenessScore: responsiveness,
    complianceScore: compliance,
    completedJobs: stats.completedJobs,
    noShowCount: stats.noShowCount,
  });

  log.info('scores recalculated', {
    techId,
    composite,
    reliability,
    quality,
    responsiveness,
    compliance,
    totalJobs: stats.totalJobs,
  });
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Recalculate technician scores after a completed or failed job.
 */
export function updateScoreAfterJob(techId: string, outcome: JobOutcome): void {
  const stats = getOrCreateStats(techId);

  stats.totalJobs++;
  stats.totalDispatches++;

  if (outcome.arrived) {
    stats.arrivedJobs++;
    stats.acceptedDispatches++;
    if (outcome.arrivedOnTime) {
      stats.onTimeArrivals++;
    }
  } else {
    stats.noShowCount++;
  }

  if (outcome.completed) {
    stats.completedJobs++;
  }

  if (outcome.callbackRequired) {
    stats.callbackJobs++;
  }

  stats.totalResponseTimeMs += outcome.responseTimeMs;

  if (outcome.customerRating !== undefined) {
    stats.ratingSum += outcome.customerRating;
    stats.ratingCount++;
  }

  recalcAndPersist(techId);

  log.info('score updated after job', {
    techId,
    workOrderId: outcome.workOrderId,
    arrived: outcome.arrived,
    completed: outcome.completed,
  });
}

/**
 * Time-based score decay for inactive technicians.
 * Run daily via scheduler. Techs who haven't had jobs slowly lose ranking.
 */
export function decayScores(): void {
  const now = Date.now();
  let decayed = 0;

  for (const [techId, stats] of statsStore) {
    const lastUpdated = new Date(stats.lastUpdated).getTime();
    const daysSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60 * 24);

    // Only decay if inactive for more than 7 days
    if (daysSinceUpdate <= 7) continue;

    const decayFactor = 1 - (DECAY_RATE_PER_DAY * daysSinceUpdate);
    if (decayFactor >= 1) continue;

    const tech = resolveTech(techId);
    if (!tech) continue;

    const newComposite = clamp(tech.compositeScore * decayFactor);

    // Don't decay below 0.1 — everyone deserves a chance
    if (newComposite < 0.1 && tech.compositeScore >= 0.1) {
      updateTech(techId, {
        compositeScore: 0.1,
        reliabilityScore: tech.reliabilityScore,
        qualityScore: tech.qualityScore,
        responsivenessScore: tech.responsivenessScore,
        complianceScore: tech.complianceScore,
        completedJobs: tech.completedJobs,
        noShowCount: tech.noShowCount,
      });
    } else {
      updateTech(techId, {
        compositeScore: newComposite,
        reliabilityScore: tech.reliabilityScore * decayFactor,
        qualityScore: tech.qualityScore * decayFactor,
        responsivenessScore: tech.responsivenessScore * decayFactor,
        complianceScore: tech.complianceScore,
        completedJobs: tech.completedJobs,
        noShowCount: tech.noShowCount,
      });
    }

    decayed++;
  }

  log.info('decay cycle complete', { techsDecayed: decayed, totalTracked: statsStore.size });
}

/**
 * Give new technicians a temporary boost so they get dispatches
 * and accumulate enough data for data-driven scoring.
 */
export function boostNewTech(techId: string): void {
  const stats = getOrCreateStats(techId);
  const boostEnd = new Date();
  boostEnd.setDate(boostEnd.getDate() + NEW_TECH_BOOST_DAYS);
  stats.newTechBoostUntil = boostEnd.toISOString();

  recalcAndPersist(techId);
  log.info('new tech boost applied', { techId, boostUntil: stats.newTechBoostUntil });
}

/**
 * Harsh penalty for no-shows. Drops reliability score by 20%.
 * Called separately from updateScoreAfterJob for explicit no-show events
 * detected outside the normal job flow (e.g., GPS verification failure).
 */
export function penalizeNoShow(techId: string): void {
  const stats = getOrCreateStats(techId);
  const tech = resolveTech(techId);
  if (!tech) {
    log.warn('penalizeNoShow: tech not found', { techId });
    return;
  }

  stats.noShowCount++;

  // Direct reliability hit: drop by 20%
  const currentReliability = tech.reliabilityScore;
  const penalizedReliability = clamp(currentReliability - NO_SHOW_PENALTY);

  // Recompute composite with penalized reliability
  const quality = tech.qualityScore;
  const responsiveness = tech.responsivenessScore;
  const compliance = computeCompliance(techId, stats);
  const composite = computeComposite(penalizedReliability, quality, responsiveness, compliance, stats);

  stats.lastUpdated = new Date().toISOString();

  updateTech(techId, {
    compositeScore: composite,
    reliabilityScore: penalizedReliability,
    qualityScore: quality,
    responsivenessScore: responsiveness,
    complianceScore: compliance,
    completedJobs: stats.completedJobs,
    noShowCount: stats.noShowCount,
  });

  log.warn('no-show penalty applied', {
    techId,
    reliabilityBefore: currentReliability,
    reliabilityAfter: penalizedReliability,
    composite,
    totalNoShows: stats.noShowCount,
  });
}

/**
 * Detailed score breakdown for admin dashboard visibility.
 */
export function getScoreBreakdown(techId: string): ScoreBreakdown | null {
  const tech = resolveTech(techId);
  if (!tech) return null;

  const stats = statsStore.get(techId);

  const totalJobs = stats?.totalJobs ?? tech.completedJobs;
  const isNewTech = totalJobs < COLD_START_THRESHOLD;

  // Compute fresh values from stats if available
  const reliability = stats ? computeReliability(stats) : tech.reliabilityScore;
  const quality = stats ? computeQuality(stats) : tech.qualityScore;
  const responsiveness = stats ? computeResponsiveness(stats) : tech.responsivenessScore;
  const compliance = stats ? computeCompliance(techId, stats) : tech.complianceScore;

  const avgResponseTime = stats && stats.totalDispatches > 0
    ? stats.totalResponseTimeMs / stats.totalDispatches
    : 0;
  const acceptRate = stats && stats.totalDispatches > 0
    ? stats.acceptedDispatches / stats.totalDispatches
    : 0;
  const callbackRate = stats && stats.totalJobs > 0
    ? stats.callbackJobs / stats.totalJobs
    : 0;
  const avgRating = stats && stats.ratingCount > 0
    ? stats.ratingSum / stats.ratingCount
    : 0;
  const completionRate = stats && stats.totalJobs > 0
    ? stats.completedJobs / stats.totalJobs
    : 0;
  const onTimeRate = stats && stats.arrivedJobs > 0
    ? stats.onTimeArrivals / stats.arrivedJobs
    : 0;

  // Consent freshness
  let consentFresh = false;
  if (tech.consentGivenAt) {
    const daysSince = (Date.now() - new Date(tech.consentGivenAt).getTime()) / (1000 * 60 * 60 * 24);
    consentFresh = daysSince <= CONSENT_FRESHNESS_DAYS;
  }

  return {
    techId,
    composite: tech.compositeScore,
    reliability: {
      score: reliability,
      completionRate,
      onTimeRate,
      noShowCount: stats?.noShowCount ?? tech.noShowCount,
    },
    quality: {
      score: quality,
      callbackRate,
      avgRating,
    },
    responsiveness: {
      score: responsiveness,
      avgResponseTime,
      acceptRate,
    },
    compliance: {
      score: compliance,
      consentFresh,
      violations: stats?.complianceViolations ?? 0,
    },
    lastUpdated: stats?.lastUpdated ?? tech.createdAt,
    totalJobs,
    isNewTech,
  };
}

/**
 * Batch recalculation of all tracked technicians.
 * Useful after bulk data imports or algorithm changes.
 */
export function recalculateAll(): void {
  let count = 0;
  for (const techId of statsStore.keys()) {
    recalcAndPersist(techId);
    count++;
  }
  log.info('batch recalculation complete', { techsRecalculated: count });
}

/**
 * Record a compliance violation (calling window breach, opt-out ignored, etc.)
 */
export function recordComplianceViolation(techId: string): void {
  const stats = getOrCreateStats(techId);
  stats.complianceViolations++;
  recalcAndPersist(techId);
  log.warn('compliance violation recorded', { techId, total: stats.complianceViolations });
}

/**
 * Get raw stats for a technician (useful for debugging/testing).
 */
export function getStats(techId: string): TechStats | undefined {
  return statsStore.get(techId);
}

/**
 * Clear all reputation state (for testing).
 */
export function clearReputationState(): void {
  statsStore.clear();
}
