'use client';

import { Marquee } from '@/components/ui/marquee';
import { TextReveal } from '@/components/ui/text-reveal';
import { TECH } from '@/lib/data';

export function QuoteSection() {
  return (
    <section className="bg-[#F7F4EE] dark:bg-[#1A1A18]">
      <TextReveal className="[&>div]:max-w-3xl [&>div]:mx-auto">
        Built for people who want their growth to compound — STEADYWRK
      </TextReveal>

      {/* Tech stack marquee */}
      <div className="py-5 border-y border-[#E5E5E2] dark:border-[#2A2A28] overflow-hidden">
        <Marquee pauseOnHover className="[--duration:35s] [--gap:3rem]">
          {TECH.map((t) => (
            <span
              key={t}
              className="text-[13px] font-medium text-[#B0B0AB] dark:text-[#4A4A47] whitespace-nowrap uppercase tracking-[0.06em]"
            >
              {t}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
