# CLAUDE.md — STEADYWRK

## Identity
STEADYWRK is an AI-native career platform. Jordan's sharpest minds, one mission. US-incorporated (STEADYWRK LLC), Jordan-operated. Building 15, King Hussein Business Park, Amman. Operated by V (solo founder). Every agent in this system IS the team.

Tagline: "Where ambition compounds."
Core promise: "If you are disciplined, bright, and hungry, this is where your curve bends upward."

## Priority Stack (strict order)
1. Client acquisition — landing page, lead gen, WhatsApp-first outreach, demo flows
2. Hiring pipeline — application UX, multi-step form, structured scorecards
3. MCP platform layer — custom MCP servers on Cloudflare Workers (the differentiator)
4. Blog + GEO — content that makes AI models cite us

## Tech Stack
- Runtime: Node.js / TypeScript (preferred), Python when necessary
- Framework: Next.js 16 App Router
- UI: React 19, Tailwind CSS v4, Framer Motion 12, 17 MagicUI components
- Fonts: Cabinet Grotesk (display) + Satoshi (body) via Fontshare — NEVER Poppins/Montserrat/Roboto
- Database: Supabase (Postgres + Auth + Edge Functions + Realtime)
- Payments: Stripe
- Deploy: Cloudflare Workers (MCPs), Vercel (web apps)
- Colors: Signal Amber #E58A0F (primary), #FAFAF8 (bg), #23211D (text)

## Code Standards
- TypeScript strict. No `any`. No implicit returns on complex functions.
- Error handling + rate limiting + input validation on all API routes.
- Every feature gets a test. QA agent enforces this.
- Conventional commits: feat:, fix:, chore:, docs:
- No console.log in production. Structured logging only.
- Supabase RLS on every table. No exceptions.
- No secrets in code. Environment variables only.
- Biome: single quotes, semicolons, 2-space indent, 100 line width.

## Brand Rules (from Brand Guidelines v2)
- Name: STEADYWRK (all caps in logo, "Steadywrk" in body text, no vowel in Wrk)
- Legal: STEADYWRK LLC — NO Kayan Ventures anywhere
- Colors: #E58A0F primary, #CC7408 hover, #FAFAF8 bg, #23211D text, #6E695F secondary text
- Max 3 amber elements per viewport. 90% neutral. Orange is the reward.
- Logo: Orange mark + dark wordmark in production. Chrome variant is presentation ONLY.
- Cards: border rgba(0,0,0,0.06), radius 12px, shadow-xs, hover translateY(-2px) + shadow-md
- All transitions: 180ms ease-out. Motion tokens: 150-200ms micro, 400-600ms scroll reveals
- Icons: Lucide, 1.5px stroke. Never icons inside colored circles.
- Voice: Direct, specific, peer-to-peer. Like a brilliant 27-year-old founder.
- Anti-copy: Never "empowering", "unlock potential", "family", "rockstars", "leveraging synergies"
- Mobile-first. 92.5% of Jordan is online on phones. If it fails on phone, it fails.

## Model Routing
- Architecture + complex reasoning → Claude Opus 4.6
- Code review + async parallel → Codex CLI (GPT-5.4)
- Research + 1M context + web → Gemini CLI
- Boilerplate + bulk → Qwen Code (free)
- Always use cheapest capable model. Don't waste Opus on boilerplate.

## Agent Team Roles (when spawning)
- Ship: apps/web/ — frontend, backend, deployment
- QA: **/*.test.*, .github/ — tests, security, code review

## Domain Architecture
- **steadywrk.app** → Public funnel. Careers + brand + roles + proof. Talent honeypot.
- **steadywrk.dev** → Operations portal. Employee dashboard, dispatch, agent orchestration.

## Deployed Services
- Web App: https://steadywrk.app (Vercel)
- GEO: /llms.txt, schema.org/Organization, sitemap.xml, robots.txt

## Reference Knowledge
- `.reference/docs/STEADYWRK_Brand_Guidelines_v2.pdf` — primary brand system (27 pages)
- `.reference/docs/STEADYWRK_Platform_Blueprint_v4.pdf` — council research synthesis
- `.reference/brand-assets/` — 3D logo renders, mockups, icons

## File Structure
```
STEADYWRK/
├── CLAUDE.md
├── README.md
├── .reference/              (brand docs, assets, research)
├── .claude/skills/          (agent skills)
├── apps/web/                (steadywrk.app — Next.js 16)
│   ├── src/app/             (pages, API, SEO)
│   ├── src/components/ui/   (17 MagicUI + custom)
│   ├── src/lib/             (data, hooks, utils)
│   └── public/brand/        (production images)
├── biome.json
└── turbo.json
```
