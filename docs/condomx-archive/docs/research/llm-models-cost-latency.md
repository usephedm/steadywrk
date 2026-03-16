I now have comprehensive data across all dimensions. Let me compile the full research report.

---

# LLM Models for Autonomous Agents — Cost, Latency, Intelligence — March 2026

## 1. COMPLETE PRICING MATRIX (per 1M tokens)

### Frontier / Premium Tier

| Model | Provider | Input | Output | Context | Intelligence Score |
|-------|----------|-------|--------|---------|-------------------|
| Gemini 3.1 Pro | Google | $2.00-$4.00 | $12.00-$18.00 | 200K+ | 57 (top) |
| GPT-5.2 Pro | OpenAI | $21.00 | $168.00 | 200K | — |
| Claude Opus 4.6 | Anthropic | $5.00 | $25.00 | 200K | 53 |
| Codex 5.3 | OpenAI | — | — | — | 54 |
| o3-pro | OpenAI | $20.00 | $80.00 | 200K | — |
| Grok 4 | xAI | $3.00 | $15.00 | 2M | — |

### Mid Tier (Best Value for Complex Tasks)

| Model | Provider | Input | Output | Context | Notes |
|-------|----------|-------|--------|---------|-------|
| Claude Sonnet 4.6 | Anthropic | $3.00 | $15.00 | 200K | Intelligence 52, strong coding |
| GPT-5.2 | OpenAI | $1.75 | $14.00 | 200K | Coding, agents |
| GPT-5 | OpenAI | $1.25 | $10.00 | 128K | General flagship |
| Gemini 2.5 Pro | Google | $1.25 | $10.00 | 2M | Long documents |
| o4-mini | OpenAI | $1.10 | $4.40 | 200K | Best value reasoning |
| o3 | OpenAI | $2.00 | $8.00 | 200K | Mid-tier reasoning |
| Mistral Large 3 | Mistral | $2.00 | $6.00 | 128K | GDPR, EU hosting |
| GPT-4.1 | OpenAI | $2.00 | $8.00 | 1M | Previous gen |

### Budget Tier (High Volume)

| Model | Provider | Input | Output | Context | Notes |
|-------|----------|-------|--------|---------|-------|
| Claude Haiku 4.5 | Anthropic | $1.00 | $5.00 | 200K | Fast classification |
| GPT-5 Mini | OpenAI | $0.25 | $2.00 | 200K | Fast, affordable |
| Gemini 2.5 Flash | Google | $0.30 | $2.50 | 1M | Fast mid-tier |
| Mistral Medium 3 | Mistral | $0.40 | $2.00 | 128K | Mid-tier tasks |
| GPT-4.1 Mini | OpenAI | $0.40 | $1.60 | 1M | Previous gen budget |
| Grok 4.1 Fast | xAI | $0.20 | $0.50 | 2M | Budget + huge context |
| DeepSeek V3.2 | DeepSeek | $0.28 | $0.42 | 128K | Insanely cheap |

### Ultra-Budget Tier (Routing/Classification)

| Model | Provider | Input | Output | Context | Notes |
|-------|----------|-------|--------|---------|-------|
| Gemini 2.5 Flash-Lite | Google | $0.10 | $0.40 | 1M | Cheapest mainstream |
| Gemini 2.0 Flash | Google | $0.10 | $0.40 | 1M | Ultra cheap, proven |
| GPT-5 Nano | OpenAI | $0.05 | $0.40 | 128K | High-volume simple |
| GPT-4.1 Nano | OpenAI | $0.10 | $0.40 | 1M | Previous gen fast |
| Ministral 8B | Mistral | $0.10 | $0.10 | 128K | Cheapest Mistral |
| Mistral Nemo | Mistral | $0.02 | $0.02 | 128K | Floor price |

### Open-Source via Providers (Groq, Cerebras, DeepInfra, Together, Fireworks)

