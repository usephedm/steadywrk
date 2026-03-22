import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { ImageResponse } from 'next/og';
import { applicants } from '../../../../../../packages/db/src/schema';

export const alt = 'STEADYWRK Assessment Scorecard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Force dynamic so we don't cache candidate scores globally
export const dynamic = 'force-dynamic';

export default async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicantId = searchParams.get('id');

  if (!applicantId) {
    return new Response('Missing applicant ID', { status: 400 });
  }

  try {
    if (!db) {
      throw new Error('Database not configured');
    }

    const records = await db
      .select({
        name: applicants.name,
        roleSlug: applicants.roleSlug,
        score: applicants.score,
        status: applicants.status,
      })
      .from(applicants)
      .where(eq(applicants.id, applicantId));

    if (records.length === 0) {
      return new Response('Applicant not found', { status: 404 });
    }

    const applicant = records[0];

    // Only generate scorecards for candidates who passed the assessment
    if (applicant.status === 'applied' || applicant.status === 'screening' || !applicant.score) {
      return new Response('Scorecard not yet available for this candidate stage', { status: 403 });
    }

    // Determine percentile/rating based on score
    let percentile = 'Top 50%';
    let color = '#FFFFFF';
    if (applicant.score >= 90) {
      percentile = 'Top 1%';
      color = '#F5C563'; // Gold
    } else if (applicant.score >= 80) {
      percentile = 'Top 10%';
      color = '#E58A0F'; // Brand Amber
    } else if (applicant.score >= 70) {
      percentile = 'Top 25%';
      color = '#0F6B6F'; // Focus Teal
    }

    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: `linear-gradient(90deg, ${color}, #0A0A0A)`,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: color,
              fontSize: 24,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 24,
            }}
          >
            Verified Assessment Result
          </div>
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            {applicant.name} scored in the {percentile} for{' '}
            {applicant.roleSlug.replace(/-/g, ' ').toUpperCase()}.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{ fontSize: 32, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em' }}
            >
              STEADYWRK
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24 }}>
            Score: {applicant.score}/100
          </div>
        </div>
      </div>,
      { ...size },
    );
  } catch (error) {
    console.error('Failed to generate scorecard:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
