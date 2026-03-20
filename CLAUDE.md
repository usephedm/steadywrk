# CLAUDE.md — SteadyWrk

## Identity
SteadyWrk is an AI-human bridge platform for field service dispatch and subcontracting. Operated by V (solo founder). The product is the protocol layer — MCP-native, dispatch-aware, AI-orchestrated. It connects businesses to subcontracted field services, digital marketing execution, and AI-powered operational tooling.

Solo operator. No team. Every agent in this system IS the team.

## Priority Stack (strict order)
1. Client acquisition — landing pages, lead gen, outreach, demo flows, onboarding
2. MCP platform layer — custom MCP servers on Cloudflare Workers (the differentiator)
3. QN8.app — autonomous website monitoring SaaS

## Tech Stack
- Runtime: Node.js / TypeScript (preferred), Python when necessary
- Framework: Next.js App Router
- Database: Supabase (Postgres + Auth + Edge Functions + Realtime)
- Payments: Stripe
- Deploy: Cloudflare Workers (MCPs), Vercel (web apps)
- Styling: Tailwind CSS. Signal Amber (#F59E0B) + #0A0A0A + #FFFFFF

## Code Standards
- TypeScript strict. No `any`. No implicit returns on complex functions.
- Error handling + rate limiting + input validation on all API routes.
- Every feature gets a test. QA agent enforces this.
- Conventional commits: feat:, fix:, chore:, docs:
- No console.log in production. Structured logging only.
- Supabase RLS on every table. No exceptions.
- No secrets in code. Environment variables only.

## Model Routing
- Architecture + complex reasoning → Claude Opus 4.6
- Code review + async parallel → Codex CLI (GPT-5.4)
- Research + 1M context + web → Gemini CLI
- Boilerplate + bulk → Qwen Code (free)
- Always use cheapest capable model. Don't waste Opus on boilerplate.

## Agent Team Roles (when spawning)
- Ship: apps/web/ — frontend, backend, deployment
- QA: **/*.test.*, .github/ — tests, security, code review

## Connected MCPs (22)
Stripe, Vercel, Notion, Figma, Canva, Linear, Gmail, Supabase, Cloudflare, HuggingFace, Monday, Webflow, HubSpot, Netlify, Google Drive, Intercom, Context7, Claude Preview, Claude in Chrome, MCP Registry, Scheduled Tasks, Cloudinary

## Brand
- Name: SteadyWrk (capital S, capital W, no vowel in Wrk)
- Colors: Signal Amber #F59E0B (primary), #0A0A0A (dark), #FFFFFF (light)
- Voice: Direct, technical authority, zero fluff
- Never: corporate buzzwords, "leverage synergies", "empower", "unlock potential"

## Domain Architecture
- **steadywrk.app** → Public funnel. Company showcase + talent honeypot. Client acquisition.
- **steadywrk.dev** → Operations portal. Workflow, dispatch, agent orchestration dashboard.

## Deployed Services
- Web App: https://steadywrk-app.vercel.app (steadywrk.app pending DNS)

## Command Center (Orchestration)
Claude Code (Opus 4.6) is the orchestrator. Dispatches to:
- `codex exec "task"` → GPT-5.4 (code review, bulk ops)
- `gemini -p "task"` → Ultra (research, web grounding, large context)
- Agent tool with subagent_type → parallel Claude agents

## File Structure
```
SteadyWrk/
├── CLAUDE.md
├── .claude/skills/       (agent skills)
├── apps/web/             (steadywrk.app — Next.js)
└── turbo.json
```
