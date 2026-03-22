import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/careers',
  '/programs',
  '/about',
  '/culture',
  '/salaries',
  '/blog',
  '/contact',
  '/privacy',
  '/terms',
  '/ar',
  '/ar/careers',
  '/ar/programs',
];

test.describe('Static Route Smoke Tests', () => {
  for (const route of ROUTES) {
    test(`should successfully load and render ${route}`, async ({ page }) => {
      // Listen for any unhandled exceptions or console errors
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(route);

      // Ensure the server responds with a 200 OK status
      expect(response?.status()).toBe(200);

      // Ensure no client-side React errors occurred during hydration
      expect(errors).toHaveLength(0);

      // Verify the main content area is present and visible
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
    });
  }
});
