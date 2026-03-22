import { isSpamTrapTriggered, jsonResponse, parseJsonBody } from '@/lib/api-guard';
import { db } from '@/lib/db';
import { rateLimitRequest } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { applicantVouches, applicants } from '../../../../../../packages/db/src/schema';

const vouchSchema = z.object({
  vouchCode: z.string().trim().min(5).max(50),
  applicantEmail: z.string().trim().email().max(255),
});

export async function POST(request: Request) {
  const requestLimit = await rateLimitRequest(request, 'vouch', 5, 60 * 60 * 1000);
  if (!requestLimit.success) {
    return jsonResponse({ error: 'Too many requests' }, { status: 429 }, requestLimit);
  }

  try {
    const parsed = await parseJsonBody(request, { maxBytes: 4 * 1024 });
    if (!parsed.ok) {
      return parsed.response;
    }

    if (isSpamTrapTriggered(parsed.body)) {
      return jsonResponse({ success: true }, { status: 202 }, requestLimit);
    }

    if (!db) {
      return jsonResponse({ error: 'Database not configured' }, { status: 503 }, requestLimit);
    }

    const data = vouchSchema.parse(parsed.body);

    const vouchRecords = await db
      .select()
      .from(applicantVouches)
      .where(eq(applicantVouches.vouchCode, data.vouchCode));

    if (vouchRecords.length === 0) {
      return jsonResponse({ error: 'Invalid vouch code' }, { status: 400 }, requestLimit);
    }

    const vouch = vouchRecords[0];
    if (!vouch) {
      return jsonResponse({ error: 'Invalid vouch code' }, { status: 400 }, requestLimit);
    }

    if (vouch.claimedAt !== null) {
      return jsonResponse(
        { error: 'Vouch code has already been claimed' },
        { status: 400 },
        requestLimit,
      );
    }

    if (vouch.vouchedEmail.toLowerCase() !== data.applicantEmail.toLowerCase()) {
      return jsonResponse(
        { error: 'This vouch code was issued to a different email address' },
        { status: 403 },
        requestLimit,
      );
    }

    const referrers = await db
      .select({ status: applicants.status })
      .from(applicants)
      .where(eq(applicants.id, vouch.referrerApplicantId));

    if (
      referrers.length === 0 ||
      referrers[0]?.status === 'rejected' ||
      referrers[0]?.status === 'withdrawn'
    ) {
      return jsonResponse(
        { error: 'The referring applicant is not in a valid state to issue vouches.' },
        { status: 403 },
        requestLimit,
      );
    }

    await db
      .update(applicantVouches)
      .set({ claimedAt: new Date() })
      .where(eq(applicantVouches.vouchCode, data.vouchCode));

    return jsonResponse(
      {
        success: true,
        message: 'Vouch code redeemed. You will bypass Stage 1 vetting.',
      },
      { status: 200 },
      requestLimit,
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return jsonResponse({ error: err.errors[0]?.message }, { status: 400 }, requestLimit);
    }

    console.error('Vouch redemption failed:', err);
    return jsonResponse({ error: 'Failed to process vouch code' }, { status: 500 }, requestLimit);
  }
}
