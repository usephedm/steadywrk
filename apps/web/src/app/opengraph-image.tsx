import { ImageResponse } from 'next/og';

export const alt = 'STEADYWRK — Where Ambition Compounds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0A',
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

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
        }}
      >
        STEADYWRK
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 24,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.05em',
        }}
      >
        Where ambition compounds.
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 18,
          color: '#E58A0F',
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
        }}
      >
        steadywrk.app
      </div>
    </div>,
    { ...size },
  );
}
