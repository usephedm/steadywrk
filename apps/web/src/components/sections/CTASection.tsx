'use client';

import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="relative py-24 md:py-36 px-6 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-[#E58A0F]/[0.03] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <ScrollReveal>
          <GraduationCap className="w-7 h-7 text-[#F5A623] mx-auto mb-6" strokeWidth={1.5} />
          <h2
            className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to build something real?
          </h2>
          <p className="text-white/35 text-[16px] leading-relaxed mb-10 max-w-md mx-auto">
            6–8 minutes. No account required. We review within 48 hours and respond to every
            applicant.
          </p>
          <Link href="/careers">
            <ShimmerButton
              shimmerColor="#F5C563"
              shimmerSize="0.05em"
              background="#E58A0F"
              borderRadius="8px"
              className="text-[16px] font-semibold px-10 py-4 flex items-center gap-3 mx-auto"
            >
              Start Your Application <ArrowRight className="w-5 h-5" />
            </ShimmerButton>
          </Link>
          <p className="mt-5 text-white/15 text-[14px]">
            Or email{' '}
            <a
              href="mailto:hello@steadywrk.app"
              className="underline underline-offset-2 hover:text-white/30 transition-colors"
            >
              hello@steadywrk.app
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
