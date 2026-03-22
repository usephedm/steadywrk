import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { PROGRAMS } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'STEADYWRK programs: IGNITE (internship), ORBIT (fellowship), APEX (leadership). Structured paths for Jordanian talent.',
  alternates: { canonical: '/programs' },
  openGraph: {
    title: 'Programs | STEADYWRK',
    description: 'IGNITE, ORBIT, APEX — structured career programs for ambitious Jordanian talent.',
    url: 'https://steadywrk.app/programs',
    images: [
      {
        url: 'https://steadywrk.app/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'STEADYWRK — Where Ambition Compounds',
      },
    ],
  },
};

export default function ProgramsPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] dark:bg-[#111110]">
          <div className="max-w-5xl mx-auto">
            <nav className="text-[13px] text-[#B0B0AB] mb-8">
              <Link href="/" className="hover:text-[#6E695F] dark:text-[#8A8A86] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[#23211D] dark:text-[#E8E8E6]">Programs</span>
            </nav>
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">
              Career Programs
            </p>
            <h1
              className="text-[clamp(2.5rem,1rem+4vw,4rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.08] tracking-[-0.03em] mb-5"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Three tracks. One trajectory.
            </h1>
            <p className="text-[#6E695F] dark:text-[#8A8A86] text-[17px] leading-relaxed max-w-xl">
              Every program builds real skills with real projects. No simulations. You ship
              production work serving US clients.
            </p>
          </div>
        </section>

        <section className="relative py-12 md:py-20 px-6 bg-[#F7F4EE] dark:bg-[#1A1A18] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/brand/steadywrk-workspace.webp"
              alt="STEADYWRK workspace background"
              fill
              className="object-cover opacity-[0.06] blur-sm"
              sizes="100vw"
              loading="lazy"
            />
          </div>
          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            {PROGRAMS.map((program) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="block bg-white dark:bg-[#1A1A18] rounded-xl p-8 md:p-10 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-[180ms]"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-3">
                      {program.type} · {program.duration}
                    </div>
                    <h2
                      className="text-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)] font-extrabold text-[#23211D] dark:text-[#E8E8E6] mb-3 tracking-[-0.02em] group-hover:text-[#E58A0F] transition-colors duration-[180ms]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {program.name}
                    </h2>
                    <p className="text-[#6E695F] dark:text-[#8A8A86] text-[16px] leading-relaxed max-w-xl">
                      {program.longDesc}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[#E58A0F] shrink-0">
                    <span className="text-[14px] font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-[180ms]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
