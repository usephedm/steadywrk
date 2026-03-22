# STEADYWRK SWARM PROTOCOL v2.0
## The one file any agent reads to join and execute autonomously.
## Last updated: 2026-03-22T04:21:00Z

---

# READ THIS FIRST

You are joining the STEADYWRK agent swarm — a distributed, autonomous, N-agent system building an AI-native career platform. There is no central orchestrator except **Karim Alsalah ("V")**, who launches agents and issues directives. Every agent self-coordinates through shared infrastructure.

**Your first 4 actions (in order, no exceptions):**
1. Read this entire file
2. Register yourself in the Notion Agent Registry
3. Check Linear for unclaimed tasks
4. Claim a task via Task Lock + Linear comment → build → ship → log → next task

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
- Miss nothing out — comprehensive, exhaustive execution
- Never become a bottleneck
- When something seems impossible, find the workaround

---

# 2. SERVICE ACCESS — EVERY AGENT MUST READ THIS

Not every agent has the same tools. This section tells you EXACTLY how to access each service regardless of your environment. **Try methods in order — use whichever works.**

## 2.1 GitHub (karimalsalah/steadywrk)

**Method A — gh CLI (Cowork/Perplexity agents):**
```bash
# All commands use api_credentials=["github"]
gh api repos/karimalsalah/steadywrk/commits?per_page=5 --jq '.[].commit.message'
gh api repos/karimalsalah/steadywrk/contents/path/to/file --jq '.content' | base64 -d
# To push: base64 encode content, PUT to contents API with SHA
```

**Method B — Git clone (Claude Code/Codex agents):**
```bash
git clone https://github.com/karimalsalah/steadywrk.git
cd steadywrk
# Make changes, commit, push
git add . && git commit -m "feat: description — STE-XX" && git push origin main
```

**Method C — GitHub MCP (if available):**
Use `github_mcp_direct` connector tools.

**Method D — Raw HTTPS API (any agent with fetch/curl):**
```
GET https://api.github.com/repos/karimalsalah/steadywrk/contents/{path}
# Response: JSON with .content (base64) and .sha
# To read: base64 decode the .content field
# To write: PUT with {"message": "...", "content": base64_encoded, "sha": current_sha}
```

**Method E — No API access at all:**
Fetch the raw file directly:
```
https://raw.githubusercontent.com/karimalsalah/steadywrk/main/{path}
```
This works for reading. If you can't push, write the code/changes to a file, share with Karim, and he'll push or assign an agent with push access.

**RULES:**
- Branch: `main` (auto-deploys to Railway → steadywrk.app)
- Commits: conventional format `feat:`, `fix:`, `chore:`, `docs:`, `perf:` — include Linear issue ID
- Never force push
- Check latest commits before pushing — if someone committed in last 10 minutes, pull first
- For large features, use branch: `agent/{your-name}/{feature}` → PR to main

## 2.2 Linear (Team: STE, Project: STEADYWRK Platform v1.0)

**Method A — Linear MCP connector (linear_alt):**
```
Tool: linear__get_issues — filter by team key "STE"
Tool: linear__update_issue — change state, add comments
Tool: linear__create_comment — claim/complete tasks
```

**Method B — Linear API via curl/fetch:**
```bash
# If you have a Linear API key in env:
curl -H "Authorization: Bearer $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ team(id: \"1a5faa1a-c1a0-4513-ad22-b6973f50f066\") { issues { nodes { identifier title state { name } priority } } } }"}' \
  https://api.linear.app/graphql
```

**Method C — No Linear API access:**
Ask Karim or another agent to check Linear for you. Or read the current issue snapshot in Section 7 of this file. When you complete work, tell Karim or post to Slack — another agent will update Linear.

**KEY IDs:**
- Team ID: `1a5faa1a-c1a0-4513-ad22-b6973f50f066`
- Team key: `STE`
- Project ID: `21ba98f3-abd8-474d-82cf-905b9d41fea8`
- Project name: STEADYWRK Platform v1.0
- Done state ID: `e1689246-ff6d-4596-a06a-6f909ed79587`
- In Progress state ID: `40259eda-8be8-4cda-8708-4e252c4f8a4a`
- Todo state ID: `48bbd6ab-8725-4d18-a5b7-91c87150c88c`
- Backlog state ID: `7f2a14eb-1d02-48f7-aedc-a66f6e4ff679`

## 2.3 Notion (Master Hub + Coordination DBs)

**Method A — Notion MCP connector (notion_mcp):**
```
Tool: notion-fetch — read pages/databases by ID
Tool: notion-create-pages — register in Agent Registry, create Task Locks, log activities
Tool: notion-search — find content
```

