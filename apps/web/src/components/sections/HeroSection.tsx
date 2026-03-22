'use client';

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BlurFade } from '@/components/ui/blur-fade';
import { Particles } from '@/components/ui/particles';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { WordRotate } from '@/components/ui/word-rotate';
import { ArrowRight, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

/* Only lazy-load the heavy 3D component */
const LogoTotem3D = dynamic(
  () => import('@/components/ui/logo-totem-3d').then((m) => m.LogoTotem3D),
  { ssr: false, loading: () => <div className="w-full h-full" /> },
);

/**
 * HeroSection — Performance-optimized
 *
 * This is a client component (uses WordRotate, AnimatedShinyText, etc.)
 * but lives inside a Server Component page (page.tsx has NO 'use client').
 * The page.tsx RSC conversion is the big perf win — this component
 * is a client island within the server-rendered shell.
 *
 * Changes from original:
 * - Removed parallax/scroll transforms (saved TBT)
 * - Particles hidden on mobile, reduced to 20
 * - LogoTotem3D lazy-loaded (Three.js is heavy)
 * - Image quality explicit at 75, priority + fetchPriority="high"
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Background: brand photography — static, no parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/brand/steadywrk-ai-work.webp"
          alt="STEADYWRK team working on AI systems in the Amman office"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAABv/EAB0QAAICAgMBAAAAAAAAAAAAAAECAAMEBREhMUH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBf/EABkRAAIDAQAAAAAAAAAAAAAAAAABAgMRIf/aAAwDAQACEQMRAD8AkdTl3Y+TRXTcyKsu4Kjr7EROxjpVmtn/2Q=="
          style={{ filter: 'brightness(0.45) saturate(1.1)' }}
        />
      </div>

      {/* Particles — hidden on mobile for performance */}
      <div className="absolute inset-0 z-[1] hidden md:block">
        <Particles
          className="absolute inset-0"
          quantity={20}
          color="#E58A0F"
          size={0.4}
          staticity={50}
          ease={80}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-[#0A0A0A]/20" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#0A0A0A]/70 to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-4 items-center pt-28 pb-20 md:pt-32 md:pb-28">
        {/* Left: Text */}
        <div className="max-w-2xl">
          <BlurFade delay={0.1} direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur-sm mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E58A0F] animate-pulse" />
              <AnimatedShinyText
                className="text-[13px] text-white/60 font-medium"
                shimmerWidth={80}
              >
                Now hiring in Amman — Cohort #1 forming
              </AnimatedShinyText>
            </div>
          </BlurFade>

          <BlurFade delay={0.15} direction="up">
            <h1
              className="text-[clamp(2.5rem,1rem+4vw,5rem)] leading-[1.04] tracking-[-0.03em] font-extrabold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span>If you&apos;re disciplined, bright, and hungry</span>
              <br className="hidden md:block" />
              <span className="text-[#E58A0F]">
                this is where your curve bends upward.
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.3} direction="up">
            <div className="mt-6 flex items-center gap-2 text-white/40 text-[clamp(1rem,0.9rem+0.3vw,1.15rem)]">
              <span>Where ambition</span>
              <WordRotate
                words={['compounds.', 'accelerates.', 'materializes.', 'transforms.']}
                duration={2000}
                className="text-[#E58A0F] font-semibold inline-block"
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.4} direction="up">
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/careers">
                <ShimmerButton
                  shimmerColor="#F5C563"
                  shimmerSize="0.05em"
                  background="#E58A0F"
                  borderRadius="8px"
                  className="text-[15px] font-medium px-8 py-3.5 flex items-center gap-2.5"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </Link>
              <Link
                href="/programs"
                className="text-white/40 hover:text-white/70 px-8 py-3.5 rounded-lg text-[15px] font-medium transition-all duration-[180ms] inline-flex items-center gap-2 border border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
              >
                See how we hire <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </BlurFade>
        </div>

        {/* Right: 3D Logo Totem — lazy loaded, hidden on mobile */}
        <div className="hidden lg:block relative h-[500px]">
          <LogoTotem3D className="w-full h-full" />
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF8] to-transparent z-20 dark:from-[#111110]" />
    </section>
  );
}
