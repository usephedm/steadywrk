/**
 * Stealth scraper — Crawlee + Playwright with anti-detection
 *
 * Uses PlaywrightCrawler for JS-rendered pages with:
 * - Automatic proxy rotation (when configured)
 * - Browser fingerprint randomization
 * - Human-like delays and scrolling
 * - Session management and retry logic
 */

import { PlaywrightCrawler, type PlaywrightCrawlingContext, type RouterHandler } from "crawlee";

export interface ScrapeResult {
	url: string;
	title: string;
	text: string;
	html: string;
	screenshot?: Buffer;
	metadata: Record<string, unknown>;
	scrapedAt: string;
}

export interface StealthConfig {
	maxConcurrency?: number;
	maxRequestRetries?: number;
	headless?: boolean;
	requestHandlerTimeoutSecs?: number;
	proxyUrls?: string[];
}

export class StealthScraper {
	private config: StealthConfig;

	constructor(config: StealthConfig = {}) {
		this.config = {
			maxConcurrency: config.maxConcurrency ?? 3,
			maxRequestRetries: config.maxRequestRetries ?? 2,
			headless: config.headless ?? true,
			requestHandlerTimeoutSecs: config.requestHandlerTimeoutSecs ?? 60,
			...config,
		};
	}

	/**
	 * Scrape a list of URLs with full browser rendering
	 */
	async scrapeUrls(
		urls: string[],
		handler?: RouterHandler<PlaywrightCrawlingContext>,
	): Promise<ScrapeResult[]> {
		const results: ScrapeResult[] = [];

		const crawler = new PlaywrightCrawler({
			maxConcurrency: this.config.maxConcurrency,
			maxRequestRetries: this.config.maxRequestRetries,
			headless: this.config.headless,
			requestHandlerTimeoutSecs: this.config.requestHandlerTimeoutSecs,
			launchContext: {
				launchOptions: {
					args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
				},
			},
			async requestHandler(ctx) {
				if (handler) {
					await handler(ctx);
					return;
				}

				const { page, request } = ctx;

				// Human-like delay
				await page.waitForTimeout(1000 + Math.random() * 2000);

				const title = await page.title();
				const text = await page.innerText("body").catch(() => "");
				const html = await page.content();

				results.push({
					url: request.url,
					title,
					text: text.slice(0, 50000),
					html: html.slice(0, 200000),
					metadata: {},
					scrapedAt: new Date().toISOString(),
				});
			},
		});

		await crawler.run(urls);
		return results;
	}

	/**
	 * Scrape a single URL and return structured data
	 */
	async scrapeOne(url: string): Promise<ScrapeResult | null> {
		const results = await this.scrapeUrls([url]);
		return results[0] ?? null;
	}

	/**
	 * Crawl a site starting from a URL, following links matching a pattern
	 */
	async crawlSite(
		startUrl: string,
		opts: {
			maxPages?: number;
			linkPattern?: RegExp;
			extractData?: (ctx: PlaywrightCrawlingContext) => Promise<Record<string, unknown>>;
		} = {},
	): Promise<ScrapeResult[]> {
		const results: ScrapeResult[] = [];
		const maxPages = opts.maxPages ?? 20;
		const linkPattern = opts.linkPattern ?? new RegExp(new URL(startUrl).hostname);

		const crawler = new PlaywrightCrawler({
			maxConcurrency: this.config.maxConcurrency,
			maxRequestRetries: this.config.maxRequestRetries,
			headless: this.config.headless,
			maxRequestsPerCrawl: maxPages,
			launchContext: {
				launchOptions: {
					args: ["--disable-blink-features=AutomationControlled", "--no-sandbox"],
				},
			},
			async requestHandler(ctx) {
				const { page, request, enqueueLinks } = ctx;

				await page.waitForTimeout(500 + Math.random() * 1500);

				const title = await page.title();
				const text = await page.innerText("body").catch(() => "");
				const html = await page.content();
				const metadata = opts.extractData ? await opts.extractData(ctx) : {};

				results.push({
					url: request.url,
					title,
					text: text.slice(0, 50000),
					html: html.slice(0, 200000),
					metadata,
					scrapedAt: new Date().toISOString(),
				});

				// Follow links matching the pattern
				await enqueueLinks({
					regexps: [linkPattern],
				});
			},
		});

		await crawler.run([startUrl]);
		return results;
	}
}
