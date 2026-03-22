import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { Metadata } from 'next';
import { PrivacyContent } from './privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    "STEADYWRK LLC privacy policy. How we collect, use, and protect your data under Jordan's PDPL Law No. 24 of 2023.",
  alternates: {
    canonical: '/privacy',
    languages: {
      en: '/privacy',
      ar: '/ar/privacy',
    },
  },
  openGraph: {
    title: 'Privacy Policy | STEADYWRK',
    description: "How we protect your data under Jordan's PDPL.",
    url: 'https://steadywrk.app/privacy',
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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8] dark:bg-[#111110]">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs />

            <h1
              className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[#23211D] dark:text-[#E8E8E6] leading-[1.08] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Privacy Policy
            </h1>
            <p className="text-[14px] text-[#6B6B66] dark:text-[#8A8A86] mb-12">
              Last updated: March 21, 2026
            </p>

            <PrivacyContent />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
