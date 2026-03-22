# apps/web

STEADYWRK’s main web application.

## What it is
- Next.js 16 App Router app
- public marketing + careers/programs/blog/contact
- apply flow
- employee/admin dashboard
- API routes used by the product surface

## Local development
From repo root:

```bash
npm install
npm run dev --workspace=web
```

Or from this directory:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Production reality
- Primary deployment target: **Railway**
- Build/start path is defined in the repo’s `nixpacks.toml`
- Do not treat Vercel boilerplate as the source of truth for this app

## See also
- Root `README.md` for repo architecture and current stack
- `AGENTS.md`, `SWARM_PROTOCOL.md`, `SWARM_QUICKSTART.md` for swarm/agent operating guidance
