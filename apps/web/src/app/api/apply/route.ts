import { isSpamTrapTriggered, jsonResponse, parseJsonBody } from '@/lib/api-guard';
import { db } from '@/lib/db';
import { ApplicationConfirmation } from '@/lib/email/application-confirmation';
import { HRNotification } from '@/lib/email/hr-notification';
import { getClientFingerprint, rateLimit } from '@/lib/rate-limit';
import { validateApplyPayload } from '@/lib/schemas';
import { createScorecardToken } from '@/lib/scorecards';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import {
  applicantVouches,
  applicants,
  emailEvents,
} from '../../../../../../packages/db/src/schema';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  const requestLimit = rateLimit(getClientFingerprint(request, 'apply'), 5, 60 * 60 * 1000);
  if (!requestLimit.success) {
    return jsonResponse(
      { error: 'Too many submissions. Try again later.' },
      { status: 429 },
      requestLimit,
    );
  }

  try {
    const parsed = await parseJsonBody(request, { maxBytes: 48 * 1024 });
    if (!parsed.ok) {
      return parsed.response;
    }

    if (isSpamTrapTriggered(parsed.body)) {
      return jsonResponse({ success: true }, { status: 202 }, requestLimit);
    }

    const body = parsed.body;

    if (!body.email || !body.name || !body.position) {
      return jsonResponse(
        { error: 'Missing required fields: email, name, and position are required.' },
        { status: 400 },
        requestLimit,
      );
    }

    const data = validateApplyPayload(body);

    let initialStatus: 'applied' | 'assessment' = 'applied';

    if (db && data.vouchCode) {
      try {
        const vouchRecords = await db
          .select()
          .from(applicantVouches)
          .where(eq(applicantVouches.vouchCode, data.vouchCode));

        if (
          vouchRecords.length > 0 &&
          vouchRecords[0]?.claimedAt === null &&
          vouchRecords[0]?.vouchedEmail.toLowerCase() === data.email.toLowerCase()
        ) {
          initialStatus = 'assessment';
        }
      } catch (err) {
        console.error('Failed to validate vouch code during application:', err);
      }
    }

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
          status: initialStatus,
          portfolioUrl: data.portfolioUrl || null,
          githubUrl: data.githubUrl || null,
          answers: data.answers,
          skills: data.skills,
          availability: data.availability || null,
          challengeResponse: data.challengeResponse || null,
          pdplConsent: data.pdplConsent,
        })
        .returning({ id: applicants.id });

      applicantId = result?.id;

      if (initialStatus === 'assessment' && data.vouchCode && applicantId) {
        await db
          .update(applicantVouches)
          .set({ claimedAt: new Date() })
          .where(eq(applicantVouches.vouchCode, data.vouchCode));
      }
    } catch (dbError) {
      console.error('Database insert failed:', dbError);

      const message = dbError instanceof Error ? dbError.message : String(dbError);
      const isDuplicateApplication =
        message.includes('applicant_email_role_idx') ||
        message.includes('duplicate key value') ||
        message.includes('unique constraint');

      if (isDuplicateApplication) {
        return jsonResponse(
          {
            error:
              'You already applied to this role with this email. We will review your existing application.',
          },
          { status: 409 },
          requestLimit,
        );
      }

      return jsonResponse(
        { error: 'Failed to save application. Please try again later.' },
        { status: 500 },
        requestLimit,
      );
    }

    console.info(
      JSON.stringify({
        event: 'application_submitted',
        applicantId,
        position: data.position,
        team: data.team,
        timestamp: new Date().toISOString(),
      }),
    );

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

    return jsonResponse(
      {
        success: true,
        applicantId,
        scorecardToken: applicantId ? createScorecardToken(applicantId) : null,
      },
      { status: 201 },
      requestLimit,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return jsonResponse({ error: message }, { status: 400 }, requestLimit);
  }
}
