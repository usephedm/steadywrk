# ADR-003: Voice AI Platform

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #3
**Decision by**: E0:orchestrator

## Decision

SMS-first dispatch flow. Retell AI ($0.07/min) as voice escalation channel. Custom STT+LLM+TTS pipeline as Phase 2 migration target.

## Context

Need to contact technicians for job dispatch. Voice and SMS are both viable channels with dramatically different cost profiles.

## Rationale

- SMS-first saves $246/month vs voice-first at 200 jobs/week (14 accounts scaled)
- Technician psychology: "morning texts beat afternoon calls" — techs on job sites can't answer calls but can glance at texts
- Optimal flow: SMS (immediate) -> SMS urgency bump (15min) -> Voice call via Retell (30min) -> Expand to next tech
- Retell chosen over Bland ($0.09/min, 28% more expensive) and Vapi ($0.144/min, 2x price)
- Retell: best interruption handling, HIPAA/SOC2 included, no platform fees
- Custom pipeline target: Deepgram STT + Gemini Flash + ElevenLabs Flash v2.5 = ~$0.035/min (50% savings). Build after 500+ calls of data.

## Consequences

- Voice integration is Phase 1 but not the primary dispatch channel
- SMS infrastructure (10DLC, Telnyx) becomes critical path
- Custom pipeline deferred to Phase 2 — requires engineering investment justified by call volume data
- Happy path (SMS acceptance) costs $0.004 per dispatch vs $0.42 for voice

## Evidence

- `docs/research/voice-ai-platforms.md`
- `docs/research/technician-recruitment-scoring.md`
- `docs/research/sms-messaging-platforms.md`
- `docs/research/speed-latency-optimization.md`
