// Robust in-memory rate limiter for API routes using a sliding window log approach
// Resets on cold start (acceptable for serverless/edge environments without Redis)

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs = 3600000, // 1 hour default
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry) {
    rateLimitMap.set(identifier, { timestamps: [now] });
    return { success: true, remaining: limit - 1 };
  }

  // Filter out timestamps older than the window
  entry.timestamps = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);

  if (entry.timestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  // Add the current timestamp
  entry.timestamps.push(now);

  // Clean up old entries from the map to prevent memory leaks over time
  // Do this probabilistically to avoid overhead on every call (e.g. 1% chance)
  if (Math.random() < 0.01) {
    cleanupRateLimitMap(windowMs);
  }

  return { success: true, remaining: limit - entry.timestamps.length };
}

function cleanupRateLimitMap(windowMs: number) {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    entry.timestamps = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
