import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAFAF8',
};

export const metadata: Metadata = {
  title: {
    default: 'STEADYWRK | Where Ambition Compounds',
    template: '%s | STEADYWRK',
  },
  description:
    'STEADYWRK is Jordan\'s AI-native career platform. We train ambitious talent with real AI tools and ship real work to US clients. Apply in 6 minutes. We respond in 48 hours.',
  metadataBase: new URL('https://steadywrk.app'),
  alternates: {
    canonical: 'https://steadywrk.app',
  },
  keywords: [
    'AI jobs Jordan', 'women in tech Jordan', 'AI internship Amman',
    'best startups Jordan', 'remote AI work Jordan', 'career growth startups',
    'STEADYWRK', 'AI BPO Jordan', 'digital marketing jobs Amman',
    'prompt engineering career', 'وظائف ذكاء اصطناعي الأردن',
  ],
  authors: [{ name: 'STEADYWRK', url: 'https://steadywrk.app' }],
  creator: 'STEADYWRK',
  openGraph: {
    title: 'STEADYWRK | Where Ambition Compounds',
    description:
      'Jordan\'s AI-native career platform. Elite standards. Rapid development. Structured opportunity. Apply now.',
    siteName: 'STEADYWRK',
    type: 'website',
    locale: 'en_US',
    url: 'https://steadywrk.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STEADYWRK | Where Ambition Compounds',
    description:
      'Jordan\'s AI-native career platform. Elite standards. Rapid development. Structured opportunity.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'JO-AM',
    'geo.placename': 'Amman',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Cabinet Grotesk (display) + Satoshi (body) from Fontshare */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        {/* JetBrains Mono for code/mono */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Skip to content — WCAG 2.2 */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#E58A0F] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
          Skip to main content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />

        {/* JSON-LD Organization — Brand Guidelines v2 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'STEADYWRK',
              legalName: 'STEADYWRK LLC',
              url: 'https://steadywrk.app',
              logo: 'https://steadywrk.app/logo-orange.svg',
              description:
                'Jordan\'s AI-native career platform offering elite training, rapid development, and structured opportunity in AI, BPO, Digital Marketing, and Operations.',
              foundingDate: '2026',
              slogan: 'Where ambition compounds.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Building 15, King Hussein Business Park',
                addressLocality: 'Amman',
                addressCountry: 'JO',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@steadywrk.app',
                contactType: 'recruitment',
              },
              sameAs: [
                'https://www.instagram.com/steadywrk',
                'https://www.linkedin.com/company/steadywrk',
                'https://www.tiktok.com/@steadywrk',
              ],
            }),
          }}
        />

        {/* JSON-LD JobPosting — GEO + Google for Jobs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              { '@context': 'https://schema.org', '@type': 'JobPosting', title: 'AI Engineer', description: 'Design and implement AI agent systems, LLM integrations, and autonomous workflows. Ship production ML pipelines from week one.', datePosted: '2026-03-21', employmentType: 'FULL_TIME', hiringOrganization: { '@type': 'Organization', name: 'STEADYWRK LLC', sameAs: 'https://steadywrk.app' }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO', streetAddress: 'Building 15, King Hussein Business Park' } }, baseSalary: { '@type': 'MonetaryAmount', currency: 'JOD', value: { '@type': 'QuantitativeValue', minValue: 800, maxValue: 1500, unitText: 'MONTH' } } },
              { '@context': 'https://schema.org', '@type': 'JobPosting', title: 'Frontend Developer', description: 'Build performant, accessible web interfaces using Next.js 16, React 19, and TypeScript. Work on public-facing platforms and internal tooling.', datePosted: '2026-03-21', employmentType: 'FULL_TIME', hiringOrganization: { '@type': 'Organization', name: 'STEADYWRK LLC', sameAs: 'https://steadywrk.app' }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' } }, baseSalary: { '@type': 'MonetaryAmount', currency: 'JOD', value: { '@type': 'QuantitativeValue', minValue: 700, maxValue: 1200, unitText: 'MONTH' } } },
              { '@context': 'https://schema.org', '@type': 'JobPosting', title: 'Digital Marketing Lead', description: 'Plan and execute SEO, content strategy, and paid media campaigns. Drive organic growth through GEO and content that compounds.', datePosted: '2026-03-21', employmentType: 'FULL_TIME', hiringOrganization: { '@type': 'Organization', name: 'STEADYWRK LLC', sameAs: 'https://steadywrk.app' }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' } }, baseSalary: { '@type': 'MonetaryAmount', currency: 'JOD', value: { '@type': 'QuantitativeValue', minValue: 600, maxValue: 1000, unitText: 'MONTH' } } },
              { '@context': 'https://schema.org', '@type': 'JobPosting', title: 'BPO Operations Manager', description: 'Coordinate AI-enhanced BPO operations serving US clients. Manage 15+ agent workflows, quality assurance, and performance metrics.', datePosted: '2026-03-21', employmentType: 'FULL_TIME', hiringOrganization: { '@type': 'Organization', name: 'STEADYWRK LLC', sameAs: 'https://steadywrk.app' }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' } }, baseSalary: { '@type': 'MonetaryAmount', currency: 'JOD', value: { '@type': 'QuantitativeValue', minValue: 500, maxValue: 900, unitText: 'MONTH' } } },
              { '@context': 'https://schema.org', '@type': 'JobPosting', title: 'AI BPO Agent', description: 'Handle customer interactions and business processes using AI-enhanced tooling. Training provided. Strong communication and attention to detail required.', datePosted: '2026-03-21', employmentType: 'FULL_TIME', hiringOrganization: { '@type': 'Organization', name: 'STEADYWRK LLC', sameAs: 'https://steadywrk.app' }, jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Amman', addressCountry: 'JO' } }, baseSalary: { '@type': 'MonetaryAmount', currency: 'JOD', value: { '@type': 'QuantitativeValue', minValue: 350, maxValue: 500, unitText: 'MONTH' } } },
            ]),
          }}
        />
      </body>
    </html>
  );
}
