import { db } from '@/lib/db';
import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { applicantVouches, applicants } from '../../../../../../packages/db/src/schema';

const vouchSchema = z.object({
  vouchCode: z.string().min(5),
  applicantEmail: z.string().email(),
});

/**
 * Validates and redeems a vouch code for a new applicant.
 * This unlocks Tier 2 Viral Growth Loop #4: The "Vouch For A Peer" Protocol.
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { success } = rateLimit(`vouch:${ip}`, 5); // strict rate limit to prevent brute forcing
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const data = vouchSchema.parse(body);

    // 1. Verify the code exists and hasn't been claimed yet
    const vouchRecords = await db
      .select()
      .from(applicantVouches)
      .where(eq(applicantVouches.vouchCode, data.vouchCode));

    if (vouchRecords.length === 0) {
      return NextResponse.json({ error: 'Invalid vouch code' }, { status: 400 });
    }

    const vouch = vouchRecords[0];

    if (vouch.claimedAt !== null) {
      return NextResponse.json({ error: 'Vouch code has already been claimed' }, { status: 400 });
    }

    // 2. Verify the email matches the intended recipient (anti-abuse)
    if (vouch.vouchedEmail.toLowerCase() !== data.applicantEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'This vouch code was issued to a different email address' },
        { status: 403 },
      );
    }

    // 3. Look up the referring applicant to ensure they actually passed vetting
    const referrers = await db
      .select({ status: applicants.status })
      .from(applicants)
      .where(eq(applicants.id, vouch.referrerApplicantId));

    if (
      referrers.length === 0 ||
      referrers[0].status === 'rejected' ||
      referrers[0].status === 'withdrawn'
    ) {
      return NextResponse.json(
        { error: 'The referring applicant is not in a valid state to issue vouches.' },
        { status: 403 },
      );
    }

    // 4. Mark code as claimed
    await db
      .update(applicantVouches)
      .set({ claimedAt: new Date() })
      .where(eq(applicantVouches.vouchCode, data.vouchCode));

    return NextResponse.json(
      {
        success: true,
        message: 'Vouch code redeemed. You will bypass Stage 1 vetting.',
      },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    console.error('Vouch redemption failed:', err);
    return NextResponse.json({ error: 'Failed to process vouch code' }, { status: 500 });
  }
}
