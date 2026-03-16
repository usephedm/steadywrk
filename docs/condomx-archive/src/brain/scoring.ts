// CondomX Technician Scoring Engine — Feedback Loops
//
// P1.5 / Phase 6: Memory & Learning
// Updates technician scores based on job performance and interaction history.

import { createLogger } from '../infra/logger.js';
import { getTechnician, updateTechnicianScore } from '../memory/database.js';

const log = createLogger('brain:scoring');

// -- Constants ----------------------------------------------------------------

const LEARNING_RATE = 0.1; // How quickly scores adjust (0.1 = 10% weight on new data)

// -- Score Update Logic -------------------------------------------------------

export interface JobFeedback {
  reliability?: number; // 0 to 1 (e.g., arrived on time = 1, late = 0.5, no-show = 0)
  quality?: number;     // 0 to 1 (from customer/platform feedback)
  responsiveness?: number; // 0 to 1 (how fast they replied to outreach)
  compliance?: number;   // 0 to 1 (did they follow all rules/disclosure)
}

/**
 * Updates a technician's scores based on a completed job or interaction.
 */
export function processJobFeedback(techId: string, feedback: JobFeedback): void {
  const tech = getTechnician(techId);
  if (!tech) {
    log.error('Cannot update scores: Technician not found', { techId });
    return;
  }

  const newScores = {
    reliabilityScore: tech.reliabilityScore,
    qualityScore: tech.qualityScore,
    responsivenessScore: tech.responsivenessScore,
    complianceScore: tech.complianceScore,
    compositeScore: tech.compositeScore,
  };

  // 1. Calculate new individual scores using moving average
  if (feedback.reliability !== undefined) {
    newScores.reliabilityScore = updateMovingAverage(tech.reliabilityScore, feedback.reliability);
  }
  if (feedback.quality !== undefined) {
    newScores.qualityScore = updateMovingAverage(tech.qualityScore, feedback.quality);
  }
  if (feedback.responsiveness !== undefined) {
    newScores.responsivenessScore = updateMovingAverage(tech.responsivenessScore, feedback.responsiveness);
  }
  if (feedback.compliance !== undefined) {
    newScores.complianceScore = updateMovingAverage(tech.complianceScore, feedback.compliance);
  }

  // 2. Re-calculate composite score
  // Weights (Data-driven Phase): reliability 30%, quality 25%, distance 20%, responsiveness 15%, compliance 10%
  // Note: Distance is calculated per-job, so we use a placeholder or omit here.
  // In the matching engine, composite is calculated dynamically.
  // Here we store the "base" composite (excluding distance).
  newScores.compositeScore =
    newScores.reliabilityScore * 0.4 +
    newScores.qualityScore * 0.3 +
    newScores.responsivenessScore * 0.2 +
    newScores.complianceScore * 0.1;

  log.info('Updating technician scores', {
    techId,
    oldComposite: tech.compositeScore.toFixed(2),
    newComposite: newScores.compositeScore.toFixed(2),
  });

  updateTechnicianScore(techId, {
    reliabilityScore: newScores.reliabilityScore,
    qualityScore: newScores.qualityScore,
    responsivenessScore: newScores.responsivenessScore,
    complianceScore: newScores.complianceScore,
    compositeScore: newScores.compositeScore,
  });
}

/**
 * Updates technician stats after a no-show.
 */
export function recordNoShow(techId: string): void {
  const tech = getTechnician(techId);
  if (!tech) return;

  log.warn('Recording no-show for technician', { techId });

  processJobFeedback(techId, {
    reliability: 0, // Heavy penalty
    quality: tech.qualityScore, // Unchanged
    responsiveness: tech.responsivenessScore,
    compliance: 0.5, // Minor penalty for breaking commitment
  });

  // In production, we'd also increment no_show_count in the DB
}

function updateMovingAverage(current: number, newValue: number): number {
  return current * (1 - LEARNING_RATE) + newValue * LEARNING_RATE;
}
