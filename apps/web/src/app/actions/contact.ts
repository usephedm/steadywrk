'use server';

import { db } from '@/lib/db';
import { contacts } from '../../../../../packages/db/src/schema';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  company: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export type ContactResult = { success: true } | { success: false; error: string };

export async function submitContact(
  formData: z.infer<typeof contactSchema>,
): Promise<ContactResult> {
  try {
    const data = contactSchema.parse(formData);

    if (!db) {
      return { success: false, error: 'Database not configured' };
    }

    await db.insert(contacts).values({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      message: data.message,
    });

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0]?.message ?? 'Validation failed' };
    }
    return { success: false, error: 'Something went wrong' };
  }
}
