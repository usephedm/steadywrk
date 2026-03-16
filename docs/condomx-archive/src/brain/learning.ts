// CondomX Dispatch Learning Engine
//
// Phase 10: Intelligence — Self-improvement loops
// Analyzes global dispatch performance and adjusts scoring weights.

import { createLogger } from '../infra/logger.js';
import { db } from '../memory/database.js';
import type { TradeType } from '../core/types.js';

const log = createLogger('brain:learning');

export interface ScoringWeights {
  reliability: number;
  quality: number;
  distance: number;
  responsiveness: number;
  compliance: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  reliability: 0.30,
  quality: 0.25,
  distance: 0.20,
  responsiveness: 0.15,
  compliance: 0.10,
};

// ---------------------------------------------------------------------------
// System config helpers (key-value store in SQLite)
// ---------------------------------------------------------------------------

db.exec(`
  CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS global_dispatch_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trade TEXT NOT NULL,
    hour_of_day INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    successful_dispatches INTEGER NOT NULL DEFAULT 0,
    total_dispatches INTEGER NOT NULL DEFAULT 0,
    avg_response_time_ms REAL NOT NULL DEFAULT 0,
    UNIQUE(trade, hour_of_day, day_of_week)
  );
`);

function getSystemConfig(key: string): string | undefined {
  const row = db.prepare('SELECT value FROM system_config WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value;
}

function setSystemConfig(key: string, value: string): void {
  db.prepare(
    'INSERT INTO system_config (key, value, updated_at) VALUES (?, ?, datetime(\'now\')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
  ).run(key, value);
}

interface GlobalMetricRow {
  hour_of_day: number;
  day_of_week: number;
  successful_dispatches: number;
  total_dispatches: number;
  avg_response_time_ms: number;
}

function updateGlobalDispatchMetrics(
  trade: TradeType,
  hour: number,
  day: number,
  success: boolean,
  responseTimeMs: number,
): void {
  db.prepare(`
    INSERT INTO global_dispatch_metrics (trade, hour_of_day, day_of_week, successful_dispatches, total_dispatches, avg_response_time_ms)
    VALUES (?, ?, ?, ?, 1, ?)
    ON CONFLICT(trade, hour_of_day, day_of_week) DO UPDATE SET
      successful_dispatches = successful_dispatches + ?,
      total_dispatches = total_dispatches + 1,
      avg_response_time_ms = (avg_response_time_ms * total_dispatches + ?) / (total_dispatches + 1)
  `).run(trade, hour, day, success ? 1 : 0, responseTimeMs, success ? 1 : 0, responseTimeMs);
}

function getGlobalMetrics(trade: TradeType): GlobalMetricRow[] {
  return db.prepare('SELECT hour_of_day, day_of_week, successful_dispatches, total_dispatches, avg_response_time_ms FROM global_dispatch_metrics WHERE trade = ?').all(trade) as GlobalMetricRow[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Gets current scoring weights from the system config or returns defaults.
 */
export function getCurrentWeights(): ScoringWeights {
  const stored = getSystemConfig('dispatch_weights');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (err) {
      log.error('Failed to parse stored weights', { error: err });
    }
  }
  return { ...DEFAULT_WEIGHTS };
}

/**
 * Records a dispatch outcome for global learning.
 */
export function recordDispatchOutcome(
  trade: TradeType,
  success: boolean,
  responseTimeMs: number,
  timestamp: string = new Date().toISOString()
): void {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const day = date.getDay();

  updateGlobalDispatchMetrics(trade, hour, day, success, responseTimeMs);

  log.debug('Recorded dispatch outcome for learning', { trade, success, hour, day });
}

/**
 * Periodic self-improvement loop.
 * In a real system, this would run every 24h or after N dispatches.
 * It analyzes which attributes correlate with success and adjusts weights.
 *
 * Simplified logic for Phase 10:
 * If global success rate is low (< 50%), it shifts weight slightly towards 'responsiveness'.
 * If quality complaints are high (not tracked here yet), it shifts towards 'quality'.
 */
export async function runSelfImprovementLoop(): Promise<void> {
  log.info('Running self-improvement weight adjustment');

  const currentWeights = getCurrentWeights();
  const nextWeights = { ...currentWeights };

  // Placeholder logic for weight adjustment
  // In production, this would use a regression model on global_dispatch_metrics

  // Example: if we want to be more aggressive on responsiveness
  if (nextWeights.responsiveness < 0.25) {
    nextWeights.responsiveness += 0.01;
    nextWeights.reliability -= 0.01; // Balance the scale
  }

  setSystemConfig('dispatch_weights', JSON.stringify(nextWeights));
  log.info('Adjusted dispatch weights', { from: currentWeights, to: nextWeights });
}

/**
 * Predictive Dispatch: Get probability of success for a given time/trade based on global history.
 */
export function getSuccessProbability(trade: TradeType, date: Date = new Date()): number {
  const hour = date.getHours();
  const day = dayOfWeekToGroup(date.getDay()); // 0=weekend, 1=weekday

  const metrics = getGlobalMetrics(trade);
  const relevant = metrics.find(m => m.hour_of_day === hour && dayOfWeekToGroup(m.day_of_week) === day);

  if (relevant && relevant.total_dispatches > 0) {
    return relevant.successful_dispatches / relevant.total_dispatches;
  }

  // Baseline if no data
  return 0.75;
}

function dayOfWeekToGroup(day: number): number {
  return (day === 0 || day === 6) ? 0 : 1;
}
