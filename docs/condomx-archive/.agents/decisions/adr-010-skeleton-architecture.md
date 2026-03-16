# ADR-010: Skeleton Architecture

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #10
**Decision by**: E0:orchestrator

## Decision

Monolith-first with clean module boundaries. Single PM2 process. Single SQLite database. Redis for BullMQ only.

## Module Structure

```
src/
├── core/           # Config, types, constants, QANAT rules engine
├── eyes/           # DMG Pro browser automation + mobile API client
├── brain/          # Dispatch engine, state machine, matching algorithm
├── comms/          # Voice (Retell), SMS (Telnyx), conversation engine
├── memory/         # Database, tech scoring, learning, analytics
├── finance/        # Stripe Connect, invoicing, P&L tracking
├── compliance/     # State engine, consent, audit, DNC
├── infra/          # Health monitoring, logging, PM2 integration
└── api/            # Internal HTTP API (Hono) for dashboard/monitoring
```

## Enforcement Rules

1. Each module exports through `index.ts` ONLY. No cross-module deep imports.
2. Dependencies are unidirectional: `core` <- everything. No circular deps.
3. Inter-module async communication through typed events (TypeScript discriminated unions).
4. Every module exposes a `health()` function returning module status.
5. PM2 cluster mode for CPU utilization across 24 cores.

## Data Architecture

- **SQLite WAL mode**: Source of truth. Single file. Daily snapshot + WAL checkpoint backup.
- **Redis**: BullMQ job queues ONLY. Not for application state. Not for sessions.
- **Turso migration**: Config change only, if write contention >100ms P99 (unlikely at 14 accounts).

## Service Extraction Criteria (NEVER unless)

- SQLite write contention >100ms P99 (measure first)
- PM2 cluster can't handle CPU load (scale vertically first)
- Geographic distribution required (all 14 accounts are US-based)

## Deploy Target

- HP Omen: 64GB RAM, 24C/32T, single PM2 process
- PM2 cluster mode for multi-core utilization
- PM2 ecosystem.config for environment management

## Evidence

- `docs/research/agent-frameworks-orchestration.md`
- `docs/research/speed-latency-optimization.md`