**Method B — Notion API via curl/fetch:**
```bash
# If you have a Notion integration token:
curl -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  https://api.notion.com/v1/databases/{database_id}/query
```

**Method C — No Notion API access:**
Post to Slack #all-steadywrk with your agent name + what you're working on. Another agent with Notion access will register you and create locks on your behalf. The protocol still works — Slack becomes your coordination fallback.

**KEY IDs:**
- Master Hub page: `32afc6ca-6b59-8131-af3b-c319ef80ffc7`
- Agent Registry data source: `065b3bc8-953d-4119-bf17-3d0b3a809f93`
- Task Locks data source: `29438713-9a67-4e7e-9362-8a6218a00f1c`
- Activity Log data source: `53fee1d7-4898-44d6-a254-4d810cca3f8d`
- Blog Content DB: `cd5df9fb-7bc6-44ca-aae7-c51dcf6b197a`
- Hiring Pipeline DB: `7b8aedaf-0428-432a-b205-f76027c5c6f6`

## 2.4 Slack (#all-steadywrk)

**Method A — Slack MCP connector (slack_direct):**
```
Tool: slack_send_message — channel_id: "C0ALRRKS0GK"
Tool: slack_read_channel — channel_id: "C0ALRRKS0GK"
Tool: slack_search_public — search messages
```

**Method B — Slack API via curl:**
```bash
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel": "C0ALRRKS0GK", "text": "🤖 [Agent-Name] — message"}'
```

**Method C — No Slack access:**
Ask Karim to relay. Or write your status update in a Linear comment on the issue you're working on — agents with Slack access will see it and cross-post.

**Channel:** #all-steadywrk — `C0ALRRKS0GK`
**Post format:** `🤖 [Agent-Name] — {action summary}`

## 2.5 Sentry (Error Monitoring)

**Method A — Sentry MCP connector:**
```
Tool: search_issues — organizationSlug: "knv", regionUrl: "https://de.sentry.io"
```

**Method B — Sentry API:**
```bash
curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  "https://de.sentry.io/api/0/organizations/knv/issues/?query=is:unresolved"
```

**Method C — No Sentry access:**
Check the live site manually for errors. Open browser console on steadywrk.app pages. Report any errors you find to Slack or Linear.

## 2.6 Cloudinary (Asset CDN)

**Cloud name:** `dzlatnokr`
**Method A — Cloudinary MCP connector** (if available)
**Method B — Cloudinary API:**
```bash
curl https://api.cloudinary.com/v1_1/dzlatnokr/resources/image \
  -u "$CLOUDINARY_API_KEY:$CLOUDINARY_API_SECRET"
```

## 2.7 Google Calendar / Google Drive

**Method A — gcal/google_drive MCP connectors** (if available)
**Method B — Google API with OAuth** (if you have tokens)
**Method C — Ask Karim** for calendar/drive data

## 2.8 The Live Site (steadywrk.app)

Every agent can read the live site. Use it to verify your work deployed correctly.
```
https://steadywrk.app          — Homepage
https://steadywrk.app/careers  — Job listings
https://steadywrk.app/blog     — Blog
https://steadywrk.app/apply/ai-engineer — Apply form
https://steadywrk.app/sitemap.xml — Sitemap
https://steadywrk.app/llms.txt — LLM context file
https://steadywrk.app/robots.txt — Robots
```

---

# 3. COORDINATION PROTOCOL

## 3.1 Task Claiming (the critical path)

```
1. CHECK Linear → find a "Todo" issue sorted by priority (P1 first)
2. CHECK Task Locks DB → ensure no other agent locked it
3. CLAIM → Create Task Lock in Notion (or post to Slack if no Notion access)
         → Add Linear comment: "🤖 [Name] claiming this — [timestamp]"
         → Update Linear state to "In Progress"
4. BUILD → Do the work. Push to GitHub.
5. DONE  → Update Linear to "Done" + completion comment
         → Release Task Lock (or post to Slack)
         → Log in Activity Log
         → Post to Slack if significant
6. NEXT  → Go back to step 1
```

**If you can't access Linear/Notion directly:**
Post to Slack: `🤖 [Name] — Claiming STE-XX. Working on: [description]`
Another agent will update Linear/Notion for you. Don't wait — start building immediately after posting.

## 3.2 Conflict Resolution

- If Task Lock exists and was created < 30 min ago → find different work
- If Task Lock is > 30 min old with no update → you may reclaim (post to Slack first)
- If two agents pushed to same file → the later push must rebase. Check git log before pushing.
- If actual conflict → log it in Activity Log as "Conflict", post to Slack, Karim resolves

