'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BlurFade } from '@/components/ui/blur-fade';
import { HyperText } from '@/components/ui/hyper-text';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Particles } from '@/components/ui/particles';
import { ScrollReveal, StaggerContainer, staggerItem } from '@/components/ui/scroll-reveal';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TextAnimate } from '@/components/ui/text-animate';
import { WordRotate } from '@/components/ui/word-rotate';
import { PROGRAMS, ROLES, TECH } from '@/lib/data';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  Building2,
  ChevronRight,
  Globe,
  GraduationCap,
  MapPin,
  Megaphone,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

const LogoTotem3D = dynamic(
  () => import('@/components/ui/logo-totem-3d').then((m) => m.LogoTotem3D),
  { ssr: false },
);

/* Brand motion tokens — Guidelines v2 §09 */
const ease = [0.22, 1, 0.36, 1] as const;

const VALUES = [
  {
    icon: Target,
    title: 'Elite Standards',
    desc: 'Hard to get into. Every hire is deliberate. Structured scorecards, transparent criteria.',
    stat: '<5%',
    statLabel: 'acceptance rate',
  },
  {
    icon: TrendingUp,
    title: 'Visible Growth',
    desc: 'Promotions, mentorship, shipped work. Your trajectory is legible — not a vague promise.',
    stat: '14',
    statLabel: 'day hiring target',
  },
  {
    icon: Shield,
    title: 'Real Fairness',
    desc: 'No "culture fit" guessing. Same questions. We respond within 48 hours. Always.',
    stat: '48h',
    statLabel: 'response time',
  },
  {
    icon: Zap,
    title: 'Speed as Brand',
    desc: 'Fast hiring. Fast feedback. Fast growth. 14-day target. The name promises momentum.',
    stat: '6 min',
    statLabel: 'to apply',
  },
];

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

const CULTURE_PHOTOS = [
  { src: '/brand/office-warm.webp', caption: 'Our Amman HQ — King Hussein Business Park' },
  { src: '/brand/hero-tech.webp', caption: 'Building AI systems, day one' },
  { src: '/brand/office-amber.webp', caption: 'Where ambition compounds' },
];

const PROGRAM_COLORS: Record<string, string> = {
  IGNITE: '#0F6B6F',
  ORBIT: '#E58A0F',
  APEX: '#F5C563',
};

