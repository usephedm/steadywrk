import type { RateLimitResult } from '@/lib/rate-limit';
import { createRateLimitHeaders } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

const DEFAULT_MAX_JSON_BYTES = 32 * 1024;
const DEFAULT_HONEYPOT_FIELDS = [
  'website',
  'companyWebsite',
  'faxNumber',
  'middleName',
  'nickname',
  'addressLine2',
] as const;

function buildHeaders(init?: ResponseInit, rateLimit?: RateLimitResult) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'same-origin');

  if (rateLimit) {
    const rateLimitHeaders = createRateLimitHeaders(rateLimit);
    rateLimitHeaders.forEach((value, key) => headers.set(key, value));
  }

  return headers;
}

export function jsonResponse(body: unknown, init?: ResponseInit, rateLimit?: RateLimitResult) {
  return NextResponse.json(body, {
    ...init,
    headers: buildHeaders(init, rateLimit),
  });
}

export async function parseJsonBody(
  request: Request,
  { maxBytes = DEFAULT_MAX_JSON_BYTES }: { maxBytes?: number } = {},
) {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return {
      ok: false as const,
      response: jsonResponse({ error: 'Content-Type must be application/json.' }, { status: 415 }),
    };
  }

  const raw = await request.text();
  if (!raw.trim()) {
    return {
      ok: false as const,
      response: jsonResponse({ error: 'Request body is required.' }, { status: 400 }),
    };
  }

  if (Buffer.byteLength(raw, 'utf8') > maxBytes) {
    return {
      ok: false as const,
      response: jsonResponse({ error: 'Request body is too large.' }, { status: 413 }),
    };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        ok: false as const,
        response: jsonResponse({ error: 'JSON body must be an object.' }, { status: 400 }),
      };
    }

    return {
      ok: true as const,
      body: parsed as Record<string, unknown>,
    };
  } catch {
    return {
      ok: false as const,
      response: jsonResponse({ error: 'Invalid JSON body.' }, { status: 400 }),
    };
  }
}

export function isSpamTrapTriggered(
  body: Record<string, unknown>,
  fields: readonly string[] = DEFAULT_HONEYPOT_FIELDS,
) {
  return fields.some((field) => {
    const value = body[field];
    return typeof value === 'string' && value.trim().length > 0;
  });
}
