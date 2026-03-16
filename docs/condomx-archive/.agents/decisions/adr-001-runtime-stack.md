# ADR-001: Runtime Stack

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #1
**Decision by**: E0:orchestrator

## Decision

TypeScript + Node.js 25.6.1 (primary) + Hono framework + BullMQ + SQLite WAL mode. Bun migration when ecosystem compatibility is verified.

## Context

Need a runtime stack that supports all required SDKs (Patchright, BullMQ, Stripe Connect, Retell, Telnyx, LiveKit) with minimal friction. Single-server deployment on HP Omen (64GB RAM, 24C/32T).

## Rationale

- TypeScript: only language where ALL SDKs converge natively
- Node 25.6.1: proven worker_threads support for BullMQ, Patchright compatibility verified
- Bun: faster but unverified with Patchright Chromium binary management and BullMQ worker_threads. Test in parallel, migrate when confirmed (30-minute migration path)
- Hono: 10x faster than Express, 14KB, edge-portable, Bun-native
- BullMQ: 50k-500k jobs/sec capacity, we need ~1k/day. Native priorities, delays, retries
- SQLite WAL: microsecond queries, handles 10K+ writes/sec, 575x faster connections than Postgres via libSQL

## Consequences

- No Python in the main stack (Nodriver sidecar only if needed)
- Redis required for BullMQ (single Redis instance, no cluster)
- Bun migration is a future optimization, not a blocker
- If SQLite write contention appears (>100ms P99), migrate to Turso libSQL (config change only)

## Evidence

- `docs/research/speed-latency-optimization.md`
- `docs/research/agent-frameworks-orchestration.md`