export default function HomePage() {
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
    <>
      <Navbar />

      <main id="main-content">
        {/* ━━━ 1. HERO — Cinematic parallax with 3D Totem ━━━ */}
        <section
          ref={heroRef}
          className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#0A0A0A]"
        >
          {/* Background: brand photography */}
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
            <Image
              src="/brand/hero-slate.webp"
              alt=""
              fill
              priority
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
                    duration={2800}
                    className="text-[#E58A0F] font-semibold inline-block"
                  />
                </div>
              </BlurFade>

              <BlurFade delay={0.7} direction="up">
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link href="/apply/operations-dispatcher">
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

        {/* ━━━ 2. CREDIBILITY BAR — Social proof ━━━ */}
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
                  className="text-[13px] font-medium text-[#B0B0AB] dark:text-[#4A4A47] whitespace-nowrap uppercase tracking-[0.06em]"
                >
                  {item}
                </span>
              ))}
            </Marquee>
          </div>
        </section>

        {/* ━━━ 3. WHY STEADYWRK — Asymmetric 2+1 grid ━━━ */}
        <section id="about" className="py-20 md:py-32 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18]">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                Why STEADYWRK
              </p>
              <h2
                className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em] max-w-xl mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Built for people who want their growth to compound.
              </h2>
              <p className="mt-3 text-[#6E695F] dark:text-[#8A8A86] text-[16px] leading-relaxed max-w-lg mb-14">
                Jordan produces 7,000+ tech graduates a year. 66% of young women are unemployed.
                The pipeline between education and elite work is broken. We&apos;re building the
                bridge.
              </p>
            </ScrollReveal>

            {/* Asymmetric grid: 2 stacked left + 1 tall right */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Left column: 2 stacked cards */}
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                {VALUES.slice(0, 2).map((v, i) => (
                  <ScrollReveal key={v.title} delay={0.1 + i * 0.08}>
                    <motion.div
                      className="bg-white dark:bg-[#222220] rounded-xl p-6 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group cursor-default h-full"
                      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      transition={{ duration: 0.18 }}
                    >
                      <v.icon
                        className="w-5 h-5 text-[#6B6B66] dark:text-[#8A8A86] group-hover:text-[#E58A0F] transition-colors duration-[180ms] mb-4"
                        strokeWidth={1.5}
                      />
                      <h3
                        className="text-[17px] font-bold text-[#23211D] dark:text-[#E8E8E6] mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {v.title}
                      </h3>
                      <p className="text-[#6E695F] dark:text-[#8A8A86] text-[14px] leading-relaxed mb-4">
                        {v.desc}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-[1.5rem] font-extrabold text-[#E58A0F]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {v.stat}
                        </span>
                        <span className="text-[12px] text-[#6B6B66] dark:text-[#8A8A86]">
                          {v.statLabel}
                        </span>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
                {/* Bottom row: speed & fairness */}
                {VALUES.slice(2).map((v, i) => (
                  <ScrollReveal key={v.title} delay={0.2 + i * 0.08}>
                    <motion.div
                      className="bg-white dark:bg-[#222220] rounded-xl p-6 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group cursor-default h-full"
                      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      transition={{ duration: 0.18 }}
                    >
                      <v.icon
                        className="w-5 h-5 text-[#6B6B66] dark:text-[#8A8A86] group-hover:text-[#E58A0F] transition-colors duration-[180ms] mb-4"
                        strokeWidth={1.5}
                      />
                      <h3
                        className="text-[17px] font-bold text-[#23211D] dark:text-[#E8E8E6] mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {v.title}
                      </h3>
                      <p className="text-[#6E695F] dark:text-[#8A8A86] text-[14px] leading-relaxed mb-4">
                        {v.desc}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-[1.5rem] font-extrabold text-[#E58A0F]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {v.stat}
                        </span>
                        <span className="text-[12px] text-[#6B6B66] dark:text-[#8A8A86]">
                          {v.statLabel}
                        </span>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>

              {/* Right column: 1 tall feature card with image */}
              <ScrollReveal delay={0.15} className="md:col-span-1">
                <motion.div
                  className="relative rounded-xl overflow-hidden h-full min-h-[320px] group cursor-default border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]"
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  transition={{ duration: 0.18 }}
                >
                  <Image
                    src="/brand/office-warm.webp"
                    alt="STEADYWRK Amman office"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#0A0A0A]/30 to-transparent" />
                  {/* Warm overlay */}
                  <div className="absolute inset-0 bg-[#FFF8F0] mix-blend-multiply opacity-[0.08]" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#F5A623] font-semibold mb-2">
                      The Promise
                    </p>
                    <h3
                      className="text-[20px] font-bold text-white mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Where ambition compounds
                    </h3>
                    <p className="text-white/60 text-[14px] leading-relaxed">
                      Ship production AI systems in week one. Lead a team by month six.
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ━━━ 4. OPEN ROLES — Staggered grid ━━━ */}
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
                  <Link
                    href={`/careers/${role.slug}`}
                    className={`group flex items-center justify-between p-5 md:px-7 md:py-6 bg-white dark:bg-[#1A1A18] rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-[180ms] ${
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

        {/* ━━━ 5. PROGRAMS (IGNITE / ORBIT / APEX) — Dark accent ━━━ */}
        <section
          id="programs"
          className="relative py-20 md:py-32 px-6 bg-[#1A1A18] overflow-hidden"
        >
          {/* Blurred background photo */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/brand/office-amber.webp"
              alt=""
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
                  <motion.div
                    className="bg-[#1A1A18]/80 backdrop-blur-sm rounded-xl p-7 border border-white/[0.05] group h-full"
                    style={{
                      borderTopWidth: '3px',
                      borderTopColor: PROGRAM_COLORS[p.name] ?? '#E58A0F',
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    }}
                    transition={{ duration: 0.2 }}
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
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ━━━ 6. DAY IN LIFE — Culture gallery ━━━ */}
        <section className="py-20 md:py-32 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18]">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                Life at STEADYWRK
              </p>
              <h2
                className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.1] tracking-[-0.02em] mb-12"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Where the work happens.
              </h2>
            </ScrollReveal>

            {/* Desktop: horizontal scroll gallery */}
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory md:pb-4 scrollbar-hide md:flex-row flex-col">
              {CULTURE_PHOTOS.map((photo, i) => (
                <ScrollReveal
                  key={photo.src}
                  direction={i % 2 === 0 ? 'left' : 'right'}
                  delay={i * 0.1}
                  className="md:min-w-[380px] md:max-w-[420px] w-full snap-center shrink-0"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 420px"
                      loading="lazy"
                    />
                    {/* Warm overlay */}
                    <div className="absolute inset-0 bg-[#FFF8F0] mix-blend-multiply opacity-[0.08]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-white/80 text-[14px] font-medium">{photo.caption}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 7. GROWTH METRICS — Big numbers ━━━ */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] dark:bg-[#111110]">
          <div className="max-w-5xl mx-auto">
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

        {/* ━━━ 8. TESTIMONIAL / QUOTE + Tech Marquee ━━━ */}
        <section className="py-20 md:py-28 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18]">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <blockquote>
                <p
                  className="text-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.2] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  &ldquo;Built for people who want their{' '}
                  <span className="text-[#E58A0F]">growth to compound.</span>&rdquo;
                </p>
                <footer className="mt-6 text-[14px] text-[#6B6B66] dark:text-[#8A8A86] font-medium">
                  — STEADYWRK
                </footer>
              </blockquote>
            </ScrollReveal>
          </div>

          {/* Tech stack marquee */}
          <div className="mt-16 py-5 border-y border-[#E5E5E2] dark:border-[#2A2A28] overflow-hidden">
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

        {/* ━━━ 9. SERVICES — What we build ━━━ */}
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

        {/* ━━━ 10. CTA FOOTER — Dark conversion section ━━━ */}
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
              <Link href="/apply/operations-dispatcher">
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
      </main>

      <Footer />
    </>
  );
}
