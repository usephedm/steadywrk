'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABEL_MAP: Record<string, string> = {
  careers: 'Careers',
  programs: 'Programs',
  blog: 'Blog',
  apply: 'Apply',
  about: 'About',
  culture: 'Culture',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
};

function formatSegment(segment: string): string {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: formatSegment(seg),
    href: `/${segments.slice(0, i + 1).join('/')}`,
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-1.5 text-[13px] text-[#B0B0AB] dark:text-[#4A4A47]">
        <li>
          <Link
            href="/"
            className="hover:text-[#6E695F] dark:hover:text-[#8A8A86] transition-colors inline-flex items-center gap-1 min-h-[28px]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-[#B0B0AB]/50 dark:text-[#4A4A47]/50" />
            {crumb.isLast ? (
              <span className="text-[#23211D] dark:text-[#E8E8E6] font-medium">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-[#6E695F] dark:hover:text-[#8A8A86] transition-colors min-h-[28px] inline-flex items-center"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
