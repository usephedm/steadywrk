import { ROLES } from '@/lib/data';
import { ImageResponse } from 'next/og';

export const alt = 'STEADYWRK Careers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);

  // Fallback if role not found
  if (!role) {
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
        <div style={{ fontSize: 72, fontWeight: 800, color: '#FFFFFF' }}>STEADYWRK</div>
      </div>,
      { ...size },
    );
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
          background: 'linear-gradient(90deg, #E58A0F, #F5C563)',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            color: '#E58A0F',
            fontSize: 24,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 24,
          }}
        >
          {role.dept}
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}
        >
          {role.title}
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
          {role.location} &middot; {role.type}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