## 3.3 Communication Hierarchy

1. **Linear comments** — primary async channel (tied to specific issues)
2. **Slack #all-steadywrk** — broadcast channel (significant events, blockers, completions)
3. **Notion Activity Log** — audit trail (everything gets logged here)
4. **GitHub commit messages** — code-level coordination (include issue IDs)

Use whatever you have access to. The goal is that ANY agent checking ANY of these channels can see what happened.

---

# 4. WHAT STEADYWRK IS

**STEADYWRK LLC** — Master holding entity for multiple divisions.
**Two platforms:** steadywrk.app (Jordan/MENA career platform, LIVE) + steadywrk.dev (US ops, details NEVER in files)
**Mission:** Maximum revenue from day one. Revenue → Hiring → Training → Platform → Brand → Content.
**Target:** 18-30 Jordanian talent, especially women (66% female youth unemployment). English-first.
**HQ:** iPARK @ KHBP, Building 15, Amman, Jordan.
**Leadership:** Yousof Malkawi (CEO), Karim Alsalah/V (VP/Co-founder), Reem Shaiber (HR Director).
**Tagline:** "Where ambition compounds." | **Archetype:** Creator × Explorer

---

# 5. TECH STACK (DO NOT SUGGEST ALTERNATIVES)

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

**Repo structure:**
```
karimalsalah/steadywrk/
├── apps/web/src/
│   ├── app/           # Pages (Next.js App Router)
│   │   ├── about/, blog/, careers/, culture/, programs/  # Public pages
│   │   ├── apply/[role]/   # 5-step application form
│   │   ├── dashboard/      # Employee/HR dashboard (auth-protected)
│   │   ├── privacy/, terms/ # Legal pages
│   │   ├── sign-in/, sign-up/ # Clerk auth
│   │   ├── api/            # API routes (apply, contact, health, jobs, waitlist)
│   │   ├── layout.tsx      # Root layout (Clerk, fonts, PostHog, JSON-LD)
│   │   ├── globals.css     # @theme inline tokens
│   │   └── sitemap.ts, robots.ts
│   ├── components/
│   │   ├── sections/   # HeroSection, EVPSection, RolesSection, etc. (10 sections)
│   │   ├── layout/     # Navbar, Footer
│   │   └── ui/         # 30+ UI components (blur-fade, shimmer-button, etc.)
│   ├── lib/
│   │   ├── data/       # blog-posts.ts, programs.ts, roles.ts, etc.
│   │   └── posthog.ts, utils.ts
│   └── fonts/          # CabinetGrotesk-Variable.woff2, Satoshi-Variable.woff2
├── packages/db/        # Drizzle schema + migrations
├── SWARM_PROTOCOL.md   # THIS FILE
├── AGENT_ONBOARDING_PROMPT.md
├── AGENTS.md, CLAUDE.md
└── turbo.json, biome.json, package.json
```

---

# 6. BRAND QUICK REFERENCE

**Colors:** Signal Amber #E58A0F, Deep Carbon #0A0A0A, Background #FAFAF8, Graphite #23211D
**Fonts:** Cabinet Grotesk (display), Satoshi (body), JetBrains Mono (code)
**Voice:** Direct, specific, peer-to-peer. "Apply in 3 minutes" not "Begin your exciting journey."
**Departments:** FORGE (Eng), SIGNAL (Marketing), OPS CORE (Ops), GRID (Infra), AXIS (Strategy), ASCENT (Training)
**Programs:** IGNITE (3mo internship), ORBIT (6mo fellowship), APEX (12mo leadership)
**Never say:** "empowering your journey", "unlock your potential", "rockstars/ninjas"
**Entity name:** STEADYWRK. Never "Kayan Ventures." Dead and void.

---

# 7. OPEN TASKS — PRIORITY EXECUTION ORDER

*Check Linear for latest — this is a snapshot as of 2026-03-22T04:21Z*

### DONE (9):
STE-13 ✅ Council Execution | STE-11 ✅ Performance polish | STE-10 ✅ Employee dashboard
STE-9 ✅ Email pipeline | STE-8 ✅ Neon DB | STE-7 ✅ Clerk Auth | STE-6 ✅ PostHog
STE-17 ✅ Sitemap fix | STE-14 ✅ Blog dates fix

### WAVE 1 — OVERDUE / QUICK WINS (do these NOW):
- **STE-18** P3 — Fix emoji on apply form team buttons (15 min) → `apps/web/src/app/apply/[role]/page.tsx`
- **STE-16** P2 — Fix Instagram handle mismatch (needs Karim decision: @swrk.jo or @steadywrk?) → `apps/web/src/components/layout/footer.tsx`

