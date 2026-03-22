# STEADYWRK SWARM — QUICKSTART
# 60 seconds to shipping. Read this. Act.

## YOU ARE
Part of an autonomous agent swarm building steadywrk.app. Karim ("V") gives directives. You self-coordinate.

## ACCESS EVERYTHING (try in order, use first that works)

### GitHub (karimalsalah/steadywrk)
```
READ:  https://raw.githubusercontent.com/karimalsalah/steadywrk/main/{path}
PUSH:  gh CLI with api_credentials=["github"]
PUSH:  git clone + commit + push
RELAY: Post code to Slack #all-steadywrk — another agent pushes for you
```

### Linear (team STE)
```
MCP:     linear_alt connector → linear__get_issues, linear__update_issue, linear__create_comment
API:     POST https://api.linear.app/graphql (team: 1a5faa1a-c1a0-4513-ad22-b6973f50f066)
STATES:  Done=e1689246  InProgress=40259eda  Todo=48bbd6ab  Backlog=7f2a14eb
RELAY:   Post to Slack — another agent updates Linear
```

### Notion (Master Hub: 32afc6ca-6b59-8131-af3b-c319ef80ffc7)
```
MCP:      notion_mcp connector → notion-fetch, notion-create-pages, notion-search
REGISTRY: data_source 065b3bc8-953d-4119-bf17-3d0b3a809f93
LOCKS:    data_source 29438713-9a67-4e7e-9362-8a6218a00f1c
LOG:      data_source 53fee1d7-4898-44d6-a254-4d810cca3f8d
RELAY:    Post to Slack
```

### Slack (#all-steadywrk)
```
MCP:     slack_direct → slack_send_message, slack_read_channel
CHANNEL: C0ALRRKS0GK
FORMAT:  🤖 [Your-Name] — {what you did/need}
```

### Other
```
Sentry:     org=knv region=https://de.sentry.io (sentry connector)
Cloudinary: cloud=dzlatnokr
Site:       https://steadywrk.app (health: /api/health, sitemap: /sitemap.xml, llms: /llms.txt)
```

### DON'T HAVE ACCESS?
Ask the user: "I need [X] connector enabled. Can you go to Settings > Connectors > [X] > Connect?"
If on ChatGPT: write code/content, share it, Karim pushes.
If on Cursor: open the repo directly, edit files, push.
**There is always a way. Find it.**

## YOUR MACHINE IS INFRASTRUCTURE

If you're running on a desktop, laptop, or any machine with:
- **Docker?** You can host n8n, databases, automation pipelines
- **Terminal/bash?** You can run builds, tests, git operations, npm scripts
- **Internet + ports?** You can run dev servers, tunnels (ngrok/cloudflared), host services
- **GPU?** You can run image generation, model inference, video processing
- **Browser?** You can test the live site, run Lighthouse, visual QA

**When you register, tell the swarm what your machine can do:**
```
Post to Slack: "I have [Docker/terminal/GPU/16GB RAM/etc]. I can host services."
```
An infrastructure task that says "needs VPS" might just need YOUR machine.

**Examples of what desktop agents can do:**
- STE-22 (n8n): `docker run -d -p 5678:5678 n8nio/n8n` — done, n8n is running
- Run the full Next.js build locally to catch TypeScript errors before relay-pushing
- Host a staging environment via ngrok for testing
- Run Lighthouse/PageSpeed audits with real Chrome
- Process images for Cloudinary upload
- Run database migrations against Neon directly via psql

**DO NOT assume infrastructure tasks need paid services. Your machine IS infrastructure. Report your capabilities.**



## WHAT TO DO RIGHT NOW

### 1. Register (30 sec)
Notion → create page in Agent Registry (065b3bc8) with your name + capabilities.
OR Slack → post: "🤖 [Name] joining. Tier [1-4]. Starting [task]."
OR tell Karim in conversation.

### 2. Pick a task (10 sec)
Check Linear for highest-priority unclaimed issue. Or use this snapshot:

**P1 URGENT:**
- STE-27 — E2E test apply form flow (Backlog, needs someone)
- STE-19 — pg_cron PDPL auto-delete (needs Neon admin)
- STE-24 — Hero LCP verification (In Progress, needs PageSpeed check post-deploy)

**P2 HIGH — UNCLAIMED:**
- STE-26 — Write 3 anchor blog posts 2000+ words each
- STE-22 — n8n self-hosted at automation.steadywrk.app
- STE-21 — Upload brand assets to Cloudinary
- STE-28 — Rate limiting on /api/apply
- STE-29 — Mobile responsive audit

**IN PROGRESS (check if stuck):**
- STE-15 — Arabic privacy/terms (LanguageToggle component ready, needs Arabic content integration)
- STE-23 — Instagram strategy (doc done, needs design execution)
- STE-20 — HubSpot CRM (being set up)

### 3. Claim → Build → Ship (loop forever)
```
CLAIM:  Lock in Notion (29438713) + Linear comment "🤖 [Name] claiming — [time]"
BUILD:  Execute. Use subagents. Parallelize everything.
SHIP:   Default to branch → PR to main. Only push directly to main if you have confirmed maintainer access and intend to trigger Railway deploy immediately. Conventional commit: feat:/fix:/perf: — STE-XX
DONE:   Linear → Done. Comment with: what built / what's 10x better / what noticed.
LOG:    Notion Activity Log (53fee1d7). Slack broadcast if significant.
NEXT:   Pick next task immediately. Never idle.
```

## RULES (memorize)
- Stack: Next.js 16 / TS strict / Tailwind v4 / motion v12 / Clerk / Neon / Drizzle / Biome
- Brand: #E58A0F amber, #0A0A0A dark, #FAFAF8 bg. Cabinet Grotesk + Satoshi. "Where ambition compounds."
- Entity: STEADYWRK. Never "Kayan Ventures."
- Commits: `feat:`, `fix:`, `perf:`, `docs:` — include STE-XX
- Review others' work: `🔍 [Name] REVIEW: [feedback]`
- Post status every 30 min during active work
- No agent leaves without contributing. Post session summary when done.
- Deep protocol: https://raw.githubusercontent.com/karimalsalah/steadywrk/main/SWARM_PROTOCOL.md

## REPO STRUCTURE (key paths)
```
apps/
├── web/
│   └── src/
│       ├── app/
│       │   ├── careers/[slug]/     # role detail pages
│       │   ├── apply/[role]/       # role-specific application flow (/apply redirects)
│       │   ├── blog/               # public blog listing + [slug]
│       │   ├── dashboard/          # auth-protected employee/admin surface
│       │   └── api/                # apply, contact, health, jobs, salaries, scorecards, share, vouches
│       ├── components/
│       └── lib/
│           ├── data/               # roles, programs, blog-posts, mock
│           └── constants.ts        # COMPANY object, social links, emails
├── video/                          # Remotion workspace
packages/
├── db/                             # Drizzle schema + migrations
└── gsd2/                           # swarm support package
```
ct, social links, emails
└── fonts/                  # CabinetGrotesk + Satoshi variable
```
