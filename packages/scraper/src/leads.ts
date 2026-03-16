/**
 * Lead scraper — autonomous sourcing of solo technicians
 *
 * Adapted from CondomX lead-scraper. Targets:
 * Google Maps, Yelp, Thumbtack, Craigslist
 * Sources SOLO operators ONLY — no companies, no franchises.
 */

export interface ScrapedLead {
	name: string;
	phone: string;
	email: string | null;
	trades: string[];
	location: { address: string; lat: number; lng: number } | null;
	source: "google_maps" | "yelp" | "thumbtack" | "craigslist" | "web";
	isSoloOperator: boolean;
	confidence: number;
	scrapedAt: string;
	rawData: Record<string, unknown>;
}

export interface ScrapeConfig {
	targetArea: { lat: number; lng: number; radiusKm: number };
	targetTrades: string[];
	maxLeadsPerSource: number;
	sources: Array<{ name: ScrapedLead["source"]; enabled: boolean }>;
}

// Corporate language patterns that disqualify a lead
const CORPORATE_INDICATORS = [
	"inc.",
	"incorporated",
	"llc",
	"l.l.c.",
	"corp.",
	"corporation",
	"franchise",
	"national",
	"nationwide",
	"our team of",
	"our technicians",
	"employees",
	"fleet of",
	"headquarters",
	"family of companies",
];

// Solo operator positive signals
const SOLO_INDICATORS = [
	"owner-operator",
	"owner operator",
	"one-man",
	"solo",
	"independent",
	"self-employed",
	"freelance",
	"handyman",
	"i do",
	"i specialize",
	"call me directly",
	"personally handle",
	"just me",
];

const TRADE_SEARCH_TERMS: Record<string, string[]> = {
	PLUMBING: ["plumber", "plumbing", "drain cleaning"],
	ELECTRICAL: ["electrician", "electrical repair", "wiring"],
	HVAC: ["hvac", "ac repair", "heating repair"],
	GENERAL: ["handyman", "general maintenance", "home repair"],
	CARPENTRY: ["carpenter", "carpentry", "cabinet repair"],
	PAINTING: ["painter", "house painting"],
	LOCKSMITH: ["locksmith", "lock repair"],
	ROOFING: ["roofer", "roofing", "roof repair"],
	FLOORING: ["flooring", "floor installation", "tile installer"],
};

function normalizePhone(phone: string): string {
	const digits = phone.replace(/\D/g, "");
	if (digits.length === 10) return `+1${digits}`;
	if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
	return `+${digits}`;
}

