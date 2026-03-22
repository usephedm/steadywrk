'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { CredibilityBar } from '@/components/sections/CredibilityBar';
import { EVPSection } from '@/components/sections/EVPSection';
import { RolesSection } from '@/components/sections/RolesSection';
import { ProgramsSection } from '@/components/sections/ProgramsSection';
import { CultureSection } from '@/components/sections/CultureSection';
import { MetricsSection } from '@/components/sections/MetricsSection';
import { QuoteSection } from '@/components/sections/QuoteSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { CTASection } from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CredibilityBar />
        <EVPSection />
        <RolesSection />
        <ProgramsSection />
        <CultureSection />
        <MetricsSection />
        <QuoteSection />
        <ServicesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
