<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/brand/logo-dark.webp" width="400">
  <img src="apps/web/public/brand/logo-orange-dark.webp" width="400" alt="STEADYWRK">
</picture>

### Where ambition compounds.

AI-native talent platform for Jordan's most ambitious operators.

**Next.js 16 · Tailwind v4 · Clerk · Neon · Vercel**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://steadywrk.app)
[![License](https://img.shields.io/badge/license-private-red)]()

</div>

---

## What is STEADYWRK?

STEADYWRK is an AI-native career platform that connects ambitious Jordanian talent with US commercial operations. We train, deploy, and develop operators who serve US clients across facility management, digital marketing, AI development, and business process operations.

**Headquartered:** Building 15, King Hussein Business Park, King Abdullah II Street, Amman, Jordan

**Entity:** STEADYWRK LLC (US/JO)

## Architecture

Single Next.js 16 application serving four role-based experiences from one codebase:

| Layer | Experience | Auth |
|---|---|---|
| **Public** | Brand, careers, programs, blog, culture | None |
| **Applicant** | Multi-step application, status tracker | Email-only |
| **Employee** | Dashboard, training, tools, leaderboard | Clerk RBAC |
| **HR Admin** | Pipeline, team management, analytics | Clerk RBAC (admin) |

Routed silently via Clerk `publicMetadata` middleware. One Neon Postgres database. One Vercel deployment.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4, Framer Motion 12, 17 MagicUI components |
| Typography | Cabinet Grotesk (display) + Satoshi (body) via Fontshare |
| Auth | Clerk (RBAC, passwordless, OAuth) |
| Database | Neon (Serverless Postgres) |
| ORM | Drizzle ORM |
| Email | Resend + React Email |
| Analytics | PostHog (funnels, drop-off) |
| Scheduling | Cal.com (WhatsApp workflows) |
| Deploy | Vercel (web), Cloudflare Workers (MCPs) |
| CMS | Sanity v3 (blog, jobs, programs) |

## Getting Started

```bash
git clone https://github.com/karimalsalah/steadywrk.git
cd steadywrk
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

## Design System

Built on Brand Guidelines v2.0 (see `.reference/docs/`):

| Token | Value | Role |
|---|---|---|
| `--color-brand` | `#E58A0F` | CTAs, brand moments, dopamine color |
| `--color-bg` | `#FAFAF8` | Page background (warm off-white) |
| `--color-text` | `#23211D` | Primary text (Graphite) |
| `--font-display` | Cabinet Grotesk | Headlines, display type |
| `--font-body` | Satoshi | Body copy, UI text |
| `--radius-md` | 8px | Buttons, cards, inputs |

**Rules:** Max 3 amber elements per viewport. 90% neutral. Orange is the reward. Never Poppins/Montserrat/Roboto.

## GEO (Generative Engine Optimization)

- [`/llms.txt`](apps/web/public/llms.txt) — Company summary for LLM extraction
- [`/llms-full.txt`](apps/web/public/llms-full.txt) — Full flattened content (24KB)
- `schema.org/Organization` — JSON-LD with KHBP address
- `schema.org/JobPosting` — Structured data for all open roles
- Sitemap, robots.txt, OpenGraph images configured

## Content Pillars

| Pillar | Keywords | Format |
|---|---|---|
| AI Careers Jordan | ai jobs jordan, ML career amman | Long-form guides |
| Women in Tech MENA | women tech jordan, female engineer | Interview series |
| Operations Careers | US operations jobs Jordan, remote BPO | Career guides |
| Growth Guides | how to get hired at US company from Jordan | Tutorials |
| Behind the Build | startup culture, day in life | Video + blog |

## Project Structure

```
steadywrk/
├── CLAUDE.md                        # AI agent instructions
├── .reference/                      # Brand docs, assets, research
│   ├── docs/                        # Guidelines v1/v2, Blueprint v4
│   └── brand-assets/                # 3D renders, mockups
├── apps/web/                        # steadywrk.app
│   ├── src/app/                     # Pages, API routes, SEO
│   │   ├── page.tsx                 # Homepage (cinematic hero)
│   │   ├── api/                     # apply, contact, waitlist, health
│   │   └── dashboard/              # Employee + admin (behind auth)
│   ├── src/components/ui/           # 24 components (MagicUI + custom)
│   ├── src/lib/                     # Data, hooks, utils, schemas
│   └── public/                      # Images, llms.txt, llms-full.txt
├── biome.json                       # Linter config
└── turbo.json                       # Monorepo config
```

---

<div align="center">

© 2026 STEADYWRK LLC · Building 15, KHBP, Amman, Jordan · [steadywrk.app](https://steadywrk.app)

</div>