| Model | Typical Price (In/Out) | Speed | Notes |
|-------|----------------------|-------|-------|
| Llama 4 Scout/Maverick | $0.05-$0.90/M | Fast | 10M / 1M context |
| Llama 3.3 70B | $0.05-$0.60/M | Very fast | Well-supported |
| Qwen3 235B | $0.50-$1.20/M | Moderate | Strong reasoning |
| Qwen3 32B | $0.10-$0.30/M | Fast | Edge-capable |
| DeepSeek R1 (distills) | $0.10-$0.80/M | Fast | 7B-70B variants |

---

## 2. LATENCY / SPEED DATA

| Model/Provider | TTFT | Output Speed | Notes |
|----------------|------|-------------|-------|
| Cerebras (Llama 8B) | <0.1s | 1,800 tok/s | Fastest inference available |
| Cerebras (Qwen3 235B) | ~0.2s | 1,400 tok/s | Large model, still blazing |
| Groq (various) | <0.2s | 500+ tok/s | LPU hardware, very low TTFT |
| Mercury 2 | — | 759 tok/s | Speed-optimized model |
| Gemini 2.5 Flash-Lite | ~0.2s | 393 tok/s | Fastest Google model |
| Gemini 2.5 Flash | 0.37s | ~200 tok/s | Good voice candidate |
| GPT-4.1 Mini | 0.42s | ~150 tok/s | Fast OpenAI option |
| DeepSeek R1 distill 32B | 0.35s | — | Fast reasoning |
| Claude Haiku 4.5 | ~0.5s | ~100 tok/s | Fastest Anthropic |
| Claude Opus 4.6 | ~1.5s | ~50 tok/s | Slowest, smartest |

---

## 3. BEST MODELS BY USE CASE (CondomX Dispatch)

### (a) Real-Time Phone Conversation
**Winner: Gemini Live API (Flash) or OpenAI gpt-realtime**

- Gemini Live API: Native voice-to-voice, barge-in support, affective dialog, 24 languages, low latency. Pricing based on session turns (accumulating context window).
- OpenAI gpt-realtime: $32/$64 per 1M audio tokens (cached: $0.40). ~$0.06/min input, $0.24/min output. About $0.30/min total for a voice call.
- For a 3-minute contractor call: ~$0.90 via OpenAI Realtime API.
- Alternative: STT (Whisper/Moonshine) + fast LLM (Gemini Flash / GPT-5 Mini) + TTS (ElevenLabs/Hume Octave). More control, potentially cheaper, but higher integration complexity.

### (b) Complex Dispatch Decisions
**Winner: Claude Opus 4.6 or GPT-5.2 or o4-mini**

- These require weighing contractor availability, pricing, location, skills, urgency, compliance rules.
- Claude Opus 4.6 ($5/$25): Best at nuanced reasoning, long-context analysis. Intelligence score 53.
- o4-mini ($1.10/$4.40): Best value reasoning model. Strong at structured decision-making.
- GPT-5.2 ($1.75/$14): Excellent at agentic workflows with function calling.

### (c) Fast Classification / Routing
**Winner: GPT-5 Nano ($0.05/$0.40) or Gemini 2.5 Flash-Lite ($0.10/$0.40)**

- Classify job type, urgency level, required trade in <200ms.
- Near-perfect structured output reliability at this tier.
- At $0.05-$0.10 per million input tokens, classification is essentially free.

### (d) Negotiation / Persuasion
**Winner: Claude Sonnet 4.6 or GPT-5**

- Negotiating pricing with contractors requires nuance, tone control, and persistence.
- Claude excels at natural language persuasion and maintaining consistent persona.
- GPT-5 ($1.25/$10) is strong at multi-turn conversation with memory.

---

## 4. MODEL ROUTING STRATEGY (Recommended for CondomX)

```
Incoming Job Request
    |
    v
[CLASSIFIER] - GPT-5 Nano or Flash-Lite ($0.05-0.10/M)
    |  Classify: job type, urgency, trade, complexity score
    v
Simple Job (score < 0.3)           Complex Job (score >= 0.3)
    |                                   |
    v                                   v
[DISPATCHER] GPT-5 Mini            [DISPATCHER] o4-mini or Sonnet 4.6
  ($0.25/$2.00)                      ($1.10/$4.40 or $3/$15)
    |                                   |
    v                                   v
[VOICE CALL] Gemini Live or        [VOICE CALL] gpt-realtime
  STT+LLM+TTS pipeline              (full negotiation mode)
```

