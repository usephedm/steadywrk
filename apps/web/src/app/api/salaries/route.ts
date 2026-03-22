import { isSpamTrapTriggered, jsonResponse, parseJsonBody } from '@/lib/api-guard';
import { db } from '@/lib/db';
import { rateLimitRequest } from '@/lib/rate-limit';
import { z } from 'zod';
import { salarySubmissions } from '../../../../../../packages/db/src/schema';

const salarySchema = z.object({
  jobTitle: z.string().trim().min(2).max(255),
  country: z.string().trim().min(2).max(100),
  city: z.string().trim().max(100).optional(),
  yearsOfExperience: z.coerce.number().int().min(0).max(50),
  baseSalaryUsd: z.coerce.number().int().min(0).max(1_000_000),
  equityValueUsd: z.coerce.number().int().min(0).max(1_000_000).optional(),
  isRemote: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const requestLimit = await rateLimitRequest(request, 'salary', 3, 24 * 60 * 60 * 1000);
  if (!requestLimit.success) {
    return jsonResponse(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
      requestLimit,
    );
  }

  try {
    const parsed = await parseJsonBody(request, { maxBytes: 8 * 1024 });
    if (!parsed.ok) {
      return parsed.response;
    }

    if (isSpamTrapTriggered(parsed.body)) {
      return jsonResponse({ success: true }, { status: 202 }, requestLimit);
    }

    if (!db) {
      return jsonResponse({ error: 'Database not configured' }, { status: 503 }, requestLimit);
    }

    const data = salarySchema.parse(parsed.body);

    await db.insert(salarySubmissions).values({
      jobTitle: data.jobTitle,
      country: data.country,
      city: data.city || null,
      yearsOfExperience: data.yearsOfExperience,
      baseSalaryUsd: data.baseSalaryUsd,
      equityValueUsd: data.equityValueUsd || 0,
      isRemote: data.isRemote,
      verified: false,
    });

    return jsonResponse(
      {
        success: true,
        message:
          'Salary data submitted anonymously. Thank you for contributing to market transparency.',
      },
      { status: 201 },
      requestLimit,
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return jsonResponse({ error: err.errors[0]?.message }, { status: 400 }, requestLimit);
    }

    console.error('Salary submission failed:', err);
    return jsonResponse(
      { error: 'Failed to process salary submission' },
      { status: 500 },
      requestLimit,
    );
  }
}
