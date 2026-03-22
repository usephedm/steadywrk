import { isSpamTrapTriggered, jsonResponse, parseJsonBody } from '@/lib/api-guard';
import { COMPANY } from '@/lib/constants';
import { db } from '@/lib/db';
import { rateLimitRequest } from '@/lib/rate-limit';
import { validateContactPayload } from '@/lib/schemas';
import { Resend } from 'resend';
import { contacts } from '../../../../../../packages/db/src/schema';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  const requestLimit = await rateLimitRequest(request, 'contact', 5, 60 * 60 * 1000);
  if (!requestLimit.success) {
    return jsonResponse(
      { error: 'Too many submissions. Try again later.' },
      { status: 429 },
      requestLimit,
    );
  }

  try {
    const parsed = await parseJsonBody(request, { maxBytes: 16 * 1024 });
    if (!parsed.ok) {
      return parsed.response;
    }

    if (isSpamTrapTriggered(parsed.body)) {
      return jsonResponse({ success: true }, { status: 202 }, requestLimit);
    }

    const data = validateContactPayload(parsed.body);

    if (!db) {
      return jsonResponse({ error: 'Database not configured' }, { status: 500 }, requestLimit);
    }

    const [contact] = await db
      .insert(contacts)
      .values({
        name: data.name,
        email: data.email,
        company: data.company || null,
        subject: data.subject,
        message: data.message,
      })
      .returning({ id: contacts.id });

    if (resend) {
      await resend.emails
        .send({
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
        })
        .catch((err) => {
          console.error('Contact email send failed:', err);
        });
    }

    console.info(
      JSON.stringify({
        event: 'inquiry_submitted',
        company: data.company,
        subject: data.subject,
        contactId: contact.id,
        timestamp: new Date().toISOString(),
      }),
    );

    return jsonResponse({ success: true }, { status: 201 }, requestLimit);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return jsonResponse({ error: message }, { status: 400 }, requestLimit);
  }
}
