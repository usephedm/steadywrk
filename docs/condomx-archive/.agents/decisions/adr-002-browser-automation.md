# ADR-002: Browser Automation Strategy

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #2
**Decision by**: E0:orchestrator

## Decision

4-tier automation strategy: Patchright (primary) + Stagehand (self-healing) + Mobile API RE (parallel endgame) + Nodriver (nuclear fallback).

## Context

DMG Pro has no public API. Work orders must be detected, accepted, and managed through browser automation or mobile app reverse engineering.

## Rationale

- **Tier 1 — Patchright**: TypeScript-native Playwright fork, automation flags patched. DMG Pro is an internal contractor portal with likely basic bot detection — Patchright is sufficient. Zero cross-language friction.
- **Tier 2 — Stagehand**: LLM-vision-based element identification for self-healing automation. When DMG Pro changes UI, selectors break; Stagehand re-identifies elements visually. Cost: ~$0.001/action via GPT-5 Nano vision.
- **Tier 3 — Mobile API RE**: React Native app -> Frida + mitmproxy -> capture endpoints -> direct API calls. No browser needed. 10x faster, 10x more reliable. Start Week 2 after basic automation proves the workflow.
- **Tier 4 — Nodriver**: Python sidecar, only if DMG Pro upgrades to Cloudflare/DataDome-level protection. Probability <5%.

## Consequences

- Phase 1 automation is Patchright only — fastest path to working system
- Stagehand adds ~$0.001/action cost but eliminates DOM change breakage
- Mobile API RE requires rooted Android device or emulator — hardware dependency
- If mobile API captured successfully, browser automation is deprecated entirely

## Evidence

- `docs/research/browser-automation-stealth.md`
- `docs/research/dmg-pro-mobile-api-reverse.md` (agent:eyes)
