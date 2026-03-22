interface RateLimitEntry {
  timestamps: number[];
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
  resetAt: number;
  retryAfterSeconds: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const IP_HEADER_CANDIDATES = [
  'cf-connecting-ip',
  'x-vercel-forwarded-for',
  'x-forwarded-for',
  'x-real-ip',
  'fly-client-ip',
] as const;

function pruneTimestamps(timestamps: number[], now: number, windowMs: number) {
  return timestamps.filter((timestamp) => now - timestamp < windowMs);
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs = 60 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);
  const timestamps = pruneTimestamps(existing?.timestamps ?? [], now, windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0] ?? now;
    const resetAt = oldest + windowMs;
    return {
      success: false,
      remaining: 0,
      limit,
      resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  }

  timestamps.push(now);
  rateLimitMap.set(identifier, { timestamps });

  if (Math.random() < 0.01) {
    cleanupRateLimitMap(windowMs);
  }

  return {
    success: true,
    remaining: Math.max(0, limit - timestamps.length),
    limit,
    resetAt: now + windowMs,
    retryAfterSeconds: 0,
  };
}

export function cleanupRateLimitMap(windowMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    const timestamps = pruneTimestamps(entry.timestamps, now, windowMs);
    if (timestamps.length === 0) {
      rateLimitMap.delete(key);
      continue;
    }

    rateLimitMap.set(key, { timestamps });
  }
}

export function createRateLimitHeaders(result: RateLimitResult) {
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', String(result.limit));
  headers.set('X-RateLimit-Remaining', String(result.remaining));
  headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

  if (!result.success) {
    headers.set('Retry-After', String(result.retryAfterSeconds));
  }

  return headers;
}

export function getClientIP(request: Request): string {
  for (const header of IP_HEADER_CANDIDATES) {
    const value = request.headers.get(header);
    if (!value) continue;

    const candidate = value.split(',')[0]?.trim();
    if (candidate) return candidate;
  }

  return 'unknown';
}

export function getClientFingerprint(request: Request, scope: string) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent')?.slice(0, 120) ?? 'unknown';
  const acceptLanguage =
    request.headers.get('accept-language')?.split(',')[0]?.slice(0, 32) ?? 'unknown';

  return `${scope}:${ip}:${userAgent}:${acceptLanguage}`;
}
