'use server';

import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';
import { ROLES } from '@/lib/data';
import { db } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { applicants } from '../../../../../packages/db/src/schema';

const ROLE_LABELS = new Map<string, string>(ROLES.map((role) => [role.slug, role.title]));

export type HiringStatus =
  | 'applied'
  | 'screening'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected';

export async function getPipelineCandidates() {
  const { canAccessAdmin } = await requireDashboardEmployee();

  if (!canAccessAdmin) {
    throw new Error('Unauthorized');
  }

  if (!db) {
    return [];
  }

  try {
    const records = await db.select().from(applicants).orderBy(desc(applicants.createdAt));

    return records.map((record) => ({
      id: record.id,
      name: record.name,
      role: ROLE_LABELS.get(record.roleSlug) ?? record.roleSlug,
      appliedDate: record.createdAt.toISOString().split('T')[0],
      status: record.status,
      score: record.score || 0,
      scores: {
        technical: record.score ? record.score - 5 : 0,
        organizational: record.score ? Math.min(record.score + 5, 100) : 0,
        communication: record.score || 0,
        growth: record.score || 0,
        cultural: record.score || 0,
        initiative: record.score || 0,
      },
      email: record.email,
    }));
  } catch (error) {
    console.error('Failed to fetch pipeline candidates:', error);
    return [];
  }
}

export async function updateApplicantStatus(applicantId: string, status: HiringStatus) {
  const { canAccessAdmin } = await requireDashboardEmployee();

  if (!canAccessAdmin) {
    return { success: false as const, error: 'Unauthorized' };
  }

  if (!db) {
    return { success: false as const, error: 'Database not configured' };
  }

  try {
    await db
      .update(applicants)
      .set({ status, updatedAt: new Date() })
      .where(eq(applicants.id, applicantId));

    revalidatePath('/dashboard/hiring');
    revalidatePath('/dashboard/interviews');

    return { success: true as const };
  } catch (error) {
    console.error('Failed to update applicant status:', error);
    return { success: false as const, error: 'Failed to update applicant status' };
  }
}
