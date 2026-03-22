import { ROLES } from '@/lib/data';
import { db, schema } from '@/lib/db';
import { verifyScorecardToken } from '@/lib/scorecards';
import {
  type TestApplicantStatus,
  getTestApplicantRecord,
  isTestPipelineMode,
} from '@/lib/test-pipeline-store';
import { asc, eq } from 'drizzle-orm';

const ROLE_LABELS = new Map<string, string>(ROLES.map((role) => [role.slug, role.title]));

const STATUS_ORDER: TestApplicantStatus[] = [
  'applied',
  'screening',
  'assessment',
  'interview',
  'offer',
];

const STATUS_LABELS: Record<TestApplicantStatus, string> = {
  applied: 'Application review',
  screening: 'Initial screening',
  assessment: 'Assessment stage',
  interview: 'Interview stage',
  offer: 'Offer stage',
  rejected: 'Closed',
  withdrawn: 'Withdrawn',
};

const NEXT_STEP_COPY: Record<TestApplicantStatus, string> = {
  applied:
    'Your application is in review. If there is a fit, you will be advanced to screening or assessment.',
  screening: 'Your profile is being screened against the current role requirements and team needs.',
  assessment:
    'You are in the assessment stage. Complete the requested exercises promptly so we can move you forward.',
  interview:
    'You have reached the interview stage. Watch this page for any scheduled interview details.',
  offer:
    'You have reached the offer stage. Training and onboarding details will follow through the hiring team.',
  rejected: 'This application is no longer active.',
  withdrawn: 'You withdrew this application.',
};

function formatRole(roleSlug: string) {
  return ROLE_LABELS.get(roleSlug) ?? roleSlug;
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getStages(status: TestApplicantStatus) {
  return STATUS_ORDER.map((stage, index) => {
    const currentIndex = STATUS_ORDER.indexOf(status);
    const active = currentIndex === index;
    const complete = currentIndex > index;

    return {
      key: stage,
      label: STATUS_LABELS[stage],
      active,
      complete,
    };
  });
}

export async function getApplicantPipelineByToken(token: string) {
  const verified = verifyScorecardToken(token);
  if (!verified) {
    return null;
  }

  if (db) {
    const [applicant] = await db
      .select()
      .from(schema.applicants)
      .where(eq(schema.applicants.id, verified.applicantId))
      .limit(1);

    if (!applicant) {
      return null;
    }

    const [interview] = await db
      .select()
      .from(schema.interviewSlots)
      .where(eq(schema.interviewSlots.applicantId, applicant.id))
      .orderBy(asc(schema.interviewSlots.scheduledAt))
      .limit(1);

    return {
      applicant: {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        role: formatRole(applicant.roleSlug),
        roleSlug: applicant.roleSlug,
        status: applicant.status,
        statusLabel: STATUS_LABELS[applicant.status],
        createdAt: formatDate(applicant.createdAt),
        availability: applicant.availability,
      },
      nextStep: NEXT_STEP_COPY[applicant.status],
      stages: getStages(applicant.status),
      interview: interview
        ? {
            scheduledAt: formatDate(interview.scheduledAt),
            interviewerName: interview.interviewerName,
            meetingUrl: interview.meetingUrl,
            duration: interview.duration,
            notes: interview.notes,
            completed: interview.completed,
          }
        : null,
      mode: 'database' as const,
    };
  }

  if (!isTestPipelineMode()) {
    return null;
  }

  const applicant = getTestApplicantRecord(verified.applicantId);
  if (!applicant) {
    return null;
  }

  return {
    applicant: {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      role: formatRole(applicant.roleSlug),
      roleSlug: applicant.roleSlug,
      status: applicant.status,
      statusLabel: STATUS_LABELS[applicant.status],
      createdAt: formatDate(applicant.createdAt),
      availability: applicant.availability,
    },
    nextStep: NEXT_STEP_COPY[applicant.status],
    stages: getStages(applicant.status),
    interview: applicant.upcomingInterview
      ? {
          scheduledAt: formatDate(applicant.upcomingInterview.scheduledAt),
          interviewerName: applicant.upcomingInterview.interviewerName,
          meetingUrl: applicant.upcomingInterview.meetingUrl,
          duration: applicant.upcomingInterview.duration,
          notes: applicant.upcomingInterview.notes,
          completed: applicant.upcomingInterview.completed,
        }
      : null,
    mode: 'test' as const,
  };
}
