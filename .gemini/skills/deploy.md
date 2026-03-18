---
description: deploy apps to Vercel and MCP servers to Cloudflare Workers
---

# Deploy Skill

## Web App (Vercel)
```bash
npx vercel --prod
```
- Vercel auto-detects Next.js from `vercel.json`
- Build command: `npx turbo run build --filter=@steadywrk/web`
- Output: `apps/web/.next`

## MCP Servers (Cloudflare Workers)
```bash
# Deploy a specific MCP
npx wrangler deploy --config infra/mcps/<name>/wrangler.json

# Deploy all MCPs
for mcp in dispatch-oracle hawkeye leadforge; do
  npx wrangler deploy --config infra/mcps/$mcp/wrangler.json
done
```

## Pre-deploy Checks
// turbo-all
1. `npx turbo typecheck` — must pass
2. `npx turbo build` — must succeed
3. `npx turbo test` — all tests pass
