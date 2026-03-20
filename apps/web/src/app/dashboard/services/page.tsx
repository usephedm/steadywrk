'use client';

import { AnimatedTitle } from '@/components/ui/animated-title';
import { BorderBeam } from '@/components/ui/border-beam';
import { TiltCard } from '@/components/ui/tilt-card';
import { WhatsAppFloat } from '@/components/ui/whatsapp-float';
import { COMPANY, SERVICES } from '@/lib/data';
import { motion } from 'framer-motion';
import { Bot, Brain, Building2, type LucideIcon, Megaphone } from 'lucide-react';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1] as const;

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Building2,
  Megaphone,
  Bot,
};

export default function ServicesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <WhatsAppFloat />

      {/* Header */}
      <div className="mb-16">
        <AnimatedTitle
          text="Our Services"
          className="text-4xl sm:text-5xl font-bold tracking-tighter text-white"
        />
        <motion.p
          className="text-white/40 text-sm tracking-[0.2em] uppercase font-mono mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          What we build
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

      {/* Service sections */}
      <div className="space-y-8">
        {SERVICES.map((service, i) => {
          const IconComponent = ICON_MAP[service.icon];
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease }}
            >
              <TiltCard
                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-amber-500/15 transition-colors duration-300 overflow-hidden"
                tiltAmount={3}
              >
                <BorderBeam
                  size={120}
                  duration={10}
                  delay={i * 2}
                  color="rgba(245,158,11,0.4)"
                  colorTo="rgba(245,158,11,0)"
                />
                <div className="flex items-start gap-6 relative">
                  {IconComponent && (
                    <div className="shrink-0 p-4 rounded-xl bg-amber-500/10 border border-amber-500/10">
                      <IconComponent className="h-8 w-8 text-amber-500" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">{service.title}</h2>
                    <p className="text-white/40 text-sm leading-relaxed">{service.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {service.features.map((feature, j) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.5 + i * 0.12 + j * 0.05,
                            ease,
                          }}
                          className="text-white/30 text-xs flex items-center gap-2"
                        >
                          <span className="text-amber-500/50 text-[10px]">▸</span>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Company overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center space-y-4"
      >
        <div className="inline-block px-6 py-3 rounded-full border border-white/[0.06] bg-white/[0.02]">
          <p className="text-white/30 text-sm font-mono">
            US company. Now in Jordan. Building the future of work.
          </p>
        </div>
        <p className="text-white/15 text-xs">
          {COMPANY.legal} · {COMPANY.parent}
        </p>
        <Link
          href="/dashboard/contact"
          className="inline-flex items-center gap-2 text-amber-500/70 text-sm font-mono tracking-wider uppercase hover:text-amber-500 transition-colors mt-4 group"
          data-interactive
        >
          Interested? Get in touch
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>
    </div>
  );
}
