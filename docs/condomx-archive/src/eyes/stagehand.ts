// CondomX Stagehand-like Self-Healing Selector System
//
// Uses AI to find alternative selectors when primary selectors fail.
// Falls back through multiple strategies before giving up.

import type { Page } from 'patchright';
import { createLogger } from '../infra/logger.js';

const log = createLogger('eyes:stagehand');

/**
 * Selector strategy types
 */
export type SelectorStrategy =
  | 'css'           // Standard CSS selector
  | 'xpath'         // XPath selector
  | 'text'          // Text content matching
  | 'aria'          // ARIA label/role
  | 'data-attr'     // Data attribute matching
  | 'sibling'       // Relative to known element
  | 'fuzzy'         // Fuzzy text matching
  | 'ml-suggested'; // ML/AI suggested (future)

/**
 * Self-healing selector definition
 */
export interface SelfHealingSelector {
  /** Element name for logging */
  name: string;
  /** Primary selector (fastest, most reliable) */
  primary: string;
  /** Primary strategy type */
  primaryStrategy: SelectorStrategy;
  /** Fallback selectors in order of preference */
  fallbacks: Array<{
    selector: string;
    strategy: SelectorStrategy;
    confidence: number; // 0-1, how confident we are this will work
  }>;
  /** Last successful selector (for learning) */
  lastSuccessful?: string;
  /** Success count for this selector */
  successCount: number;
  /** Failure count for this selector */
  failureCount: number;
}

/**
 * Self-healing selector finder
 */
export class StagehandSelector {
  private selectors: Map<string, SelfHealingSelector>;

  constructor() {
    this.selectors = new Map();
  }

  /**
   * Register a self-healing selector
   *
   * @param name - Element name (e.g., 'accept_button')
   * @param primary - Primary CSS selector
   * @param fallbacks - Array of fallback selectors with strategies
   */
  register(
    name: string,
    primary: string,
    fallbacks: Array<{ selector: string; strategy: SelectorStrategy; confidence?: number }>,
  ): void {
    this.selectors.set(name, {
      name,
      primary,
      primaryStrategy: 'css',
      fallbacks: fallbacks.map(f => ({
        ...f,
        confidence: f.confidence ?? 0.8,
      })),
      successCount: 0,
      failureCount: 0,
    });
    log.info(`Registered self-healing selector: ${name}`);
  }

  /**
   * Find element with self-healing
   *
   * Tries primary selector first, then falls back through alternatives
   * until finding a match or exhausting all options.
   *
   * @param page - Patchright page
   * @param name - Element name
   * @param timeout - Timeout in ms (default: 5000)
   * @returns Element handle or null
   */
  async find(page: Page, name: string, timeout = 5000): Promise<any> {
    const selector = this.selectors.get(name);
    if (!selector) {
      log.error(`Unknown selector: ${name}`);
      return null;
    }

    // Build ordered list of selectors to try
    const selectorsToTry = [
      { selector: selector.primary, strategy: selector.primaryStrategy, confidence: 1.0 },
      ...selector.fallbacks,
    ];

    // If we have a last successful selector, try it first
    if (selector.lastSuccessful && selector.lastSuccessful !== selector.primary) {
      selectorsToTry.unshift({
        selector: selector.lastSuccessful,
        strategy: 'css',
        confidence: 0.9,
      });
    }

    log.info(`Finding ${name}: trying ${selectorsToTry.length} selectors`);

    for (const { selector: sel, strategy, confidence } of selectorsToTry) {
      try {
        const element = await this.trySelector(page, sel, strategy, timeout);
        if (element) {
          // Success! Update stats
          selector.successCount++;
          if (sel !== selector.primary) {
            selector.lastSuccessful = sel;
            log.warn(`Self-healed ${name}: using ${strategy} "${sel}" (confidence: ${confidence})`);
          } else {
            log.debug(`Found ${name} with primary selector`);
          }
          return element;
        }
      } catch (err) {
        log.debug(`Selector failed (${strategy}): ${sel} - ${err}`);
      }
    }

    // All selectors failed
    selector.failureCount++;
    log.error(`All selectors failed for ${name}: ${selector.failureCount} failures`);
    return null;
  }

  /**
   * Try a single selector strategy
   */
  private async trySelector(
    page: Page,
    selector: string,
    strategy: SelectorStrategy,
    timeout: number,
  ): Promise<any> {
    switch (strategy) {
      case 'css':
        return await page.waitForSelector(selector, { timeout });

      case 'xpath':
        return await page.waitForSelector(`xpath=${selector}`, { timeout });

      case 'text':
        return await page.getByText(selector).first();

      case 'aria':
        return await page.getByLabel(selector).or(page.getByRole(selector as any)).first();

      case 'data-attr':
        return await page.waitForSelector(`[data-${selector}]`, { timeout });

      case 'sibling':
        // Try to find element relative to known anchor
        return await this.trySiblingSelector(page, selector, timeout);

      case 'fuzzy':
        return await this.tryFuzzyTextMatch(page, selector, timeout);

      case 'ml-suggested':
        // Future: use ML model to suggest selectors
        log.warn('ML-suggested selectors not yet implemented');
        return null;

      default:
        log.error(`Unknown strategy: ${strategy}`);
        return null;
    }
  }

