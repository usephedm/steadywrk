'use server';

import { requireDashboardEmployee } from '@/lib/auth/dashboard-access';
import { db } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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

export async function scheduleInterviewSlot(input: {
  applicantId: string;
  scheduledAt: string;
  duration: number;
  interviewerName?: string;
  meetingUrl?: string;
  notes?: string;
}) {
  const { canAccessAdmin } = await requireDashboardEmployee();

  if (!canAccessAdmin) {
    return { success: false as const, error: 'Unauthorized' };
  }

  if (!db) {
    return { success: false as const, error: 'Database not configured' };
  }

  const scheduledAt = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledAt.getTime())) {
    return { success: false as const, error: 'Invalid interview date' };
  }

  try {
    await db.insert(interviewSlots).values({
      applicantId: input.applicantId,
      scheduledAt,
      duration: input.duration,
      interviewerName: input.interviewerName?.trim() || null,
      meetingUrl: input.meetingUrl?.trim() || null,
      notes: input.notes?.trim() || null,
      completed: false,
    });

    await db
      .update(applicants)
      .set({ status: 'interview', updatedAt: new Date() })
      .where(eq(applicants.id, input.applicantId));

    revalidatePath('/dashboard/hiring');
    revalidatePath('/dashboard/interviews');

    return { success: true as const };
  } catch (error) {
    console.error('Failed to schedule interview:', error);
    return { success: false as const, error: 'Failed to schedule interview' };
  }
}

export async function markInterviewCompleted(interviewId: string, completed: boolean) {
  const { canAccessAdmin } = await requireDashboardEmployee();

  if (!canAccessAdmin) {
    return { success: false as const, error: 'Unauthorized' };
  }

  if (!db) {
    return { success: false as const, error: 'Database not configured' };
  }

  try {
    await db.update(interviewSlots).set({ completed }).where(eq(interviewSlots.id, interviewId));

    revalidatePath('/dashboard/interviews');
    return { success: true as const };
  } catch (error) {
    console.error('Failed to update interview status:', error);
    return { success: false as const, error: 'Failed to update interview status' };
  }
}
