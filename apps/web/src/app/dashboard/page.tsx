'use client';

import { HubCard } from '@/components/ui/hub-card';
import { HUB_CARDS } from '@/lib/data';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { useTouchDevice } from '@/lib/hooks/use-touch-device';
import { motion } from 'framer-motion';

// Card-specific preview content
const CARD_PREVIEWS = [
  'Q1 2026 · Launch',
  '5 open positions',
  'Latest: SteadyWrk Has Landed',
  'AI Lab · Facility · Marketing · BPO',
  'hello@steadywrk.app',
] as const;

export default function DashboardPage() {
  const prefersReduced = usePrefersReducedMotion();
  const isTouch = useTouchDevice();
  const isMobile = isTouch; // Will be refined by CSS breakpoints

  return (
    <div className="relative min-h-[calc(100dvh-8rem)] flex flex-col items-center justify-center px-6 py-16">
      {/* Portal entrance flash */}
      {!prefersReduced && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background:
              'radial-gradient(ellipse at 50% 45%, rgba(245,158,11,0.2), rgba(255,255,255,0.06) 40%, transparent 70%)',
          }}
        />
      )}

      {/* Header */}
      <motion.div
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          prefersReduced
            ? { duration: 0.01 }
            : { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
        }
        className="text-center mb-14"
      >
        <h1 className="h-14 sm:h-16 mb-4 flex items-center justify-center text-4xl sm:text-5xl text-white font-bold tracking-tighter">
          SteadyWrk
        </h1>

        {/* Accent line */}
        {!prefersReduced && (
          <motion.div
            className="mx-auto w-16 h-px mt-8"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        )}

        <motion.p
          className="text-white/25 text-xs tracking-[0.3em] uppercase font-mono mt-4"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReduced ? { duration: 0.01 } : { delay: 0.6 }}
        >
          Select your destination
        </motion.p>
      </motion.div>

      {/* Mobile: Horizontal swipe carousel */}
      <div className="w-full max-w-5xl md:hidden">
        <div
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-6 px-6"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {HUB_CARDS.map((card, i) => (
            <div key={card.href} className="snap-center shrink-0 w-[85vw] max-w-[340px]">
              <HubCard
                title={card.title}
                subtitle={card.subtitle}
                href={card.href}
                icon={card.icon}
                colors={card.colors}
                index={i}
                preview={CARD_PREVIEWS[i]}
                className="h-full"
              />
            </div>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {HUB_CARDS.map((card) => (
            <div key={card.href} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>

      {/* Tablet: 2-column grid */}
      <div className="w-full max-w-5xl hidden md:block lg:hidden">
        <div className="grid grid-cols-2 gap-4 auto-rows-[20rem]">
          {HUB_CARDS.map((card, i) => (
            <HubCard
              key={card.href}
              title={card.title}
              subtitle={card.subtitle}
              href={card.href}
              icon={card.icon}
              colors={card.colors}
              index={i}
              preview={CARD_PREVIEWS[i]}
              className="h-full"
            />
          ))}
        </div>
      </div>

      {/* Desktop: Bento grid */}
      <div className="w-full max-w-5xl hidden lg:block">
        <div className="grid grid-cols-6 gap-4 auto-rows-[20rem]">
          {/* Row 1: Featured card (4 cols) + Regular card (2 cols) */}
          <div className="col-span-4">
            <HubCard
              title={HUB_CARDS[0].title}
              subtitle={HUB_CARDS[0].subtitle}
              href={HUB_CARDS[0].href}
              icon={HUB_CARDS[0].icon}
              colors={HUB_CARDS[0].colors}
              index={0}
              preview={CARD_PREVIEWS[0]}
              className="h-full"
            />
          </div>
          <div className="col-span-2">
            <HubCard
              title={HUB_CARDS[1].title}
              subtitle={HUB_CARDS[1].subtitle}
              href={HUB_CARDS[1].href}
              icon={HUB_CARDS[1].icon}
              colors={HUB_CARDS[1].colors}
              index={1}
              preview={CARD_PREVIEWS[1]}
              className="h-full"
            />
          </div>

          {/* Row 2: Three equal cards */}
          <div className="col-span-2">
            <HubCard
              title={HUB_CARDS[2].title}
              subtitle={HUB_CARDS[2].subtitle}
              href={HUB_CARDS[2].href}
              icon={HUB_CARDS[2].icon}
              colors={HUB_CARDS[2].colors}
              index={2}
              preview={CARD_PREVIEWS[2]}
              className="h-full"
            />
          </div>
          <div className="col-span-2">
            <HubCard
              title={HUB_CARDS[3].title}
              subtitle={HUB_CARDS[3].subtitle}
              href={HUB_CARDS[3].href}
              icon={HUB_CARDS[3].icon}
              colors={HUB_CARDS[3].colors}
              index={3}
              preview={CARD_PREVIEWS[3]}
              className="h-full"
            />
          </div>
          <div className="col-span-2">
            <HubCard
              title={HUB_CARDS[4].title}
              subtitle={HUB_CARDS[4].subtitle}
              href={HUB_CARDS[4].href}
              icon={HUB_CARDS[4].icon}
              colors={HUB_CARDS[4].colors}
              index={4}
              preview={CARD_PREVIEWS[4]}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
