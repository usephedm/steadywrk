'use client';

import { ShimmerButton } from '@/components/ui/shimmer-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const NAV_LINKS = [
  { href: '/careers', label: 'Careers' },
  { href: '/programs', label: 'Programs' },
  { href: '/about', label: 'About' },
  { href: '/culture', label: 'Culture' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#FAFAF8]/70 dark:bg-[#111110]/80 border-b border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          {/* Light mode: orange mark + dark wordmark on white bg */}
          <Image
            src="/brand/logo-gold-chrome-white.webp"
            alt="STEADYWRK"
            width={140}
            height={32}
            className="h-7 w-auto dark:hidden"
            priority
          />
          {/* Dark mode: orange mark + white wordmark on dark bg */}
          <Image
            src="/brand/logo-orange-white-dark.webp"
            alt="STEADYWRK"
            width={140}
            height={32}
            className="h-7 w-auto hidden dark:block"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-[#6E695F] dark:text-[#8A8A86]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#23211D] dark:hover:text-[#E8E8E6] transition-colors duration-[180ms]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link href="/careers">
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
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6E695F] dark:text-[#8A8A86] hover:text-[#23211D] dark:hover:text-[#E8E8E6] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.04)] bg-[#FAFAF8]/95 dark:bg-[#111110]/95 backdrop-blur-2xl"
          >
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-[15px] font-medium text-[#6E695F] dark:text-[#8A8A86] hover:text-[#23211D] dark:hover:text-[#E8E8E6] transition-colors py-3 min-h-[44px] flex items-center"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
