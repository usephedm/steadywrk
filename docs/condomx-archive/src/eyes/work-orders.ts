// CondomX work order detection and management via DMG Pro browser automation
//
// All CSS selectors for DMG Pro are HYPOTHESIZED — the real platform has not
// been inspected yet. Every selector is tagged with a /* HYPOTHESIZED */ comment.
// Once we have verified selectors, replace them and remove the tags.

import { createLogger } from '../infra/logger.js';
import type { BrowserSession, Page } from './browser.js';

const log = createLogger('eyes:work-orders');

const DMG_BASE_URL = 'https://controlcenter.dmgpro.com';

// ---- Raw scraped data before normalization ----

export interface WorkOrderRaw {
  /** DMG Pro's internal work order ID (scraped from the page) */
  dmgProId: string;
  title: string;
  description: string;
  location: string;
  tradeType: string;
  urgency: string;
  clientName: string;
  siteAddress: string;
  /** Any additional text we captured but couldn't categorize */
  rawNotes: string;
  /** URL of the detail page for this work order */
  detailUrl: string;
  /** ISO timestamp when we scraped this */
  scrapedAt: string;
}

// ---------- HYPOTHESIZED SELECTORS ----------
// These are best-guess selectors. Replace with real ones after inspecting DMG Pro.

const SELECTORS = {
  /** Navigation link or tab to the work orders list page */
  workOrdersNavLink: 'a[href*="work-order"], .nav-work-orders, [data-nav="work-orders"]',  /* HYPOTHESIZED */

  /** Container for the work order list */
  workOrderList: '.work-order-list, .orders-table, #work-orders-container',  /* HYPOTHESIZED */

  /** Individual work order row/card in the list */
  workOrderRow: '.work-order-row, .order-item, tr.work-order',  /* HYPOTHESIZED */

  /** Status badge/label within a work order row */
  statusBadge: '.status-badge, .order-status, .badge',  /* HYPOTHESIZED */

  /** Work order ID element within a row */
  orderId: '.order-id, .wo-number, [data-field="id"]',  /* HYPOTHESIZED */

  /** Title/subject element within a row */
  orderTitle: '.order-title, .wo-title, .subject',  /* HYPOTHESIZED */

  /** Description element within a row or detail page */
  orderDescription: '.order-description, .wo-description, .description',  /* HYPOTHESIZED */

  /** Location/address element */
  orderLocation: '.order-location, .wo-address, .location, .address',  /* HYPOTHESIZED */

  /** Trade type / category element */
  orderTradeType: '.trade-type, .category, .wo-category',  /* HYPOTHESIZED */

  /** Urgency/priority indicator */
  orderUrgency: '.urgency, .priority, .wo-priority',  /* HYPOTHESIZED */

  /** Client name on the detail page */
  clientName: '.client-name, .customer-name, .wo-client',  /* HYPOTHESIZED */

  /** Site address on the detail page */
  siteAddress: '.site-address, .wo-site-address, .property-address',  /* HYPOTHESIZED */

  /** Accept button on a work order detail page */
  acceptButton: '.accept-btn, button.accept, [data-action="accept"]',  /* HYPOTHESIZED */

  /** Confirmation dialog accept/OK button */
  confirmAcceptButton: '.confirm-btn, .modal-confirm, button.ok',  /* HYPOTHESIZED */

  /** Notes or additional details text block */
  orderNotes: '.notes, .wo-notes, .additional-info',  /* HYPOTHESIZED */

  /** Filter or tab for new/unaccepted orders */
  newOrdersFilter: '.filter-new, [data-filter="new"], .tab-new',  /* HYPOTHESIZED */
} as const;
// ---------- END HYPOTHESIZED SELECTORS ----------

/**
 * Helper: extract text content from a child element within a parent,
 * returning empty string if the selector doesn't match.
 */
async function safeText(page: Page, parentSelector: string, childSelector: string, index: number): Promise<string> {
  try {
    const text = await page.evaluate(
      (args: unknown) => {
        const [pSel, cSel, idx] = args as [string, string, number];
        const parents = document.querySelectorAll(pSel);
        const parent = parents[idx];
        if (!parent) return '';
        const child = parent.querySelector(cSel);
        return child?.textContent?.trim() ?? '';
      },
      [parentSelector, childSelector, index] as unknown,
    );
    return text as string;
  } catch {
    return '';
  }
}

/**
 * Detect new/unaccepted work orders from the DMG Pro work orders page.
 */
