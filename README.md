# STEADYWRK

AI-native careers and operations platform for Jordanian talent.

## Repo reality

This repository is a **Turborepo monorepo**, not a single-app codebase.

### Workspaces
- `apps/web` — primary Next.js 16 / React 19 application
- `apps/video` — Remotion video workspace
- `packages/db` — Drizzle + Neon schema and database helpers
- `packages/gsd2` — GSD-2 swarm support package (`sync` script only right now)

## What is currently live in this repo

The main application in `apps/web` includes:
- public marketing pages
- careers and individual role pages
- programs pages
- public blog pages
- contact page
- Arabic legal routes
- application flow (`/apply/[role]`)
- authenticated dashboard routes
- API routes for apply/contact/health/jobs plus several growth-loop endpoints

### Important truthfulness notes
- Public content is currently **code-backed**, mostly from `apps/web/src/lib/data/*`.
- `/apply` itself redirects to `/careers`; the role-specific flow lives at `/apply/[role]`.
- The public site and core APIs are real and buildable.
- Parts of the authenticated dashboard/admin surface still rely on **mock/staged data**, especially in hiring/admin views.
- Root docs should not claim a waitlist flow or other routes that do not exist in the codebase.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Motion | `motion` v12 |
| Auth | Clerk |
| Database | Neon Postgres |
| ORM | Drizzle ORM |
| Validation | Zod / drizzle-zod |
| Email | Resend |
| Analytics | PostHog |
| Monitoring | Sentry |
| Testing | Playwright |
| Monorepo | Turborepo + npm workspaces |
| Formatting / linting | Biome + ESLint |

## Database shape

`packages/db/src/schema.ts` currently defines:
- `applicants`
- `job_listings`
- `blog_posts`
- `employees`
- `interview_slots`
- `email_events`
- `contacts`
- `salary_submissions`
- `applicant_vouches`

## Local development

### Prerequisites
- Node `22.x`
- npm `10.x`

### Install
```bash
npm install
```

### Run the web app
From the repo root:
```bash
npm run dev --workspace=web
```

Or run the whole workspace graph:
```bash
npm run dev
```

Open <http://localhost:3000>.

## Validation

Run these from the repo root:

```bash
npm run lint
npm run build
npm run test
npm run test:smoke
```

Notes:
- `npm run build` builds the monorepo, including `apps/video`.
- Playwright coverage exists, but some QA/audit scripts are still being cleaned up for determinism.

## Environment

See `.env.example` for the current baseline.

Main groups:
- Clerk
- Neon database
- Resend
- scorecard signing secret
- PostHog / Sentry
- Listmonk
- WhatsApp Business API

## Deployment and CI

### Production target
- `apps/web` is documented for **Railway** deployment.
- `nixpacks.toml` is present at repo root.
- Do not treat old Vercel references as the source of truth for deployment.

### CI
GitHub Actions currently run:
- Biome check
- TypeScript check for `apps/web`
- full repo build
- Playwright workflow on pushes / PRs to `main`

## Repo structure

```text
steadywrk/
├── apps/
│   ├── video/                  # Remotion workspace
│   └── web/                    # Main product app
│       ├── public/             # brand assets, llms files
│       └── src/
│           ├── app/            # routes, layouts, API routes
│           ├── components/     # UI and layout components
│           └── lib/            # data, constants, helpers, schemas
├── packages/
│   ├── db/                     # schema + db exports
│   └── gsd2/                   # swarm support package
├── tests/                      # Playwright tests
├── .github/workflows/          # CI + Playwright workflows
├── AGENTS.md                   # repo-specific agent guidance
├── CLAUDE.md                   # repo / subagent instructions
├── SWARM_PROTOCOL.md           # detailed swarm operating model
└── SWARM_QUICKSTART.md         # short swarm brief
```

## See also
- `apps/web/README.md` — web-app-specific notes
- `AGENTS.md` — repo conventions for agents and contributors
- `SWARM_QUICKSTART.md` / `SWARM_PROTOCOL.md` — swarm coordination docs
