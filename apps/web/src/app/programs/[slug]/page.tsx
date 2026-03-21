import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PROGRAMS } from '@/lib/data';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) return {};

  return {
    title: `${program.name} ${program.type} — Programs`,
    description: program.longDesc,
    openGraph: {
      title: `${program.name} — ${program.type} at STEADYWRK`,
      description: program.desc,
    },
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) notFound();

  return (
    <>
      <Navbar />

      <main className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <nav className="text-[13px] text-[#B0B0AB] mb-8">
              <Link href="/" className="hover:text-[#6E695F] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/programs" className="hover:text-[#6E695F] transition-colors">Programs</Link>
              <span className="mx-2">/</span>
              <span className="text-[#23211D]">{program.name}</span>
            </nav>

            <div className="text-[11px] uppercase tracking-[0.12em] text-[#E58A0F] font-semibold mb-3">
              {program.type} · {program.duration}
            </div>
            <h1 className="text-[clamp(2.5rem,1rem+4vw,4.5rem)] font-extrabold text-[#23211D] leading-[1.04] tracking-[-0.03em] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              {program.name}
            </h1>
            <p className="text-[#6E695F] text-[17px] leading-relaxed max-w-xl">
              {program.longDesc}
            </p>
          </div>
        </section>

        {/* Outcomes */}
        <section className="py-16 md:py-24 px-6 bg-[#F7F4EE]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              What You&rsquo;ll Walk Away With
            </h2>
            <div className="space-y-4">
              {program.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-3 bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.06)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <CheckCircle2 className="w-5 h-5 text-[#4D7A3A] shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-[#23211D] text-[15px] leading-relaxed">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 px-6 bg-[#FAFAF8]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[clamp(1.5rem,1.2rem+1.25vw,2.25rem)] font-bold text-[#23211D] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to join {program.name}?
            </h2>
            <p className="text-[#6E695F] text-[16px] mb-8">
              6–8 minute application. We respond within 48 hours.
            </p>
            <Link
              href="/apply/operations-dispatcher"
              className="inline-flex items-center gap-2.5 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-8 py-3.5 rounded-lg transition-colors duration-[180ms]"
            >
              Start your application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
