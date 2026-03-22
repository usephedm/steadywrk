import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { COMPANY } from '@/lib/constants';
import { ROLES } from '@/lib/data';
import { ArrowRight, Briefcase, Clock, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) return {};

  return {
    title: `${role.title} — Careers`,
    description: role.description,
    alternates: {
      canonical: `https://steadywrk.app/careers/${slug}`,
    },
    openGraph: {
      title: `${role.title} at STEADYWRK`,
      description: role.description,
    },
  };
}

export default async function CareerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const role = ROLES.find((r) => r.slug === slug);
  if (!role) notFound();

  // Parse salary range from "400–700 JOD" format
  const salaryMatch = role.salary?.match(/([\d,]+)\s*[\u2013\-]\s*([\d,]+)/);
  const minSalary = salaryMatch ? Number(salaryMatch[1].replace(',', '')) : undefined;
  const maxSalary = salaryMatch ? Number(salaryMatch[2].replace(',', '')) : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: role.title,
    description: role.description,
    datePosted: '2026-03-01',
    validThrough: '2026-12-31',
    employmentType: role.type === 'Full-time' ? 'FULL_TIME' : 'CONTRACT',
    hiringOrganization: {
      '@type': 'Organization',
      name: COMPANY.name,
      sameAs: COMPANY.url,
      logo: `${COMPANY.url}/logo.webp`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Building 15, King Hussein Business Park',
        addressLocality: 'Amman',
        addressRegion: 'Amman',
        addressCountry: 'JO',
      },
    },
    baseSalary: minSalary && maxSalary ? {
      '@type': 'MonetaryAmount',
      currency: 'JOD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: minSalary,
        maxValue: maxSalary,
        unitText: 'MONTH',
      },
    } : undefined,
    applicantLocationRequirements: role.location.includes('Remote')
      ? { '@type': 'Country', name: 'Jordan' }
      : undefined,
    jobLocationType: role.location.includes('Remote') ? 'TELECOMMUTE' : undefined,
    jobWorkingLanguages: ['en'],
    directApply: true,
    industry: 'Technology',
  };

  return (
    <>
      <Navbar />

      <main id="main-content" className="pt-16">
        <section className="py-20 md:py-28 px-6 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs />

            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#6B6B66]">
                  {role.dept}
                </span>
                {role.featured && (
                  <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#E58A0F] bg-[#E58A0F]/8 px-2 py-0.5 rounded-full">
                    Hiring Now
                  </span>
                )}
              </div>
              <h1
                className="text-[clamp(2rem,1.2rem+2.5vw,3.5rem)] font-bold text-[#23211D] leading-[1.08] tracking-[-0.02em] mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {role.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-[14px] text-[#6E695F]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E58A0F]" strokeWidth={1.5} />
                  <span>{role.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#E58A0F]" strokeWidth={1.5} />
                  <span>{role.type}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E58A0F]" strokeWidth={1.5} />
                  <span>{role.salary}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="prose-steady mb-12">
              <h2
                className="text-[20px] font-bold text-[#23211D] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                About the Role
              </h2>
              <p className="text-[#6E695F] text-[16px] leading-relaxed mb-8">{role.description}</p>

              <h2
                className="text-[20px] font-bold text-[#23211D] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Requirements
              </h2>
              <ul className="space-y-2 mb-8">
                {role.requirements.map((req) => (
                  <li
                    key={req}
                    className="flex items-start gap-3 text-[#6E695F] text-[15px] leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E58A0F] mt-2 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>

              <h2
                className="text-[20px] font-bold text-[#23211D] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Our Hiring Process
              </h2>
              <p className="text-[#6E695F] text-[16px] leading-relaxed mb-4">
                We believe in speed and transparency. Our process takes 14 days or fewer:
              </p>
              <ol className="space-y-2 mb-8">
                {[
                  'Application review (within 48 hours)',
                  'Skills assessment — role-specific challenge',
                  'Video interview — async recorded questions',
                  'Live interview with the team lead',
                  'Offer with growth plan',
                ].map((step, i) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 text-[#6E695F] text-[15px] leading-relaxed"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#E58A0F]/10 text-[#E58A0F] text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA */}
            <div className="p-8 bg-white rounded-xl border border-[rgba(0,0,0,0.06)] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <h3
                className="text-[20px] font-bold text-[#23211D] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Ready to apply?
              </h3>
              <p className="text-[#6E695F] text-[15px] mb-6">
                6–8 minutes. No account required. We respond within 48 hours.
              </p>
              <Link
                href={`/apply/${role.slug}`}
                className="inline-flex items-center gap-2.5 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-8 py-3.5 rounded-lg transition-colors duration-[180ms]"
              >
                Apply for {role.title} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* JobPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
