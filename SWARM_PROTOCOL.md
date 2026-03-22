# STEADYWRK SWARM PROTOCOL v1.0
## The one file any agent reads to join the autonomous build system.
## Last updated: 2026-03-22T04:00:00Z

---

# READ THIS FIRST

You are joining the STEADYWRK agent swarm — a distributed, autonomous, N-agent system building an AI-native career platform. There is no central orchestrator except **Karim Alsalah ("V")**, who launches agents and issues directives. Every agent self-coordinates through shared infrastructure.

**Your first 4 actions on joining (in this order):**
1. Read this entire file
2. Register yourself in the Notion Agent Registry
3. Check Linear for unclaimed tasks
4. Check the Task Locks DB — claim your work, then build

---

# 1. THE PERSON GIVING ORDERS

**Karim Alsalah ("V")** — VP/Co-founder, Technical Builder
- Uses Cowork account: usufmalkawi@gmail.com / v@steadywrk.dev
- His cousin Yousof Malkawi is CEO — but Yousof is NOT in your conversation
- Every directive comes from Karim. Execute with his intensity.

**How Karim works:**
- "Always find workarounds that turn bottlenecks into superpowers"
- Do NOT suggest alternative tools/stacks — the stack is decided
- Do NOT ask "are you sure?" — he's sure
- Default to action over questions
- Think several moves ahead
- Miss nothing out
- Never become a bottleneck
- When something seems impossible, find the workaround

---

# 2. COORDINATION INFRASTRUCTURE

## 2.1 Notion Databases (under STEADYWRK Master Hub)

Master Hub page ID: `32afc6ca-6b59-8131-af3b-c319ef80ffc7`

### 🤖 Agent Registry
**Data source ID:** `065b3bc8-953d-4119-bf17-3d0b3a809f93`
**Purpose:** Every agent registers here on first action.
**Fields:** Agent Name, Agent Type, Status, Current Task, Environment, Capabilities, Last Heartbeat, Session Start, Tasks Completed, Notes

**On join:** Create a row with your name (format: `{Platform}-{Codename}`, e.g. `Claude-Dispatch`, `Perplexity-Alpha`, `GPT-Scout`), your type, capabilities, and status = Active.
**During work:** Update "Current Task" and "Last Heartbeat" periodically.
**On disconnect:** Set Status to Offline.

### 🔒 Task Locks
**Data source ID:** `29438713-9a67-4e7e-9362-8a6218a00f1c`
**Purpose:** Distributed lock system preventing two agents from working on the same thing.
**Fields:** Task (Linear ID or file path), Locked By, Lock Status, Lock Acquired, Lock Released, Scope, Branch, Notes

**BEFORE starting any task:**
1. Search this DB for the task name/ID
2. If a lock exists with status "Locked" and was acquired < 30 minutes ago → DO NOT TOUCH IT, find another task
3. If no lock exists OR lock is > 30 minutes old → Create a new lock with status "Locked" and your agent name
4. When done → Update lock to "Released"

**Lock scopes:** Linear Issue, GitHub File, Notion Page, Deployment, Research, Content

### 📋 Agent Activity Log
**Data source ID:** `53fee1d7-4898-44d6-a254-4d810cca3f8d`
**Purpose:** Append-only audit trail. Every significant action gets logged here.
**Fields:** Action (title), Agent, Type, Target, Details, Timestamp

**Log these events:** Every commit push, every deployment, every task claim/release, every major decision, every blocker encountered, every research finding that affects strategy.

## 2.2 Linear (Team: STE)

**Team key:** STE
**Project:** STEADYWRK Platform v1.0

Linear is the **task queue**. Issues are the work. Priorities are:
- P1 (URGENT) → Do these first
- P2 (HIGH) → Do these next
- P3 (MEDIUM) → Fill gaps
- P4 (LOW) → When nothing else

**Workflow:**
1. Check Linear for issues with state "Todo" (unclaimed)
2. Check Task Locks DB to confirm no other agent has it
3. Create a Task Lock in Notion
4. Add a Linear comment: `🤖 [Your-Agent-Name] claiming this — [timestamp]`
5. Update Linear issue state to "In Progress"
6. Do the work
7. When done: Update Linear to "Done", add completion comment, release the Task Lock, log in Activity Log

**If an issue is already "In Progress":** Read its comments. If another agent claimed it < 30 min ago, find different work. If > 30 min with no update, you may reclaim it (add a comment first).

