import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { TermsContent } from './content';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'STEADYWRK LLC terms of service. Governing law: Kingdom of Jordan, Amman courts.',
  alternates: {
    canonical: '/terms',
    languages: {
      en: '/terms',
      ar: '/ar/terms',
    },
  },
  openGraph: {
    title: 'Terms of Service | STEADYWRK',
    description: 'Terms governing your use of the STEADYWRK platform.',
    url: 'https://steadywrk.app/terms',
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
