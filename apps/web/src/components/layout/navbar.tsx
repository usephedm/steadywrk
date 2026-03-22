'use client';

import { ShimmerButton } from '@/components/ui/shimmer-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NAV_LINKS } from '@/lib/constants';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Scroll lock when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
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
      </nav>

      {/* Mobile drawer — rendered outside nav to avoid clipping */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={closeMobile}
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-[280px] bg-[#FAFAF8] dark:bg-[#111110] shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                <div className="flex-1 space-y-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center text-[15px] font-medium text-[#6E695F] dark:text-[#8A8A86] hover:text-[#23211D] dark:hover:text-[#E8E8E6] transition-colors min-h-[44px]"
                      onClick={closeMobile}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="pb-8">
                  <Link href="/careers" onClick={closeMobile}>
                    <ShimmerButton
                      shimmerColor="#F5C563"
                      shimmerSize="0.06em"
                      background="#E58A0F"
                      borderRadius="8px"
                      className="text-[14px] font-medium px-6 py-2.5 w-full"
                    >
                      Apply Now
                    </ShimmerButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
