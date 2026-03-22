'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry
    Sentry.captureException(error);

    // Structured logging — no console.log in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Page error:', error);
    }
  }, [error]);

  return (
    <main
      className="min-h-dvh flex items-center justify-center px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="text-center max-w-md">
        <div
          className="text-4xl font-extrabold text-[var(--color-error)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Something went wrong
        </div>
        <p className="text-[var(--color-fog)] mb-8">
          We hit an unexpected error. Our team has been notified.
        </p>
        <button
          onClick={reset}
          type="button"
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-6 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
