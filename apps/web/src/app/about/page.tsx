import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { COMPANY } from '@/lib/data';
import { Globe, MapPin, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About STEADYWRK',
  description:
    'AI-native career-launch platform. US-incorporated, Jordan-operated. Building the bridge between education and elite work for Jordan\u2019s most ambitious talent.',
  alternates: {
    canonical: 'https://steadywrk.app/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="pt-16">
        {/* Header */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <nav className="text-[13px] text-[#B0B0AB] mb-8">
              <Link href="/" className="hover:text-[#6E695F] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#23211D]">About</span>
            </nav>
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
              About Us
            </p>
            <h1
              className="text-[clamp(2.5rem,1rem+4vw,4rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.03em] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Where ambition compounds.
            </h1>
            <p className="text-[#6E695F] text-[17px] leading-relaxed">
              STEADYWRK is an AI-native career-launch platform built for Jordan&rsquo;s most
              ambitious talent. We bridge the gap between world-class education and world-class
              work.
            </p>
          </div>
        </section>

        {/* Workspace photo */}
        <section className="relative h-[320px] md:h-[420px] overflow-hidden">
          <Image
            src="/brand/steadywrk-workspace.webp"
            alt="STEADYWRK modern workspace in Amman"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F4EE] via-transparent to-[#FAFAF8]/30" />
        </section>

        {/* Story */}
        <section className="py-16 md:py-24 px-6 bg-[#F7F4EE]">
          <div className="max-w-3xl mx-auto space-y-12">
            <div>
              <h2
                className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                The Problem
              </h2>
              <p className="text-[#6E695F] text-[16px] leading-relaxed mb-4">
                Jordan produces 7,000+ ICT graduates every year. 41.72% of youth are unemployed. 66% of
                young women can&rsquo;t find work that matches their talent. The pipeline between
                education and elite work is broken.
              </p>
              <p className="text-[#6E695F] text-[16px] leading-relaxed">
                Traditional employers offer generic ATS templates, 30-day hiring timelines, and no
                feedback. Ambitious people deserve better.
              </p>
            </div>

            <div>
              <h2
                className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our Approach
              </h2>
              <p className="text-[#6E695F] text-[16px] leading-relaxed mb-4">
                We&rsquo;re building the bridge. STEADYWRK combines AI-powered operations,
                structured hiring, and real mentorship to launch careers at speed. You ship
                production AI systems from week one — not a simulation.
              </p>
              <p className="text-[#6E695F] text-[16px] leading-relaxed">
                14-day hiring. 48-hour response to every applicant. Structured scorecards,
                transparent criteria, and constructive feedback at every stage. Speed is our brand.
                Fairness is our foundation.
              </p>
            </div>

            <div>
              <h2
                className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Where We Are
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Globe,
                    label: 'US-Incorporated',
                    desc: 'STEADYWRK LLC — serving US clients with Jordan talent.',
                  },
                  {
                    icon: MapPin,
                    label: 'Amman, Jordan',
                    desc: 'Building 15, King Hussein Business Park. Where the work happens.',
                  },
                  {
                    icon: Users,
                    label: 'Cohort Model',
                    desc: 'We hire in cohorts. Same start date, shared momentum, built-in community.',
                  },
                  {
                    icon: Zap,
                    label: 'AI-Native',
                    desc: 'Every vertical runs on AI. You don\u2019t observe AI — you build with it.',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-xl p-6 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <item.icon className="w-5 h-5 text-[#E58A0F] mb-3" strokeWidth={1.5} />
                    <h3
                      className="text-[16px] font-bold text-[#23211D] mb-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.label}
                    </h3>
                    <p className="text-[#6E695F] text-[14px] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 px-6 bg-[#FAFAF8]">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Want to be part of this?
            </h2>
            <p className="text-[#6E695F] text-[16px] mb-8">
              We&rsquo;re hiring across engineering, AI, operations, and marketing.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2.5 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-8 py-3.5 rounded-lg transition-colors duration-[180ms]"
            >
              View open positions
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
