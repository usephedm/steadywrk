'use client';

import { HyperText } from '@/components/ui/hyper-text';
import { Particles } from '@/components/ui/particles';
import { ScrollReveal, StaggerContainer, staggerItem } from '@/components/ui/scroll-reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { PROGRAMS } from '@/lib/data';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const PROGRAM_COLORS: Record<string, string> = {
  IGNITE: '#0F6B6F',
  ORBIT: '#E58A0F',
  APEX: '#F5C563',
};

export function ProgramsSection() {
  return (
    <section
      id="programs"
      className="relative py-20 md:py-32 px-6 bg-[#1A1A18] overflow-hidden"
    >
      {/* Blurred background photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/brand/steadywrk-workspace.webp"
          alt="STEADYWRK workspace background"
          fill
          className="object-cover opacity-[0.07] blur-sm"
          sizes="100vw"
          loading="lazy"
        />
      </div>

      <Particles
        className="absolute inset-0 z-[1]"
        quantity={20}
        color="#E58A0F"
        size={0.4}
        staticity={80}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="text-[13px] uppercase tracking-[0.12em] text-[#F5A623] font-semibold mb-4">
            Career Programs
          </p>
          <h2
            className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Three tracks. One trajectory.
          </h2>
          <p className="text-white/35 text-[16px] leading-relaxed max-w-lg mb-14">
            Every program builds real skills with real projects. No simulations. You ship
            production work serving US clients.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-5" stagger={0.1}>
          {PROGRAMS.map((p) => (
            <motion.div key={p.name} variants={staggerItem}>
              <TiltCard className="h-full" tiltAmount={5}>
                <motion.div
                  className="bg-[#1A1A18]/80 backdrop-blur-sm rounded-xl p-7 border border-white/[0.05] group h-full"
                  style={{
                    borderTopWidth: '3px',
                    borderTopColor: PROGRAM_COLORS[p.name] ?? '#E58A0F',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#F5A623] font-semibold mb-3">
                    {p.type} · {p.duration}
                  </div>
                  <h3
                    className="text-[28px] font-extrabold text-white mb-3 tracking-[-0.02em]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <HyperText
                      startOnView
                      animateOnHover
                      duration={600}
                      className="text-[28px] font-extrabold text-white"
                    >
                      {p.name}
                    </HyperText>
                  </h3>
                  <p className="text-white/35 text-[15px] leading-relaxed mb-6">{p.desc}</p>
                  <Link
                    href={`/programs/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#F5A623] hover:text-white transition-colors duration-[180ms]"
                  >
                    Learn about {p.name} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </TiltCard>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
