import { latLngToCell, gridDisk, cellToLatLng, greatCircleDistance, UNITS } from 'h3-js';
import type { WorkOrder, Technician } from '../core/types.js';
import { Urgency } from '../core/types.js';

// ── Types ───────────────────────────────────────────────────────────

export interface MatchCandidate {
  technician: Technician;
  score: number;
  distanceKm: number;
  h3Distance: number;
  scoringPhase: ScoringPhase;
}

export type ScoringPhase = 'cold-start' | 'data-driven';

export interface FindCandidatesOptions {
  maxDistance: number; // kilometers
  maxResults: number;
}

export interface UrgencyConfig {
  startK: number;
  payMultiplier: number;
  parallelOutreach: number;
}

// ── Constants ───────────────────────────────────────────────────────

const H3_RESOLUTION = 7; // ~5.16 km^2 avg hex area — good for city-level matching
const COLD_START_THRESHOLD = 5; // jobs needed before data-driven scoring kicks in

// ── Technician index (in-memory, replaced by DB in production) ──────

const techniciansByCell = new Map<string, Set<string>>();
const techniciansById = new Map<string, Technician>();

export function indexTechnician(tech: Technician): void {
  techniciansById.set(tech.id, tech);
  const cell = tech.h3Index || latLngToCell(0, 0, H3_RESOLUTION);
  let cellSet = techniciansByCell.get(cell);
  if (!cellSet) {
    cellSet = new Set();
    techniciansByCell.set(cell, cellSet);
  }
  cellSet.add(tech.id);
}

export function removeTechnician(techId: string): void {
  const tech = techniciansById.get(techId);
  if (tech) {
    const cell = tech.h3Index;
    techniciansByCell.get(cell)?.delete(techId);
    techniciansById.delete(techId);
  }
}

export function getTechnicianById(id: string): Technician | undefined {
  return techniciansById.get(id);
}

export function listTechnicians(): Technician[] {
  return [...techniciansById.values()];
}

export function clearIndex(): void {
  techniciansByCell.clear();
  techniciansById.clear();
}

// ── Urgency Configuration ───────────────────────────────────────────

export function getUrgencyConfig(urgency: Urgency): UrgencyConfig {
  switch (urgency) {
    case Urgency.EMERGENCY:
      return { startK: 3, payMultiplier: 1.5, parallelOutreach: 5 };
    case Urgency.URGENT:
      return { startK: 2, payMultiplier: 1.25, parallelOutreach: 3 };
    case Urgency.STANDARD:
      return { startK: 1, payMultiplier: 1.0, parallelOutreach: 1 };
    case Urgency.FLEXIBLE:
      return { startK: 1, payMultiplier: 0.9, parallelOutreach: 1 };
  }
}

// ── Scoring ─────────────────────────────────────────────────────────

function determineScoringPhase(tech: Technician): ScoringPhase {
  return tech.completedJobs >= COLD_START_THRESHOLD ? 'data-driven' : 'cold-start';
}

function computeDistanceKm(techH3: string, jobH3: string): number {
  const techCoord = cellToLatLng(techH3);
  const jobCoord = cellToLatLng(jobH3);
  return greatCircleDistance(techCoord, jobCoord, UNITS.km);
}

function computeStableTieBreaker(seed: string): number {
  let hash = 0;

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash % 101;
}

export function computeScore(
  tech: Technician,
  workOrder: WorkOrder,
  phase: ScoringPhase,
): number {
  const distKm = computeDistanceKm(tech.h3Index, workOrder.location.h3Index);

  // Normalize distance: 0km = 100, 50km+ = 0
  const distanceScore = Math.max(0, 100 - (distKm / 50) * 100);

  if (phase === 'cold-start') {
    // Cold-start weights: distance 40%, availability 30%, rate 20%, stable tie-breaker 10%
    const availabilityScore = tech.completedJobs > 0 ? 80 : 50; // basic heuristic
    const rateScore = workOrder.estimatedPay > 0
      ? Math.min(100, (workOrder.estimatedPay / (tech.completedJobs > 0 ? 100 : 80)) * 50)
      : 50;
    const tieBreakerScore = computeStableTieBreaker(`${workOrder.id}:${tech.id}`);

    return clamp(
      distanceScore * 0.4 +
      availabilityScore * 0.3 +
      rateScore * 0.2 +
      tieBreakerScore * 0.1,
    );
  }

  // Data-driven weights: reliability 30%, quality 25%, distance 20%, responsiveness 15%, compliance 10%
  return clamp(
    normalizeWeightedScore(tech.reliabilityScore) * 0.3 +
    normalizeWeightedScore(tech.qualityScore) * 0.25 +
    distanceScore * 0.2 +
    normalizeWeightedScore(tech.responsivenessScore) * 0.15 +
    normalizeWeightedScore(tech.complianceScore) * 0.1,
  );
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeWeightedScore(score: number): number {
  return score <= 1 ? score * 100 : score;
}

// ── Candidate Search ────────────────────────────────────────────────

function getTechsInCells(cells: string[], trade: TradeFilter): Technician[] {
  const seen = new Set<string>();
  const results: Technician[] = [];

  for (const cell of cells) {
    const techIds = techniciansByCell.get(cell);
    if (!techIds) continue;

    for (const id of techIds) {
      if (seen.has(id)) continue;
      seen.add(id);

      const tech = techniciansById.get(id);
      if (!tech) continue;
      if (tech.optedOut) continue;
      if (!tech.trades.includes(trade)) continue;

      results.push(tech);
    }
  }

  return results;
}

type TradeFilter = Technician['trades'][number];

export function findCandidates(
  workOrder: WorkOrder,
  options: FindCandidatesOptions,
): MatchCandidate[] {
  const urgencyConfig = getUrgencyConfig(workOrder.urgency);
  const jobH3 = workOrder.location.h3Index || latLngToCell(
    workOrder.location.lat,
    workOrder.location.lng,
    H3_RESOLUTION,
  );

  const candidates: MatchCandidate[] = [];
  let k = urgencyConfig.startK;
  const maxK = Math.max(k + 5, 10); // safety cap on search radius

  // Expand search radius until we have enough candidates or hit max
  while (candidates.length < options.maxResults && k <= maxK) {
    const cells = gridDisk(jobH3, k);
    const techs = getTechsInCells(cells, workOrder.tradeType);

    for (const tech of techs) {
      // Skip if already in candidates
      if (candidates.some(c => c.technician.id === tech.id)) continue;

      const distKm = computeDistanceKm(tech.h3Index, jobH3);

      // Skip if beyond max distance
      if (distKm > options.maxDistance) continue;

      const phase = determineScoringPhase(tech);
      const score = computeScore(tech, workOrder, phase);

      // Compute H3 grid distance (ring count from center)
      const h3Dist = k; // approximate — tech is in ring k or closer

      candidates.push({
        technician: tech,
        score,
        distanceKm: Math.round(distKm * 100) / 100,
        h3Distance: h3Dist,
        scoringPhase: phase,
      });
    }

    k++;
  }

  // Sort by score descending, take top N
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, options.maxResults);
}

// ── Batch outreach selection ────────────────────────────────────────

export function selectOutreachBatch(
  candidates: MatchCandidate[],
  urgency: Urgency,
): MatchCandidate[] {
  const config = getUrgencyConfig(urgency);
  return candidates.slice(0, config.parallelOutreach);
}
