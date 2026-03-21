import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PROGRAMS } from '@/lib/data';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Programs — IGNITE, ORBIT, APEX',
  description:
    'Three career tracks for ambitious talent. IGNITE internships, ORBIT fellowships, and APEX leadership. Ship production work from week one.',
};

export default function ProgramsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-5xl mx-auto">
            <nav className="text-[13px] text-[#B0B0AB] mb-8">
              <Link href="/" className="hover:text-[#6E695F] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[#23211D]">Programs</span>
            </nav>
            <p className="text-[13px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-4">Career Programs</p>
            <h1 className="text-[clamp(2.5rem,1rem+4vw,4rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.03em] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
              Three tracks. One trajectory.
            </h1>
            <p className="text-[#6E695F] text-[17px] leading-relaxed max-w-xl">
              Every program builds real skills with real projects. No simulations. You ship production work serving US clients.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-20 px-6 bg-[#F7F4EE]">
          <div className="max-w-5xl mx-auto space-y-8">
            {PROGRAMS.map((program, i) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="block bg-white rounded-xl p-8 md:p-10 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)] group hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-[180ms]"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-3">
                      {program.type} · {program.duration}
                    </div>
                    <h2 className="text-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)] font-extrabold text-[#23211D] mb-3 tracking-[-0.02em] group-hover:text-[#E58A0F] transition-colors duration-[180ms]" style={{ fontFamily: 'var(--font-display)' }}>
                      {program.name}
                    </h2>
                    <p className="text-[#6E695F] text-[16px] leading-relaxed max-w-xl">{program.longDesc}</p>
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
