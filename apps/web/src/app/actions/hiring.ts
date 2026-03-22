'use server';

import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';
import { db } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { applicants } from '../../../../../packages/db/src/schema';

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
      role: record.roleSlug,
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
