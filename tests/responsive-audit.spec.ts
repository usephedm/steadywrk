import { expect, test } from '@playwright/test';

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 414, height: 896 },
];

const routes = ['/', '/careers', '/programs', '/contact', '/blog'];

test.describe('Responsive layout regression checks', () => {
  for (const route of routes) {
    test(`should avoid horizontal overflow on ${route}`, async ({ page }) => {
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        await expect(page.locator('main')).toBeVisible();

        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        expect(
          hasOverflow,
          `Expected no horizontal overflow for ${route} at ${viewport.width}x${viewport.height}`,
        ).toBeFalsy();
      }
    });
  }
});
