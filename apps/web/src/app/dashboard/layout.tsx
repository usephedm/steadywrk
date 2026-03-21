'use client';

import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { useTouchDevice } from '@/lib/hooks/use-touch-device';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Deterministic particle positions
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: `${((i * 31 + 17) % 90) + 5}%`,
  delay: `${((i * 3.2) % 18).toFixed(1)}s`,
  duration: `${(18 + ((i * 4.3) % 14)).toFixed(1)}s`,
  size: 1 + (i % 2) * 0.5,
  opacity: 0.08 + (i % 3) * 0.04,
}));

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReduced = usePrefersReducedMotion();
  const isTouch = useTouchDevice();

  return (
    <div className="relative min-h-dvh bg-[#0A0A0A] text-white">


      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(245,158,11,0.04), transparent 60%)',
        }}
      />

      {/* Noise texture — visual continuity with splash */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Floating particles — skip on reduced motion */}
      {!prefersReduced && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: p.left,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: '#F59E0B',
                opacity: p.opacity,
                animation: `ember-float ${p.duration} ${p.delay} infinite linear`,
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>
      )}

      {/* Dot grid pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.8) 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top bar */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/40 border-b border-white/[0.04]"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 1rem))' }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-amber-500/80 transition-colors duration-300"
          data-interactive
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs font-mono tracking-wider uppercase hidden sm:inline">
            SteadyWrk
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
            <span className="text-[10px] font-mono text-white/20 tracking-wider uppercase hidden sm:inline">
              Live
            </span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <footer
        className="relative z-10 py-8 text-center border-t border-white/[0.03]"
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 2rem))' }}
      >
        <p className="text-white/15 text-[10px] tracking-[0.25em] uppercase font-light font-mono">
          SteadyWrk™ · SteadyWrk LLC
        </p>
      </footer>
    </div>
  );
}
