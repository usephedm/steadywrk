'use server';

import { randomBytes } from 'node:crypto';
import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';
import { db } from '@/lib/db';
import { and, desc, eq, isNotNull, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { applicantVouches, applicants } from '../../../../../packages/db/src/schema';

function createVouchCode() {
  return `VOUCH-${randomBytes(3).toString('hex').toUpperCase()}`;
}

export async function getReferralStats() {
  const { employee } = await requireDashboardEmployee();

  if (!db) {
    return {
      totalReferrals: 0,
      successfulHires: 0,
      bountyEarned: 0,
      vouchCode: null,
    };
  }

  const [referrer] = await db
    .select({ id: applicants.id })
    .from(applicants)
    .where(eq(applicants.email, employee.email))
    .limit(1);

  if (!referrer) {
    return {
      totalReferrals: 0,
      successfulHires: 0,
      bountyEarned: 0,
      vouchCode: null,
    };
  }

  const totalRows = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(applicantVouches)
    .where(eq(applicantVouches.referrerApplicantId, referrer.id));

  const successfulRows = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(applicantVouches)
    .innerJoin(applicants, eq(applicants.email, applicantVouches.vouchedEmail))
    .where(
      and(eq(applicantVouches.referrerApplicantId, referrer.id), eq(applicants.status, 'offer')),
    );

  const [latestVouch] = await db
    .select({ vouchCode: applicantVouches.vouchCode })
    .from(applicantVouches)
    .where(eq(applicantVouches.referrerApplicantId, referrer.id))
    .orderBy(desc(applicantVouches.createdAt))
    .limit(1);

  const totalReferrals = Number(totalRows[0]?.count ?? 0);
  const successfulHires = Number(successfulRows[0]?.count ?? 0);

  return {
    totalReferrals,
    successfulHires,
    bountyEarned: successfulHires * 500,
    vouchCode: latestVouch?.vouchCode ?? null,
  };
}

export async function generateReferralVouch(vouchedEmail: string) {
  const { employee } = await requireDashboardEmployee();

  if (!db) {
    return { success: false as const, error: 'Database not configured' };
  }

  const normalizedEmail = vouchedEmail.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false as const, error: 'A valid referral email is required.' };
  }

  const [referrer] = await db
    .select({ id: applicants.id })
    .from(applicants)
    .where(eq(applicants.email, employee.email))
    .limit(1);

  if (!referrer) {
    return {
      success: false as const,
      error: 'You need an applicant profile before generating vouch links.',
    };
  }

  const [existing] = await db
    .select({ vouchCode: applicantVouches.vouchCode })
    .from(applicantVouches)
    .where(
      and(
        eq(applicantVouches.referrerApplicantId, referrer.id),
        eq(applicantVouches.vouchedEmail, normalizedEmail),
      ),
    )
    .limit(1);

  if (existing) {
    return { success: true as const, vouchCode: existing.vouchCode };
  }

  const vouchCode = createVouchCode();

  try {
    await db.insert(applicantVouches).values({
      referrerApplicantId: referrer.id,
      vouchedEmail: normalizedEmail,
      vouchCode,
    });

    revalidatePath('/dashboard/referrals');
    return { success: true as const, vouchCode };
  } catch (error) {
    console.error('Failed to generate vouch:', error);
    return { success: false as const, error: 'Failed to generate vouch link.' };
  }
}

export async function getAssessment() {
  const { employee } = await requireDashboardEmployee();

  if (!db) {
    return {
      applicantId: null,
      score: 0,
      role: 'Applicant',
      percentile: 'No score yet',
    };
  }

  const [applicant] = await db
    .select({
      id: applicants.id,
      score: applicants.score,
      roleSlug: applicants.roleSlug,
      status: applicants.status,
    })
    .from(applicants)
    .where(and(eq(applicants.email, employee.email), isNotNull(applicants.score)))
    .orderBy(desc(applicants.createdAt))
    .limit(1);

  if (!applicant || applicant.score === null) {
    return {
      applicantId: null,
      score: 0,
      role: employee.role,
      percentile: 'No score yet',
    };
  }

  const scoredRows = await db
    .select({ score: applicants.score })
    .from(applicants)
    .where(isNotNull(applicants.score));

  const rankedScores = scoredRows
    .map((row) => Number(row.score ?? 0))
    .filter((score) => Number.isFinite(score))
    .sort((a, b) => b - a);

  const rank = Math.max(1, rankedScores.findIndex((score) => score <= applicant.score) + 1);
  const percentileRank =
    rankedScores.length === 0 ? 50 : Math.max(1, Math.round((rank / rankedScores.length) * 100));

  return {
    applicantId: applicant.id,
    score: applicant.score,
    role: applicant.roleSlug,
    percentile: `Top ${percentileRank}%`,
  };
}
