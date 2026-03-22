import { db } from '@/lib/db';
import { salarySubmissions } from '@steadywrk/db/schema';
import { sql } from 'drizzle-orm';
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

    // 1. Calculate aggregate stats for the past week
    const recentSubmissions = await db.execute(sql`
      SELECT 
        COUNT(*) as total_new,
        AVG(base_salary_usd) as avg_salary,
        MAX(base_salary_usd) as max_salary
      FROM ${salarySubmissions}
      WHERE created_at >= NOW() - INTERVAL '7 days'
        AND verified = false
    `);

    const stats = recentSubmissions.rows[0];

    // 2. Trigger webhook to n8n for Slack/Listmonk digest if there's new data
    if (Number(stats.total_new) > 0) {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'weekly_salary_digest',
            data: {
              newSubmissions: Number(stats.total_new),
              averageSalary: Math.round(Number(stats.avg_salary)),
              maxSalary: Number(stats.max_salary),
              timestamp: new Date().toISOString(),
            },
          }),
        });
      }
    }

    // 3. (Optional) Auto-verify bounds or clean up extreme outliers
    // await db.execute(sql`UPDATE ${salarySubmissions} SET verified = true WHERE base_salary_usd BETWEEN 5000 AND 300000`);

    return NextResponse.json({
      success: true,
      message: 'Weekly salary cron executed',
      processed: Number(stats.total_new),
    });
  } catch (error) {
    console.error('Salary cron failed:', error);
    return NextResponse.json({ error: 'Failed to execute cron' }, { status: 500 });
  }
}
