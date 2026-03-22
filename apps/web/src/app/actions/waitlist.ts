'use server';

import { db } from '@/lib/db';
import { waitlist } from '../../../../../packages/db/src/schema';
import { z } from 'zod';

const waitlistSchema = z.object({
  email: z.string().email('Invalid email'),
});

export type WaitlistResult = { success: true } | { success: false; error: string };

export async function submitWaitlist(
  formData: z.infer<typeof waitlistSchema>,
): Promise<WaitlistResult> {
  try {
    const data = waitlistSchema.parse(formData);

    if (!db) {
      return { success: false, error: 'Database not configured' };
    }

    await db.insert(waitlist).values({
      email: data.email.trim().toLowerCase(),
    });

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0]?.message ?? 'Validation failed' };
    }
    return { success: false, error: 'Something went wrong' };
  }
}
