# CondomX — Development Roadmap

> Maintained by E0 (Orchestrator) only.
> Current phase: RESEARCH (Milestones 1-10)
> No code is written until all research milestones are complete.

---

## Phase 0: Research & Intelligence (Current)

### Milestone 1: Core Research [COMPLETE]
- [x] Platform intelligence (DMG Pro, no API, browser automation required)
- [x] Voice AI landscape (Bland, Retell, Vapi, open-source)
- [x] SMS/messaging (Twilio vs Telnyx, A2P 10DLC)
- [x] LLM models cost/latency matrix
- [x] Legal compliance (TCPA, FCC, state laws)
- [x] Browser automation stealth (Nodriver, Camoufox, Patchright)
- [x] Payment processing (Stripe Connect, Mercury, factoring)
- [x] Technician recruitment and scoring
- [x] Speed/latency optimization
- [x] Agent frameworks and orchestration
- **Output**: `docs/research/` — 10 reports, 3,927 lines

### Milestone 2: Deep Competitive Intelligence [NOT STARTED]
- [ ] Keys Inc. patent analysis (US 63/939,152) — full claims review
- [ ] DMG Pro mobile app traffic capture (mitmproxy + Frida)
- [ ] ServiceChannel API documentation study (developer.servicechannel.com)
- [ ] Corrigo provider portal workflow mapping
- [ ] Interview/survey technicians about dispatch preferences
- [ ] Shadow a human dispatcher for workflow documentation

### Milestone 3: Voice AI Deep Dive [NOT STARTED]
- [ ] Bland AI API hands-on testing (create account, test calls)
- [ ] Retell AI API hands-on testing
- [ ] Vapi API evaluation
- [ ] Open-source voice stack testing (Pipecat + LiveKit)
- [ ] Latency benchmarking across platforms
- [ ] Cold call script A/B test design
- [ ] Voice persona design per account

### Milestone 4: DMG Pro Reverse Engineering [NOT STARTED]
- [ ] Control center DOM mapping (all pages, forms, buttons)
- [ ] Login flow documentation (SMS code, timing, session handling)
- [ ] Work order data schema extraction
- [ ] Invoice submission flow mapping
- [ ] Fast-accept SMS link format analysis
- [ ] Mobile app API endpoint discovery (mitmproxy)
- [ ] Rate limiting / anti-bot detection analysis

### Milestone 5: Legal & Compliance Framework [NOT STARTED]
- [ ] State-by-state compliance matrix (all 50 states)
- [ ] AI disclosure script templates per state
- [ ] Consent form templates (onboarding, verbal, written)
- [ ] A2P 10DLC campaign registration plan
- [ ] DNC list integration strategy
- [ ] Insurance verification workflow design
- [ ] Data retention policy document

### Milestone 6: Financial Modeling [NOT STARTED]
- [ ] Per-account P&L projection (all 14 accounts)
- [ ] NET55 cash flow gap analysis
- [ ] Technician pay rate modeling by trade/region
- [ ] Margin optimization simulation
- [ ] EarlyPay vs standard payment decision matrix
- [ ] Startup cost estimate (phones, SMS, voice, LLM, infrastructure)
- [ ] Break-even analysis

### Milestone 7: Technician Network Design [NOT STARTED]
- [ ] Recruitment channel strategy per market
- [ ] Onboarding flow design (SMS-first, no app required)
- [ ] Scoring algorithm design (transparent, composite)
- [ ] H3 geospatial zone design for service areas
- [ ] Referral program structure
- [ ] Background check / COI integration design
- [ ] Retention strategy document

### Milestone 8: Architecture Decision [NOT STARTED]
- [ ] Final tech stack selection (informed by all research)
- [ ] Database design (SQLite vs Turso vs PostgreSQL)
- [ ] Agent architecture (custom vs framework)
- [ ] Durable execution strategy (Temporal vs Inngest vs custom)
- [ ] Communication architecture (voice + SMS + LLM routing)
- [ ] Deployment architecture (PM2 vs Docker vs edge)
- [ ] ADR documents for all major decisions

### Milestone 9: System Design [NOT STARTED]
- [ ] Complete system architecture document
- [ ] API design (internal service boundaries)
- [ ] Data flow diagrams (end-to-end job lifecycle)
- [ ] State machine formal specification
- [ ] Error handling and escalation design
- [ ] Monitoring and observability design
- [ ] Security architecture

### Milestone 10: Implementation Plan [NOT STARTED]
- [ ] Phase-by-phase build plan with dependencies
- [ ] Agent assignment matrix (which E1 agent builds what)
- [ ] Test strategy document
- [ ] CI/CD pipeline design
- [ ] Definition of done per phase
- [ ] Risk register with mitigations
- [ ] Timeline estimate

---

## Phase 1: Foundation (After Milestone 10)
- Repository scaffolding, package setup, configuration system
- Database schema and migrations
- Account configuration loader
- Basic project infrastructure

## Phase 2: Eyes (DMG Pro Monitor)
- Browser automation for DMG Pro
- Multi-account session management
- Work order detection and parsing

## Phase 3: Brain (Dispatch Engine)
- Work order state machine
- Technician matching algorithm
- Pricing engine

## Phase 4: Communication
- SMS integration
- Outbound voice (cold calling)
- Inbound voice handling
- LLM conversation engine

## Phase 5: Finance
- Invoice automation
- Payment tracking
- Stripe Connect integration

## Phase 6: Memory & Learning
- Technician scoring
- Pricing model self-adjustment
- Interaction analytics

## Phase 7: Dashboard
- Live status SPA
- Account health monitoring
- Financial reporting

## Phase 8: Compliance Automation
- Consent management system
- DNC integration
- Recording compliance

## Phase 9: Scale
- All 14 accounts online
- Technician recruitment automation
- Advanced negotiation strategies

## Phase 10: Intelligence
- Predictive dispatch
- Mobile API integration (replace browser automation)
- Self-improvement loops

---

*Last updated: 2026-03-06T04:30Z by E0*
