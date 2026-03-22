'use client';

import { ScrollReveal, StaggerContainer, staggerItem } from '@/components/ui/scroll-reveal';
import { motion } from 'motion/react';
import { Brain, Building2, Megaphone, Sparkles } from 'lucide-react';

const SERVICES_INLINE = [
  {
    icon: Brain,
    title: 'AI Lab & Studio',
    desc: 'Custom AI agents. LLM integration. Autonomous workflow architecture.',
  },
  {
    icon: Building2,
    title: 'Facility Management',
    desc: 'Field service dispatch. Preventive maintenance. 24/7 emergency response.',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    desc: 'SEO that ranks. Paid media that converts. Content that compounds.',
  },
  {
    icon: Sparkles,
    title: 'AI BPO',
    desc: 'AI-enhanced support. Document processing. Back-office automation at scale.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32 px-6 bg-[#FAFAF8] dark:bg-[#111110]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <ScrollReveal>
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
              What We Build
            </p>
            <h2
              className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em] mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Four verticals.
              <br />
              One platform.
            </h2>
            <p className="text-[#6E695F] dark:text-[#8A8A86] text-[16px] leading-relaxed">
              US clients. Jordan talent. AI-first operations across every service line. We
              don&apos;t outsource — we operate.
            </p>
          </ScrollReveal>
        </div>
        <StaggerContainer className="md:col-span-7 grid sm:grid-cols-2 gap-4">
          {SERVICES_INLINE.map((s) => (
            <motion.div key={s.title} variants={staggerItem}>
              <motion.div
                className="bg-white dark:bg-[#1A1A18] rounded-xl p-6 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group cursor-default h-full"
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                transition={{ duration: 0.18 }}
              >
                <s.icon
                  className="w-5 h-5 text-[#6B6B66] dark:text-[#8A8A86] group-hover:text-[#E58A0F] transition-colors duration-[180ms] mb-3"
                  strokeWidth={1.5}
                />
                <h3
                  className="text-[16px] font-bold text-[#23211D] dark:text-[#E8E8E6] mb-1.5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.title}
                </h3>
                <p className="text-[#6E695F] dark:text-[#8A8A86] text-[14px] leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
