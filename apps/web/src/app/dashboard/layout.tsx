'use client';

import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Map,
  Menu,
  Rocket,
  Trophy,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/training', label: 'Training', icon: GraduationCap },
  { href: '/dashboard/tools', label: 'Tools', icon: Wrench },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/dashboard/blog', label: 'Blog', icon: BookOpen },
  { href: '/dashboard/hiring', label: 'Hiring', icon: Users, adminOnly: true },
  { href: '/dashboard/contact', label: 'Contact', icon: Mail },
  { href: '/dashboard/roadmap', label: 'Roadmap', icon: Map },
  { href: '/dashboard/services', label: 'Services', icon: Rocket },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="relative min-h-dvh bg-[#FAFAF8] flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-dvh bg-[#1A1A18] z-40 transition-all duration-300 ease-out ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.06]">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/brand/logo-orange-white-dark.webp"
                alt="STEADYWRK"
                width={120}
                height={28}
                className="h-6 w-auto"
                priority
              />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg min-h-[44px] transition-all duration-200 relative ${
                  active
                    ? 'bg-[#E58A0F]/10 text-[#E58A0F]'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#E58A0F]" />
                )}
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
                {!collapsed && 'adminOnly' in item && item.adminOnly && (
                  <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/[0.06]">
          {!collapsed && (
            <p className="text-white/15 text-[10px] tracking-[0.15em] uppercase font-light text-center">
              STEADYWRK™
            </p>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-[#1A1A18] border-b border-white/[0.06]">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/logo-orange-white-dark.webp"
            alt="STEADYWRK"
            width={110}
            height={26}
            className="h-5 w-auto"
            priority
          />
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={closeSidebar}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-0 left-0 h-dvh w-[280px] z-50 bg-[#1A1A18] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06]">
                <Link href="/" onClick={closeSidebar}>
                  <Image
                    src="/brand/logo-orange-white-dark.webp"
                    alt="STEADYWRK"
                    width={110}
                    height={26}
                    className="h-5 w-auto"
                    priority
                  />
                </Link>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-white/40 hover:text-white/60"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSidebar}
                      className={`group flex items-center gap-3 px-3 py-3 rounded-lg min-h-[44px] transition-all duration-200 relative ${
                        active
                          ? 'bg-[#E58A0F]/10 text-[#E58A0F]'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#E58A0F]" />
                      )}
                      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {'adminOnly' in item && item.adminOnly && (
                        <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-white/[0.06]">
                <p className="text-white/15 text-[10px] tracking-[0.15em] uppercase font-light text-center">
                  STEADYWRK™
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <main
        className={`flex-1 min-h-dvh transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        } pt-14 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
