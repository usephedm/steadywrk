'use client';

import { BorderBeam } from '@/components/ui/border-beam';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { useTouchDevice } from '@/lib/hooks/use-touch-device';
import { Layers, type LucideIcon, Mail, Map, Newspaper, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ICON_MAP: Record<string, LucideIcon> = {
  Map,
  Users,
  Newspaper,
  Layers,
  Mail,
};

interface HubCardProps {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  colors: readonly number[][] | number[][];
  className?: string;
  index?: number;
  preview?: string;
}

export function HubCard({
  title,
  subtitle,
  href,
  icon,
  colors,
  className,
  index = 0,
  preview,
}: HubCardProps) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = ICON_MAP[icon];
  const cardRef = useRef<HTMLAnchorElement>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isTouch = useTouchDevice();

  // Reset cached rect on resize
  useEffect(() => {
    const handleResize = () => {
      cachedRectRef.current = null;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spotlight cursor tracking — skip on touch
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!cardRef.current || isTouch || prefersReduced) return;
      if (!cachedRectRef.current) {
        cachedRectRef.current = cardRef.current.getBoundingClientRect();
      }
      const rect = cachedRectRef.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
      cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
    },
    [isTouch, prefersReduced],
  );

  const showEffects = !isTouch && !prefersReduced;

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReduced
          ? { duration: 0.01 }
          : { duration: 0.6, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }
      }
    >
      <Link
        ref={cardRef}
        href={href}
        className={`group/card relative block h-[20rem] rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-amber-500/25 ${className ?? ''}`}
        onMouseEnter={() => showEffects && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        style={
          {
            '--spotlight-x': '50%',
            '--spotlight-y': '50%',
          } as React.CSSProperties
        }
      >
        {/* Spotlight gradient following cursor — desktop only */}
        {showEffects && (
          <div
            className="absolute inset-0 z-[1] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                'radial-gradient(400px circle at var(--spotlight-x) var(--spotlight-y), rgba(245,158,11,0.08), transparent 60%)',
            }}
          />
        )}

        {/* Border beam on hover — desktop only */}
        {hovered && showEffects && <BorderBeam size={150} duration={6} delay={0} />}

        {/* Corner icons */}
        <CornerIcon className="absolute h-5 w-5 -top-2.5 -left-2.5 text-white/15" />
        <CornerIcon className="absolute h-5 w-5 -top-2.5 -right-2.5 text-white/15" />
        <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 text-white/15" />
        <CornerIcon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 text-white/15" />

        {/* Ambient hover glow — desktop only */}
        {showEffects && (
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-[2]"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 50% 60%, rgba(${(colors[0] as number[]).join(',')},0.12), transparent 70%)`,
                  }}
                />
                <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50" />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Mobile: static amber gradient background */}
        {isTouch && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.15), transparent 70%)',
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center p-6">
          {/* Icon — always visible on mobile, hover-gated on desktop */}
          <div
            className={`text-center transition-all duration-300 ${
              isTouch
                ? ''
                : 'group-hover/card:-translate-y-6 group-hover/card:opacity-0 group-hover/card:scale-90'
            }`}
          >
            {IconComponent && (
              <div className="mx-auto mb-3 p-3 rounded-xl bg-amber-500/10 inline-block">
                <IconComponent className="h-8 w-8 text-amber-500/70" />
              </div>
            )}
            {/* Mobile: show title always */}
            {isTouch && (
              <h3 className="text-xl font-bold text-white tracking-tight mt-2">{title}</h3>
            )}
            <p className="text-white/25 text-xs font-mono tracking-wider uppercase mt-2">
              {subtitle}
            </p>
            {/* Preview text — mobile and desktop resting state */}
            {preview && (
              <p className="text-amber-500/40 text-[11px] font-mono mt-3 max-w-[200px] mx-auto truncate">
                {preview}
              </p>
            )}
          </div>

          {/* Title + subtitle — hover state (desktop only) */}
          {!isTouch && (
            <>
              <h3 className="absolute text-2xl font-bold text-white opacity-0 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:-translate-y-2 tracking-tight">
                {title}
              </h3>
              <p className="absolute bottom-8 text-xs text-amber-500/60 font-mono tracking-wider uppercase opacity-0 transition-all duration-300 group-hover/card:opacity-100">
                {subtitle}
              </p>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

function CornerIcon({ className, ...rest }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}
