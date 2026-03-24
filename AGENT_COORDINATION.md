# Agent Coordination — STEADYWRK

> **Truth hierarchy:** STACK_TRUTH.md → origin/main → live site. If this file conflicts, STACK_TRUTH.md wins.

## Active Agents

| Agent | Role | Access | Status |
|---|---|---|---|
| **Claude-Apex** | Lead architect, code execution, platform orchestration | GitHub PAT (k2), Slack, Notion, Linear, Gmail | Active |
| **OpenClaw (K1)** | Deep analysis, architecture review, fleet hosting | GitHub PAT (k2), Pop!_OS local, repo clone, Docker fleet | Active |
| **OpenClaw (K2)** | Code, analytics, strategy, growth | GitHub PAT (k2), Arc local, repo clone, Docker fleet | OFFLINE (30d) |
| **Perplexity-Alpha** | Research, competitive intel, SEO/GEO | Web search, repo read | Standby |
| **Gemini-Prime** | Long-context analysis, 1M token research | Repo read, web search | Standby |
| **Claude-Dispatch** | Slack coordination, status broadcasting | Slack | Active |

## Repository Access

```
git clone https://github.com/karimalsalah/steadywrk.git
cd steadywrk
npm install
```

GitHub PAT `k2` is shared between Claude-Apex and OpenClaw. Expires April 21, 2026.

## Current Architecture

- **Framework:** Next.js 16 (App Router), React 19
- **Database:** Neon Postgres via Drizzle ORM (canonical)
- **Deploy:** Railway from `main` (auto-deploy)
- **Auth:** Clerk v7 (production instance on clerk.steadywrk.app)
- **ORM:** Drizzle ORM
- **Analytics:** PostHog
- **Email:** Resend + React Email
- **CDN/Workers:** Cloudflare Workers (MCP servers)
- **Monitoring:** Sentry
- **Legacy exception:** An optional Supabase edge-function webhook may still fan out applicant pipeline events. Do NOT treat Supabase as the primary database.

## Trust Boundary

| Domain | Purpose | Audience |
|---|---|---|
| `steadywrk.app` | MENA talent platform | Jordanian candidates, employees |
| `steadywrk.dev` | US FM operations | US clients, field ops |

Full isolation: separate Clerk instances, PostHog projects, Resend sending domains.

## Current Priorities

See Linear (team STE) for the live backlog. Key focus areas:

1. **Fleet autonomy:** Turn thin fleet-agent.mjs wrappers into real role-specific workers
2. **Truth convergence:** Ensure all docs, automations, and memory align with STACK_TRUTH.md
3. **SEO/GEO:** Maintain indexability (robots.txt, sitemap.xml, llms.txt all verified 200)
4. **Dashboard:** Wire real Neon/Drizzle data into dashboard pages
5. **Content pipeline:** Blog posts, employer outreach, newsletter automation

## How to Coordinate

- **Slack:** #all-steadywrk for broadcasts, #eng for technical
- **Linear:** STE-* tickets for all work
- **This file:** Update when completing major milestones
- **Commits:** Conventional commits (feat:, fix:, chore:, docs:) — include STE-XX

## What NOT to Do

- Never commit secrets, API keys, or .env files
- Never reference "Kayan Ventures" in any public file
- Never describe Supabase as the primary application database (it is Neon)
- Never commit internal operational details (client names, margins, dispatch specifics)
- The repo is indexed by GitHub, Google, GPTBot, ClaudeBot — treat every file as public

## Last Updated

2026-03-24 — aligned with STACK_TRUTH.md (commit 03b443f)
