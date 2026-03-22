import { isSpamTrapTriggered, jsonResponse, parseJsonBody } from '@/lib/api-guard';
import { rateLimitRequest } from '@/lib/rate-limit';
import { z } from 'zod';

const shareSchema = z.object({
  applicantId: z.string().uuid(),
  platform: z.enum(['linkedin', 'x', 'whatsapp', 'copy_link']),
});

export async function POST(request: Request) {
  const requestLimit = await rateLimitRequest(request, 'share', 20, 60 * 60 * 1000);
  if (!requestLimit.success) {
    return jsonResponse({ error: 'Too many requests' }, { status: 429 }, requestLimit);
  }

  try {
    const parsed = await parseJsonBody(request, { maxBytes: 4 * 1024 });
    if (!parsed.ok) {
      return parsed.response;
    }

    if (isSpamTrapTriggered(parsed.body)) {
      return jsonResponse({ success: true }, { status: 202 }, requestLimit);
    }

    const data = shareSchema.parse(parsed.body);

    console.log(`[Viral Loop] Applicant ${data.applicantId} shared scorecard on ${data.platform}`);

    return jsonResponse({ success: true }, { status: 200 }, requestLimit);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return jsonResponse({ error: err.errors[0]?.message }, { status: 400 }, requestLimit);
    }

    console.error('Share tracking failed:', err);
    return jsonResponse({ error: 'Failed to track share event' }, { status: 500 }, requestLimit);
  }
}