**Cascade logic**: Start with cheapest model. If confidence < threshold, escalate to next tier. Research shows this saves up to 14% over static routing with no quality loss.

---

## 5. STRUCTURED OUTPUT / JSON RELIABILITY

| Model | JSON Reliability | Function Calling | Notes |
|-------|-----------------|-----------------|-------|
| GPT-5 Nano | Near-perfect | Yes | Best budget JSON |
| GPT-5 / 5.2 | Near-perfect | Excellent | Constrained mode |
| o4-mini | Near-perfect | Yes | Strong with schemas |
| Claude Sonnet/Opus 4.6 | Very strong | Yes | Best on long-form |
| Gemini 2.5 Pro/Flash | Very strong | Yes | Explicit schema support |
| GLM-4.5 | Near-perfect | Yes | Surprising budget winner |
| Grok-3 Mini | Near-perfect | Yes | Another budget winner |
| DeepSeek V3.2 | Good | Yes | Occasionally inconsistent |
| Open-source (Llama/Qwen) | Variable | Variable | Depends on provider/quantization |

Key insight: Even the cheapest models (Nano-class) now achieve near-perfect JSON output with schema constraints. This was not true in 2024.

---

## 6. FREE TIERS & PROVIDER AGGREGATORS

### Best Free Tiers for Development

| Provider | Free Allowance | Models Available | Speed |
|----------|---------------|-----------------|-------|
| **Cerebras** | 1M tokens/day | Llama 3.3 70B, Qwen3 235B, GPT-OSS 120B | 1,400-1,800 tok/s |
| **Groq** | 1K req/day (70B) | Llama 3.3 70B, Llama 4 Scout, Qwen3 | 500+ tok/s |
| **Google AI Studio** | 250K TPM, 100-1K req/day | Gemini 2.5 Pro/Flash/Flash-Lite | Fast |
| **Mistral AI** | 1B tokens/month | Mistral Large/Small, Codestral | Moderate |
| **OpenRouter** | 50 req/day (free models) | DeepSeek R1/V3, Llama 4, Qwen3 235B | Varies |
| **Fireworks AI** | Unlimited at 10 RPM | Llama 3.1 405B, DeepSeek R1, hundreds | Fast |
| **Cloudflare Workers AI** | 10K neurons/day | Llama 3.2, Mistral 7B, Whisper | Edge |
| **xAI** | $25 signup credits | Grok 4, Grok 4.1 Fast | Fast |
| **DeepSeek** | 5M tokens (30 days) | DeepSeek V3, R1 | Moderate |

### Aggregators Worth Using

- **OpenRouter**: 300+ models, single API, pay-per-use, free models available. Best for model switching.
- **Together AI**: Strong open-source hosting, occasional $50K startup promos.
- **DeepInfra**: Lowest price for large open-source models (~$0.80/M for 405B).
- **Fireworks AI**: Good balance of speed and price, generous free tier.

---

## 7. EDGE / ON-DEVICE MODELS

For real-time voice on-device (sub-20ms per token):

| Model | Size | Use Case | Notes |
|-------|------|----------|-------|
| Gemma 3 | 270M-2B | Embedded assistant | Google, very small |
| SmolLM2 | 135M-1.7B | Classification | HuggingFace |
| Phi-4 Mini | 3.8B | General tasks | Microsoft |
| Llama 3.2 | 1B/3B | On-device chat | Meta |
| Qwen2.5 | 0.5B-1.5B | Multilingual | Alibaba |
| Moonshine | ASR-specific | Speech-to-text | Fast edge ASR |

Practical reality: On-device models are good for STT and simple classification, but dispatch decision quality requires at minimum a 7B+ model or cloud API. The hybrid approach (edge STT + cloud LLM + edge TTS) is the sweet spot for voice agents in 2026.

