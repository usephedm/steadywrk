# AGENTS.md

## Repository: STEADYWRK

### Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + motion (framer-motion successor)
- Clerk auth, Supabase Postgres + Drizzle ORM, Resend email, PostHog analytics
- Turborepo monorepo: apps/web, packages/db

### Conventions
- Biome for linting/formatting
- Server Components by default; 'use client' only when needed
- Server Actions in apps/web/src/app/actions/
- Data modules in apps/web/src/lib/data/
- Section components in apps/web/src/components/sections/
- Brand color: #E58A0F (amber/orange)
- Company: STEADYWRK LLC (never "Kayan Ventures")

### PR Rules
- Never approve PRs — only create and comment
- All changes must pass `npx next build`
- Commit messages: conventional commits (feat:, fix:, chore:)
