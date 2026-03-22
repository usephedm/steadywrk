import { db } from '@/lib/db';
import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { salarySubmissions } from '../../../../../../packages/db/src/schema';

const salarySchema = z.object({
  jobTitle: z.string().min(2).max(255),
  country: z.string().min(2).max(100),
  city: z.string().max(100).optional(),
  yearsOfExperience: z.number().min(0).max(50),
  baseSalaryUsd: z.number().min(0),
  equityValueUsd: z.number().min(0).optional(),
  isRemote: z.boolean().default(false),
});

/**
 * Handles anonymous salary data submissions.
 * Unlocks Tier 1 Viral Growth Loop #1: Dynamic Salary Dashboards.
 */
export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { success } = rateLimit(`salary:${ip}`, 3); // Very strict rate limit to prevent data poisoning
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();
    const data = salarySchema.parse(body);

    await db.insert(salarySubmissions).values({
      jobTitle: data.jobTitle,
      country: data.country,
      city: data.city,
      yearsOfExperience: data.yearsOfExperience,
      baseSalaryUsd: data.baseSalaryUsd,
      equityValueUsd: data.equityValueUsd || 0,
      isRemote: data.isRemote,
      verified: false, // All initial submissions are unverified until HR review
    });

    return NextResponse.json(
      {
        success: true,
        message:
          'Salary data submitted anonymously. Thank you for contributing to market transparency.',
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    console.error('Salary submission failed:', err);
    return NextResponse.json({ error: 'Failed to process salary submission' }, { status: 500 });
  }
}
