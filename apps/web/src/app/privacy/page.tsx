import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import type { Metadata } from 'next';
import { PrivacyContent } from './content';

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
          <PrivacyContent />
        </section>
      </main>
      <Footer />
    </>
  );
}
