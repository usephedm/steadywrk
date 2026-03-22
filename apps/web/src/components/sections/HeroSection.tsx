'use client';

import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BlurFade } from '@/components/ui/blur-fade';
import { Particles } from '@/components/ui/particles';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TextAnimate } from '@/components/ui/text-animate';
import { WordRotate } from '@/components/ui/word-rotate';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const LogoTotem3D = dynamic(
  () => import('@/components/ui/logo-totem-3d').then((m) => m.LogoTotem3D),
  { ssr: false },
);

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const totemProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background: brand photography */}
      <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
        <Image
          src="/brand/steadywrk-ai-work.webp"
          alt="STEADYWRK team working on AI systems in the Amman office"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
          style={{ filter: 'brightness(0.45) saturate(1.1)' }}
        />
      </motion.div>

      {/* Particles — reduced to 30 for performance */}
      <Particles
        className="absolute inset-0 z-[1]"
        quantity={30}
        color="#E58A0F"
        size={0.5}
        staticity={40}
        ease={60}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
      <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#0A0A0A]/70 via-[#0A0A0A]/30 to-transparent" />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Hero content — split layout: text LEFT, 3D totem RIGHT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-4 items-center pt-28 pb-20 md:pt-32 md:pb-28">
        {/* Left: Text */}
        <motion.div className="max-w-2xl" style={{ opacity: heroOpacity }}>
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

          <BlurFade delay={0.2} direction="up">
            <h1
              className="text-[clamp(2.5rem,1rem+4vw,5rem)] leading-[1.04] tracking-[-0.03em] font-extrabold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <TextAnimate animation="blurInUp" by="word" as="span" startOnView={false} once>
                If you&apos;re disciplined, bright, and hungry
              </TextAnimate>
              <br className="hidden md:block" />
              <span className="text-[#E58A0F]">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  as="span"
                  delay={0.4}
                  startOnView={false}
                  once
                >
                  this is where your curve bends upward.
                </TextAnimate>
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.5} direction="up">
            <div className="mt-6 flex items-center gap-2 text-white/40 text-[clamp(1rem,0.9rem+0.3vw,1.15rem)]">
              <span>Where ambition</span>
              <WordRotate
                words={['compounds.', 'accelerates.', 'materializes.', 'transforms.']}
                duration={2000}
                className="text-[#E58A0F] font-semibold inline-block"
              />
            </div>
          </BlurFade>

          <BlurFade delay={0.7} direction="up">
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
        </motion.div>

        {/* Right: 3D Logo Totem */}
        <div className="hidden lg:block relative h-[500px]">
          <motion.div
            className="absolute inset-0"
            style={{ opacity: heroOpacity }}
          >
            <LogoTotem3D
              className="w-full h-full"
              scrollProgress={totemProgress.get()}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF8] to-transparent z-20 dark:from-[#111110]" />
    </section>
  );
}
