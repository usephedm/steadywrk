'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BlurFade } from '@/components/ui/blur-fade';
import { HyperText } from '@/components/ui/hyper-text';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Particles } from '@/components/ui/particles';
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

const OrbitalField = dynamic(
  () => import('@/components/ui/orbital-field').then((m) => m.OrbitalField),
  { ssr: false },
);

/* Brand motion tokens — Guidelines v2 §09 */
const ease = [0.22, 1, 0.36, 1] as const;

const VALUES = [
  {
    icon: Target,
    title: 'Elite Standards',
    desc: 'Hard to get into. Every hire is deliberate. Structured scorecards, transparent criteria.',
  },
  {
    icon: TrendingUp,
    title: 'Visible Growth',
    desc: 'Promotions, mentorship, shipped work. Your trajectory is legible — not a vague promise.',
  },
  {
    icon: Shield,
    title: 'Real Fairness',
    desc: 'No "culture fit" guessing. Same questions. We respond within 48 hours. Always.',
  },
  {
    icon: Zap,
    title: 'Speed as Brand',
    desc: 'Fast hiring. Fast feedback. Fast growth. 14-day target. The name promises momentum.',
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

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* ━━━ 1. HERO — Cinematic parallax ━━━ */}
        <section
          ref={heroRef}
          className="relative min-h-[100dvh] flex items-end overflow-hidden bg-[#0A0A0A]"
        >
          <motion.div className="absolute inset-0 z-0" style={{ y: heroY, scale: heroScale }}>
            <Image
              src="/brand/hero-slate.webp"
              alt=""
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              style={{ filter: 'brightness(0.55)' }}
            />
          </motion.div>

          <Particles
            className="absolute inset-0 z-[1]"
            quantity={50}
            color="#E58A0F"
            size={0.6}
            staticity={40}
            ease={60}
          />

          <OrbitalField className="z-[2] opacity-40 mix-blend-screen" />

          <div className="absolute inset-0 z-[3] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
          <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[#0A0A0A]/60 to-transparent" />

          <div
            className="absolute inset-0 z-[4] pointer-events-none opacity-[0.025] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />

          <motion.div
            className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 pb-20 md:pb-28 pt-32"
            style={{ opacity: heroOpacity }}
          >
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
                className="text-[clamp(2.5rem,1rem+5vw,5rem)] leading-[1.04] tracking-[-0.03em] font-extrabold text-white max-w-[800px]"
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
                  className="text-white/40 hover:text-white/70 px-8 py-3.5 rounded-lg text-[15px] font-medium transition-all duration-[180ms] inline-flex items-center gap-2 border border-white/8 hover:border-white/15 hover:bg-white/[0.03]"
                >
                  See how selection works <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </BlurFade>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF8] to-transparent z-20" />
        </section>

        {/* ━━━ 2. PROOF — Number tickers ━━━ */}
        <section className="py-16 md:py-20 px-6 bg-[#FAFAF8]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-14">
            {[
              { val: 46, suf: '%', label: 'Youth unemployment in Jordan' },
              { val: 7, suf: 'K+', label: 'ICT graduates per year' },
              { val: 14, suf: ' days', label: 'Our hiring target' },
              { val: 48, suf: 'h', label: 'Application response' },
            ].map((s, i) => (
              <BlurFade key={s.label} delay={0.1 + i * 0.08} inView>
                <div className="text-left">
                  <div
                    className="flex items-baseline"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <NumberTicker
                      value={s.val}
                      className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#23211D] tracking-tighter"
                    />
                    <span className="text-[1.2rem] md:text-[1.5rem] font-bold text-[#E58A0F] ml-0.5">
                      {s.suf}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6E695F] mt-1">{s.label}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </section>

        {/* ━━━ 3. WHY STEADYWRK ━━━ */}
        <section id="about" className="py-20 md:py-32 px-6 bg-[#F7F4EE]">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-5">
                <BlurFade delay={0.1} inView>
                  <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                    Why STEADYWRK
                  </p>
                  <h2
                    className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] leading-[1.1] tracking-[-0.02em]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Built for people who want their growth to compound.
                  </h2>
                  <p className="mt-5 text-[#6E695F] text-[16px] leading-relaxed">
                    Jordan produces 7,000+ tech graduates a year. 66% of young women are unemployed.
                    The pipeline between education and elite work is broken. We&apos;re building the
                    bridge.
                  </p>
                </BlurFade>
              </div>

              <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
                {VALUES.map((v, i) => (
                  <BlurFade key={v.title} delay={0.15 + i * 0.08} inView>
                    <motion.div
                      className="bg-white rounded-xl p-6 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group cursor-default h-full"
                      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      transition={{ duration: 0.18 }}
                    >
                      <v.icon
                        className="w-5 h-5 text-[#6B6B66] group-hover:text-[#E58A0F] transition-colors duration-[180ms] mb-4"
                        strokeWidth={1.5}
                      />
                      <h3
                        className="text-[17px] font-bold text-[#23211D] mb-2"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {v.title}
                      </h3>
                      <p className="text-[#6E695F] text-[14px] leading-relaxed">{v.desc}</p>
                    </motion.div>
                  </BlurFade>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ 4. OPEN ROLES ━━━ */}
        <section id="roles" className="py-20 md:py-32 px-6 bg-[#FAFAF8]">
          <div className="max-w-5xl mx-auto">
            <BlurFade delay={0.1} inView>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
                <div>
                  <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                    Open Positions
                  </p>
                  <h2
                    className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] leading-[1.1] tracking-[-0.02em]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Join the team.
                  </h2>
                </div>
                <p className="text-[#6E695F] text-[15px] max-w-xs leading-relaxed">
                  You&apos;ll ship production AI systems in week one. Not a simulation.
                </p>
              </div>
            </BlurFade>

            <div className="space-y-2">
              {ROLES.map((role, i) => (
                <BlurFade key={role.title} delay={0.05 + i * 0.06} inView>
                  <Link
                    href={`/careers/${role.slug}`}
                    className={`flex items-center justify-between p-5 md:px-7 md:py-6 bg-white rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-[180ms] ${role.featured ? 'border-[#E58A0F]/20 ring-1 ring-[#E58A0F]/10' : 'border-[rgba(0,0,0,0.06)]'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3
                          className="text-[17px] font-bold text-[#23211D] group-hover:text-[#E58A0F] transition-colors duration-[180ms]"
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
                        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#6B6B66]">
                          {role.dept}
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-[#B0B0AB]" />
                        <span className="text-[13px] text-[#6E695F]">{role.type}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-[#B0B0AB]" />
                        <span className="text-[13px] text-[#6E695F]">{role.location}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                      <span className="text-[14px] text-[#E58A0F] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]">
                        {role.salary}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#B0B0AB] group-hover:text-[#E58A0F] group-hover:translate-x-1 transition-all duration-[180ms]" />
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>

            <BlurFade delay={0.4} inView>
              <div className="mt-8 text-center">
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[#E58A0F] hover:text-[#CC7408] transition-colors duration-[180ms]"
                >
                  View all positions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </BlurFade>
          </div>
        </section>

        {/* ━━━ 5. TECH MARQUEE ━━━ */}
        <div className="py-5 bg-[#FAFAF8] border-y border-[rgba(0,0,0,0.04)] overflow-hidden">
          <Marquee pauseOnHover className="[--duration:35s] [--gap:3rem]">
            {TECH.map((t) => (
              <span
                key={t}
                className="text-[13px] font-medium text-[#B0B0AB] whitespace-nowrap uppercase tracking-[0.06em]"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>

        {/* ━━━ 6. PROGRAMS ━━━ */}
        <section
          id="programs"
          className="relative py-20 md:py-32 px-6 bg-[#0A0A0A] overflow-hidden"
        >
          <Particles
            className="absolute inset-0 z-0"
            quantity={25}
            color="#E58A0F"
            size={0.4}
            staticity={80}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <BlurFade delay={0.1} inView>
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
            </BlurFade>

            <div className="grid md:grid-cols-3 gap-5">
              {PROGRAMS.map((p, i) => (
                <BlurFade key={p.name} delay={0.15 + i * 0.1} inView>
                  <motion.div
                    className="bg-[#1A1A18] rounded-xl p-7 border border-white/[0.05] group h-full"
                    style={
                      i === 1 ? { borderLeftWidth: '3px', borderLeftColor: '#E58A0F' } : undefined
                    }
                    whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
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
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 7. SERVICES ━━━ */}
        <section id="services" className="py-20 md:py-32 px-6 bg-[#FAFAF8]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5">
              <BlurFade delay={0.1} inView>
                <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                  What We Build
                </p>
                <h2
                  className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] leading-[1.1] tracking-[-0.02em] mb-5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Four verticals.
                  <br />
                  One platform.
                </h2>
                <p className="text-[#6E695F] text-[16px] leading-relaxed">
                  US clients. Jordan talent. AI-first operations across every service line. We
                  don&apos;t outsource — we operate.
                </p>
              </BlurFade>
            </div>
            <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
              {SERVICES_INLINE.map((s, i) => (
                <BlurFade key={s.title} delay={0.15 + i * 0.08} inView>
                  <motion.div
                    className="bg-white rounded-xl p-6 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group cursor-default h-full"
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.18 }}
                  >
                    <s.icon
                      className="w-5 h-5 text-[#6B6B66] group-hover:text-[#E58A0F] transition-colors duration-[180ms] mb-3"
                      strokeWidth={1.5}
                    />
                    <h3
                      className="text-[16px] font-bold text-[#23211D] mb-1.5"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[#6E695F] text-[14px] leading-relaxed">{s.desc}</p>
                  </motion.div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ 8. CREDIBILITY ━━━ */}
        <section className="py-20 md:py-28 px-6 bg-[#F7F4EE]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-5">
              <BlurFade delay={0.1} inView>
                <div className="relative rounded-xl overflow-hidden aspect-square max-w-[320px]">
                  <Image
                    src="/brand/icon-gold.webp"
                    alt="STEADYWRK mark"
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                </div>
              </BlurFade>
            </div>

            <div className="md:col-span-7">
              <BlurFade delay={0.2} inView>
                <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                  Who We Are
                </p>
                <h3
                  className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-4"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  STEADYWRK LLC
                </h3>
                <p className="text-[#6E695F] text-[16px] leading-relaxed mb-6">
                  US-incorporated. Jordan-operated. We serve US clients with Jordan&apos;s sharpest
                  talent. Building 15, King Hussein Business Park, Amman — where ambition compounds.
                </p>
                <div className="space-y-3 text-[15px] text-[#6E695F]">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#E58A0F] shrink-0" strokeWidth={1.5} />
                    <span>steadywrk.app</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#E58A0F] shrink-0" strokeWidth={1.5} />
                    <span>KHBP, Amman, Jordan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#E58A0F] shrink-0" strokeWidth={1.5} />
                    <span>Cohort #1 forming — {ROLES.length} open positions</span>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </section>

        {/* ━━━ 9. CTA ━━━ */}
        <section className="relative py-24 md:py-36 px-6 bg-[#0A0A0A] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-[#E58A0F]/[0.03] blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <BlurFade delay={0.1} inView>
              <GraduationCap className="w-7 h-7 text-[#F5A623] mx-auto mb-6" strokeWidth={1.5} />
              <h2
                className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-white leading-[1.1] tracking-[-0.02em] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Ready to apply?
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
            </BlurFade>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
