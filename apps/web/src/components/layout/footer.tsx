import { COMPANY } from '@/lib/data';
import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/careers', label: 'Careers' },
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'About' },
  { href: '/culture', label: 'Culture' },
] as const;

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.04)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path
                d="M6 22L16 12L26 22"
                stroke="#E58A0F"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 15L16 5L26 15"
                stroke="#E58A0F"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-white/60 text-[14px] font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              STEADYWRK
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[13px] text-white/30">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white/60 transition-colors duration-[180ms] min-h-[44px] inline-flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`mailto:${COMPANY.email}`}
              className="hover:text-white/60 transition-colors duration-[180ms] min-h-[44px] inline-flex items-center"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} {COMPANY.legal}. All rights reserved.
          </p>
          <p className="text-[11px] text-white/15">{COMPANY.address}</p>
        </div>
      </div>
    </footer>
  );
}
