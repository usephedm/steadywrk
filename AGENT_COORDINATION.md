# Agent Coordination — STEADYWRK

> This file enables cross-agent collaboration. All agents in the swarm read this to understand current state, access points, and priorities.

## Active Agents

| Agent | Role | Access | Status |
|---|---|---|---|
| **Claude-Apex** | Lead architect, code execution, platform orchestration | GitHub PAT (k2), Slack, Notion, Linear, Gmail, Supabase | Active |
| **OpenClaw (K2)** | Deep analysis, architecture review, security audit | GitHub PAT (k2), Pop!_OS local, repo clone | Active |
| **Perplexity-Alpha** | Research, competitive intel, SEO/GEO | Web search, repo read | Active |
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
- **Database:** Supabase (Postgres) — NOT Neon
- **Deploy:** Railway — NOT Vercel
- **Auth:** Clerk v7 (production instance on clerk.steadywrk.app)
- **ORM:** Drizzle ORM
- **Analytics:** PostHog
- **Email:** Resend + React Email
- **CDN/Workers:** Cloudflare Workers (MCP servers)
- **Monitoring:** Sentry

## Trust Boundary

| Domain | Purpose | Audience |
|---|---|---|
| `steadywrk.app` | MENA talent platform | Jordanian candidates, employees |
| `steadywrk.dev` | US FM operations | US clients, field ops |

Full isolation: separate Clerk instances, PostHog projects, Resend sending domains.

## Priority Stack (Operation Wildfire)

1. **P0:** Clerk SSL fix (clerk.steadywrk.app needs CNAME + cert)
2. **P0:** Apply flow end-to-end (applicant → training → hiring → Reem interviews)
3. **P1:** Website overhaul (brand polish, dark/light mode, animations, alignment)
4. **P1:** SEO/GEO maximization (robots.txt, llms.txt, structured data, AI bot indexing)
5. **P2:** Dashboard pages — replace mock data with Supabase queries
6. **P2:** WhatsApp integration (Meta Cloud API templates)
7. **P3:** MCP platform layer on Cloudflare Workers

## How to Coordinate

- **Slack:** #all-steadywrk for broadcasts, #eng for technical
- **Linear:** STE-* tickets for all work
- **This file:** Update when completing major milestones
- **Commits:** Conventional commits (feat:, fix:, chore:, docs:)

## What NOT to Do

- Never commit secrets, API keys, or .env files
- Never reference "Kayan Ventures" in any public file
- Never use Neon or Vercel references (we use Supabase + Railway)
- Never commit internal operational details (client names, margins, dispatch specifics)
- The repo is indexed by GitHub, Google, GPTBot, ClaudeBot — treat every file as public

## Last Updated

2026-03-23 by Claude-Apex
