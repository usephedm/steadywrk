'use client';

import { AnimatedTitle } from '@/components/ui/animated-title';
import { ROADMAP } from '@/lib/data';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

export default function RoadmapPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <AnimatedTitle
          text="Steady...W-hat?"
          className="text-4xl sm:text-5xl font-bold tracking-tighter text-white"
        />
        <motion.p
          className="text-white/40 text-sm tracking-[0.2em] uppercase font-mono mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          SteadyWrk 1.0 — 2026 Roadmap
        </motion.p>
        <motion.div
          className="w-20 h-px mt-6"
          style={{
            background: 'linear-gradient(90deg, rgba(245,158,11,0.5), transparent)',
          }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <motion.div
          className="absolute left-4 top-0 bottom-0 w-px"
          style={{
            background: 'linear-gradient(to bottom, #F59E0B, rgba(245,158,11,0.2), transparent)',
          }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        <div className="space-y-14">
          {ROADMAP.map((milestone, i) => {
            const isActive = i === 0;
            return (
              <motion.div
                key={milestone.quarter}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease }}
                className="relative pl-12"
              >
                {/* Dot with pulse for active */}
                <div
                  className={`absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${
                    isActive
                      ? 'bg-amber-500 ring-amber-500/30'
                      : 'bg-amber-500/60 ring-amber-500/10'
                  }`}
                  style={isActive ? { animation: 'pulse-dot 2s ease-in-out infinite' } : undefined}
                />

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-amber-500/15 transition-colors duration-300">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span
                      className={`text-xs font-mono tracking-wider uppercase ${isActive ? 'text-amber-500' : 'text-amber-500/50'}`}
                    >
                      {milestone.quarter}
                    </span>
                    <h2
                      className={`text-xl font-bold ${isActive ? 'text-white' : 'text-white/70'}`}
                    >
                      {milestone.title}
                    </h2>
                    {isActive && (
                      <span className="text-[10px] font-mono text-amber-500/60 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Current
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {milestone.items.map((item, j) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.7 + i * 0.15 + j * 0.06,
                          ease,
                        }}
                        className="text-white/45 text-sm flex items-start gap-2.5"
                      >
                        <span className="text-amber-500/50 mt-0.5 shrink-0">
                          {isActive ? '▸' : '›'}
                        </span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
