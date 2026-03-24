# STEADYWRK Stack Truth

Last verified: 2026-03-24

## Truth hierarchy

1. Latest `origin/main` in `karimalsalah/steadywrk`
2. Live responses from `https://steadywrk.app`
3. Code and environment files in the current SteadyWrk repo
4. Current architecture docs in the repo
5. Older generated reports only as leads, never as final truth

## Canonical project truth

- Web app: Next.js 16 + React 19
- Auth: Clerk
- Primary database: Neon Postgres via Drizzle ORM
- Primary deploy target: Railway from `main`
- Legacy exception: an optional Supabase edge-function webhook may still fan out applicant pipeline events

## Public production truth

As of the latest verification on 2026-03-24:

- `https://steadywrk.app/robots.txt` returns `200`
- `https://steadywrk.app/sitemap.xml` returns `200`
- `https://steadywrk.app/llms.txt` returns `200`
- `https://steadywrk.app/apply/operations-dispatcher` returns `200`

## Drift to avoid

- Do not describe Supabase as the primary application database
- Do not treat generated reports as canonical without checking live state
- Do not assume K1/K2 access or LAN reachability without current verification
- Do not spam Slack on every automated cycle when nothing materially changed

## Working rule

If any doc, report, or automation prompt conflicts with live site behavior plus latest `origin/main`, live site plus latest `origin/main` wins.

If this local checkout is behind `origin/main` or carrying local ops artifacts, treat it as an evidence cache rather than the canonical repo.
