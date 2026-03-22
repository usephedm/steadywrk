'use server';

import { db } from '@/lib/db';
import { applicants } from '../../../../../packages/db/src/schema';
import { z } from 'zod';

const applySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  team: z.string().optional(),
  answers: z.object({
    q1: z.string(),
    q2: z.string(),
    q3: z.string(),
  }).optional(),
  portfolioUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  skills: z.record(z.number()).optional(),
  availability: z.string().optional(),
  challengeResponse: z.string().optional(),
});

export type ApplyResult = { success: true; applicantId?: string } | { success: false; error: string };

export async function submitApplication(formData: z.infer<typeof applySchema>): Promise<ApplyResult> {
  try {
    const data = applySchema.parse(formData);

    if (!db) {
      return { success: false, error: 'Database not configured' };
    }

    const [result] = await db.insert(applicants).values({
      email: data.email,
      name: data.name,
      phone: data.phone ?? null,
      roleSlug: data.position,
      teamInterest: data.team ?? null,
      portfolioUrl: data.portfolioUrl ?? null,
      githubUrl: data.githubUrl ?? null,
      answers: data.answers ?? { q1: '', q2: '', q3: '' },
      skills: data.skills ?? {},
      availability: data.availability ?? null,
      challengeResponse: data.challengeResponse ?? null,
      pdplConsent: true,
    }).returning({ id: applicants.id });

    return { success: true, applicantId: result?.id };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0]?.message ?? 'Validation failed' };
    }
    return { success: false, error: 'Something went wrong' };
  }
}
