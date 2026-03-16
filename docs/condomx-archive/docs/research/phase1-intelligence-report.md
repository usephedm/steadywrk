# CondomX Phase 1 — Intelligence Report
## Compiled: 2026-03-06 from 5 parallel research agents

---

## DMG Pro Platform Intelligence

- **No public API exists** — walled garden, web portal + mobile app only
- Mobile app is React Native (confirmed via job postings) — reverse-engineerable
- Control Center at `controlcenter.dmgpro.com` — standard web app, automatable
- Login flow: phone → SMS code → 20-second expiry → sequential only
- ~1 million jobs/year, 16,000+ technicians, 65+ trades, all 50 states
- $280M+ revenue, headquartered Cincinnati/Newport KY
- Clients: Walgreens (Vendor of Year), Sam's Club, Kroger, Dollar General, GAP, Target
- Payment: NET55 standard, EarlyPay same-day for 6% discount
- Key URLs: controlcenter.dmgpro.com, login.dmgpro.com, dmgexternal.zendesk.com
- Provider roles: Admin (full), Dispatcher (jobs), Invoicer (billing), Technician (app-only)
- Competitors WITH APIs: ServiceChannel (full REST + webhooks), Corrigo (REST + SOAP)
- Competitors WITHOUT APIs: FacilitySource, MaintenX (same walled garden problem)

## Voice Platform Comparison

| Platform | Cost/Min | Latency | Best For |
|----------|----------|---------|----------|
| Retell AI | $0.07+LLM | ~600ms | Inbound, scheduling, home services |
| Bland AI | $0.09-0.14 | ~800ms | Bulk outbound, cheapest |
| Vapi | $0.05+providers | ~700ms | Max customization, Squads feature |
| Synthflow | $0.13+ | Sub-100ms audio | No-code, enterprise |

**Decision**: Bland AI for outbound tech cold-calling (cheapest, simplest API). Retell AI for inbound (fastest, best function calling). Consider Vapi later for advanced multi-agent call flows.

## SMS/Text Platform

**Twilio** is the clear choice:
- $0.0079/msg, A2P 10DLC support, ConversationRelay for AI
- A2P 10DLC registration MANDATORY — carriers block unregistered traffic
- Wire Twilio SMS to custom LLM conversation engine for multi-turn negotiations

## Agent Architecture Intelligence

**Mastra.ai** emerged as the top TypeScript agent framework (150K weekly npm, YC-backed, $13M seed). However, for CondomX we go custom agent loop (same pattern as VAEL) to avoid framework overhead and maintain full control. Key patterns to adopt from Mastra:
- Thread-based memory with compression
- Zod-validated tool inputs/outputs
- Workflow suspension for human approval

**Temporal** recommended for durable workflow execution (survives crashes, timers persist). Consider for Phase 2+ when reliability requirements increase.

## Legal/Compliance Summary

- **B2B calls to technicians**: more lenient (business exemption from DNC)
- **FCC one-to-one consent rule**: STRUCK DOWN by 11th Circuit (Aug 2025)
- **AI disclosure**: required at call start where state law mandates
- **TCPA**: no calls before 8am or after 9pm local time, $500-1500/violation
- **Two-party consent recording states**: CA, CT, FL, IL, MD, MA, MT, NH, PA, WA
- **A2P 10DLC**: NON-NEGOTIABLE for SMS, register via TCR through Twilio
- **Technician consent**: get blanket consent during onboarding for job-related comms

## Payment Processing

**Stripe Connect** recommended:
- Marketplace model: client pays → platform holds → release to tech minus fee
- Manual capture for escrow-like behavior
- Instant payouts (charge tech 1-2% — revenue opportunity)
- 1099 generation for subcontractors
- Multiple partial payments supported

## Industry Benchmarks

| Metric | Industry Avg | CondomX Target |
|--------|-------------|---------------|
| Completion rate | >95% | >99% |
| Emergency response | <2 hours | <30 min to dispatch |
| First-time fix rate | >85% | >92% |
| Tech utilization | 70-80% | >85% |
| Net profit margin | 1.4-3.5% | 15-40% (subcontracting spread) |

## Novel Approaches Identified

1. **Multi-agent call routing**: Vapi Squads — chain greeting→scheduling→pricing agents in one call
2. **RL-based pricing**: train on negotiation outcomes, optimize margin vs acceptance rate
3. **Predictive dispatch**: analyze location history to pre-position techs before failures
4. **Knowledge graph**: capture tribal knowledge from every job for better triage
5. **Computer vision QC**: analyze completion photos to auto-verify work quality
6. **Dynamic pricing**: Uber-model with urgency/demand/time multipliers

## Key Sources
- ServiceChannel Developer Portal: developer.servicechannel.com
- DMG Pro Control Center: controlcenter.dmgpro.com
- DMG Pro Tech App Guide: dmgexternal.zendesk.com
- Bland AI: bland.ai ($0.09/min outbound)
- Retell AI: retellai.com ($0.07/min + LLM)
- Vapi: vapi.ai ($0.05/min + providers)
- Twilio: twilio.com ($0.0079/msg)
- Stripe Connect: stripe.com/connect
- TCPA/FCC rules: fcc.gov, apten.ai compliance guide
- Mastra.ai: mastra.ai (TypeScript agent framework)
- Temporal: temporal.io (durable workflow execution)
