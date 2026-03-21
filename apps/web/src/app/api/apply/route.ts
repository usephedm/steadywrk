import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { validateApplyPayload } from '@/lib/schemas';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request);
    const { success } = rateLimit(`apply:${ip}`, 5);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many submissions. Try again later.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const data = validateApplyPayload(body);

    // Log application for processing
    // When DATABASE_URL is configured, this will insert into Neon via Drizzle
    console.info(
      JSON.stringify({
        event: 'application_submitted',
        name: data.name,
        email: data.email,
        position: data.position,
        team: data.team,
        timestamp: new Date().toISOString(),
      }),
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
