'use client';

import { Marquee } from '@/components/ui/marquee';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export function CredibilityBar() {
  return (
    <section className="py-8 md:py-10 px-6 bg-[#FAFAF8] dark:bg-[#111110] border-b border-[#E5E5E2] dark:border-[#2A2A28]">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#6B6B66] dark:text-[#8A8A86] font-medium text-center mb-6">
            Built at
          </p>
        </ScrollReveal>
        <Marquee pauseOnHover className="[--duration:30s] [--gap:4rem]">
          {[
            'King Hussein Business Park',
            'est. 2026',
            'Amman, Jordan',
            'US-Incorporated',
            'AI-Native',
            'Cohort #1 Forming',
          ].map((item) => (
            <span
              key={item}
              className="text-[13px] font-medium text-[#74746D] dark:text-[#4A4A47] whitespace-nowrap uppercase tracking-[0.06em]"
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
