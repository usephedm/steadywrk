import { expect, test } from '@playwright/test';

test.describe('Apply Form Flow', () => {
  test('should navigate through the apply form steps', async ({ page }) => {
    // Navigate to a specific role application
    await page.goto('/apply/ai-engineer');

    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'AI Engineer' })).toBeVisible();

    // Step 1: The Hook
    await expect(page.getByText('Step 1 of 5')).toBeVisible();
    await page.getByLabel('Full name *').fill('Test User');
    await page.getByLabel('Email address *').fill('test@steadywrk.app');
    await page.getByLabel('Phone number *').fill('+962 79 000 0000');

    // Select team (AI Lab)
    await page.getByRole('button', { name: /AI Lab/i }).click();

    // Consent checkbox
    await page.getByRole('checkbox').check();

    // Continue to Step 2
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    // Step 2: Your Story
    await expect(page.getByText('Step 2 of 5')).toBeVisible();

    // Fill text areas
    await page
      .getByLabel(/What’s the most interesting thing you’ve built/i)
      .fill('I built a swarm of AI agents.');
    await page
      .getByLabel(/Why does AI in Jordan matter/i)
      .fill('It is a massive opportunity for growth.');
    await page
      .getByLabel(/Describe a time you turned chaos into order/i)
      .fill('Organized a messy repo into a monorepo.');

    // Continue to Step 3
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    // Step 3: Skills Signal
    await expect(page.getByText('Step 3 of 5')).toBeVisible();

    // Optional links
    await page.getByLabel(/GitHub URL/i).fill('https://github.com/testuser');

    // Select Availability
    await page.getByLabel('Immediately').check();

    // Continue to Step 4
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    // Step 4: The Challenge
    await expect(page.getByText('Step 4 of 5')).toBeVisible();

    // Fill challenge response
    await page
      .getByLabel(/Scenario Response/i)
      .fill('I would apologize, dispatch an emergency team, and update the CRM.');

    // Since we don't want to actually submit the form to the DB in a basic E2E test without mocking,
    // we will assert the submit button is present and enabled.
    const submitButton = page.getByRole('button', { name: /Submit Application/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});
