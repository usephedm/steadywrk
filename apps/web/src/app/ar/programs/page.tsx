import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'STEADYWRK | البرامج',
  description: 'برامج STEADYWRK لتسريع المسار المهني.',
};

export default function ArabicProgramsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#23211D] dark:text-[#E8E8E6] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            البرامج
          </h1>
          <p className="text-xl text-[#6E695F] dark:text-[#8A8A86] mb-10">
            برامج تدريبية وتطويرية مصممة لنخبة المواهب التقنية في الأردن.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/programs" className="bg-[#E58A0F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#CC7408] transition-colors">
              English Version
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}