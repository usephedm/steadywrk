import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Rate limit: 10 submissions per IP per hour
    const ip = getClientIP(request);
    const { success } = rateLimit(`waitlist:${ip}`, 10);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many submissions. Try again later.' },
        { status: 429 },
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          email: normalized,
          created_at: new Date().toISOString(),
        }),
      });

      if (!res.ok && res.status !== 409) {
        console.error('Supabase waitlist insert failed:', res.status);
      }
    }

    // Structured log for Vercel Log Drain
    console.info(
      JSON.stringify({
        event: 'waitlist_signup',
        email: normalized,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
