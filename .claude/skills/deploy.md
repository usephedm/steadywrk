# Skill: Deploy
Trigger: deploy, ship, push, release, publish, go live
## Steps
1. Run tests: npm run test — if fail, fix first
2. Type check: npm run typecheck
3. Lint: npm run lint
4. Build: turbo build --filter=<target>
5. Web apps → vercel --prod or git push main
6. MCP servers → wrangler deploy in infra/mcps/<server>/
7. Supabase migrations → supabase db push (review SQL first)
8. Verify deployment URL returns 200
9. Git tag: git tag v<semver> && git push --tags
## Guardrails
- Never deploy without passing tests
- Never deploy DB migrations without review
- Stop and report on any failure
