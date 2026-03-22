import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_VERSION = 'v1';
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.SCORECARD_SECRET || null;
}

function sign(payload: string) {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createScorecardToken(
  applicantId: string,
  issuedAt = Math.floor(Date.now() / 1000),
) {
  const payload = `${TOKEN_VERSION}.${applicantId}.${issuedAt}`;
  const signature = sign(payload);
  if (!signature) return null;
  return `${payload}.${signature}`;
}

export function verifyScorecardToken(token: string, maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS) {
  const parts = token.split('.');
  if (parts.length !== 4) return null;

  const [version, applicantId, issuedAtRaw, providedSignature] = parts;
  if (!version || !applicantId || !issuedAtRaw || !providedSignature) return null;
  if (version !== TOKEN_VERSION) return null;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (issuedAt > now || now - issuedAt > maxAgeSeconds) return null;

  const payload = `${version}.${applicantId}.${issuedAtRaw}`;
  const expectedSignature = sign(payload);
  if (!expectedSignature) return null;

  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  return { applicantId, issuedAt };
}
