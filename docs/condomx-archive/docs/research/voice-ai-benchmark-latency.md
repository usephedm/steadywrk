# Voice AI Benchmark & Latency Analysis — M3 Deep Dive

> **Milestone**: M3 (Voice AI Deep Dive)  
> **Agent**: agent:research (E1)  
> **Status**: IN PROGRESS  
> **Started**: 2026-03-06T05:30Z  
> **Constitution Reference**: QANAT Principle III (Zero Dead Air), VI (Learn or Die)

---

## Executive Summary

**Objective**: Hands-on benchmarking of voice AI platforms for CondomX dispatcher use case.

**Key Findings** (from existing research + new analysis):

| Platform | Cost/Min | Latency | Best For | CondomX Fit |
|----------|----------|---------|----------|-------------|
| **Retell AI** | $0.07 | ~800ms | Inbound, scheduling | **P0 - Primary** |
| **Bland AI** | $0.09 | ~800ms | Bulk outbound, cheapest | **P0 - Primary** |
| **Vapi** | $0.13-0.31 | ~700ms | Customization, Squads | P1 - Advanced |
| **Synthflow** | ~$0.08 | ~420ms | No-code, enterprise | P2 - Overkill |
| **Twilio** | $0.01+LLM | ~950ms | Reliability, global | Infrastructure only |

**Recommendation**: 
- **Outbound (tech cold calls)**: Bland AI ($0.09/min, simplest API)
- **Inbound (tech responses)**: Retell AI ($0.07/min, fastest, best function calling)
- **Total estimated cost**: $0.08/min blended = $48/hour of call time

---

## Latency Deep Dive

### Target Metrics (QANAT Principle III)

**Zero Dead Air Requirement**:
- Inbound call answer: < 3 rings (<10 seconds)
- AI response time: < 500ms initial, < 800ms total round-trip
- Technician outreach: < 5 minutes after job acceptance

### Time-to-First-Byte (TTFB) Breakdown

| Component | Target | Best-in-Class | Notes |
|-----------|--------|---------------|-------|
| STT (speech-to-text) | <300ms | Deepgram local: 110ms | Deepgram API: 250ms |
| LLM inference | <400ms | ElevenLabs Flash v2.5: 75ms | Depends on model size |
| TTS (text-to-speech) | <200ms | Google Studio: 200-250ms | ElevenLabs: <150ms |
| **Total round-trip** | **<800ms** | **~420ms (Synthflow)** | **CondomX target: <600ms** |

### Platform Latency Comparison

**Retell AI** (~800ms average):
- STT: Deepgram or Google
- LLM: Bring-your-own (OpenAI, Anthropic, etc.)
- TTS: ElevenLabs or Google
- **Pros**: Fastest in class for inbound, best function calling
- **Cons**: Slightly higher latency than Synthflow

**Bland AI** (~800ms average):
- Integrated stack (STT + LLM + TTS)
- **Pros**: Simplest API, cheapest for outbound, 10 lines of code
- **Cons**: Less customization than Vapi

**Vapi** (~700ms average):
- Modular architecture (bring-your-own everything)
- **Pros**: Maximum flexibility, Squads feature (multi-agent calls)
- **Cons**: Higher total cost ($0.13-0.31/min), more engineering required

**Synthflow** (~420ms average):
- Fully integrated, no-code builder
- **Pros**: Fastest latency, visual Flow Designer
- **Cons**: Enterprise-focused, overkill for MVP

---

## Cost Modeling for CondomX

### Assumptions
- **Phase 1**: 14 accounts, ~50 jobs/day average
- **Call volume**: 3 calls/job (accept confirmation + 2 tech outreach attempts)
- **Average call duration**: 2 minutes
- **Monthly call minutes**: 50 jobs × 3 calls × 2 min × 30 days = **9,000 minutes/month**

### Cost Comparison

| Platform | Cost/Min | Monthly Cost (9K min) | Annual Cost |
|----------|----------|----------------------|-------------|
| Retell AI | $0.07 | $630 | $7,560 |
| Bland AI | $0.09 | $810 | $9,720 |
| Vapi (low) | $0.13 | $1,170 | $14,040 |
| Vapi (high) | $0.31 | $2,790 | $33,480 |
| Synthflow | $0.08 | $720 | $8,640 |
| Twilio DIY | $0.01 + LLM | ~$400 | ~$4,800 |

**Recommendation**: 
- **MVP (Months 1-3)**: Bland AI outbound + Retell AI inbound = ~$1,440/month blended
- **Scale (Months 4+)**: Negotiate enterprise rates (Retell: $0.05/min at volume)

---

## Hands-On Testing Plan

### Test Scenarios (CondomX Dispatcher Use Case)

**Scenario 1: Outbound Tech Cold Call**
```
AI: "Hey, this is Jimmy from Jay Maintenance. We got a plumbing job in 
     Phoenix, NTE $250. You available today?"
Tech: "Yeah, what's the address?"
AI: "123 Main St, Phoenix AZ 85001. Can you do it for $200?"
Tech: "Make it $220 and I'm there."
AI: "Deal. I'll send you the details. Thanks!"
```

**Metrics to Measure**:
- Time from call initiation to AI greeting (<2 seconds)
- Response latency after tech speaks (<800ms)
- Negotiation success rate (target: >60% acceptance)
- Cost per successful dispatch

