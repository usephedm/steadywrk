import { db } from '@/lib/db';
import { jobListings } from '../../../../../../packages/db/src/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const jobs = await db
      .select()
      .from(jobListings)
      .where(eq(jobListings.status, 'open'))
      .orderBy(desc(jobListings.featured), desc(jobListings.createdAt));

    return NextResponse.json(jobs);
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    return NextResponse.json({ error: 'Failed to fetch job listings' }, { status: 500 });
  }
}
