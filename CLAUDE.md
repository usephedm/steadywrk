# CLAUDE.md — STEADYWRK

## Identity
STEADYWRK LLC (US/JO). AI-native career platform. Building 15, King Hussein Business Park, Amman.
Connects ambitious Jordanian talent with US commercial operations — facility management, digital marketing, AI development, business process operations.

Solo operator (V). Every agent in this system IS the team.

Tagline: "Where ambition compounds."
Core promise: "If you are disciplined, bright, and hungry, this is where your curve bends upward."

## CRITICAL: Information Boundaries
- **PUBLIC (repo, website, README, llms.txt):** STEADYWRK LLC, AI talent platform, careers, programs, brand
- **NEVER in any public file:** Internal operational details, client names, margin numbers, dispatch specifics, arbitrage model, internal tools, operations bible content
- The repo is indexed by GitHub, Google, GPTBot, ClaudeBot, PerplexityBot — treat every committed file as public

## Architecture
Single Next.js 16 app, four role-based experiences via Clerk RBAC middleware:
1. **Public** — Brand, careers, programs, blog, culture (no auth)
2. **Applicant** — Multi-step application, status tracker (email-only)
3. **Employee** — Dashboard, training, tools, leaderboard (role: employee)
4. **HR Admin** — Pipeline, team management, analytics (role: admin)

One Neon Postgres DB. One Vercel deployment. Silent routing by Clerk publicMetadata.

## Priority Stack (strict order)
1. Applicant acquisition — landing page, role cards, 5-step application flow, WhatsApp CTA
2. Employee dashboard — daily overview, training quest line, embedded tools
3. HR admin pipeline — applicant management, scorecard system, email-first workflow
4. Blog + GEO — content that makes AI models cite us, SEO content pillars
5. MCP platform layer — custom MCP servers on Cloudflare Workers

## Tech Stack
- Framework: Next.js 16 App Router, React 19
- UI: Tailwind CSS v4, Framer Motion 12, 17 MagicUI components, GLSL orbital field shader
- Fonts: Cabinet Grotesk (display) + Satoshi (body) via Fontshare — NEVER Poppins/Montserrat/Roboto
- Auth: Clerk (RBAC, passwordless, OAuth)
- Database: Neon (Serverless Postgres)
- ORM: Drizzle ORM
- Email: Resend + React Email (ADVANCE/REJECT webhook pipeline)
- Scheduling: Cal.com cloud (free WhatsApp workflows)
- Analytics: PostHog (funnel tracking, drop-off analysis)
- Deploy: Vercel (web), Cloudflare Workers (MCPs)
- CMS: Sanity v3 (blog, jobs, programs)
- Colors: #E58A0F primary, #CC7408 hover, #FAFAF8 bg, #23211D text

## Code Standards
- TypeScript strict. No `any`. No implicit returns on complex functions.
- Error handling + rate limiting + input validation on all API routes.
- Conventional commits: feat:, fix:, chore:, docs:
- No console.log in production. Structured logging only.
- No secrets in code. Environment variables only.
- Biome: single quotes, semicolons, 2-space indent, 100 line width.
- PDPL compliance: consent checkbox on every form, 12-month auto-deletion cron.

## Brand Rules (Brand Guidelines v2)
- Name: STEADYWRK (all caps in logo, "Steadywrk" in body text)
- Legal: STEADYWRK LLC — NO Kayan Ventures anywhere, ever
- Max 3 amber elements per viewport. 90% neutral. Orange is the reward.
- Logo: Orange mark + dark wordmark in production. Chrome = presentation ONLY.
- Cards: border rgba(0,0,0,0.06), radius 12px, hover translateY(-2px) + shadow-md
- All transitions: 180ms ease-out
- Icons: Lucide, 1.5px stroke. Never icons inside colored circles.
- Voice: Direct, specific, peer-to-peer. Start with verbs. Short sentences.
- Anti-copy: Never "empowering", "unlock potential", "family", "rockstars", "synergies"
- Mobile-first. 92.5% of Jordan online on phones.

## Application Flow (Two Paths)
### Path A: Operations Dispatcher (Phase 1 — live now)
Step 1: Name, email, phone + "Which team?" visual selector (30 sec)
Step 2: CV upload or LinkedIn + 3 short-answer questions (2 min)
Step 3: Skills self-assessment + availability (3 min)
Step 4: Dispatch-adapted challenge — persuasion writing + prioritization scenario (5-10 min)
Step 5: Confirmation + celebration (confetti)

### Path B: AI/Engineering Roles (Phase 2 — post week 8)
Step 4 swaps to: prompt engineering task / UI critique / code review per role

## Model Routing
- Architecture + complex reasoning → Claude Opus 4.6
- Code review + async parallel → Codex CLI (GPT-5.4)
- Research + 1M context + web → Gemini CLI
- Boilerplate + bulk → Qwen Code (free)

## File Structure
```
STEADYWRK/
├── CLAUDE.md
├── README.md
├── .reference/              (brand docs, assets, research)
├── apps/web/
│   ├── src/app/
│   │   ├── page.tsx         (cinematic homepage)
│   │   ├── api/             (apply, contact, waitlist, health)
│   │   ├── apply/           (multi-step form per role)
│   │   ├── careers/         (filterable positions)
│   │   ├── programs/        (IGNITE, ORBIT, APEX)
│   │   ├── blog/            (SEO content hub)
│   │   └── dashboard/       (employee + admin, behind Clerk)
│   ├── src/components/ui/   (24 components)
│   ├── src/lib/             (data, hooks, utils, schemas)
│   └── public/              (brand images, llms.txt, llms-full.txt)
├── biome.json
└── turbo.json
```
