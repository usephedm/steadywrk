// CondomX lead scraper — autonomous sourcing of SOLO technicians
// Targets: Google Maps, Yelp, Thumbtack, Craigslist, Facebook Marketplace
// CRITICAL: We source SOLO operators ONLY — no companies, no franchises.
// Techs must NEVER arrive representing another company.

import type { TradeType } from '../core/types.js';
import type { RecruitmentLead } from '../comms/cold-calling.js';
import { createLogger } from '../infra/logger.js';

const log = createLogger('eyes:lead-scraper');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LeadSource {
  name: 'google_maps' | 'yelp' | 'thumbtack' | 'craigslist' | 'facebook';
  enabled: boolean;
}

export interface ScrapedLead {
  name: string;
  phone: string;
  email: string | null;
  trades: string[];
  location: { address: string; lat: number; lng: number } | null;
  source: LeadSource['name'];
  isSoloOperator: boolean;
  confidence: number; // 0-1
  scrapedAt: string;
  rawData: Record<string, unknown>;
}

export interface ScrapeConfig {
  targetArea: { lat: number; lng: number; radiusKm: number };
  targetTrades: string[];
  maxLeadsPerSource: number;
  sources: LeadSource[];
}

export interface ScrapeSession {
  id: string;
  config: ScrapeConfig;
  startedAt: string;
  completedAt: string | null;
  totalScraped: number;
  totalSolo: number;
  totalDeduplicated: number;
  leads: ScrapedLead[];
  errors: Array<{ source: LeadSource['name']; error: string }>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Review count threshold — anyone with more reviews is likely a company */
const SOLO_REVIEW_THRESHOLD = 100;

/** Low review count is a strong solo indicator */
const LOW_REVIEW_THRESHOLD = 50;

/** Corporate language patterns that disqualify a lead */
const CORPORATE_INDICATORS = [
  'inc.', 'inc,', 'incorporated',
  'llc', 'l.l.c.',
  'corp.', 'corp,', 'corporation',
  'franchise', 'franchisee',
  'national', 'nationwide',
  'chain', 'locations',
  'we are a team of',
  'our team of',
  'our technicians',
  'employees',
  'fleet of',
  'serving .* states',
  'offices in',
  'headquarters',
  'est\\. \\d{4}',
  'since \\d{4}',
  'years of experience as a company',
  'family of companies',
] as const;

/** Solo operator positive signals */
const SOLO_INDICATORS = [
  'owner-operator',
  'owner operator',
  'one-man',
  'solo',
  'independent',
  'self-employed',
  'freelance',
  'handyman',
  'i do',
  'i specialize',
  'call me directly',
  'personally handle',
  'i personally',
  'just me',
  'individual',
] as const;

/** Map of scrape-friendly trade search terms */
const TRADE_SEARCH_TERMS: Record<string, string[]> = {
  PLUMBING: ['plumber', 'plumbing', 'drain cleaning', 'pipe repair'],
  ELECTRICAL: ['electrician', 'electrical repair', 'wiring'],
  HVAC: ['hvac', 'ac repair', 'heating repair', 'air conditioning'],
  GENERAL: ['handyman', 'general maintenance', 'home repair'],
  CARPENTRY: ['carpenter', 'carpentry', 'woodwork', 'cabinet repair'],
  PAINTING: ['painter', 'house painting', 'interior painting'],
  LOCKSMITH: ['locksmith', 'lock repair', 'key cutting'],
  ROOFING: ['roofer', 'roofing', 'roof repair'],
  FLOORING: ['flooring', 'floor installation', 'tile installer'],
};

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------

function generateId(): string {
  return `scrape-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createScrapeSession(config: ScrapeConfig): ScrapeSession {
  const session: ScrapeSession = {
    id: generateId(),
    config,
    startedAt: new Date().toISOString(),
    completedAt: null,
    totalScraped: 0,
    totalSolo: 0,
    totalDeduplicated: 0,
    leads: [],
    errors: [],
  };

  log.info('Scrape session created', {
    sessionId: session.id,
    sources: config.sources.filter((s) => s.enabled).map((s) => s.name),
    trades: config.targetTrades,
    area: `${config.targetArea.lat},${config.targetArea.lng} r=${config.targetArea.radiusKm}km`,
  });

  return session;
}

// ---------------------------------------------------------------------------
// Phone normalization
// ---------------------------------------------------------------------------

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

// ---------------------------------------------------------------------------
// Solo operator detection
// ---------------------------------------------------------------------------

function computeSoloScore(lead: {
  name: string;
  reviewCount?: number;
  description?: string;
  hasWebsite?: boolean;
  photoCount?: number;
  employeeCount?: number;
}): { isSolo: boolean; confidence: number } {
  let score = 0.5; // Start neutral

  // Review count is a strong signal
  const reviewCount = lead.reviewCount ?? 0;
  if (reviewCount < LOW_REVIEW_THRESHOLD) {
    score += 0.15;
  } else if (reviewCount >= SOLO_REVIEW_THRESHOLD) {
    score -= 0.25;
  }

  // No website = likely solo
  if (lead.hasWebsite === false) {
    score += 0.1;
  } else if (lead.hasWebsite === true) {
    score -= 0.05; // Slight negative — solos can have sites too
  }

  // Low photo count = solo
  if (lead.photoCount !== undefined) {
    if (lead.photoCount <= 5) score += 0.05;
    if (lead.photoCount > 20) score -= 0.1;
  }

  // Employee count
  if (lead.employeeCount !== undefined) {
    if (lead.employeeCount <= 1) score += 0.2;
    if (lead.employeeCount > 3) score -= 0.3;
  }

  const desc = (lead.description ?? '').toLowerCase();
  const nameAndDesc = `${lead.name} ${desc}`.toLowerCase();

  // Check for corporate language (disqualifier)
  for (const pattern of CORPORATE_INDICATORS) {
    if (new RegExp(pattern, 'i').test(nameAndDesc)) {
      score -= 0.2;
      break; // One hit is enough to penalize
    }
  }

  // Check for solo indicators (qualifier)
  for (const keyword of SOLO_INDICATORS) {
    if (nameAndDesc.includes(keyword)) {
      score += 0.15;
      break;
    }
  }

  // Personal name pattern (e.g., "John's Plumbing", "Mike the Plumber")
  if (/^[A-Z][a-z]+'s\s/i.test(lead.name) || /\bthe\b/i.test(lead.name)) {
    score += 0.05;
  }

  // Clamp to 0-1
  const confidence = Math.max(0, Math.min(1, score));

  return {
    isSolo: confidence >= 0.5,
    confidence,
  };
}

// ---------------------------------------------------------------------------
// Google Maps scraper (Places API)
// ---------------------------------------------------------------------------

export async function scrapeGoogleMaps(config: ScrapeConfig): Promise<ScrapedLead[]> {
  const apiKey = process.env['GOOGLE_MAPS_API_KEY'];
  if (!apiKey) {
    log.warn('GOOGLE_MAPS_API_KEY not set, skipping Google Maps scrape');
    return [];
  }

  const leads: ScrapedLead[] = [];
  const { lat, lng, radiusKm } = config.targetArea;
  const radiusMeters = Math.min(radiusKm * 1000, 50000); // API max 50km

  for (const trade of config.targetTrades) {
    const searchTerms = TRADE_SEARCH_TERMS[trade] ?? [trade.toLowerCase()];

    for (const term of searchTerms) {
      if (leads.length >= config.maxLeadsPerSource) break;

      try {
        const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
        url.searchParams.set('location', `${lat},${lng}`);
        url.searchParams.set('radius', String(radiusMeters));
        url.searchParams.set('keyword', term);
        url.searchParams.set('type', 'point_of_interest');
        url.searchParams.set('key', apiKey);

        log.debug('Google Maps API request', { term, lat, lng, radiusMeters });

        const resp = await fetch(url.toString());
        if (!resp.ok) {
          log.error('Google Maps API error', { status: resp.status, term });
          continue;
        }

        const data = (await resp.json()) as {
          results: Array<{
            name: string;
            place_id: string;
            geometry: { location: { lat: number; lng: number } };
            vicinity: string;
            user_ratings_total?: number;
            rating?: number;
            business_status?: string;
            photos?: unknown[];
            types?: string[];
          }>;
          next_page_token?: string;
        };

        for (const place of data.results) {
          if (leads.length >= config.maxLeadsPerSource) break;

          // Get place details for phone number
          const detailUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
          detailUrl.searchParams.set('place_id', place.place_id);
          detailUrl.searchParams.set('fields', 'formatted_phone_number,website,editorial_summary');
          detailUrl.searchParams.set('key', apiKey);

          const detailResp = await fetch(detailUrl.toString());
          if (!detailResp.ok) continue;

          const detailData = (await detailResp.json()) as {
            result: {
              formatted_phone_number?: string;
              website?: string;
              editorial_summary?: { overview?: string };
            };
          };

          const phone = detailData.result.formatted_phone_number;
          if (!phone) continue; // No phone = unusable lead

          const soloResult = computeSoloScore({
            name: place.name,
            reviewCount: place.user_ratings_total,
            description: detailData.result.editorial_summary?.overview,
            hasWebsite: !!detailData.result.website,
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
            source: 'google_maps',
            isSoloOperator: soloResult.isSolo,
            confidence: soloResult.confidence,
            scrapedAt: new Date().toISOString(),
            rawData: {
              placeId: place.place_id,
              rating: place.rating,
              reviewCount: place.user_ratings_total,
              hasWebsite: !!detailData.result.website,
              businessStatus: place.business_status,
            },
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        log.error('Google Maps scrape failed', { term, error: message });
      }
    }
  }

  log.info('Google Maps scrape complete', { total: leads.length });
  return leads;
}

// ---------------------------------------------------------------------------
// Yelp scraper (Fusion API)
// ---------------------------------------------------------------------------

export async function scrapeYelp(config: ScrapeConfig): Promise<ScrapedLead[]> {
  const apiKey = process.env['YELP_API_KEY'];
  if (!apiKey) {
    log.warn('YELP_API_KEY not set, skipping Yelp scrape');
    return [];
  }

  const leads: ScrapedLead[] = [];
  const { lat, lng, radiusKm } = config.targetArea;
  const radiusMeters = Math.min(radiusKm * 1000, 40000); // Yelp max 40km

  for (const trade of config.targetTrades) {
    if (leads.length >= config.maxLeadsPerSource) break;

    const searchTerms = TRADE_SEARCH_TERMS[trade] ?? [trade.toLowerCase()];
    const term = searchTerms[0]!; // Primary term only for Yelp

    try {
      const url = new URL('https://api.yelp.com/v3/businesses/search');
      url.searchParams.set('term', term);
      url.searchParams.set('latitude', String(lat));
      url.searchParams.set('longitude', String(lng));
      url.searchParams.set('radius', String(radiusMeters));
      url.searchParams.set('limit', String(Math.min(config.maxLeadsPerSource, 50)));
      url.searchParams.set('sort_by', 'distance');

      log.debug('Yelp API request', { term, lat, lng });

      const resp = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!resp.ok) {
        log.error('Yelp API error', { status: resp.status, term });
        continue;
      }

      const data = (await resp.json()) as {
        businesses: Array<{
          id: string;
          name: string;
          phone: string;
          display_phone: string;
          review_count: number;
          rating: number;
          location: {
            address1: string;
            city: string;
            state: string;
            zip_code: string;
          };
          coordinates: { latitude: number; longitude: number };
          url: string;
          is_claimed?: boolean;
          categories?: Array<{ alias: string; title: string }>;
        }>;
      };

      for (const biz of data.businesses) {
        if (leads.length >= config.maxLeadsPerSource) break;
        if (!biz.phone) continue;

        const soloResult = computeSoloScore({
          name: biz.name,
          reviewCount: biz.review_count,
          hasWebsite: true, // Yelp listings always have a page
        });

        const fullAddress = [
          biz.location.address1,
          biz.location.city,
          biz.location.state,
          biz.location.zip_code,
        ].filter(Boolean).join(', ');

        leads.push({
          name: biz.name,
          phone: normalizePhone(biz.phone),
          email: null,
          trades: [trade],
          location: {
            address: fullAddress,
            lat: biz.coordinates.latitude,
            lng: biz.coordinates.longitude,
          },
          source: 'yelp',
          isSoloOperator: soloResult.isSolo,
          confidence: soloResult.confidence,
          scrapedAt: new Date().toISOString(),
          rawData: {
            yelpId: biz.id,
            rating: biz.rating,
            reviewCount: biz.review_count,
            isClaimed: biz.is_claimed,
            categories: biz.categories?.map((c) => c.title),
            yelpUrl: biz.url,
          },
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error('Yelp scrape failed', { term, error: message });
    }
  }

  log.info('Yelp scrape complete', { total: leads.length });
  return leads;
}

// ---------------------------------------------------------------------------
// Thumbtack scraper (public search page HTML parsing)
// ---------------------------------------------------------------------------

export async function scrapeThumbtack(config: ScrapeConfig): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const { lat, lng } = config.targetArea;

  for (const trade of config.targetTrades) {
    if (leads.length >= config.maxLeadsPerSource) break;

    const searchTerms = TRADE_SEARCH_TERMS[trade] ?? [trade.toLowerCase()];
    const term = searchTerms[0]!;
    const slug = term.replace(/\s+/g, '-').toLowerCase();

    try {
      // Thumbtack public search pages encode location as zip or city
      // We use the lat/lng to approximate a zip-code-based URL
      const url = `https://www.thumbtack.com/k/${slug}/near-me/`;

      log.debug('Thumbtack scrape request', { term, url });

      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      if (!resp.ok) {
        log.error('Thumbtack scrape error', { status: resp.status, term });
        continue;
      }

      const html = await resp.text();

      // Thumbtack embeds structured data as JSON-LD in the page
      const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
      if (!jsonLdMatches) {
        log.debug('No JSON-LD found on Thumbtack page', { term });
        continue;
      }

      for (const match of jsonLdMatches) {
        if (leads.length >= config.maxLeadsPerSource) break;

        try {
          const jsonStr = match
            .replace(/<script type="application\/ld\+json">/, '')
            .replace(/<\/script>/, '');
          const parsed = JSON.parse(jsonStr) as {
            '@type'?: string;
            name?: string;
            telephone?: string;
            email?: string;
            address?: { streetAddress?: string; addressLocality?: string; addressRegion?: string };
            aggregateRating?: { ratingValue?: number; reviewCount?: number };
            description?: string;
          };

          if (parsed['@type'] !== 'LocalBusiness' && parsed['@type'] !== 'Service') continue;
          if (!parsed.name || !parsed.telephone) continue;

          const soloResult = computeSoloScore({
            name: parsed.name,
            reviewCount: parsed.aggregateRating?.reviewCount,
            description: parsed.description,
          });

          const address = parsed.address
            ? [parsed.address.streetAddress, parsed.address.addressLocality, parsed.address.addressRegion]
                .filter(Boolean)
                .join(', ')
            : null;

          leads.push({
            name: parsed.name,
            phone: normalizePhone(parsed.telephone),
            email: parsed.email ?? null,
            trades: [trade],
            location: address ? { address, lat, lng } : null,
            source: 'thumbtack',
            isSoloOperator: soloResult.isSolo,
            confidence: soloResult.confidence,
            scrapedAt: new Date().toISOString(),
            rawData: {
              reviewCount: parsed.aggregateRating?.reviewCount,
              rating: parsed.aggregateRating?.ratingValue,
              description: parsed.description,
            },
          });
        } catch {
          // Malformed JSON-LD block — skip
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error('Thumbtack scrape failed', { term, error: message });
    }
  }

  log.info('Thumbtack scrape complete', { total: leads.length });
  return leads;
}

// ---------------------------------------------------------------------------
// Craigslist scraper (public search pages)
// ---------------------------------------------------------------------------

/** Major Craigslist subdomains mapped from approximate coordinates */
function getCraigslistSubdomain(lat: number, lng: number): string {
  // Simple geo-lookup for major metros — extend as needed
  if (lat > 40.4 && lat < 41.0 && lng > -74.3 && lng < -73.7) return 'newyork';
  if (lat > 33.7 && lat < 34.2 && lng > -118.5 && lng < -117.8) return 'losangeles';
  if (lat > 41.6 && lat < 42.1 && lng > -87.9 && lng < -87.4) return 'chicago';
  if (lat > 29.5 && lat < 30.0 && lng > -95.7 && lng < -95.0) return 'houston';
  if (lat > 25.6 && lat < 26.0 && lng > -80.4 && lng < -80.0) return 'miami';
  if (lat > 33.3 && lat < 33.7 && lng > -112.3 && lng < -111.8) return 'phoenix';
  if (lat > 39.7 && lat < 40.0 && lng > -75.3 && lng < -74.9) return 'philadelphia';
  if (lat > 29.3 && lat < 29.6 && lng > -98.6 && lng < -98.3) return 'sanantonio';
  if (lat > 32.6 && lat < 33.0 && lng > -117.3 && lng < -116.9) return 'sandiego';
  if (lat > 32.6 && lat < 33.0 && lng > -97.0 && lng < -96.5) return 'dallas';
  return 'sfbay'; // Fallback
}

export async function scrapeCraigslist(config: ScrapeConfig): Promise<ScrapedLead[]> {
  const leads: ScrapedLead[] = [];
  const { lat, lng } = config.targetArea;
  const subdomain = getCraigslistSubdomain(lat, lng);

  for (const trade of config.targetTrades) {
    if (leads.length >= config.maxLeadsPerSource) break;

    const searchTerms = TRADE_SEARCH_TERMS[trade] ?? [trade.toLowerCase()];
    const term = searchTerms[0]!;

    try {
      // Craigslist services-offered section
      const url = `https://${subdomain}.craigslist.org/search/bbs?query=${encodeURIComponent(term)}&sort=date`;

      log.debug('Craigslist scrape request', { term, subdomain, url });

      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (!resp.ok) {
        log.error('Craigslist scrape error', { status: resp.status, term, subdomain });
        continue;
      }

      const html = await resp.text();

      // Extract listings — Craigslist uses <li class="cl-static-search-result">
      // Each has a title link and possibly embedded details
      const listingPattern = /<li[^>]*class="[^"]*cl-static-search-result[^"]*"[^>]*>[\s\S]*?<\/li>/g;
      const listings = html.match(listingPattern) ?? [];

      for (const listing of listings) {
        if (leads.length >= config.maxLeadsPerSource) break;

        // Extract title
        const titleMatch = listing.match(/<div class="title"[^>]*>([\s\S]*?)<\/div>/);
        const title = titleMatch ? titleMatch[1]!.replace(/<[^>]*>/g, '').trim() : null;
        if (!title) continue;

        // Extract link for detail page
        const linkMatch = listing.match(/href="([^"]+)"/);
        const detailUrl = linkMatch ? linkMatch[1]! : null;

        // Phone extraction: look for phone patterns in listing text
        const phoneMatch = listing.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
        if (!phoneMatch) {
          // No phone in listing snippet — try detail page if we have a link
          if (detailUrl) {
            const phoneLead = await extractCraigslistDetail(detailUrl, title, trade, lat, lng);
            if (phoneLead) leads.push(phoneLead);
          }
          continue;
        }

        const soloResult = computeSoloScore({
          name: title,
          description: listing.replace(/<[^>]*>/g, ''),
        });

        leads.push({
          name: title,
          phone: normalizePhone(phoneMatch[1]!),
          email: null,
          trades: [trade],
          location: null, // Craigslist doesn't give coords in search results
          source: 'craigslist',
          isSoloOperator: soloResult.isSolo,
          confidence: soloResult.confidence,
          scrapedAt: new Date().toISOString(),
          rawData: {
            title,
            detailUrl,
            subdomain,
          },
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error('Craigslist scrape failed', { term, subdomain, error: message });
    }
  }

  log.info('Craigslist scrape complete', { total: leads.length });
  return leads;
}

async function extractCraigslistDetail(
  detailUrl: string,
  title: string,
  trade: string,
  lat: number,
  lng: number,
): Promise<ScrapedLead | null> {
  try {
    const resp = await fetch(detailUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
      },
    });

    if (!resp.ok) return null;

    const html = await resp.text();

    const phoneMatch = html.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (!phoneMatch) return null;

    const bodyMatch = html.match(/<section id="postingbody">([\s\S]*?)<\/section>/);
    const body = bodyMatch ? bodyMatch[1]!.replace(/<[^>]*>/g, '').trim() : '';

    const emailMatch = body.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);

    const soloResult = computeSoloScore({
      name: title,
      description: body,
    });

    // Try to extract map coordinates from Craigslist detail page
    const latMatch = html.match(/data-latitude="([-\d.]+)"/);
    const lngMatch = html.match(/data-longitude="([-\d.]+)"/);
    const detailLat = latMatch ? parseFloat(latMatch[1]!) : lat;
    const detailLng = lngMatch ? parseFloat(lngMatch[1]!) : lng;

    return {
      name: title,
      phone: normalizePhone(phoneMatch[1]!),
      email: emailMatch ? emailMatch[0]! : null,
      trades: [trade],
      location: { address: '', lat: detailLat, lng: detailLng },
      source: 'craigslist',
      isSoloOperator: soloResult.isSolo,
      confidence: soloResult.confidence,
      scrapedAt: new Date().toISOString(),
      rawData: { title, detailUrl, bodySnippet: body.slice(0, 500) },
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Filtering & deduplication
// ---------------------------------------------------------------------------

/**
 * Filter leads to only solo operators.
 * This is the critical gate — no companies, no franchises.
 */
export function filterSoloOperators(leads: ScrapedLead[]): ScrapedLead[] {
  const filtered = leads.filter((lead) => {
    if (!lead.isSoloOperator) return false;
    if (lead.confidence < 0.4) return false;

    // Hard-reject corporate names
    const nameLower = lead.name.toLowerCase();
    for (const pattern of CORPORATE_INDICATORS) {
      if (new RegExp(pattern, 'i').test(nameLower)) return false;
    }

    return true;
  });

  log.info('Solo operator filter applied', {
    input: leads.length,
    output: filtered.length,
    rejected: leads.length - filtered.length,
  });

  return filtered;
}

/**
 * Deduplicate leads by normalized phone number.
 * When duplicates exist, keep the one with highest confidence.
 */
export function deduplicateLeads(leads: ScrapedLead[]): ScrapedLead[] {
  const byPhone = new Map<string, ScrapedLead>();

  for (const lead of leads) {
    const normalized = normalizePhone(lead.phone);
    const existing = byPhone.get(normalized);

    if (!existing || lead.confidence > existing.confidence) {
      byPhone.set(normalized, lead);
    } else if (existing && lead.confidence === existing.confidence) {
      // Merge trades from both entries
      const mergedTrades = [...new Set([...existing.trades, ...lead.trades])];
      byPhone.set(normalized, { ...existing, trades: mergedTrades });
    }
  }

  const deduped = Array.from(byPhone.values());

  log.info('Leads deduplicated', {
    input: leads.length,
    output: deduped.length,
    duplicatesRemoved: leads.length - deduped.length,
  });

  return deduped;
}

// ---------------------------------------------------------------------------
// Conversion to RecruitmentLead (for cold-calling pipeline)
// ---------------------------------------------------------------------------

/**
 * Convert a scraped lead into a RecruitmentLead for the cold-calling engine.
 * Only call this on leads that passed filterSoloOperators().
 */
export function convertToRecruitmentLead(lead: ScrapedLead): RecruitmentLead {
  // Map trade strings to TradeType enum values
  const tradeMap: Record<string, TradeType> = {
    PLUMBING: 'PLUMBING' as TradeType,
    ELECTRICAL: 'ELECTRICAL' as TradeType,
    HVAC: 'HVAC' as TradeType,
    GENERAL: 'GENERAL' as TradeType,
    CARPENTRY: 'CARPENTRY' as TradeType,
    PAINTING: 'PAINTING' as TradeType,
    LOCKSMITH: 'LOCKSMITH' as TradeType,
    ROOFING: 'ROOFING' as TradeType,
    FLOORING: 'FLOORING' as TradeType,
  };

  const trades = lead.trades
    .map((t) => tradeMap[t.toUpperCase()])
    .filter((t): t is TradeType => t !== undefined);

  // Fallback to GENERAL if no trade matched
  if (trades.length === 0) {
    trades.push('GENERAL' as TradeType);
  }

  const sourceMap: Record<LeadSource['name'], RecruitmentLead['source']> = {
    google_maps: 'directory',
    yelp: 'directory',
    thumbtack: 'directory',
    craigslist: 'web_scrape',
    facebook: 'web_scrape',
  };

  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: lead.name,
    phone: lead.phone,
    trades,
    source: sourceMap[lead.source],
    area: lead.location?.address ?? 'unknown',
    createdAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Master scrape orchestrator
// ---------------------------------------------------------------------------

/**
 * Scrape all enabled sources in parallel, filter for solo operators, deduplicate.
 * This is the main entry point for autonomous lead generation.
 */
export async function scrapeAll(config: ScrapeConfig): Promise<ScrapedLead[]> {
  const session = createScrapeSession(config);
  const enabledSources = config.sources.filter((s) => s.enabled);

  log.info('Starting full scrape run', {
    sessionId: session.id,
    enabledSources: enabledSources.map((s) => s.name),
    trades: config.targetTrades,
  });

  // Build scraper map
  const scraperMap: Record<LeadSource['name'], (c: ScrapeConfig) => Promise<ScrapedLead[]>> = {
    google_maps: scrapeGoogleMaps,
    yelp: scrapeYelp,
    thumbtack: scrapeThumbtack,
    craigslist: scrapeCraigslist,
    facebook: scrapeFacebook,
  };

  // Run all enabled scrapers in parallel
  const results = await Promise.allSettled(
    enabledSources.map(async (source) => {
      const scraper = scraperMap[source.name];
      const leads = await scraper(config);
      return { source: source.name, leads };
    }),
  );

  // Collect results and errors
  const allLeads: ScrapedLead[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allLeads.push(...result.value.leads);
    } else {
      const errorMsg = result.reason instanceof Error ? result.reason.message : String(result.reason);
      session.errors.push({ source: 'google_maps', error: errorMsg }); // Source unknown from rejection
      log.error('Source scraper failed', { error: errorMsg });
    }
  }

  session.totalScraped = allLeads.length;

  // Filter for solo operators only
  const soloLeads = filterSoloOperators(allLeads);
  session.totalSolo = soloLeads.length;

  // Deduplicate by phone number
  const uniqueLeads = deduplicateLeads(soloLeads);
  session.totalDeduplicated = uniqueLeads.length;

  session.leads = uniqueLeads;
  session.completedAt = new Date().toISOString();

  log.info('Full scrape run complete', {
    sessionId: session.id,
    totalScraped: session.totalScraped,
    totalSolo: session.totalSolo,
    totalDeduplicated: session.totalDeduplicated,
    errors: session.errors.length,
    durationMs: new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime(),
  });

  return uniqueLeads;
}

// ---------------------------------------------------------------------------
// Facebook Marketplace (stub — requires auth, complex scraping)
// ---------------------------------------------------------------------------

async function scrapeFacebook(_config: ScrapeConfig): Promise<ScrapedLead[]> {
  // Facebook Marketplace requires authentication and has aggressive bot detection.
  // This is a placeholder for future implementation via:
  //   1. Facebook Graph API (if we get app approval for marketplace access)
  //   2. Browser automation via Playwright (slow, fragile)
  //   3. Third-party data providers (Bright Data, etc.)
  log.warn('Facebook scraper not yet implemented — requires auth strategy');
  return [];
}
