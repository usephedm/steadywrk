# ADR-006: LLM Routing Strategy

**Status**: ACCEPTED
**Date**: 2026-03-06
**Debate**: #6
**Decision by**: E0:orchestrator

## Decision

3-tier cascade with direct API calls (no OpenRouter). Prompt caching mandatory. Semantic caching for repeated patterns.

## Tiers

1. **Classification (Tier 1)**: GPT-5 Nano or Gemini 2.5 Flash-Lite — $0.05-0.10/1M tokens. Job type, urgency, trade classification. Cost per call: ~$0.00001.
2. **Dispatch Logic (Tier 2)**: o4-mini — $1.10/$4.40/1M tokens. Tech matching, pricing, negotiation strategy. Cost per call: ~$0.005.
3. **Escalation (Tier 3)**: Claude Sonnet 4.6 — $3/$15/1M tokens. Complex edge cases, multi-factor analysis. Cost per call: ~$0.02.

## Rationale

- **OpenRouter dropped**: Extra latency hop, dependency risk, markup eats cost advantage. 3 providers = 3 API keys = 10-line router function. Simpler, faster, more reliable.
- **Prompt caching**: Dispatch system prompt (~2K tokens with QANAT rules, account context) repeats on every call. Anthropic: 90% savings. OpenAI: 50%. Saves ~$40-80/month on Tier 2 at 200 dispatches/week.
- **Semantic caching**: Redis + embedding similarity (cosine >0.95). Repeated technician questions about same job type/zone served from cache. 65x latency reduction on hits. Expected hit rate >60% after 2 weeks of data.

## Monthly Cost Estimate (200 jobs/week)

- Tier 1 (classification): ~$2
- Tier 2 (dispatch): ~$50-100
- Tier 3 (escalation, ~10% of jobs): ~$15-30
- **Total: $67-132/month** (with caching)

## Consequences

- Three API integrations to maintain (OpenAI, Anthropic, Google)
- Prompt caching requires careful system prompt design (stable prefix)
- Semantic cache needs embedding model (text-embedding-3-small, ~$0.02/1M tokens)
- Cache miss penalty is 2.5x — needs monitoring and hit-rate alerts

## Evidence

- `docs/research/llm-models-cost-latency.md`
- `docs/research/speed-latency-optimization.md`
