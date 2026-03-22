import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'STEADYWRK | حيث يتضاعف الطموح',
  description: 'منصة الانطلاق المهني بالذكاء الاصطناعي للمواهب الأردنية الأكثر طموحاً.',
  alternates: {
    canonical: '/ar',
    languages: {
      en: '/',
      ar: '/ar',
    },
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ArabicHomePage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] pt-32 pb-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-5xl md:text-7xl font-bold text-[#23211D] dark:text-[#E8E8E6] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            حيث يتضاعف الطموح.
          </h1>
          <p className="text-xl text-[#6E695F] dark:text-[#8A8A86] mb-10">
            نحن نبني فرق تشغيل وهندسة ذكاء اصطناعي عالية التأثير في عمّان لصالح أفضل الشركات
            الأمريكية.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/ar/careers"
              className="bg-[#E58A0F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#CC7408] transition-colors"
            >
              اكتشف الوظائف
            </Link>
            <Link
              href="/"
              className="bg-white dark:bg-[#1A1A18] text-[#23211D] dark:text-[#E8E8E6] border border-[#E5E5E2] dark:border-[#333330] px-8 py-3 rounded-lg font-medium hover:bg-[#F5F5F3] dark:hover:bg-[#232320] transition-colors"
            >
              English
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