---

## 8. PROMPT CACHING

| Provider | Mechanism | Cost Savings | Latency Savings | Min Tokens |
|----------|-----------|-------------|-----------------|------------|
| **Anthropic** | Explicit (developer-controlled) | 90% on cached input | 85% | 1,024 |
| **OpenAI** | Automatic (no code changes) | 50-90% on cached input | Significant | 1,024 |
| **Google** | Implicit (auto) + Explicit (manual) | Variable / Guaranteed | Variable | — |
| **DeepSeek** | Automatic | 90% on cache hits | — | — |

For CondomX: System prompts with dispatch rules, contractor databases, and compliance rules should be cached. With a ~2K token system prompt reused across all calls, caching saves 90% on that portion. Stackable with batch API for up to 95% total savings (Anthropic).

---

## 9. BATCH vs STREAMING for VOICE AI

| Mode | Latency | Cost | Best For |
|------|---------|------|----------|
| **Streaming** | Low (tokens arrive as generated) | Standard pricing | Voice conversations, real-time UI |
| **Batch** | High (minutes to hours) | 50% discount (OpenAI, Anthropic) | Background processing, reports, analytics |
| **Native voice** (Realtime API / Gemini Live) | Lowest (voice-to-voice) | Premium (~$0.30/min) | Phone calls, interactive voice |

For CondomX voice calls: Always streaming or native voice. Batch only for overnight analytics, report generation, or bulk contractor scoring.

---

## 10. TOTAL COST MODEL: 200 Jobs/Week, ~5 LLM Calls/Job

### Call Breakdown Per Job (estimated tokens)

| Step | Model | Input Tokens | Output Tokens | Cost/Call |
|------|-------|-------------|---------------|-----------|
| 1. Classify job | GPT-5 Nano | 500 | 100 | $0.000065 |
| 2. Select contractor | o4-mini | 2,000 | 500 | $0.004400 |
| 3. Voice call (3 min) | gpt-realtime | ~15K audio | ~10K audio | $0.90 |
| 4. Confirm dispatch | GPT-5 Mini | 1,000 | 200 | $0.000650 |
| 5. Generate report | GPT-5 Mini | 1,500 | 500 | $0.001375 |

### Per-Job Cost
- Without voice call: ~$0.006/job
- With voice call: ~$0.91/job

### Monthly Cost (200 jobs/week = 867 jobs/month)

| Scenario | Monthly Cost |
|----------|-------------|
| **No voice calls** (text/SMS dispatch) | ~$5.20/month |
| **25% jobs need voice** (217 calls) | ~$201/month |
| **50% jobs need voice** (433 calls) | ~$397/month |
| **100% jobs need voice** (867 calls) | ~$793/month |
| **With prompt caching (90% savings on system prompt)** | Saves ~15-25% on non-voice calls |

### Cost Optimization Levers

1. **Replace gpt-realtime with STT+LLM+TTS pipeline**: Could cut voice costs by 60-70% ($0.25-0.35/call instead of $0.90).
2. **Use DeepSeek V3.2 for dispatch decisions**: $0.28/$0.42 vs o4-mini's $1.10/$4.40 — 75% cheaper if quality is sufficient.
3. **Prompt caching**: 90% savings on repeated system prompts.
4. **Batch API for reports**: 50% off for non-urgent generation.
5. **Free tiers for dev/testing**: Cerebras (1M tok/day) + Google AI Studio + Groq = zero cost during development.

### Realistic Monthly Budget Estimate

| Tier | Approach | Monthly Cost |
|------|----------|-------------|
| **Minimal** | Text-only dispatch, cheapest models | $5-15 |
| **Standard** | Some voice, cascade routing | $100-200 |
| **Full voice** | Every job gets a phone call | $400-800 |
| **Optimized full voice** | STT+LLM+TTS pipeline | $150-300 |

---

## KEY TAKEAWAYS

1. **LLM costs have collapsed**: Classification is essentially free ($0.05/M tokens). Even complex reasoning is under $5/M input. The expensive part is voice.

