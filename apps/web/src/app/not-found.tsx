import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6 bg-[#FAFAF8]">
      <div className="text-center max-w-md">
        <div
          className="text-6xl font-extrabold text-[#E58A0F] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold text-[#23211D] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Page not found
        </h1>
        <p className="text-[#6E695F] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-[#E58A0F] hover:bg-[#CC7408] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 inline-block"
        >
          Back to Home
        </Link>
        <div className="mt-8 pt-6 border-t border-[#E5E5E2]">
          <p className="text-xs text-[#B0B0AB] mb-3">Popular pages</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/careers', label: 'Careers' },
              { href: '/programs', label: 'Programs' },
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'About' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#E58A0F] hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
