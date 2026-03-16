# ADR-005: Durable Execution & State Machine

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #5
**Decision by**: E0:orchestrator

## Decision

XState v5 for state machine + BullMQ for job execution. Inngest dropped.

## Context

Work order lifecycle has 12+ states and 20+ transitions. Need durable execution for multi-step dispatch workflows with retries and failure handling.

## Rationale

- **Three systems was over-engineered.** BullMQ + XState is sufficient.
- **Inngest dropped** because:
  - Requires cloud service ($25-200/mo) or self-hosted server (extra process)
  - BullMQ Flows already provide parent-child job dependencies (same capability)
  - Adding Inngest means a third persistence layer (Redis + SQLite + Inngest's store)
- **XState v5 kept** because:
  - 12+ states with 20+ transitions is a genuine state machine problem
  - Formal state definitions, transition guards, enter/exit actions, visual inspector
  - TypeScript-native type safety prevents invalid transitions at compile time
  - A switch/case becomes unmaintainable at this complexity
- **Architecture**: XState defines valid transitions, BullMQ executes the work. XState transitions trigger BullMQ jobs. BullMQ completion triggers XState transitions. Clean separation.

## State Machine (Work Order Lifecycle)

```
new -> evaluating -> accepted -> matching -> outreach -> dispatching ->
in_progress -> completing -> invoicing -> paid

Branches: rejected, escalated, cancelled, no_show, rescheduled
```

## Consequences

- Two systems to learn (XState + BullMQ) instead of three
- No Inngest dependency (cloud or self-hosted)
- Redis is the only external persistence for job execution
- BullMQ Flows handle multi-step workflow orchestration
- XState visual inspector available for debugging state transitions

## Evidence

- `docs/research/agent-frameworks-orchestration.md`
