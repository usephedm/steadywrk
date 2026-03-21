import { COMPANY } from '@/lib/constants';
import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { validateContactPayload } from '@/lib/schemas';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    // Send contact inquiry via email
    if (resend) {
      await resend.emails.send({
        from: `STEADYWRK <${COMPANY.emails.noreply}>`,
        to: COMPANY.emails.public,
        subject: `Contact inquiry: ${data.subject}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Company: ${data.company}`,
          `Subject: ${data.subject}`,
          '',
          data.message,
        ].join('\n'),
      }).catch((err) => {
        console.error('Contact email send failed:', err);
      });
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
