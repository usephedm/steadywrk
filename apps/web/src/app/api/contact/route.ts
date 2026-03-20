import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { validateContactPayload } from '@/lib/schemas';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Rate limit: 5 submissions per IP per hour
    const ip = getClientIP(request);
    const { success } = rateLimit(`contact:${ip}`, 5);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many submissions. Try again later.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const data = validateContactPayload(body);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          company: data.company,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          created_at: new Date().toISOString(),
        }),
      });

      if (!res.ok && res.status !== 409) {
        console.error('Supabase inquiry insert failed:', res.status);
      }
    }

    // Structured log for Vercel Log Drain
    console.info(
      JSON.stringify({
        event: 'inquiry_submitted',
        company: data.company,
        name: data.name,
        email: data.email,
        subject: data.subject,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
