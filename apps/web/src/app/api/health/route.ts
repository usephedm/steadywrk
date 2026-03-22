import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Perform a lightweight query to ensure DB connectivity
    if (db) {
      await db.execute(sql`SELECT 1`);
    }

    return NextResponse.json(
      {
        status: 'ok',
        database: db ? 'connected' : 'unconfigured',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503, // Service Unavailable
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }
}
