import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { TermsContent } from './content';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'STEADYWRK terms of service — the rules and conditions governing your use of our platform.',
  alternates: {
    canonical: 'https://steadywrk.app/terms',
    languages: {
      'en': '/terms',
      'ar': '/ar/terms',
    },
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <TermsContent />
        </section>
      </main>
      <Footer />
    </>
  );
}
