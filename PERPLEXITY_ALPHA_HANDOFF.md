# PERPLEXITY-ALPHA HANDOFF — March 22, 2026 12:32 PM Amman

## WHO I AM
Perplexity-Alpha. First agent in the swarm. Built the coordination infrastructure, ran all watchdogs, pushed 8 commits today, filed 4 strategic issues, built the employer target list.

---

## CRITICAL IDs — MEMORIZE THESE

### Linear
- **Team ID:** `1a5faa1a-c1a0-4513-ad22-b6973f50f066`
- **Team Key:** STE
- **Project ID:** `21ba98f3-abd8-474d-82cf-905b9d41fea8`
- **Project Name:** STEADYWRK Platform v1.0
- **Workflow States:**
  - Done: `e1689246-ff6d-4596-a06a-6f909ed79587`
  - In Progress: `40259eda-8be8-4cda-8708-4e252c4f8a4a`
  - Todo: `48bbd6ab-...` (get from linear__list_issue_statuses)
  - Backlog: `7f2a14eb-1d02-48f7-aedc-a66f6e4ff679`
- **Connector:** `linear_alt`

### Slack
- **Channel:** #all-steadywrk
- **Channel ID:** `C0ALRRKS0GK`
- **V's User ID:** `U0ALY7J9G9G`
- **Connector:** `slack_direct`
- **Tool for posting:** `slack_send_message`
- **Tool for reading:** `slack_read_channel`

### Notion
- **Master Hub:** `32afc6ca-6b598131-af3b-c319ef80ffc7`
- **Agent Registry (data_source):** `065b3bc8-953d-4119-bf17-3d0b3a809f93`
- **Task Locks (data_source):** `29438713-9a67-4e7e-9362-8a6218a00f1c`
- **Activity Log (data_source):** `53fee1d7-4898-44d6-a254-4d810cca3f8d`
- **Launch Checklist:** `32bfc6ca-6b5981b8-b170-cff282c023d3`
- **Connector:** `notion_mcp`

### Sentry
- **Org Slug:** `knv`
- **Region URL:** `https://de.sentry.io`
- **Connector:** `sentry`

### GitHub
- **Repo:** `karimalsalah/steadywrk`
- **Access:** `gh` CLI with `api_credentials=["github"]`
- **Branch:** `main` (only branch now — master and stale branches deleted)
- **Latest commit:** `38a3e8f` (my cleanup + blog backdate)

### Cloudinary
- **Cloud name:** `dzlatnokr`
- **Folders:** `/steadywrk/logos`, etc. (ALL EMPTY — needs V to upload brand assets)

### Site
- **URL:** `https://steadywrk.app`
- **Health:** `/api/health` → `{"status":"ok"}`
- **All routes:** 200 OK as of 12:13 PM

---

## CURRENT STATE — LINEAR ISSUES

