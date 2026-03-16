/**
 * CondomX Browser Automation — Patchright Integration
 * 
 * P1.2: Browser Automation (ADR-002)
 * - DMG Pro login flow
 * - Work order detection
 * - Auto-accept logic
 * - Stagehand fallback for self-healing
 * 
 * Stack: Patchright (TypeScript-native Playwright fork)
 */

import { chromium, type Browser, type Page } from 'patchright';

export interface BrowserConfig {
  headless: boolean;
  userAgent: string;
  viewport: { width: number; height: number };
}

export class DMGBrowser {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: BrowserConfig;

  constructor(config: BrowserConfig) {
    this.config = config;
  }

  /**
   * Launch browser with anti-detection settings
   */
  async launch(): Promise<void> {
    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    this.page = await this.browser.newPage({
      userAgent: this.config.userAgent,
      viewport: this.config.viewport,
    });

    // Inject stealth scripts
    await this.page.addInitScript(() => {
      // Remove webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });
  }

  /**
   * Login to DMG Pro
   * 
   * @param phone - Phone number for SMS login
   * @param smsCode - SMS code (from external input)
   */
  async login(phone: string, smsCode: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');

    // Navigate to DMG Pro login
    await this.page.goto('https://login.dmgpro.com', {
      waitUntil: 'networkidle',
    });

    // Enter phone number
    await this.page.fill('input[name="phone"]', phone);
    await this.page.click('button[type="submit"]');

    // Wait for SMS code input
    await this.page.waitForSelector('input[name="code"]');

    // Enter SMS code
    await this.page.fill('input[name="code"]', smsCode);
    await this.page.click('button:has-text("Verify")');

    // Wait for redirect to Control Center
    await this.page.waitForURL(/controlcenter\.dmgpro\.com/);
  }

  /**
   * Navigate to work orders page
   */
  async goToWorkOrders(): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');

    await this.page.goto('https://controlcenter.dmgpro.com/work-orders', {
      waitUntil: 'networkidle',
    });
  }

  /**
   * Detect new work orders
   * 
   * @returns Array of work order IDs
   */
  async detectWorkOrders(): Promise<string[]> {
    if (!this.page) throw new Error('Browser not launched');

    // Wait for work order cards to load
    await this.page.waitForSelector('.work-order-card');

    // Extract work order IDs
    const workOrderIds = await this.page.$$eval('.work-order-card', (cards) =>
      cards.map((card) => card.dataset.id || '').filter(Boolean)
    );

    return workOrderIds;
  }

  /**
   * Accept work order
   * 
   * @param workOrderId - Work order ID to accept
   */
  async acceptWorkOrder(workOrderId: string): Promise<void> {
    if (!this.page) throw new Error('Browser not launched');

    // Find and click accept button
    const acceptButton = await this.page.$(
      `[data-id="${workOrderId}"] button:has-text("Accept")`
    );
    if (acceptButton) {
      await acceptButton.click();
    }
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

/**
 * Stagehand-like self-healing selector finder
 * 
 * Uses AI to find alternative selectors when primary selectors fail
 */
export class SelfHealingSelector {
  private primarySelectors: Map<string, string>;
  private fallbackSelectors: Map<string, string[]>;

  constructor() {
    this.primarySelectors = new Map();
    this.fallbackSelectors = new Map();
  }

  /**
   * Register selector with fallbacks
   * 
   * @param elementName - Element name (e.g., 'accept_button')
   * @param primary - Primary selector
   * @param fallbacks - Fallback selectors (ordered by preference)
   */
  register(
    elementName: string,
    primary: string,
    fallbacks: string[]
  ): void {
    this.primarySelectors.set(elementName, primary);
    this.fallbackSelectors.set(elementName, fallbacks);
  }

  /**
   * Find element with self-healing
   * 
   * @param page - Patchright page
   * @param elementName - Element name
   * @returns Element handle or null
   */
  async find(page: any, elementName: string): Promise<any> {
    const primary = this.primarySelectors.get(elementName);
    const fallbacks = this.fallbackSelectors.get(elementName) || [];

    // Try primary selector
    try {
      const element = await page.$(primary);
      if (element) return element;
    } catch (err) {
      console.log(`[SelfHealing] Primary selector failed for ${elementName}`);
    }

    // Try fallbacks
    for (const fallback of fallbacks) {
      try {
        const element = await page.$(fallback);
        if (element) {
          console.log(`[SelfHealing] Found ${elementName} with fallback: ${fallback}`);
          return element;
        }
      } catch (err) {
        continue;
      }
    }

    console.log(`[SelfHealing] Could not find ${elementName}`);
    return null;
  }
}

// Export types
export type { Browser, Page };

export interface BrowserSession {
  page: Page;
  browser: Browser;
  context: import('patchright').BrowserContext;
  accountId: string;
}

export async function saveSession(_accountId: string, _context: import('patchright').BrowserContext): Promise<void> {
  // TODO: persist cookies/localStorage for session reuse
}
