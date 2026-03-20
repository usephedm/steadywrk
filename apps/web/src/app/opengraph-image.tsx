import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SteadyWrk — Apply. Train. Work.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#000',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Ambient amber glow */}
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Title */}
      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        SteadyWrk
      </div>

      {/* Amber accent line */}
      <div
        style={{
          width: 100,
          height: 2,
          background: '#F59E0B',
          marginTop: 28,
          borderRadius: 1,
          position: 'relative',
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.45)',
          marginTop: 24,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        Apply. Train. Work.
      </div>
    </div>,
    { ...size },
  );
}
