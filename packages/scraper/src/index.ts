/**
 * @steadywrk/scraper — Crawlee-powered web scraping + lead intelligence
 *
 * Combines Crawlee (anti-detection, Playwright) with CondomX lead scoring.
 * Used for: lead gen, vendor discovery, competitor intel, market research.
 */

export { StealthScraper, type ScrapeResult } from "./stealth.js";
export { LeadScraper, type ScrapedLead, type ScrapeConfig } from "./leads.js";
export { AiExtractor, type ExtractionResult } from "./ai-extract.js";