  /**
   * Try sibling-based selector (relative to known element)
   */
  private async trySiblingSelector(
    page: Page,
    description: string,
    _timeout: number,
  ): Promise<any> {
    // Parse description like "button after 'Work Orders' link"
    const match = description.match(/(\w+) (?:after|before|next to|near) ['"](.+?)['"]/i);
    if (!match) {
      return null;
    }

    const [, elementType, anchorText] = match;
    if (!anchorText || !elementType) return null;

    try {
      // Find anchor element
      const anchor = await page.getByText(anchorText).first();
      if (!anchor) return null;

      // Find sibling of specified type
      const sibling = await anchor.locator(`xpath=following-sibling::${elementType}`).first();
      return sibling;
    } catch {
      return null;
    }
  }

  /**
   * Try fuzzy text matching (tolerates minor text differences)
   */
  private async tryFuzzyTextMatch(
    page: Page,
    expectedText: string,
    _timeout: number,
  ): Promise<any> {
    try {
      // Get all text elements
      const elements = await page.$$('*');
      for (const el of elements) {
        const text = await el.textContent();
        if (text && this.fuzzyMatch(text, expectedText)) {
          return el;
        }
      }
    } catch {
      // Ignore errors in fuzzy matching
    }
    return null;
  }

  /**
   * Simple fuzzy text matching (Levenshtein-based)
   */
  private fuzzyMatch(text1: string, text2: string, threshold = 0.8): boolean {
    const normalized1 = text1.toLowerCase().trim();
    const normalized2 = text2.toLowerCase().trim();

    // Exact match
    if (normalized1 === normalized2) return true;

    // Contains
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;

    // Levenshtein distance check
    const distance = this.levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);
    const similarity = 1 - (distance / maxLength);

    return similarity >= threshold;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;

    // Create matrix
    const dp: number[][] = Array.from({ length: m + 1 }, () =>
      new Array<number>(n + 1).fill(0),
    );

    // Initialize first row and column
    for (let i = 0; i <= m; i++) dp[i]![0] = i;
    for (let j = 0; j <= n; j++) dp[0]![j] = j;

    // Fill matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i]![j] = Math.min(
          dp[i - 1]![j]! + 1,      // deletion
          dp[i]![j - 1]! + 1,      // insertion
          dp[i - 1]![j - 1]! + cost, // substitution
        );
      }
    }

    return dp[m]![n]!;
  }

  /**
   * Get selector statistics
   */
  getStats(name: string): { successCount: number; failureCount: number; successRate: number } | null {
    const selector = this.selectors.get(name);
    if (!selector) return null;

    const total = selector.successCount + selector.failureCount;
    return {
      successCount: selector.successCount,
      failureCount: selector.failureCount,
      successRate: total > 0 ? selector.successCount / total : 0,
    };
  }

  /**
   * Get all registered selectors (for debugging)
   */
  getAllSelectors(): Array<{ name: string; primary: string; fallbacks: number }> {
    return Array.from(this.selectors.values()).map(s => ({
      name: s.name,
      primary: s.primary,
      fallbacks: s.fallbacks.length,
    }));
  }
}

/**
 * Pre-registered selectors for DMG Pro
 */
export function registerDMGProSelectors(stagehand: StagehandSelector): void {
  // Accept button
  stagehand.register('accept_button', '.accept-btn, button.accept', [
    { selector: '[data-action="accept"]', strategy: 'data-attr', confidence: 0.9 },
    { selector: 'button:has-text("Accept")', strategy: 'text', confidence: 0.85 },
    { selector: 'xpath=//button[contains(text(), "Accept")]', strategy: 'xpath', confidence: 0.8 },
    { selector: 'button after "Work Order" heading', strategy: 'sibling', confidence: 0.7 },
  ]);

  // Work order list
  stagehand.register('work_order_list', '.work-order-list', [
    { selector: '#work-orders-container', strategy: 'css', confidence: 0.9 },
    { selector: '.orders-table', strategy: 'css', confidence: 0.85 },
    { selector: '[role="table"][aria-label*="work order"]', strategy: 'aria', confidence: 0.8 },
  ]);

  // Work order row
  stagehand.register('work_order_row', '.work-order-row', [
    { selector: '.order-item', strategy: 'css', confidence: 0.9 },
    { selector: 'tr.work-order', strategy: 'css', confidence: 0.85 },
    { selector: '[data-type="work-order"]', strategy: 'data-attr', confidence: 0.8 },
  ]);

  // Status badge
  stagehand.register('status_badge', '.status-badge', [
    { selector: '.order-status', strategy: 'css', confidence: 0.9 },
    { selector: '.badge', strategy: 'css', confidence: 0.8 },
    { selector: '[role="status"]', strategy: 'aria', confidence: 0.75 },
  ]);

  // SMS code input
  stagehand.register('sms_code_input', 'input[name="code"]', [
    { selector: 'input[type="text"][maxlength="6"]', strategy: 'css', confidence: 0.9 },
    { selector: 'input[placeholder*="code" i]', strategy: 'css', confidence: 0.85 },
    { selector: 'input after "SMS Code" label', strategy: 'sibling', confidence: 0.75 },
  ]);

  // Phone input
  stagehand.register('phone_input', 'input[name="phone"]', [
    { selector: 'input[type="tel"]', strategy: 'css', confidence: 0.9 },
    { selector: 'input[placeholder*="phone" i]', strategy: 'css', confidence: 0.85 },
    { selector: 'input after "Phone" label', strategy: 'sibling', confidence: 0.75 },
  ]);
}
