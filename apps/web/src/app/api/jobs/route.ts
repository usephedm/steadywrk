import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { jobListings } from '../../../../../../packages/db/src/schema';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 },
      );
    }

    const jobs = await db
      .select()
      .from(jobListings)
      .where(eq(jobListings.status, 'open'));

    return NextResponse.json(jobs);
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    return NextResponse.json(
      { error: 'Failed to fetch job listings' },
      { status: 500 },
    );
  }
}
