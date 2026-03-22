import { type Page, expect, test } from '@playwright/test';

const APPLICATION_PATH = '/apply/ai-engineer';

async function completeApplyForm(page: Page) {
  await page.goto(APPLICATION_PATH);
  await expect(page.getByRole('heading', { name: 'AI Engineer' })).toBeVisible();

  await expect(page.getByText('Step 1 of 5')).toBeVisible();
  await page.getByLabel('Full name *').fill('Test User');
  await page.getByLabel('Email address *').fill('test@steadywrk.app');
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
  test('submits successfully when /api/apply succeeds', async ({ page }) => {
    let requestBody: Record<string, unknown> | null = null;

    await page.route('**/api/apply', async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, applicantId: 'test-applicant-id' }),
      });
    });

    await completeApplyForm(page);
    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(page.getByRole('heading', { name: 'Application submitted!' })).toBeVisible();
    await expect(page.getByText('We’ll review your application within 48 hours.')).toBeVisible();
    await expect(page.getByText('Failed to submit application. Please try again.')).toHaveCount(0);

    expect(requestBody).toMatchObject({
      name: 'Test User',
      email: 'test@steadywrk.app',
      phone: '+962 79 000 0000',
      team: 'ai-lab',
      position: 'ai-engineer',
      availability: 'Immediately',
      portfolioUrl: 'https://portfolio.example.com',
      githubUrl: 'https://github.com/testuser',
    });
    expect(requestBody?.challengeResponse).toBeTruthy();
    expect(requestBody?.answers).toMatchObject({
      q1: 'I built a swarm of AI agents.',
      q2: 'It creates real leverage for local talent.',
      q3: 'I turned a noisy release process into a documented deployment pipeline.',
    });
  });

  test('shows a duplicate-application message and stays on the form when /api/apply returns 409', async ({
    page,
  }) => {
    await page.route('**/api/apply', async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error:
            'You already applied to this role with this email. We will review your existing application.',
        }),
      });
    });

    await completeApplyForm(page);
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

    await completeApplyForm(page);
    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(
      page.getByText('Failed to save application. Please try again later.'),
    ).toBeVisible();
    await expect(page.getByText('Step 4 of 5')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Application submitted!' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Submit Application/i })).toBeEnabled();
  });
});
