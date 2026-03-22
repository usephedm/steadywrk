'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function CareersError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof window !== 'undefined' && w.posthog) {
      w.posthog.capture('error_boundary', { error: error.message, page: '/careers' });
    }
  }, [error]);

  return (
    <main className="min-h-dvh flex items-center justify-center px-6 bg-[#FAFAF8]">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-[#23211D] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Something went wrong
        </h1>
        <p className="text-[#6E695F] mb-6">We couldn&apos;t load this page. Please try again.</p>
        <div className="flex items-center justify-center gap-3">
          <button type="button" onClick={reset} className="bg-[#E58A0F] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#CC7408] transition-colors">
            Try again
          </button>
          <Link href="/" className="text-[#6E695F] hover:text-[#23211D] text-sm font-medium transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