### WAVE 2 — P1 URGENT (by Monday March 24):
- **STE-24** P1 — Hero LCP surgery: 9.6s → <1.5s. Root cause: hero image + parallax + particles + 3D totem + noise. Fix: defer 3D, lazy particles, optimize image, code-split motion. → `apps/web/src/components/sections/HeroSection.tsx`
- **STE-15** P1 — Arabic bilingual Privacy/Terms. Add EN/AR toggle, RTL support. → `apps/web/src/app/privacy/page.tsx`, `apps/web/src/app/terms/page.tsx`
- **STE-19** P1 — Verify pg_cron auto-delete. Enable pg_cron on Neon, create deletion job for applicant data >12 months. → `packages/db/`

### WAVE 3 — P2 HIGH (this week):
- **STE-25** P2 — JobPosting schema.org with baseSalary on career pages → `apps/web/src/app/careers/[slug]/page.tsx`
- **STE-26** P2 — Write 3 anchor blog posts (2000+ words each) for GEO/SEO moat → `apps/web/src/lib/data/blog-posts.ts` + Notion Blog Content DB
- **STE-21** P2 — Upload brand assets to Cloudinary (cloud: dzlatnokr)
- **STE-22** P2 — n8n self-hosted at automation.steadywrk.app

### IN PROGRESS (verify these are actually being worked on):
- **STE-23** 🔄 Instagram launch grid — strategy done, needs design execution
- **STE-20** 🔄 HubSpot CRM pipeline — being set up via MCP

### BACKLOG:
- STE-12 — Cal.com interview scheduling
- STE-5 — Sanity v3 CMS

---

# 8. COMPLIANCE (JORDAN PDPL)

Jordan PDPL Law No. 24 of 2023 is FULLY ACTIVE:
- DPO appointment required
- Explicit consent on every form (ConsentCheckbox exists)
- 12-month auto-deletion via pg_cron (NOT YET VERIFIED — STE-19)
- Bilingual privacy/terms needed (NOT YET DONE — STE-15)

---

# 9. HOW TO JOIN — STEP BY STEP

```
STEP 1: Read this file completely. You now know everything.

STEP 2: Register yourself.
  IF you have Notion access:
    → Create page in Agent Registry (data_source: 065b3bc8-953d-4119-bf17-3d0b3a809f93)
    → Fields: Agent Name, Agent Type, Status=Active, Current Task, Capabilities
  IF you DON'T have Notion access:
    → Post to Slack #all-steadywrk: "🤖 [Name] joining swarm. Type: [platform]. Capabilities: [list]. Starting on: [task]"
    → An agent with Notion access will register you

STEP 3: Pick a task from Section 7 (Wave 1 first, then Wave 2, then Wave 3).

STEP 4: Claim it.
  IF you have Linear access:
    → Add comment: "🤖 [Name] claiming this — [timestamp]"
    → Update state to In Progress
  IF you have Notion access:
    → Create Task Lock (data_source: 29438713-9a67-4e7e-9362-8a6218a00f1c)
  IF you have neither:
    → Post to Slack: "🤖 [Name] claiming STE-XX — [what you'll do]"
    → START BUILDING IMMEDIATELY. Don't wait for confirmation.

STEP 5: Build. Push to GitHub. Test on steadywrk.app after Railway deploys.

STEP 6: Mark done.
  → Update Linear (or post to Slack if no access)
  → Release Task Lock (or post to Slack)
  → Log in Activity Log (or post to Slack)
  → Pick next task
```

**Naming:** `{Platform}-{Codename}` → Claude-Dispatch, Claude-Apex, Perplexity-Alpha, GPT-Scout, Gemini-Forge

**If you have NO access to ANY service:** You can still read from GitHub (raw URLs are public) and write code. Save your output to files. Post to the conversation. Karim or another agent will push your code and update the coordination layer.

**There is ALWAYS a way to contribute. Find the workaround.**

---

# 10. CURRENT AGENT ROSTER

| Agent | Type | Status | Capabilities |
|-------|------|--------|-------------|
| Perplexity-Alpha | Perplexity Cowork | Active | code, research, deploy, data, content |
| Claude-Apex | Claude Cowork | Joining | code, research, deploy, content |
| *(your name here)* | | | |

---

# END OF SWARM PROTOCOL
# Register. Claim. Build. Ship. Repeat.
# "Always find workarounds that turn bottlenecks into superpowers."
