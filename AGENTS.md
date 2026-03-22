# AGENTS.md — STEADYWRK repo guide

Use this file as the practical source of truth for working inside this repository.

## Repo overview

This repo is a **monorepo** with four workspaces:
- `apps/web` — main Next.js product
- `apps/video` — Remotion video workspace
- `packages/db` — Drizzle/Neon schema and DB helpers
- `packages/gsd2` — GSD-2 swarm support package

## Current product reality

Be accurate when you write code, docs, or updates:
- the public site is real and buildable
- core write paths are real (`apply`, `contact`, etc.)
- auth is real via Clerk
- public content is mostly **code-backed** in `apps/web/src/lib/data/*`
- some dashboard/admin surfaces are still **mock/staged**, especially hiring/admin views
- `/apply` redirects to `/careers`; the actual application flow is under `/apply/[role]`
- there is **no waitlist flow** in the current app surface

## Important paths

### Main app
- `apps/web/src/app/` — routes, layouts, metadata, API routes
- `apps/web/src/app/actions/` — current server actions (`apply`, `contact`)
- `apps/web/src/components/` — layout/UI/sections
- `apps/web/src/lib/` — constants, helpers, rate limiting, analytics setup
- `apps/web/src/lib/data/` — roles, programs, blog posts, mock dashboard data

### Data layer
- `packages/db/src/schema.ts` — database schema
- `packages/db/src/types.ts` — typed shapes / zod helpers
- `packages/db/drizzle/` — migrations

### Swarm / coordination docs
- `SWARM_QUICKSTART.md`
- `SWARM_PROTOCOL.md`
- `AGENT_ONBOARDING_PROMPT.md`

## Database tables currently present

Do not document stale table names. Current schema includes:
- `applicants`
- `job_listings`
- `blog_posts`
- `employees`
- `interview_slots`
- `email_events`
- `contacts`
- `salary_submissions`
- `applicant_vouches`

## Build, test, and validation

Run commands from repo root unless you have a good reason not to.

### Standard checks
```bash
npm run lint
npm run build
```

### Tests
```bash
npm run test
npm run test:smoke
```

### Web-only local dev
```bash
npm run dev --workspace=web
```

## Deployment reality

- `apps/web` is currently documented for **Railway** deployment.
- `nixpacks.toml` exists at repo root.
- Old Vercel references should be treated as drift unless verified in current code/infrastructure.
- GitHub Actions run formatting/type/build checks plus a Playwright workflow on `main` pushes and PRs.

## Contribution / shipping rules

- Prefer **branch + PR** unless you explicitly know you have direct maintainer push rights.
- Do not assume direct push to upstream `main` is available.
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `perf:`.
- Include the issue ID when one exists.
- Never force-push shared branches.

## Documentation rules

When updating docs or status notes:
- do not claim a single-app architecture; this is a monorepo
- do not claim waitlist routes/actions/tables
- do not overstate dashboard maturity where mock data still exists
- do not describe `/apply` as the only public apply route without noting the redirect behavior
- do not describe deployment in conflicting ways inside the same file

## Good defaults for contributors

- use Server Components by default in `apps/web`
- keep edits small and targeted
- prefer existing utilities/constants over introducing parallel abstractions
- if you touch public-facing behavior, validate with `lint` and `build`
- if you touch docs, make them match the current repo, not the intended future state
