# CondomX — Project Configuration

## What This Is
Autonomous AI dispatcher for facility maintenance subcontracting via DMG Pro.
Governed by QANAT.md (the constitution). Read it before making any decisions.

## Required Reading (in order)
1. QANAT.md — Constitution (governing principles)
2. AGENTS.md — Multi-agent governance, echelon system, branch protocol
3. ROADMAP.md — Research milestones and build phases
4. .agents/active-tasks.md — Check before claiming any work

## Current Phase: Research & Intelligence
- NO code, NO implementation, NO tech stack decisions yet
- Gathering intelligence on DMG Pro, voice platforms, SMS, legal, pricing, technician networks
- All findings go in docs/research/
- Design proposals go in docs/plans/
- Nothing is decided until we've completed all research milestones

## CRITICAL: Builder vs Product Separation
The tools building CondomX (Claude Code, agents, E0 orchestrator) are NOT the product.
The product runs independently on its own infrastructure with its own AI subscriptions.
- No production code may import or depend on builder tools (Claude SDK, MCP servers)
- Product AI services (Retell voice, LLM for NLU) use SEPARATE accounts/API keys
- Config via env vars only — no hardcoded developer paths
- Test: "If I close my laptop, does CondomX keep running?" Must be YES.
See QANAT.md Section XI for the full doctrine.

## Key Known Facts (Verified)
- DMG Pro has NO public API — walled garden platform
- DMG Pro mobile app is React Native (reversible)
- 14 accounts under different company names
- Per-account human personas required (matching admin names)
- A2P 10DLC registration required before any SMS sending
- AI disclosure required on calls where state law mandates
- TCPA: no calls before 8am or after 9pm recipient local time

## File Structure
- docs/research/ — Intelligence reports, platform analysis, market data
- docs/plans/ — Design proposals (subject to change)
- QANAT.md — Constitution (governing principles, stable)
