'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { BlurFade } from '@/components/ui/blur-fade';
import { DEPARTMENTS, ROLES } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CareersPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredRoles =
    activeFilter === 'All' ? ROLES : ROLES.filter((r) => r.dept === activeFilter);

  return (
    <>
      <Navbar />

      <main id="main-content" className="pt-16">
        {/* Header */}
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] dark:bg-[#111110]">
          <div className="max-w-5xl mx-auto">
            <BlurFade delay={0.1} direction="up">
              <nav className="text-[13px] text-[#B0B0AB] mb-8">
                <Link
                  href="/"
                  className="hover:text-[#6E695F] dark:text-[#8A8A86] transition-colors"
                >
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-[#23211D] dark:text-[#E8E8E6]">Careers</span>
              </nav>
              <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
                Open Positions
              </p>
              <h1
                className="text-[clamp(2.5rem,1rem+4vw,4rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.08] tracking-[-0.03em] mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Build something that matters.
              </h1>
              <p className="text-[#6E695F] dark:text-[#8A8A86] text-[17px] leading-relaxed max-w-xl">
                Ship production AI systems from week one. Structured hiring, transparent criteria,
                14-day timeline. We respond to every applicant within 48 hours.
              </p>
            </BlurFade>
          </div>
        </section>

        {/* Filters + Roles */}
        <section className="py-12 md:py-16 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18]">
          <div className="max-w-5xl mx-auto">
            {/* Department filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveFilter(dept)}
                  className={`px-4 py-2 min-h-[44px] rounded-full text-[13px] font-medium transition-all duration-[180ms] ${
                    activeFilter === dept
                      ? 'bg-[#E58A0F] text-white'
                      : 'bg-white dark:bg-[#1A1A18] text-[#6E695F] dark:text-[#8A8A86] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] hover:border-[#E58A0F]/30 hover:text-[#23211D] dark:text-[#E8E8E6]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Role cards */}
            <div className="space-y-3">
              {filteredRoles.map((role, i) => (
                <BlurFade key={role.slug} delay={0.05 + i * 0.06} inView>
                  <Link
                    href={`/careers/${role.slug}`}
                    className={`flex items-center justify-between p-5 md:px-7 md:py-6 bg-white dark:bg-[#1A1A18] rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-[180ms] ${
                      role.featured
                        ? 'border-[#E58A0F]/20 ring-1 ring-[#E58A0F]/10'
                        : 'border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2
                          className="text-[17px] font-bold text-[#23211D] dark:text-[#E8E8E6] group-hover:text-[#E58A0F] transition-colors duration-[180ms]"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {role.title}
                        </h2>
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
                      <p className="text-[14px] text-[#6E695F] dark:text-[#8A8A86] mt-3 max-w-xl leading-relaxed hidden md:block">
                        {role.description}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 shrink-0 ml-6">
                      <span className="text-[14px] text-[#E58A0F] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms]">
                        {role.salary}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#B0B0AB] group-hover:text-[#E58A0F] group-hover:translate-x-1 transition-all duration-[180ms]" />
                    </div>
                  </Link>
                </BlurFade>
              ))}
            </div>

            {filteredRoles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[#6E695F] dark:text-[#8A8A86] text-[16px]">
                  No positions in this department right now. Check back soon.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
