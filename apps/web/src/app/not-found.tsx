'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="min-h-dvh flex items-center justify-center px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="text-center max-w-md">
        <div
          className="text-6xl font-extrabold text-[var(--color-brand)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold text-[var(--color-graphite)] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Page not found
        </h1>
        <p className="text-[var(--color-fog)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white px-6 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