function computeSoloScore(lead: {
	name: string;
	reviewCount?: number;
	description?: string;
	hasWebsite?: boolean;
	photoCount?: number;
}): { isSolo: boolean; confidence: number } {
	let score = 0.5;

	const reviewCount = lead.reviewCount ?? 0;
	if (reviewCount < 50) score += 0.15;
	else if (reviewCount >= 100) score -= 0.25;

	if (lead.hasWebsite === false) score += 0.1;
	else if (lead.hasWebsite === true) score -= 0.05;

	if (lead.photoCount !== undefined) {
		if (lead.photoCount <= 5) score += 0.05;
		if (lead.photoCount > 20) score -= 0.1;
	}

	const nameAndDesc = `${lead.name} ${lead.description ?? ""}`.toLowerCase();

	for (const pattern of CORPORATE_INDICATORS) {
		if (nameAndDesc.includes(pattern)) {
			score -= 0.2;
			break;
		}
	}

	for (const keyword of SOLO_INDICATORS) {
		if (nameAndDesc.includes(keyword)) {
			score += 0.15;
			break;
		}
	}

	if (/^[A-Z][a-z]+'s\s/i.test(lead.name)) score += 0.05;

	return {
		isSolo: Math.max(0, Math.min(1, score)) >= 0.5,
		confidence: Math.max(0, Math.min(1, score)),
	};
}

export function filterSoloOperators(leads: ScrapedLead[]): ScrapedLead[] {
	return leads.filter((lead) => {
		if (!lead.isSoloOperator || lead.confidence < 0.4) return false;
		const nameLower = lead.name.toLowerCase();
		return !CORPORATE_INDICATORS.some((p) => nameLower.includes(p));
	});
}

export function deduplicateLeads(leads: ScrapedLead[]): ScrapedLead[] {
	const byPhone = new Map<string, ScrapedLead>();
	for (const lead of leads) {
		const norm = normalizePhone(lead.phone);
		const existing = byPhone.get(norm);
		if (!existing || lead.confidence > existing.confidence) {
			byPhone.set(norm, lead);
		}
	}
	return Array.from(byPhone.values());
}

export class LeadScraper {
	private config: ScrapeConfig;

	constructor(config: ScrapeConfig) {
		this.config = config;
	}

	async scrapeGoogleMaps(): Promise<ScrapedLead[]> {
		const apiKey = process.env.GOOGLE_MAPS_API_KEY;
		if (!apiKey) return [];

		const leads: ScrapedLead[] = [];
		const { lat, lng, radiusKm } = this.config.targetArea;
		const radiusMeters = Math.min(radiusKm * 1000, 50000);

		for (const trade of this.config.targetTrades) {
			const terms = TRADE_SEARCH_TERMS[trade] ?? [trade.toLowerCase()];
			for (const term of terms) {
				if (leads.length >= this.config.maxLeadsPerSource) break;
				try {
					const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
					url.searchParams.set("location", `${lat},${lng}`);
					url.searchParams.set("radius", String(radiusMeters));
					url.searchParams.set("keyword", term);
					url.searchParams.set("key", apiKey);

					const resp = await fetch(url.toString());
					if (!resp.ok) continue;

					const data = (await resp.json()) as {
						results: Array<{
							name: string;
							place_id: string;
							geometry: { location: { lat: number; lng: number } };
							vicinity: string;
							user_ratings_total?: number;
							photos?: unknown[];
						}>;
					};

					for (const place of data.results) {
						if (leads.length >= this.config.maxLeadsPerSource) break;

						const detailUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
						detailUrl.searchParams.set("place_id", place.place_id);
						detailUrl.searchParams.set(
							"fields",
							"formatted_phone_number,website,editorial_summary",
						);
						detailUrl.searchParams.set("key", apiKey);

						const detailResp = await fetch(detailUrl.toString());
						if (!detailResp.ok) continue;

						const detail = (await detailResp.json()) as {
							result: {
								formatted_phone_number?: string;
								website?: string;
								editorial_summary?: { overview?: string };
							};
						};

						const phone = detail.result.formatted_phone_number;
						if (!phone) continue;

						const solo = computeSoloScore({
							name: place.name,
							reviewCount: place.user_ratings_total,
							description: detail.result.editorial_summary?.overview,
							hasWebsite: !!detail.result.website,
							photoCount: place.photos?.length,
						});

						leads.push({
							name: place.name,
							phone: normalizePhone(phone),
							email: null,
							trades: [trade],
							location: {
								address: place.vicinity,
								lat: place.geometry.location.lat,
								lng: place.geometry.location.lng,
							},
							source: "google_maps",
							isSoloOperator: solo.isSolo,
							confidence: solo.confidence,
							scrapedAt: new Date().toISOString(),
							rawData: { placeId: place.place_id },
						});
					}
				} catch {
					// Continue to next term
				}
			}
		}
		return leads;
	}

	async scrapeAll(): Promise<ScrapedLead[]> {
		const enabled = this.config.sources.filter((s) => s.enabled);
		const scraperMap: Record<string, () => Promise<ScrapedLead[]>> = {
			google_maps: () => this.scrapeGoogleMaps(),
		};

		const results = await Promise.allSettled(
			enabled.filter((s) => scraperMap[s.name]).map((s) => scraperMap[s.name]?.()),
		);

		const allLeads: ScrapedLead[] = [];
		for (const result of results) {
			if (result.status === "fulfilled") {
				allLeads.push(...result.value);
			}
		}

		return deduplicateLeads(filterSoloOperators(allLeads));
	}
}
