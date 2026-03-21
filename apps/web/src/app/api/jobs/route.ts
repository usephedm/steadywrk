import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 },
      );
    }

    const jobs = await sql`
      SELECT * FROM job_listings WHERE status = 'open' ORDER BY featured DESC, created_at DESC
    `;

    return NextResponse.json(jobs);
  } catch (err) {
    console.error('Failed to fetch jobs:', err);
    return NextResponse.json(
      { error: 'Failed to fetch job listings' },
      { status: 500 },
    );
  }
}
