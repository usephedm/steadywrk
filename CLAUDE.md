# STEADYWRK — AI Agent Instructions

## Project Identity

**STEADYWRK** is an AI-native career-launch platform for Jordan's most ambitious talent. Next.js 16 + React 19 + Tailwind CSS v4 monorepo deployed at [steadywrk.app](https://steadywrk.app).

**Entity:** STEADYWRK LLC (US-incorporated, Jordan-operated)
**HQ:** Building 15, King Hussein Business Park, Amman, Jordan

## Code Standards

- TypeScript strict, no `any`
- Biome: single quotes, semicolons, 2-space indent, LF line endings
- `'use client'` only when needed (forms, animations, client hooks)
- Server Components by default
- Import paths use `@/` alias (maps to `apps/web/src/`)
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`

## Architecture

Single Next.js 16 app with four role-based experiences:

| Layer | Routes | Auth |
|---|---|---|
| Public | `/`, `/careers`, `/programs`, `/about`, `/culture` | None |
| Applicant | `/apply/[role]` | Email-only |
| Employee | `/dashboard/*` | Clerk RBAC |
| HR Admin | `/dashboard/*` | Clerk RBAC (admin) |

## Key Files

| File | Purpose |
|---|---|
| `apps/web/src/app/layout.tsx` | Root layout (fonts, metadata, analytics) |
| `apps/web/src/app/page.tsx` | Cinematic homepage |
| `apps/web/src/app/globals.css` | Tailwind v4 @theme tokens, brand classes |
| `apps/web/src/lib/data.ts` | Static data (roles, programs, services) |
| `apps/web/src/components/layout/` | Navbar, Footer |
| `apps/web/src/components/ui/` | 25 UI components |
| `packages/db/src/schema.ts` | Drizzle ORM tables (6) |
| `packages/db/src/types.ts` | Insert/select schemas (drizzle-zod) |

## Design Tokens

| Token | Value |
|---|---|
| Brand | `#E58A0F` (Signal Amber) |
| Background | `#FAFAF8` (Warm Off-White) |
| Text | `#23211D` (Graphite) |
| Display Font | Cabinet Grotesk (`--font-display`) |
| Body Font | Satoshi (`--font-body`) |
| Card Hover | `translateY(-2px)` + shadow-md, 180ms ease-out |

## Do Not

- Delete WebGL `orbital-field.tsx` or particle components
- Remove Framer Motion or animation infrastructure
- Use Poppins, Montserrat, Roboto, or Raleway fonts
- Add chrome/bevel/3D effects to production UI
- Use icons inside colored circles
- Create fake social proof or artificial urgency
- Set `dark` class as default — brand default is warm off-white
