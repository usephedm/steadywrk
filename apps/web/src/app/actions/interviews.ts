'use server';

import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';
import { db } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { applicants, interviewSlots } from '../../../../../packages/db/src/schema';

export async function getUpcomingInterviews() {
  const { canAccessAdmin } = await requireDashboardEmployee();

  if (!canAccessAdmin) {
    throw new Error('Unauthorized');
  }

  if (!db) {
    return [];
  }

  try {
    const records = await db
      .select({
        id: interviewSlots.id,
        scheduledAt: interviewSlots.scheduledAt,
        duration: interviewSlots.duration,
        interviewerName: interviewSlots.interviewerName,
        meetingUrl: interviewSlots.meetingUrl,
        notes: interviewSlots.notes,
        completed: interviewSlots.completed,
        applicant: {
          id: applicants.id,
          name: applicants.name,
          email: applicants.email,
          role: applicants.roleSlug,
          status: applicants.status,
        },
      })
      .from(interviewSlots)
      .leftJoin(applicants, eq(interviewSlots.applicantId, applicants.id))
      .orderBy(desc(interviewSlots.scheduledAt));

    return records.map((record) => ({
      ...record,
      scheduledAt: record.scheduledAt.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch interviews:', error);
    return [];
  }
}
