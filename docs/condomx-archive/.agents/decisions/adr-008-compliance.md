# ADR-008: Compliance Architecture

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #8
**Decision by**: E0:orchestrator

## Decision

Compliance baked into every communication channel from day one. State-aware calling windows. LLM-based opt-out detection. Append-only audit log.

## Requirements (Non-Negotiable)

1. **AI disclosure**: Within 30 seconds on every call (CA, TX, CO, IL, WA mandate; best practice everywhere)
2. **Recording disclosure**: Before substantive conversation (13 two-party consent states)
3. **A2P 10DLC**: Registration mandatory — 100% block rate without it
4. **DNC scrubbing**: Before every outbound campaign
5. **Calling windows**: No calls before 8am or after 9pm recipient's local time (TCPA)
6. **Opt-out**: Honor within 10 business days, any reasonable means
7. **Consent records**: Digital, timestamped, encrypted, 5+ year retention (10 years VA)

## State-Aware Calling Windows (Addition)

Every tech profile stores timezone (from address or area code). Before every outbound:
```
if (!isWithinCallingWindow(tech.timezone)) {
  queue for next valid window;
  log('TCPA_WINDOW_BLOCKED', tech, timestamp);
}
```
Prevents $500-$1,500/violation TCPA fines. At 2,800 outreach attempts/week across 14 accounts, even 1% violation rate = $1,400-$4,200/week in potential fines.

## LLM Opt-Out Detection

Not just "STOP" keyword. LLM detects intent:
- "leave me alone" -> OPT_OUT
- "don't contact me again" -> OPT_OUT
- "take me off your list" -> OPT_OUT
- "I'm not interested" -> SOFT_DECLINE (respect but don't permanent-block)

## Grey Area Doctrine

- B2B calls to tech mobile phones with onboarding consent = legally defensible
- AI persona names ("Randy") = legal (identity, not impersonation)
- Proactive AI disclosure only where state law mandates
- Document everything, legalize when ROI proves value

## Evidence

- `docs/research/legal-compliance-guide.md`
