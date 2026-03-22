# STEADYWRK Playwright E2E Tests

This directory contains the **hermetic** Playwright suites for the STEADYWRK monorepo.

Default test runs should target the **local app** served by `playwright.config.ts`, not the live production site.

## Test Suites

1. **`smoke.spec.ts`**
   - Baseline sanity check for key public routes.
   - Asserts successful rendering, `<main>` visibility, and absence of page errors.

2. **`apply-flow.spec.ts`**
   - Exercises the `/apply/[role]` flow.
   - Mocks `/api/apply` responses so the suite stays deterministic and does not write to a live database.

3. **`contact-flow.spec.ts`**
   - Verifies the public `/contact` flow.
   - Mocks `/api/contact` so the suite remains local and side-effect free.

4. **`responsive-audit.spec.ts`**
   - Local responsive regression check for key public routes.
   - Verifies zero horizontal overflow at `320px`, `375px`, and `414px`.
   - This is now a **local test**, not a production-site audit.

## Manual QA scripts

These are intentionally **outside** the normal Playwright test lane:

- `npm run qa:responsive`
  - Runs a live-site responsive audit against `TARGET_URL` (default: `https://steadywrk.app`)
  - Writes markdown output to `AUDIT_OUTPUT` (default: `STE-29-audit.md`)

- `npm run qa:lcp`
  - Queries Google PageSpeed for the live target URL
  - Default target: `https://steadywrk.app`

Examples:

```bash
npm run qa:responsive
TARGET_URL=https://steadywrk.app AUDIT_OUTPUT=tmp-responsive-audit.md npm run qa:responsive
npm run qa:lcp
```

## Commands

**Run all tests (headless):**
```bash
npx playwright test
```

**Run smoke only:**
```bash
npm run test:smoke
```

**Run responsive regression only:**
```bash
npm run test:responsive
```

**Run with UI:**
```bash
npx playwright test --ui
```

**View HTML report:**
```bash
npx playwright show-report
```

## CI / GitHub Actions

Playwright runs automatically on `push` and `pull_request` to `main` via `.github/workflows/playwright.yml`.

CI uses the local Next.js app defined in `playwright.config.ts`. Live-site audits are **not** part of the default CI path and should be run explicitly as QA/ops scripts when needed.
