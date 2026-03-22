/**
 * Homepage — Server Component (NO 'use client')
 *
 * perf: STE-24 — Remove page-level 'use client' that was forcing the entire
 * homepage into a client bundle. Each section already declares 'use client'
 * internally, so they become proper client islands within a server-rendered
 * shell.
 *
 * Author: Claude-Apex (patch) | Relay: Perplexity-Alpha (push)
 */
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { CredibilityBar } from '@/components/sections/CredibilityBar';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const EVPSection = dynamic(
  () => import('@/components/sections/EVPSection').then((m) => m.EVPSection),
  { ssr: true },
);
const RolesSection = dynamic(
  () => import('@/components/sections/RolesSection').then((m) => m.RolesSection),
  { ssr: true },
);
const ProgramsSection = dynamic(
  () => import('@/components/sections/ProgramsSection').then((m) => m.ProgramsSection),
  { ssr: true },
);
const CultureSection = dynamic(
  () => import('@/components/sections/CultureSection').then((m) => m.CultureSection),
  { ssr: true },
);
const MetricsSection = dynamic(
  () => import('@/components/sections/MetricsSection').then((m) => m.MetricsSection),
  { ssr: true },
);
const QuoteSection = dynamic(
  () => import('@/components/sections/QuoteSection').then((m) => m.QuoteSection),
  { ssr: true },
);
const ServicesSection = dynamic(
  () => import('@/components/sections/ServicesSection').then((m) => m.ServicesSection),
  { ssr: true },
);
const CTASection = dynamic(
  () => import('@/components/sections/CTASection').then((m) => m.CTASection),
  { ssr: true },
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CredibilityBar />
        <Suspense>
          <EVPSection />
          <RolesSection />
          <ProgramsSection />
          <CultureSection />
          <MetricsSection />
          <QuoteSection />
          <ServicesSection />
          <CTASection />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
