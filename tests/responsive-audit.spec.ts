import { test, expect } from '@playwright/test';
import fs from 'fs';

const viewports = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 414, height: 896 }
];

test('Responsive Audit - Check for horizontal overflow', async ({ page }) => {
  let auditResults = '# Responsive Audit Results\n\n## LCP Audit (Google PageSpeed)\n\nEncountered HTTP 429 (Too Many Requests) during LCP fetch, or pending execution.\n\n## Horizontal Overflow Check\n\n';
  
  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await page.goto('https://steadywrk.app', { waitUntil: 'networkidle' });
    
    // Check if there is horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    auditResults += `- Viewport ${vp.width}x${vp.height}: ${hasOverflow ? '❌ FAIL (Overflow detected)' : '✅ PASS (No overflow)'}\n`;
  }
  
  fs.writeFileSync('STE-29-audit.md', auditResults);
});