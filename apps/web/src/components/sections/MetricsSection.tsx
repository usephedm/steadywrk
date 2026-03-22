'use client';

import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { NumberTicker } from '@/components/ui/number-ticker';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function MetricsSection() {
  return (
    <section className="relative py-20 md:py-28 px-6 bg-[#FAFAF8] dark:bg-[#111110] overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.35] dark:opacity-[0.15] pointer-events-none">
        <InteractiveGridPattern
          width={50}
          height={50}
          squares={[30, 16]}
          className="border-none stroke-[#E5E5E2] dark:stroke-[#2A2A28] [&_rect]:stroke-[#E5E5E2] dark:[&_rect]:stroke-[#2A2A28]"
          squaresClassName="hover:fill-[#E58A0F]/10"
        />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4 text-center">
            The Numbers
          </p>
          <h2
            className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em] mb-16 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The problem. The pipeline. The promise.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14">
          {[
            { val: 41.72, suf: '%', label: 'Youth unemployment in Jordan', dec: 2 },
            { val: 7, suf: 'K+', label: 'ICT graduates per year', dec: 0 },
            { val: 14, suf: ' days', label: 'Average time to hire', dec: 0 },
            { val: 5, pre: '<', suf: '%', label: 'Acceptance rate', dec: 0 },
          ].map((s, i) => (
            <ScrollReveal key={s.label} delay={0.1 + i * 0.08}>
              <div className="text-center md:text-left">
                <div
                  className="flex items-baseline justify-center md:justify-start"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.pre && (
                    <span className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#E58A0F]">
                      {s.pre}
                    </span>
                  )}
                  <NumberTicker
                    value={s.val}
                    decimalPlaces={s.dec}
                    className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#E58A0F] tracking-tighter"
                  />
                  <span className="text-[1.2rem] md:text-[1.5rem] font-bold text-[#E58A0F] ml-0.5">
                    {s.suf}
                  </span>
                </div>
                <p className="text-[13px] text-[#6B6B66] dark:text-[#8A8A86] mt-1 font-medium">
                  {s.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
