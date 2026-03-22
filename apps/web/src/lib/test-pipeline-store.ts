import { randomUUID } from 'node:crypto';

export type TestApplicantStatus =
  | 'applied'
  | 'screening'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface TestApplicantRecord {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  roleSlug: string;
  teamInterest: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  availability: string | null;
  challengeResponse: string | null;
  status: TestApplicantStatus;
  score: number | null;
  answers: {
    q1: string;
    q2: string;
    q3: string;
  };
  skills: Record<string, number>;
  pdplConsent: boolean;
  createdAt: string;
  updatedAt: string;
  upcomingInterview: {
    scheduledAt: string;
    duration: number;
    interviewerName: string | null;
    meetingUrl: string | null;
    notes: string | null;
    completed: boolean;
  } | null;
}

declare global {
  var __steadywrkTestApplicants: Map<string, TestApplicantRecord> | undefined;
}

function getStore() {
  if (!globalThis.__steadywrkTestApplicants) {
    globalThis.__steadywrkTestApplicants = new Map<string, TestApplicantRecord>();
  }

  return globalThis.__steadywrkTestApplicants;
}

export function isTestPipelineMode() {
  return process.env.PLAYWRIGHT_BYPASS_AUTH === '1';
}

export function findTestApplicantByEmailRole(email: string, roleSlug: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    Array.from(getStore().values()).find(
      (applicant) =>
        applicant.email.trim().toLowerCase() === normalizedEmail && applicant.roleSlug === roleSlug,
    ) ?? null
  );
}

export function createTestApplicantRecord(input: {
  email: string;
  name: string;
  phone?: string | null;
  roleSlug: string;
  teamInterest?: string | null;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  availability?: string | null;
  challengeResponse?: string | null;
  status?: TestApplicantStatus;
  score?: number | null;
  answers?: { q1: string; q2: string; q3: string };
  skills?: Record<string, number>;
  pdplConsent?: boolean;
}) {
  const now = new Date().toISOString();
  const record: TestApplicantRecord = {
    id: randomUUID(),
    email: input.email,
    name: input.name,
    phone: input.phone ?? null,
    roleSlug: input.roleSlug,
    teamInterest: input.teamInterest ?? null,
    portfolioUrl: input.portfolioUrl ?? null,
    githubUrl: input.githubUrl ?? null,
    availability: input.availability ?? null,
    challengeResponse: input.challengeResponse ?? null,
    status: input.status ?? 'applied',
    score: input.score ?? null,
    answers: input.answers ?? { q1: '', q2: '', q3: '' },
    skills: input.skills ?? {},
    pdplConsent: input.pdplConsent ?? false,
    createdAt: now,
    updatedAt: now,
    upcomingInterview: null,
  };

  getStore().set(record.id, record);
  return record;
}

export function getTestApplicantRecord(applicantId: string) {
  return getStore().get(applicantId) ?? null;
}
