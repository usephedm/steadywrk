# AGENTS.md — AI Agent Guide for STEADYWRK

## Architecture
- **Monorepo**: Turborepo with `apps/web` (Next.js 16) and `packages/db` (Drizzle/Postgres)
- **Runtime**: Node.js 22, React 19, TypeScript 5.8
- **Styling**: Tailwind CSS v4, CSS custom properties in globals.css
- **Auth**: Clerk v7 with proxy.ts (Next.js 16 convention)
- **Database**: Supabase Postgres with Drizzle ORM 0.45
- **Email**: Resend
- **Analytics**: PostHog (session recordings enabled)
- **Deployment**: Railway (auto-deploy from main)

## Key Directories
- `apps/web/src/app/` — Next.js App Router pages
- `apps/web/src/app/actions/` — Server Actions (apply, contact, waitlist)
- `apps/web/src/components/` — Shared components
- `apps/web/src/components/sections/` — Homepage section components
- `apps/web/src/lib/` — Utilities, constants
- `apps/web/src/lib/data/` — Data modules (roles, programs, blog-posts, mock)
- `packages/db/src/` — Database schema, migrations

## Conventions
- Use Server Components by default, `'use client'` only for interactive components
- Server Actions in `apps/web/src/app/actions/`
- CSS variables for brand colors (see globals.css)
- Entity: **STEADYWRK LLC** (never "Kayan Ventures")
- Admin email: v@steadywrk.dev
- Public email: hello@steadywrk.app

## Database
- Supabase Postgres
- Use Drizzle query builder, NOT raw SQL
- Schema in `packages/db/src/schema.ts`
- Tables: applicants, job_listings, blog_posts, employees, interview_slots, email_events, waitlist, contacts

## Build & Deploy
- `npm run build` from root (or `npm run build --workspace=web`)
- Railway auto-deploys from main branch
- CI: GitHub Actions (lint + typecheck + build)
- Node 22 required

## Environment Variables
See `.env.example` for required variables.
 variables.
