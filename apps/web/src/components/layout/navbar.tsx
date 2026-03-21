'use client';

import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/careers', label: 'Careers' },
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'About' },
  { href: '/culture', label: 'Culture' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#FAFAF8]/70 border-b border-[rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
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
            className="font-extrabold text-[#23211D] text-[16px] tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            STEADYWRK
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#6E695F]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#23211D] transition-colors duration-[180ms]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/apply/operations-dispatcher">
            <ShimmerButton
              shimmerColor="#F5C563"
              shimmerSize="0.06em"
              background="#E58A0F"
              borderRadius="8px"
              className="text-[14px] font-medium px-6 py-2.5"
            >
              Apply Now
            </ShimmerButton>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-[#6E695F] hover:text-[#23211D] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(0,0,0,0.04)] bg-[#FAFAF8]/95 backdrop-blur-2xl">
          <div className="px-6 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[15px] font-medium text-[#6E695F] hover:text-[#23211D] transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