## 2.3 GitHub (karimalsalah/steadywrk)

**Repo:** `karimalsalah/steadywrk`
**Branch:** `main` (auto-deploys to Railway → steadywrk.app)

**Rules:**
- ALWAYS check latest commits before making changes
- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `perf:`
- Never force push to main
- If another agent committed in the last 10 minutes, pull and rebase
- For large features, use a feature branch: `agent/{your-name}/{feature}`
- Create a Task Lock with scope "GitHub File" when editing specific files

## 2.4 Slack (#all-steadywrk)

**Channel ID:** `C0ALRRKS0GK`

**Post here when:**
- You complete a significant task (shipped a feature, fixed a critical bug)
- You encounter a blocker that needs Karim's input
- You make a strategic decision that affects other agents
- You discover something important during research

**Format:** `🤖 *[Agent-Name]* — {action summary}`

## 2.5 Notion Master Hub

**Page ID:** `32afc6ca-6b59-8131-af3b-c319ef80ffc7`

Contains: strategy docs, blog content drafts, brand decisions. Read before writing content. Update after making decisions.

**Key databases:**
- Blog Content: `cd5df9fb-7bc6-44ca-aae7-c51dcf6b197a`
- Hiring Pipeline: `7b8aedaf-0428-432a-b205-f76027c5c6f6`

## 2.6 Sentry (Error Monitoring)

**Org:** `knv` | **Region URL:** `https://de.sentry.io`

Check for production errors before and after deployments.

---

# 3. WHAT STEADYWRK IS

**STEADYWRK LLC** — Master holding entity for multiple divisions, departments, verticals, and revenue funnels.

**Two platforms:**
- `steadywrk.app` — Jordan/MENA AI-native career-launch platform (LIVE on Railway)
- `steadywrk.dev` — US-facing operations (details NEVER written to files)

**Mission:** Maximum revenue generation from day one. Revenue → Hiring → Training → Platform → Brand → Content/Marketing.

**Target:** 18-30 year-old Jordanian talent, especially women (66% female youth unemployment). English-first. Physical HQ: iPARK @ KHBP, Building 15, Amman.

**Revenue:** US operations (primary), premium AI course at iPARK (1,500-3,500 JOD), B2B consultation.

**Leadership:** Yousof Malkawi (CEO), Karim Alsalah/V (VP/Co-founder), Reem Shaiber (HR Director).

**Tagline:** "Where ambition compounds."
**Archetype:** Creator × Explorer
**One word:** Momentum

---

# 4. TECH STACK (NON-NEGOTIABLE — DO NOT SUGGEST ALTERNATIVES)

| Layer | Tech | Details |
|-------|------|---------|
| Framework | Next.js 16 | App Router, RSC, Server Actions |
| Language | TypeScript 5.8.3 | Strict, no `any` |
| Styling | Tailwind CSS v4 | @theme inline tokens |
| Animation | motion v12 | NOT framer-motion |
| Fonts | Cabinet Grotesk + Satoshi | next/font/local, variable |
| Auth | Clerk v7 | proxy.ts, 4 RBAC roles |
| Database | Neon Serverless Postgres | pg_cron for auto-delete |
| ORM | Drizzle ORM 0.45.1 | @neondatabase/serverless 1.0.2 |
| Email | Resend + React Email | ADVANCE/REJECT webhooks |
| Analytics | PostHog | Session recordings |
| Deploy | Railway | Auto-deploy on main |
| Icons | Lucide React | 1.5px stroke, 24px |
| Monorepo | Turborepo | npm workspaces |
| Linting | Biome | single quotes, semicolons, 2-space |

---

# 5. BRAND QUICK REFERENCE

**Colors:** Signal Amber #E58A0F, Deep Carbon #0A0A0A, Background #FAFAF8, Graphite #23211D, Fog #6E695F
**Fonts:** Cabinet Grotesk (display), Satoshi (body), JetBrains Mono (code)
**Voice:** Direct, specific, peer-to-peer. "Apply in 3 minutes" not "Begin your exciting journey."
**Departments:** FORGE (Eng), SIGNAL (Marketing), OPS CORE (Ops), GRID (Infra), AXIS (Strategy), ASCENT (Training)
**Programs:** IGNITE (3mo), ORBIT (6mo), APEX (12mo)
**Never say:** "empowering your journey", "unlock your potential", "rockstars/ninjas"

---

# 6. CURRENT STATE (as of 2026-03-22)

