import { db } from '@/lib/db';
import { salarySubmissions } from '@steadywrk/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Vercel/Railway Cron standard authentication
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [stats] = await db
      .select({
        totalNew: sql<number>`COUNT(*)`,
        avgSalary: sql<number>`AVG(${salarySubmissions.baseSalaryUsd})`,
        maxSalary: sql<number>`MAX(${salarySubmissions.baseSalaryUsd})`,
      })
      .from(salarySubmissions)
      .where(
        and(gte(salarySubmissions.createdAt, sevenDaysAgo), eq(salarySubmissions.verified, false)),
      );

    const totalNew = Number(stats?.totalNew ?? 0);
    const averageSalary = Math.round(Number(stats?.avgSalary ?? 0));
    const maxSalary = Number(stats?.maxSalary ?? 0);

    if (totalNew > 0) {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'weekly_salary_digest',
            data: {
              newSubmissions: totalNew,
              averageSalary,
              maxSalary,
              timestamp: new Date().toISOString(),
            },
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Weekly salary cron executed',
      processed: totalNew,
    });
  } catch (error) {
    console.error('Salary cron failed:', error);
    return NextResponse.json({ error: 'Failed to execute cron' }, { status: 500 });
  }
}
