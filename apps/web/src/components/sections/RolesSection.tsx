'use client';

import { BorderBeam } from '@/components/ui/border-beam';
import { ScrollReveal, StaggerContainer, staggerItem } from '@/components/ui/scroll-reveal';
import { ROLES } from '@/lib/data';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RolesSection() {
  return (
    <section id="roles" className="py-20 md:py-32 px-6 bg-[#FAFAF8] dark:bg-[#111110]">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
              Open Positions
            </p>
            <h2
              className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Join the team.
            </h2>
            <p className="mt-3 text-[#6E695F] dark:text-[#8A8A86] text-[15px] max-w-md leading-relaxed">
              Apply in 6 minutes. Hear back in 48 hours.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="space-y-2">
          {ROLES.map((role) => (
            <motion.div key={role.title} variants={staggerItem}>
              <div className="relative rounded-xl">
                <Link
                  href={`/careers/${role.slug}`}
                  className={`relative group flex items-center justify-between p-5 md:px-7 md:py-6 bg-white dark:bg-[#1A1A18] rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-[180ms] ${
                    role.featured
                      ? 'border-[#E58A0F]/20 ring-1 ring-[#E58A0F]/10'
                      : 'border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3
                        className="text-[17px] font-bold text-[#23211D] dark:text-[#E8E8E6] group-hover:text-[#E58A0F] transition-colors duration-[180ms]"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {role.title}
                      </h3>
                      {role.featured && (
                        <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#E58A0F] bg-[#E58A0F]/8 px-2 py-0.5 rounded-full">
                          Hiring Now
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6B6B66] dark:text-[#8A8A86]">
                        {role.dept}
                      </span>
                      <span className="w-0.5 h-0.5 rounded-full bg-[#B0B0AB]" />
                      <span className="text-[13px] text-[#6E695F] dark:text-[#8A8A86]">
                        {role.type}
                      </span>
                      <span className="w-0.5 h-0.5 rounded-full bg-[#B0B0AB]" />
                      <span className="text-[13px] text-[#6E695F] dark:text-[#8A8A86]">
                        {role.location}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                    <span className="text-[14px] text-[#E58A0F] font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-[250ms]">
                      {role.salary}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#B0B0AB] group-hover:text-[#E58A0F] group-hover:translate-x-1 transition-all duration-[180ms]" />
                  </div>
                </Link>
                {role.featured && <BorderBeam size={150} duration={10} color="#E58A0F" />}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 text-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[#E58A0F] hover:text-[#CC7408] transition-colors duration-[180ms]"
            >
              View all positions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
