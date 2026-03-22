import HiringBoard, {
  type HiringCandidate,
  type HiringCandidateStatus,
} from '@/components/dashboard/hiring-board';
import { ROLES } from '@/lib/data';
import { db, schema } from '@/lib/db';
import { desc } from 'drizzle-orm';

const ROLE_LABELS = new Map<string, string>(ROLES.map((role) => [role.slug, role.title]));

function humanizeSlug(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatRole(roleSlug: string) {
  return ROLE_LABELS.get(roleSlug) ?? humanizeSlug(roleSlug);
}

function formatAppliedDate(value: Date | string | null | undefined) {
  if (!value) return 'Unknown';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function normalizeAnswers(raw: unknown) {
  const answers = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    q1: typeof answers.q1 === 'string' ? answers.q1 : '',
    q2: typeof answers.q2 === 'string' ? answers.q2 : '',
    q3: typeof answers.q3 === 'string' ? answers.q3 : '',
  };
}

function normalizeSkills(raw: unknown): HiringCandidate['skills'] {
  if (!raw || typeof raw !== 'object') return [];

  return Object.entries(raw as Record<string, unknown>)
    .map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : Number(value ?? 0),
    }))
    .filter((skill) => skill.name.trim().length > 0 && Number.isFinite(skill.value))
    .sort((left, right) => right.value - left.value);
}

function normalizeStatus(value: string | null | undefined): HiringCandidateStatus {
  switch (value) {
    case 'applied':
    case 'screening':
    case 'assessment':
    case 'interview':
    case 'offer':
    case 'rejected':
    case 'withdrawn':
      return value;
    default:
      return 'applied';
  }
}

function toCandidate(row: typeof schema.applicants.$inferSelect): HiringCandidate {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    role: formatRole(row.roleSlug),
    roleSlug: row.roleSlug,
    teamInterest: row.teamInterest ?? null,
    status: normalizeStatus(row.status),
    appliedDate: formatAppliedDate(row.createdAt),
    score: row.score ?? null,
    availability: row.availability ?? null,
    portfolioUrl: row.portfolioUrl ?? null,
    githubUrl: row.githubUrl ?? null,
    linkedinUrl: row.linkedinUrl ?? null,
    cvUrl: row.cvUrl ?? null,
    challengeResponse: row.challengeResponse ?? null,
    reviewerNotes: row.reviewerNotes ?? null,
    pdplConsent: row.pdplConsent,
    answers: normalizeAnswers(row.answers),
    skills: normalizeSkills(row.skills),
  };
}

export default async function HiringPage() {
  const candidates = !db
    ? []
    : await db
        .select()
        .from(schema.applicants)
        .orderBy(desc(schema.applicants.createdAt))
        .limit(200)
        .then((rows) => rows.map(toCandidate));

  return <HiringBoard candidates={candidates} />;
}
