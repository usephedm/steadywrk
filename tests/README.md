# STEADYWRK Playwright E2E Tests

This directory contains the critical path End-to-End (E2E) test suites for the steadywrk.app monorepo. 

We test against the Next.js production build (`npm run build && npm run start`) in CI, and the Next.js dev server locally, automatically handled by `playwright.config.ts`.

## Test Suites

1. **`smoke.spec.ts`**: The baseline sanity check. Iterates over every single static and dynamic route in the `NAV_LINKS` (including `/ar` translations). Asserts 200 OK network responses, structural `<main>` rendering, and strict absence of React hydration errors or unhandled console exceptions.
2. **`apply-flow.spec.ts` (STE-27)**: Deep tests the multi-step application form `/apply/[role]`. Validates required inputs, edge-case validations, and successful database mock insertion states.
3. **`contact-flow.spec.ts`**: Verifies the public `/contact` form routing, state management, and mock API submission flow.
4. **`responsive-audit.spec.ts` (STE-29)**: Executes structural viewport analysis at `320px`, `375px`, and `414px` specifically asserting zero horizontal overflow (`scrollWidth > innerWidth`) across the DOM tree.

## Commands

**Run all tests (headless):**
```bash
npx playwright test
```

**Run a specific test file:**
```bash
npx playwright test tests/smoke.spec.ts
```

**Run with UI (headed mode):**
```bash
npx playwright test --ui
```

**Generate and view HTML report:**
```bash
npx playwright show-report
```

## CI / GitHub Actions
These tests run automatically on every `push` and `pull_request` to `main` via `.github/workflows/playwright.yml`. A mock `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is injected at build-time to bypass authentication hard-blocks during the pipeline.