2. **Voice is the cost driver**: Native voice APIs (gpt-realtime, Gemini Live) run ~$0.30/min. A STT+LLM+TTS pipeline can cut this to ~$0.10/min with more engineering.

3. **Model routing is mandatory**: Using Opus 4.6 for classification wastes 100x the cost. A 3-tier cascade (Nano -> Mini -> Full) optimizes spend dramatically.

4. **Open-source models are production-ready**: DeepSeek V3.2 at $0.28/M is 18x cheaper than Claude Sonnet with competitive quality for most tasks. Llama 4 is free to self-host.

5. **Prompt caching is free money**: 90% savings on Anthropic, 50% on OpenAI. System prompts with dispatch rules should always be cached.

6. **Free tiers cover all development**: Cerebras + Google AI Studio + Groq + Mistral gives you access to dozens of models at zero cost for prototyping.

7. **For CondomX specifically**: The sweet spot is likely $100-200/month at 200 jobs/week, using text/SMS dispatch as default with voice calls reserved for negotiation-heavy or urgent situations.

---

Sources:
- [LLM API Pricing Feb 2026 - TLDL](https://www.tldl.io/resources/llm-api-pricing-2026)
- [Artificial Analysis - Model Comparison](https://artificialanalysis.ai/models)
- [AI API Pricing Comparison 2026 - IntuitionLabs](https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude)
- [Every Free AI API in 2026 - Awesome Agents](https://awesomeagents.ai/tools/free-ai-inference-providers-2026/)
- [Choosing an LLM in 2026 - DEV Community](https://dev.to/superorange0707/choosing-an-llm-in-2026-the-practical-comparison-table-specs-cost-latency-compatibility-354g)
- [Best Inference Providers for AI Agents 2026 - Fast.io](https://fast.io/resources/best-inference-providers-ai-agents/)
- [Benchmarking LLMs for Voice Agent Use Cases - Daily.co](https://www.daily.co/blog/benchmarking-llms-for-voice-agent-use-cases/)
- [Comparing LLMs for Voice Agents - Gladia](https://www.gladia.io/blog/comparing-llms-for-voice-agents)
- [Choosing the Right LLM for Voice Agents - Softcery](https://softcery.com/lab/ai-voice-agents-choosing-the-right-llm)
- [On-Device LLMs State of the Union 2026](https://v-chandra.github.io/on-device-llms/)
- [Best Small LLMs for Edge Devices 2026 - SiliconFlow](https://www.siliconflow.com/articles/en/best-small-llms-for-edge-devices)
- [Prompt Caching - PromptHub](https://www.prompthub.us/blog/prompt-caching-with-openai-anthropic-and-google-models)
- [Token Optimization 2026 - Obvious Works](https://www.obviousworks.ch/en/token-optimization-saves-up-to-80-percent-llm-costs/)
- [Cascading and Routing for LLMs - ETH Zurich](https://arxiv.org/html/2410.10347v1)
- [Speculative Cascades - Google Research](https://research.google/blog/speculative-cascades-a-hybrid-approach-for-smarter-faster-llm-inference/)
- [Groq Pricing](https://groq.com/pricing)
- [Cerebras Free Tier](https://adam.holter.com/cerebras-opens-a-free-1m-tokens-per-day-inference-tier-and-claims-20x-faster-than-nvidia-real-benchmarks-model-limits-and-why-ui2-matters/)
- [OpenAI Realtime API](https://openai.com/index/introducing-gpt-realtime/)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [Gemini Live API - Google Cloud](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/live-api)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [StructEval Benchmark](https://tiger-ai-lab.github.io/StructEval/)
- [DeepInfra Pricing](https://deepinfra.com/pricing)
- [LLM Cost Comparison 2026 - Zen Van Riel](https://zenvanriel.com/ai-engineer-blog/llm-api-cost-comparison-2026/)
- [Building Real-Time Voice AI - SimpliSmart](https://simplismart.ai/blog/real-time-voice-ai-sub-400ms-latency)
