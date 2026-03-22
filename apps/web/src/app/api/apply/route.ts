import { db } from '@/lib/db';
import { ApplicationConfirmation } from '@/lib/email/application-confirmation';
import { HRNotification } from '@/lib/email/hr-notification';
import { getClientIP, rateLimit } from '@/lib/rate-limit';
import { validateApplyPayload } from '@/lib/schemas';
import { createScorecardToken } from '@/lib/scorecards';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { applicants, emailEvents } from '../../../../../../packages/db/src/schema';

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
          pdplConsent: data.pdplConsent,
        })
        .returning({ id: applicants.id });
      applicantId = result?.id;
    } catch (dbError) {
      console.error('Database insert failed:', dbError);

      const message = dbError instanceof Error ? dbError.message : String(dbError);
      const isDuplicateApplication =
        message.includes('applicant_email_role_idx') ||
        message.includes('duplicate key value') ||
        message.includes('unique constraint');

      if (isDuplicateApplication) {
        return NextResponse.json(
          {
            error:
              'You already applied to this role with this email. We will review your existing application.',
          },
          { status: 409 },
        );
      }

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
    const eventDb = db;
    if (resend && eventDb && applicantId) {
      const candidateSubject = `Application received — ${data.position}`;
      const hrSubject = `New application: ${data.name} — ${data.position}`;
      const emailJobs = [
        {
          type: 'status_update' as const,
          subject: candidateSubject,
          send: () =>
            resend.emails.send({
              from: 'STEADYWRK <noreply@steadywrk.app>',
              to: data.email,
              subject: candidateSubject,
              react: ApplicationConfirmation({ name: data.name, role: data.position }),
            }),
          metadata: {
            recipient: data.email,
            channel: 'candidate_confirmation',
          },
        },
      ];

      const hrEmail = process.env.HR_EMAIL;
      if (hrEmail) {
        emailJobs.push({
          type: 'status_update' as const,
          subject: hrSubject,
          send: () =>
            resend.emails.send({
              from: 'STEADYWRK Hiring <hiring@steadywrk.app>',
              to: hrEmail,
              subject: hrSubject,
              react: HRNotification({
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.position,
                team: data.team,
              }),
            }),
          metadata: {
            recipient: hrEmail,
            channel: 'hr_notification',
          },
        });
      }

      Promise.allSettled(emailJobs.map((job) => job.send())).then(async (results) => {
        for (const [index, result] of results.entries()) {
          const job = emailJobs[index];
          if (!job) continue;

          if (result.status === 'fulfilled') {
            try {
              await eventDb.insert(emailEvents).values({
                applicantId,
                type: job.type,
                subject: job.subject,
                resendMessageId: result.value.data?.id ?? null,
                metadata: job.metadata,
              });
            } catch (eventError) {
              console.error('Email event insert failed:', eventError);
            }
          } else {
            console.error('Email send failed:', result.reason);
          }
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        applicantId,
        scorecardToken: applicantId ? createScorecardToken(applicantId) : null,
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
