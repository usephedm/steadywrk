'use client';

import { MagicCard } from '@/components/ui/magic-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { motion } from 'motion/react';
import { Shield, Target, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';

const VALUES = [
  {
    icon: Target,
    title: 'Elite Standards',
    desc: 'Hard to get into. Every hire is deliberate. Structured scorecards, transparent criteria.',
    stat: '<5%',
    statLabel: 'acceptance rate',
  },
  {
    icon: TrendingUp,
    title: 'Visible Growth',
    desc: 'Promotions, mentorship, shipped work. Your trajectory is legible — not a vague promise.',
    stat: '14',
    statLabel: 'day hiring target',
  },
  {
    icon: Shield,
    title: 'Real Fairness',
    desc: 'No "culture fit" guessing. Same questions. We respond within 48 hours. Always.',
    stat: '48h',
    statLabel: 'response time',
  },
  {
    icon: Zap,
    title: 'Speed as Brand',
    desc: 'Fast hiring. Fast feedback. Fast growth. 14-day target. The name promises momentum.',
    stat: '6 min',
    statLabel: 'to apply',
  },
];

export function EVPSection() {
  return (
    <section id="about" className="py-20 md:py-32 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
            Why STEADYWRK
          </p>
          <h2
            className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em] max-w-xl mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Built for people who want their growth to compound.
          </h2>
          <p className="mt-3 text-[#6E695F] dark:text-[#8A8A86] text-[16px] leading-relaxed max-w-lg mb-14">
            Jordan produces 7,000+ tech graduates a year. 66% of young women are unemployed.
            The pipeline between education and elite work is broken. We&apos;re building the
            bridge.
          </p>
        </ScrollReveal>

        {/* Asymmetric grid: 2 stacked left + 1 tall right */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Left column: 2 stacked cards */}
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={0.1 + i * 0.06}>
                <MagicCard
                  className="rounded-xl h-full"
                  gradientSize={180}
                  gradientColor="rgba(229,138,15,0.08)"
                  gradientFrom="#E58A0F"
                  gradientTo="#F5C563"
                >
                  <div className="p-6 group cursor-default h-full">
                    <v.icon
                      className="w-5 h-5 text-[#6B6B66] dark:text-[#8A8A86] group-hover:text-[#E58A0F] transition-colors duration-[180ms] mb-4"
                      strokeWidth={1.5}
                    />
                    <h3
                      className="text-[17px] font-bold text-[#23211D] dark:text-[#E8E8E6] mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {v.title}
                    </h3>
                    <p className="text-[#6E695F] dark:text-[#8A8A86] text-[14px] leading-relaxed mb-4">
                      {v.desc}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-[1.5rem] font-extrabold text-[#E58A0F]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {v.stat}
                      </span>
                      <span className="text-[12px] text-[#6B6B66] dark:text-[#8A8A86]">
                        {v.statLabel}
                      </span>
                    </div>
                  </div>
                </MagicCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Right column: 1 tall feature card with image */}
          <ScrollReveal delay={0.15} className="md:col-span-1">
            <motion.div
              className="relative rounded-xl overflow-hidden h-full min-h-[320px] group cursor-default border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]"
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.18 }}
            >
              <Image
                src="/brand/steadywrk-team-collab.webp"
                alt="STEADYWRK team collaboration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
              {/* Warm overlay */}
              <div className="absolute inset-0 bg-[#FFF8F0] mix-blend-multiply opacity-[0.08]" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[11px] uppercase tracking-[0.12em] text-[#F5A623] font-semibold mb-2">
                  The Promise
                </p>
                <h3
                  className="text-[20px] font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Where ambition compounds
                </h3>
                <p className="text-white/60 text-[14px] leading-relaxed">
                  Ship production AI systems in week one. Lead a team by month six.
                </p>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
