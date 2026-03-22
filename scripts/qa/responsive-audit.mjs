import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const targetUrl = process.env.TARGET_URL ?? 'https://steadywrk.app';
const outputPath = process.env.AUDIT_OUTPUT ?? 'STE-29-audit.md';
const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 414, height: 896 },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let auditResults = '# Responsive Audit Results\n\n';
  auditResults += `- Target URL: ${targetUrl}\n`;
  auditResults += `- Generated: ${new Date().toISOString()}\n\n`;
  auditResults += '## Horizontal Overflow Check\n\n';

  try {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(targetUrl, { waitUntil: 'networkidle' });

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      auditResults += `- Viewport ${viewport.width}x${viewport.height}: ${
        hasOverflow ? '❌ FAIL (Overflow detected)' : '✅ PASS (No overflow)'
      }\n`;
    }
  } finally {
    await browser.close();
  }

  const resolvedOutput = path.resolve(outputPath);
  fs.writeFileSync(resolvedOutput, auditResults, 'utf8');
  console.log(`Wrote responsive audit to ${resolvedOutput}`);
}

run().catch((error) => {
  console.error('Responsive audit failed:', error);
  process.exit(1);
});
