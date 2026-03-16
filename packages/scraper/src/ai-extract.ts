/**
 * AI-powered data extraction — turns scraped HTML into structured data
 *
 * Uses Claude to extract specific information from web pages.
 * Like Firecrawl but self-hosted and integrated with our stack.
 */

import Anthropic from "@anthropic-ai/sdk";

export interface ExtractionResult {
	url: string;
	data: Record<string, unknown>;
	confidence: number;
	rawText: string;
}

export class AiExtractor {
	private client: Anthropic;
	private model: string;

	constructor(opts?: { apiKey?: string; model?: string }) {
		this.client = new Anthropic({ apiKey: opts?.apiKey });
		this.model = opts?.model ?? "claude-haiku-4-5-20251001";
	}

	/**
	 * Extract structured data from HTML/text using a schema prompt
	 */
	async extract(opts: {
		text: string;
		schema: string;
		url?: string;
	}): Promise<ExtractionResult> {
		const truncated = opts.text.slice(0, 30000);

		const response = await this.client.messages.create({
			model: this.model,
			max_tokens: 4096,
			messages: [
				{
					role: "user",
					content: `Extract structured data from this web page content. Return ONLY valid JSON matching the schema.

Schema: ${opts.schema}

Content:
${truncated}`,
				},
			],
		});

		const content = response.content[0];
		const responseText = content?.type === "text" ? content.text : "";

		let data: Record<string, unknown> = {};
		try {
			// Try to parse JSON from the response, handling markdown code blocks
			const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
			const jsonStr = jsonMatch?.[1] ?? responseText;
			data = JSON.parse(jsonStr.trim()) as Record<string, unknown>;
		} catch {
			data = { raw: responseText, parseError: true };
		}

		return {
			url: opts.url ?? "",
			data,
			confidence: data.parseError ? 0.3 : 0.9,
			rawText: responseText,
		};
	}

	/**
	 * Extract leads from a business directory page
	 */
	async extractLeads(html: string, url: string): Promise<ExtractionResult> {
		return this.extract({
			text: html,
			url,
			schema: `{
  "businesses": [{
    "name": "string",
    "phone": "string | null",
    "email": "string | null",
    "address": "string | null",
    "website": "string | null",
    "description": "string | null",
    "rating": "number | null",
    "reviewCount": "number | null",
    "services": ["string"]
  }]
}`,
		});
	}

	/**
	 * Extract pricing/competitor data from a page
	 */
	async extractPricing(html: string, url: string): Promise<ExtractionResult> {
		return this.extract({
			text: html,
			url,
			schema: `{
  "company": "string",
  "plans": [{
    "name": "string",
    "price": "string",
    "period": "string",
    "features": ["string"]
  }],
  "currency": "string"
}`,
		});
	}
}