**Scenario 2: Inbound Tech Response**
```
Tech: (calls back) "Hey, I'm at the job site. What's the issue?"
AI: "Hey! Customer says the toilet keeps running. They've already 
     shut off the water. You need anything before you start?"
Tech: "Nah, I got it. I'll call when I'm done."
```

**Metrics to Measure**:
- Answer time (<3 rings)
- Context recall (job details accurate)
- Call handoff quality (natural conversation flow)

### Test Accounts to Create

| Platform | Account Status | Test Number | Priority |
|----------|---------------|-------------|----------|
| Bland AI | [ ] Not created | [ ] Not assigned | P0 |
| Retell AI | [ ] Not created | [ ] Not assigned | P0 |
| Vapi | [ ] Not created | [ ] Not assigned | P1 |

**Action Required**: E0 approval for test account creation (requires credit card)

---

## Integration Architecture

### Bland AI Integration (Outbound)

```typescript
// 10 lines of code (per Bland docs)
import BlandAI from 'bland-ai';

const call = await BlandAI.call({
  phone_number: '+15555550123',
  prompt: 'You are Jimmy from Jay Maintenance. Dispatch a plumber...',
  voice: 'jimmy',
  max_duration: 300, // 5 minutes
});
```

**CondomX Wrapper**:
```typescript
// Our dispatcher integration
async function dispatchTechnician(tech: Technician, job: WorkOrder) {
  const call = await bland.call({
    phone_number: tech.phone,
    prompt: buildDispatchPrompt(tech, job),
    voice: getPersonaForAccount(job.accountId),
    tools: [
      { name: 'checkAvailability', handler: checkTechAvailability },
      { name: 'negotiateRate', handler: negotiateRate },
      { name: 'confirmDispatch', handler: confirmDispatch },
    ],
  });
  return call.result;
}
```

### Retell AI Integration (Inbound)

```typescript
import Retell from 'retell-sdk';

const agent = new Retell.Agent({
  response_model: {
    name: 'DispatchAgent',
    prompt: 'You are the dispatch assistant for...',
  },
  voice_id: 'retell-voice-1',
  general_tools: [
    { name: 'lookupJobDetails', type: 'function' },
    { name: 'updateJobStatus', type: 'function' },
  ],
});

// Webhook for call events
app.post('/retell-webhook', (req, res) => {
  const { event, call_id, transcript } = req.body;
  if (event === 'call_ended') {
    // Process call summary, update job status
  }
});
```

### Latency Optimization Strategies

1. **Pre-warm LLM context**: Load job details before call connects
2. **Streaming STT**: Process speech in real-time (not batch)
3. **Interrupt handling**: Allow tech to interrupt AI mid-sentence
4. **Caching**: Cache common responses (greetings, confirmations)
5. **Edge deployment**: Deploy voice AI closest to technician geography

---

## Compliance & Disclosure

### AI Disclosure Requirements (from legal-compliance-guide.md)

| State | Disclosure Required | Timing |
|-------|---------------------|--------|
| CA | Yes | Beginning of call |
| CT | Yes | Beginning of call |
| FL | Yes | Beginning of call |
| IL | Yes | Beginning of call |
| MD | Yes | Beginning of call |
| MA | Yes | Beginning of call |
| MT | Yes | Beginning of call |
| NH | Yes | Beginning of call |
| PA | Yes | Beginning of call |
| WA | Yes | Beginning of call |

**Bland AI Disclosure Script**:
```
AI: "Hi, this is an automated call from Jay Maintenance. I'm calling 
     about a plumbing job..."
```

**Retell AI Disclosure Script**:
```
AI: "Thanks for calling Jay Maintenance. This is an automated assistant. 
     How can I help?"
```

---

## Competitive Intelligence

### What Competitors Use

| Company | Platform | Known Use Case |
|---------|----------|----------------|
| Keys Inc | [Unknown - likely custom] | Autonomous dispatch |
| FieldPulse | [Proprietary] | Inbound receptionist only |
| ServiceTitan | [In-house] | Atlas AI sidekick |

**CondomX Advantage**: 
- First to market with **fully autonomous** voice dispatch (not assistant-only)
- Multi-persona capability (14 companies, 14 voices)
- Integrated with profitability engine (AI negotiates margin)

---

## Next Steps

### Immediate (This Week)
1. [ ] **E0**: Approve test account budget ($100 for Bland + Retell credits)
2. [ ] Create Bland AI test account
3. [ ] Create Retell AI test account
4. [ ] Build test harness (call recording + latency measurement)

### Short-Term (Next Week)
5. [ ] Run Scenario 1 test (outbound dispatch) - 10 calls
6. [ ] Run Scenario 2 test (inbound response) - 10 calls
7. [ ] Measure latency, success rate, cost per call
8. [ ] Document findings in this report

### Medium-Term (Phase 1 Build)
9. [ ] Integrate Bland AI into CondomX dispatcher
10. [ ] Integrate Retell AI for inbound calls
11. [ ] Build call recording + transcription pipeline
12. [ ] Implement compliance disclosure per state

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Platform downtime | Low | High | Fallback to SMS-only dispatch |
| Latency spikes | Medium | Medium | Multi-provider failover |
| Cost overrun | Low | Low | Usage alerts, budget caps |
| Compliance violation | Medium | High | Legal review of scripts |
| Tech rejection of AI | Medium | Medium | Human escalation path |

---

**Last Updated**: 2026-03-06T05:30Z  
**Agent**: agent:research  
**Next Review**: After hands-on testing (target: 2026-03-07)
