import { expect, test } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test('should submit the contact form successfully', async ({ page }) => {
    // Navigate to the contact page
    await page.goto('/dashboard/contact');

    // Fill out the form
    await page.fill('input#contact-company', 'Test Company LLC');
    await page.fill('input#contact-name', 'Jane Doe');
    await page.fill('input#contact-email', 'jane@example.com');
    await page.fill('input#contact-subject', 'Business Inquiry');
    await page.fill('textarea#contact-message', 'This is a test message from Playwright E2E.');

    // Intercept the API call to prevent actual DB inserts if it's hitting a live API,
    // or just let it hit the local dev server.
    await page.route('/api/contact', async (route) => {
      // Mock the response so we don't spam the database
      const json = { success: true };
      await route.fulfill({ json, status: 201 });
    });

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify success message
    const successMessage = page.locator("text=Message received. We'll get back to you shortly.");
    await expect(successMessage).toBeVisible();
  });
});
