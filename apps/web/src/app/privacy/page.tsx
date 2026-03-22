import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import type { Metadata } from 'next';
import { PrivacyContent } from './privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'STEADYWRK privacy policy — how we collect, use, and protect your personal data in compliance with Jordan\u2019s Personal Data Protection Law (PDPL).',
  alternates: {
    canonical: 'https://steadywrk.app/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs />

            <h1
              className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.02em] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Privacy Policy
            </h1>
            <p className="text-[14px] text-[#6B6B66] mb-12">
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
