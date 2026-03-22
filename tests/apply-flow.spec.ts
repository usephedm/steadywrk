import { type Page, expect, test } from '@playwright/test';

const APPLICATION_PATH = '/apply/ai-engineer';

async function completeApplyForm(page: Page, email: string) {
  await page.goto(APPLICATION_PATH);
  await expect(page.getByRole('heading', { name: 'AI Engineer' })).toBeVisible();

  await expect(page.getByText('Step 1 of 5')).toBeVisible();
  await page.getByLabel('Full name *').fill('Test User');
  await page.getByLabel('Email address *').fill(email);
  await page.getByLabel('Phone number *').fill('+962 79 000 0000');
  await page.getByRole('button', { name: /AI Lab/i }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await expect(page.getByText('Step 2 of 5')).toBeVisible();
  await page
    .getByLabel(/What’s the most interesting thing you’ve built/i)
    .fill('I built a swarm of AI agents.');
  await page
    .getByLabel(/Why does AI in Jordan matter/i)
    .fill('It creates real leverage for local talent.');
  await page
    .getByLabel(/Describe a time you turned chaos into order/i)
    .fill('I turned a noisy release process into a documented deployment pipeline.');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await expect(page.getByText('Step 3 of 5')).toBeVisible();
  await page.getByLabel(/Portfolio URL/i).fill('https://portfolio.example.com');
  await page.getByLabel(/GitHub URL/i).fill('https://github.com/testuser');
  await page.getByLabel('Immediately').check();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  await expect(page.getByText('Step 4 of 5')).toBeVisible();
  await page
    .getByLabel(/Scenario Response/i)
    .fill('I would calm the client, dispatch the right team, and keep stakeholders updated.');
}

test.describe('Apply Form Flow', () => {
  test('submits successfully through the real apply route and exposes a live pipeline page', async ({
    page,
  }) => {
    const email = `success-${Date.now()}@steadywrk.app`;

    await completeApplyForm(page, email);
    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(page.getByRole('heading', { name: 'Application submitted!' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Track your pipeline' })).toBeVisible();
    await expect(page.getByText('Failed to submit application. Please try again.')).toHaveCount(0);

    await page.getByRole('link', { name: 'Track your pipeline' }).click();

    await expect(page.getByRole('heading', { name: 'Your application pipeline' })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByText('Application review').first()).toBeVisible();
  });

  test('shows a duplicate-application message on a second real submission', async ({ page }) => {
    const email = `duplicate-${Date.now()}@steadywrk.app`;

    await completeApplyForm(page, email);
    await page.getByRole('button', { name: /Submit Application/i }).click();
    await expect(page.getByRole('heading', { name: 'Application submitted!' })).toBeVisible();

    await completeApplyForm(page, email);
    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(
      page.getByText(
        'You already applied to this role with this email. We will review your existing application.',
      ),
    ).toBeVisible();
    await expect(page.getByText('Step 4 of 5')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Application submitted!' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Submit Application/i })).toBeEnabled();
  });

  test('shows an error and stays on the form when /api/apply fails', async ({ page }) => {
    await page.route('**/api/apply', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to save application. Please try again later.' }),
      });
    });

    await completeApplyForm(page, `error-${Date.now()}@steadywrk.app`);
    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(
      page.getByText('Failed to save application. Please try again later.'),
    ).toBeVisible();
    await expect(page.getByText('Step 4 of 5')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Application submitted!' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Submit Application/i })).toBeEnabled();
  });
});
