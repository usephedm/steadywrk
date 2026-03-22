import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'steadywrk-web',
      version: '5.0.0',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}
