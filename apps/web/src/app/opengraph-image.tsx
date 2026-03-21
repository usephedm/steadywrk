import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'STEADYWRK — Where Ambition Compounds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF8',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand amber accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #E58A0F, #F5C563)',
          }}
        />

        {/* Double chevron mark */}
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
          <path d="M8 20L16 12L24 20" stroke="#E58A0F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14L16 6L24 14" stroke="#E58A0F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div
          style={{
            marginTop: 24,
            fontSize: 56,
            fontWeight: 800,
            color: '#23211D',
            letterSpacing: '-0.03em',
          }}
        >
          STEADYWRK
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            color: '#6E695F',
            letterSpacing: '0.05em',
          }}
        >
          Where ambition compounds.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 16,
            color: '#E58A0F',
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
          }}
        >
          steadywrk.app
        </div>
      </div>
    ),
    { ...size },
  );
}
