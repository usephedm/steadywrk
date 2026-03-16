# ADR-009: Technician Matching Algorithm

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #9
**Decision by**: E0:orchestrator

## Decision

H3 hexagonal grid indexing + 2-phase composite scoring (cold-start vs data-driven) + urgency tiers + BullMQ priority queue.

## H3 Geospatial Indexing

- Resolution 7 (~5km²) for urban, resolution 6 (~36km²) for suburban/rural
- Every tech and job site gets H3 index on ingestion
- Matching: `kRing(job_h3, k)` -> filter by trade -> sort by composite score -> top N
- H3 computed in application code via `h3-js` (<1ms per index)
- Stored as indexed VARCHAR column in SQLite

## Composite Scoring

### Phase 1 — Cold Start (no history)
| Factor | Weight | Source |
|--------|--------|--------|
| Distance to job | 40% | H3 kRing distance |
| Availability signal | 30% | Last response time, online recency |
| Rate compatibility | 20% | Tech expected rate vs job budget |
| Random factor | 10% | Prevent burnout of same techs |

### Phase 2+ — Data-Driven (5+ completed jobs)
| Factor | Weight | Source |
|--------|--------|--------|
| Reliability | 30% | Show-up rate, on-time rate |
| Quality | 25% | Client feedback, completion rate |
| Distance | 20% | H3 kRing distance |
| Responsiveness | 15% | Response time to outreach |
| Compliance | 10% | Follows instructions, check-in/out |

Transition: automatic once tech completes 5+ jobs. No manual intervention.

## Urgency Tiers

| Tier | Search Start | Pay Multiplier | Outreach Strategy |
|------|-------------|----------------|-------------------|
| Emergency | k=3 | 1.5x base | Top 5 simultaneously |
| Urgent | k=2 | 1.25x base | Top 3 simultaneously |
| Standard | k=1 | 1.0x base | Sequential, expand after 10min |
| Flexible | k=1 | 0.9x base | Sequential, expand after 30min |

## Consequences

- No PostGIS dependency — all spatial logic in application code
- Cold-start scoring means initial dispatches are distance-weighted (acceptable)
- Urgency tiers affect cost (higher pay multipliers) — tracked in per-job P&L
- Pre-matching cache (top candidates per open job) refreshes every 5 minutes

## Evidence

- `docs/research/technician-recruitment-scoring.md`
- `docs/research/speed-latency-optimization.md`