export async function detectNewWorkOrders(session: BrowserSession): Promise<WorkOrderRaw[]> {
  const { page, accountId } = session;

  try {
    log.info('Navigating to work orders page', { accountId });
    await page.goto(`${DMG_BASE_URL}/work-orders`, { waitUntil: 'networkidle' });  /* HYPOTHESIZED URL */
    await page.waitForLoadState('domcontentloaded');

    // Try to filter for new/unaccepted orders — HYPOTHESIZED
    try {
      await page.click(SELECTORS.newOrdersFilter);
      await page.waitForLoadState('networkidle');
    } catch {
      log.debug('New orders filter not found or not clickable — proceeding with full list', { accountId });
    }

    // Wait for the list to render — HYPOTHESIZED
    await page.waitForSelector(SELECTORS.workOrderRow, { timeout: 10_000 });

    // Count rows
    const rows = await page.$$(SELECTORS.workOrderRow);
    log.info('Work order rows found', { accountId, count: rows.length });

    const orders: WorkOrderRaw[] = [];

    for (let i = 0; i < rows.length; i++) {
      const dmgProId = await safeText(page, SELECTORS.workOrderRow, SELECTORS.orderId, i);
      const title = await safeText(page, SELECTORS.workOrderRow, SELECTORS.orderTitle, i);
      const description = await safeText(page, SELECTORS.workOrderRow, SELECTORS.orderDescription, i);
      const location = await safeText(page, SELECTORS.workOrderRow, SELECTORS.orderLocation, i);
      const tradeType = await safeText(page, SELECTORS.workOrderRow, SELECTORS.orderTradeType, i);
      const urgency = await safeText(page, SELECTORS.workOrderRow, SELECTORS.orderUrgency, i);
      const status = await safeText(page, SELECTORS.workOrderRow, SELECTORS.statusBadge, i);

      // Skip orders that appear already accepted — HYPOTHESIZED status values
      const normalizedStatus = status.toLowerCase();
      if (
        normalizedStatus.includes('accepted') ||
        normalizedStatus.includes('in progress') ||
        normalizedStatus.includes('completed') ||
        normalizedStatus.includes('closed')
      ) {
        continue;
      }

      orders.push({
        dmgProId: dmgProId || `unknown-${i}`,
        title,
        description,
        location,
        tradeType,
        urgency,
        clientName: '',  // Only available on detail page
        siteAddress: location,
        rawNotes: '',
        detailUrl: `${DMG_BASE_URL}/work-orders/${dmgProId}`,  /* HYPOTHESIZED URL pattern */
        scrapedAt: new Date().toISOString(),
      });
    }

    log.info('New work orders detected', { accountId, count: orders.length });
    return orders;
  } catch (err) {
    log.error('Failed to detect work orders', {
      accountId,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Accept a specific work order on DMG Pro.
 */
export async function acceptWorkOrder(session: BrowserSession, workOrderId: string): Promise<boolean> {
  const { page, accountId } = session;

  try {
    log.info('Navigating to work order detail for acceptance', { accountId, workOrderId });
    await page.goto(`${DMG_BASE_URL}/work-orders/${workOrderId}`, { waitUntil: 'networkidle' });  /* HYPOTHESIZED URL */
    await page.waitForLoadState('domcontentloaded');

    // Click accept — HYPOTHESIZED
    await page.waitForSelector(SELECTORS.acceptButton, { timeout: 10_000 });
    await page.click(SELECTORS.acceptButton);

    // Handle potential confirmation dialog — HYPOTHESIZED
    try {
      await page.waitForSelector(SELECTORS.confirmAcceptButton, { timeout: 5_000 });
      await page.click(SELECTORS.confirmAcceptButton);
    } catch {
      log.debug('No confirmation dialog appeared', { accountId, workOrderId });
    }

    // Verify acceptance by checking the status badge changes — HYPOTHESIZED
    await page.waitForLoadState('networkidle');
    const statusText = await page.textContent(SELECTORS.statusBadge);
    const accepted = statusText?.toLowerCase().includes('accepted') ?? false;

    if (accepted) {
      log.info('Work order accepted successfully', { accountId, workOrderId });
    } else {
      log.warn('Work order acceptance uncertain — status did not change to accepted', {
        accountId,
        workOrderId,
        statusText,
      });
    }

    return accepted;
  } catch (err) {
    log.error('Failed to accept work order', {
      accountId,
      workOrderId,
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

/**
 * Get full details for a specific work order from its detail page.
 */
export async function getWorkOrderDetails(
  session: BrowserSession,
  workOrderId: string,
): Promise<WorkOrderRaw | null> {
  const { page, accountId } = session;

  try {
    const detailUrl = `${DMG_BASE_URL}/work-orders/${workOrderId}`;  /* HYPOTHESIZED URL */
    log.info('Fetching work order details', { accountId, workOrderId, detailUrl });
    await page.goto(detailUrl, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    const title = (await page.textContent(SELECTORS.orderTitle)) ?? '';
    const description = (await page.textContent(SELECTORS.orderDescription)) ?? '';
    const location = (await page.textContent(SELECTORS.orderLocation)) ?? '';
    const tradeType = (await page.textContent(SELECTORS.orderTradeType)) ?? '';
    const urgency = (await page.textContent(SELECTORS.orderUrgency)) ?? '';
    const clientName = (await page.textContent(SELECTORS.clientName)) ?? '';
    const siteAddress = (await page.textContent(SELECTORS.siteAddress)) ?? '';
    const rawNotes = (await page.textContent(SELECTORS.orderNotes)) ?? '';

    log.info('Work order details fetched', { accountId, workOrderId, title });

    return {
      dmgProId: workOrderId,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      tradeType: tradeType.trim(),
      urgency: urgency.trim(),
      clientName: clientName.trim(),
      siteAddress: siteAddress.trim(),
      rawNotes: rawNotes.trim(),
      detailUrl,
      scrapedAt: new Date().toISOString(),
    };
  } catch (err) {
    log.error('Failed to fetch work order details', {
      accountId,
      workOrderId,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