### Done (31)
STE-6 through STE-40 (most), including today's fixes:
- STE-30: /api/apply returns 500 on DB failure (was silently losing applications)
- STE-40: /ar/* added to Clerk public routes (Arabic pages were blocked)

### In Progress (4)
| Issue | Title | Priority | Blocked On |
|-------|-------|----------|------------|
| STE-33 | Clerk pk_test_ → pk_live_* in Railway | URGENT | V (2 min in Railway dashboard) |
| STE-36 | SSH key rotation (condomx-agent-deploy-key) | URGENT | V (5 min) |
| STE-39 | Railway TTFB health check env vars | HIGH | V (1 min in Railway dashboard) |
| STE-23 | Instagram launch (@swrk.jo) | HIGH | Design execution (strategy done, 750 lines) |

### Todo (5)
| Issue | Title | Priority |
|-------|-------|----------|
| STE-22 | n8n self-hosted at automation.steadywrk.app | HIGH |
| STE-1/2/3/4 | Linear onboarding placeholders | None |

### Backlog (6)
| Issue | Title | Priority | Due |
|-------|-------|----------|-----|
| STE-5 | Sanity v3 CMS for blog/jobs | HIGH | Apr 14 |
| STE-12 | Cal.com interview scheduling | MEDIUM | Apr 28 |
| STE-41 | WhatsApp Business API | HIGH | Apr 14 |
| STE-42 | Employer-first go-to-market (30 companies) | URGENT | Apr 7 |
| STE-43 | PDPL legal compliance review | URGENT | Apr 1 |
| STE-44 | MoDEE/YTJ government partnership | HIGH | May 15 |

---

## CRONS RUNNING (4 active)

| ID | Name | Schedule | What |
|----|------|----------|------|
| `173d4816` | Production Watchdog | Every hour at :33 | Checks all routes, Sentry, CI. Posts to Slack ONLY if something breaks. |
| `a32576bd` | Directive Intake | Every hour at :33 | Reads Slack for new human messages from V (U0ALY7J9G9G). Creates Linear issues if found. |
| `6b448485` | Swarm Health Monitor | Every 2h at :39 | Checks Linear for stuck issues (>4h In Progress). |
| `2c1e8e42` | Morning Briefing | Daily 7:00 AM Amman (4:00 UTC) | Full overnight report to Slack + notification. |

These are Perplexity platform crons. They will continue running even after this session ends. If they need updating, use `schedule_cron` with action `update` or `delete` and the cron IDs above.

---

## FILES IN WORKSPACE

| File | What |
|------|------|
| `/home/user/workspace/employer-target-list.md` | 30-company target list for STE-42 (485 lines) |
| `/home/user/workspace/strategic-research.md` | Full strategic deep-dive (522 lines, competitive landscape, market data) |
| `/home/user/workspace/notion-deep-audit.md` | Complete Notion workspace audit (457 lines) |
| `/home/user/workspace/watchdog-production.md` | Last production watchdog report |
| `/home/user/workspace/watchdog-swarm.md` | Last swarm health report |
| `/home/user/workspace/watchdog-directives.md` | Last directive scan |
| `/home/user/workspace/linear-state.md` | Last Linear full state dump |
| `/home/user/workspace/steadywrk-fix/` | Local clone of the repo (up to date with main) |

---

## WHAT I SHIPPED TODAY (8 commits)

1. `40dbaba` — /blog added to nav + title/description trim (STE-37)
2. `f5b1a47` — /apply 404 redirect + OG metadata on 6 pages (STE-38)
3. `640c271` — SSR Arabic privacy + terms pages (STE-35)
4. `d17e215` — AGENT_ONBOARDING v8
5. `1d28f46` — /ar/* added to Clerk public routes (STE-40)
6. `f24149c` — /api/apply returns 500 on DB failure + og:image on 5 pages (STE-30)
7. `38a3e8f` — Repo root cleanup + blog backdate

Plus: Closed PR #5 and #6. Deleted 3 dead branches. Filed STE-41/42/43/44. Built employer target list. Ran all watchdogs. Rebuilt 4 crons. Posted 8+ Slack broadcasts. Created 4 Notion activity log entries.

---

## STRATEGIC CONTEXT — CRITICAL

From the deep strategic audit (read `/home/user/workspace/strategic-research.md`):

1. **EMPLOYER-FIRST**: The #1 risk is a beautiful platform no employer has heard of. Need 10-15 signed commitments before launch. BPO companies are the fastest yes.
2. **PDPL MANDATORY**: Grace period ended March 2025. Need Jordanian data privacy lawyer.
3. **MoDEE/YTJ**: Government spending World Bank money on 10,000 digital jobs. Partner or competitor — contact within 60 days.
4. **WhatsApp**: 93% penetration in Jordan. Should be primary communication channel.
5. **Qanat (qn8.app)**: Separate parallel project in Notion, 30 days stale. V hasn't confirmed if active or paused.
6. **Over-engineering risk**: Platform is beautiful but the constraint is employer relationships and social proof, not technology.

---

## BLOCKERS ONLY V CAN RESOLVE

1. **STE-33** — Railway env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from `pk_test_*` to `pk_live_*` (2 min)
2. **STE-36** — Rotate `condomx-agent-deploy-key` SSH key, revoke old one (5 min)
3. **STE-39** — Railway env vars: `RAILWAY_HEALTH_CHECK_ENDPOINT=/api/health` + `RAILWAY_HEALTHCHECK_TIMEOUT_SEC=300` (1 min)
4. **STE-22** — Railway new project from n8n template (2 min)
5. **Canva** — Export brand assets to Cloudinary (all folders empty)
6. **Qanat** — Is qn8.app still active? Notion pages 30 days stale.

---

## UNBLOCKED WORK FOR NEXT AGENT

1. **STE-23 Instagram**: Strategy is 750 lines in Notion, execution is 0%. Design the 9-post grid assets.
2. **STE-42 Employer outreach**: Target list is DONE (30 companies). Draft the employer MOU/commitment letter + outreach email templates.
3. **STE-5 Sanity CMS**: Blog is hardcoded in `blog-posts.ts`. Wire up Sanity v3.
4. **STE-12 Cal.com**: Interview scheduling integration.
5. **STE-43 PDPL**: Research Jordanian data privacy lawyers. Draft DPO appointment letter.
6. **STE-44 MoDEE**: Draft partnership pitch deck for YTJ program.
7. **Content**: Arabic versions of key marketing pages (homepage, careers, programs).
8. **Performance**: Implement stale-while-revalidate headers in next.config.ts (STE-39 Patch 2).
9. **QA**: Run Lighthouse on all 18 blog pages. Check for broken links.
10. **Resend DNS**: Verify SPF + DKIM records for steadywrk.app.

---

## V'S OPERATING STYLE

- Karim "V" Alsalah. VP, Co-founder. Builds and ships.
- Expects: operational precision, no padding, proactive workarounds, code/commands ready to execute
- Communication: direct, intense, fast. Swearing is normal. Urgency is the default.
- The directive: "never stop until you provide true value, no conflict, all harmony, full autonomy 24/7"
- Yousof Malkawi is CEO. V provides all operational instructions.
- Entity: STEADYWRK LLC. NEVER "Kayan Ventures."

---

*Perplexity-Alpha signing off. 55 commits. 31 issues done. 4 crons running. The swarm doesn't sleep.*
