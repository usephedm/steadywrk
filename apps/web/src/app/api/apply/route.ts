import { db } from '@/lib/db';
import { ApplicationConfirmation } from '@/lib/email/application-confirmation';
import { HRNotification } from '@/lib/email/hr-notification';
import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { validateApplyPayload } from '@/lib/schemas';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { applicants } from '../../../../../../packages/db/src/schema';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    // Validate required fields early
    if (!body.email || !body.name || !body.position) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and position are required.' },
        { status: 400 },
      );
    }

    const data = validateApplyPayload(body);

    // Insert into database
    let applicantId: string | undefined;
    try {
      if (!db) throw new Error('Database not configured');
      const [result] = await db
        .insert(applicants)
        .values({
          email: data.email,
          name: data.name,
          phone: data.phone || null,
          roleSlug: data.position,
          teamInterest: data.team || null,
          portfolioUrl: data.portfolioUrl || null,
          githubUrl: data.githubUrl || null,
          answers: data.answers || { q1: '', q2: '', q3: '' },
          skills: data.skills || {},
          availability: data.availability || null,
          challengeResponse: data.challengeResponse || null,
          pdplConsent: true,
        })
        .returning({ id: applicants.id });
      applicantId = result?.id;
    } catch (dbError) {
      console.error('Database insert failed:', dbError);
      // Database insertion is critical — fail the request
      return NextResponse.json(
        { error: 'Failed to save application. Please try again later.' },
        { status: 500 },
      );
    }

    console.info(
      JSON.stringify({
        event: 'application_submitted',
        applicantId,
        name: data.name,
        email: data.email,
        position: data.position,
        team: data.team,
        timestamp: new Date().toISOString(),
      }),
    );

    // Send emails (non-blocking — don't fail the application if email fails)
    if (resend) {
      const emailPromises: Promise<unknown>[] = [];

      // Confirmation email to candidate
      emailPromises.push(
        resend.emails.send({
          from: 'STEADYWRK <noreply@steadywrk.app>',
          to: data.email,
          subject: `Application received — ${data.position}`,
          react: ApplicationConfirmation({ name: data.name, role: data.position }),
        }),
      );

      // HR notification email
      const hrEmail = process.env.HR_EMAIL;
      if (hrEmail) {
        emailPromises.push(
          resend.emails.send({
            from: 'STEADYWRK Hiring <hiring@steadywrk.app>',
            to: hrEmail,
            subject: `New application: ${data.name} — ${data.position}`,
            react: HRNotification({
              name: data.name,
              email: data.email,
              phone: data.phone,
              role: data.position,
              team: data.team,
            }),
          }),
        );
      }

      // Fire and forget — log errors but don't fail the response
      Promise.allSettled(emailPromises).then((results) => {
        for (const result of results) {
          if (result.status === 'rejected') {
            console.error('Email send failed:', result.reason);
          }
        }
      });
    }

    return NextResponse.json({ success: true, applicantId }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
