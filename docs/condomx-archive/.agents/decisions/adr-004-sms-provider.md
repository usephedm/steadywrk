# ADR-004: SMS Provider

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #4
**Decision by**: E0:orchestrator

## Decision

Telnyx primary ($0.004/msg). Custom Sticky Sender logic. A2P 10DLC registration is CRITICAL PATH — must start immediately.

## Context

SMS is the primary dispatch channel (ADR-003). Need reliable, cost-effective messaging with regulatory compliance.

## Rationale

- Telnyx: $0.004/msg vs Twilio $0.0079/msg = 50% savings ($82/month at 700 msgs/day)
- Sticky Sender: 20 lines of code (map tech_phone -> our_number in DB). Not worth paying double for Twilio's built-in version.
- Number strategy: 14 accounts = 14-28 phone numbers. $1/month/number via Telnyx = $28/month max.
- Twilio retained as hot-swap backup if Telnyx deliverability issues emerge.

## CRITICAL BLOCKER

**A2P 10DLC registration takes 4-6 weeks.** Without it, carriers block 100% of A2P messages. Actions required THIS WEEK:

1. Register with TCR through Telnyx
2. Brand registration ($4 one-time)
3. Campaign registration (~$15/month)
4. Wait 4-6 weeks for approval
5. Build SMS dispatch engine in parallel, test with verified numbers only

**Every day of delay = one day closer to mid-April before SMS dispatch is operational.**

## Consequences

- SMS dispatch blocked until 10DLC approval (~mid-April 2026)
- Must build and test SMS engine against verified numbers only until approval
- Telnyx -> Twilio hot-swap requires abstraction layer in comms module
- 14+ phone numbers to provision and manage

## Evidence

- `docs/research/sms-messaging-platforms.md`
- `docs/research/legal-compliance-guide.md`