## Live Site (steadywrk.app)
- Multi-page routing works: /, /careers, /programs, /about, /culture, /blog, /apply/[role], /privacy, /terms, /dashboard/*
- Fonts correct (Cabinet Grotesk + Satoshi via preload)
- SEO: 100/100, llms.txt live, sitemap, JSON-LD
- Accessibility: 96/100
- Security headers: production-grade CSP, HSTS, strict referrer
- Sentry: 0 unresolved errors

## Performance Issues
- LCP: 9.6s mobile (target: <1.5s) — hero image + parallax + particles + 3D totem
- TBT: 340ms — motion + confetti + dynamic imports
- Unused JS: 314 KiB

## Latest commits
- `2a2d28e` fix: unblock robots/sitemap/llms from auth
- `08abb94` feat: council execution
- `de4c8e6` feat: Phase 1B code splitting

---

# 7. OPEN TASKS (check Linear for latest — this is a snapshot)

## URGENT (P1)
- STE-19: Verify pg_cron auto-delete for PDPL
- STE-15: Arabic bilingual Privacy/Terms (LAUNCH BLOCKER)
- STE-14: Backdate blog posts to March 2026 (LAUNCH BLOCKER)

## HIGH (P2)
- STE-22: n8n self-hosted at automation.steadywrk.app
- STE-21: Upload brand assets to Cloudinary
- STE-17: Add /privacy and /terms to sitemap.xml
- STE-16: Fix Instagram handle mismatch

## IN PROGRESS
- STE-23: Instagram launch grid + content calendar
- STE-20: HubSpot CRM pipeline

## NOT YET FILED
- Hero LCP performance surgery (9.6s → <2s)
- JobPosting schema.org with baseSalary
- 3 anchor blog posts for GEO/SEO moat
- Cal.com embed on apply success screen

---

# 8. COMPLIANCE (JORDAN PDPL)

Jordan PDPL Law No. 24 of 2023 is FULLY ACTIVE. Non-negotiable:
- DPO appointment from day one
- Explicit consent on every form (ConsentCheckbox exists in code)
- 12-month auto-deletion via Neon pg_cron (NOT YET VERIFIED)
- Bilingual privacy/terms (NOT YET DONE)
- Arabic consent documentation
- Sub-processor DPAs: Neon, Clerk, Vercel

---

# 9. CONNECTED SERVICES

Verify these in your own environment — availability varies by agent type:
- GitHub: `karimalsalah/steadywrk` (gh CLI with api_credentials=["github"])
- Linear: Team STE, project STEADYWRK Platform v1.0
- Notion: Master Hub + Blog Content DB + Hiring Pipeline DB
- Sentry: Org knv, region de.sentry.io
- Slack: #all-steadywrk (C0ALRRKS0GK)
- Google Drive, Google Calendar
- Cloudinary: cloud name dzlatnokr
- HubSpot: CRM (being set up)
- Hugging Face: model hub

---

# 10. HOW TO JOIN THE SWARM

```
STEP 1: Read this file completely
STEP 2: Register in Notion Agent Registry (data_source: 065b3bc8-953d-4119-bf17-3d0b3a809f93)
        → Create a page with your name, type, capabilities, status = Active
STEP 3: Check Linear (team STE) for open tasks sorted by priority
STEP 4: Check Task Locks DB (data_source: 29438713-9a67-4e7e-9362-8a6218a00f1c)
        → Ensure no other agent has locked your target task
STEP 5: Create a Task Lock → Claim the Linear issue → Start building
STEP 6: Log actions in Activity Log (data_source: 53fee1d7-4898-44d6-a254-4d810cca3f8d)
STEP 7: When done → Release lock → Update Linear → Log completion → Pick next task
```

**Naming convention:** `{Platform}-{Codename}`
Examples: `Perplexity-Alpha`, `Claude-Dispatch`, `Claude-Builder`, `GPT-Scout`, `Gemini-Research`

**If Karim gives you a directive that contradicts an existing task:** Karim's directive takes priority. Update the relevant Linear issue, release any conflicting locks, and redirect.

**If you encounter a conflict with another agent:** Do NOT proceed. Log it in the Activity Log with Type = "Decision". Post in Slack. Wait for the other agent's lock to expire or Karim to resolve.

**If you finish all available tasks:** Research. Find gaps. File new Linear issues. Audit the live site. Check Sentry. Improve performance. Write content. There is always work.

---

# END OF SWARM PROTOCOL
# You now have everything you need. Register, claim, build, ship.
