import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: 'SteadyWrk | Apply. Train. Work.',
  description:
    'SteadyWrk is a US-based platform offering AI Lab, Facility Management, Digital Marketing, and AI BPO services. Now in Jordan. Apply to join.',
  metadataBase: new URL('https://steadywrk.app'),
  openGraph: {
    title: 'SteadyWrk | Apply. Train. Work.',
    description:
      'AI Lab, Facility Management, Digital Marketing, and AI BPO. US company, now in Jordan.',
    siteName: 'SteadyWrk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SteadyWrk | Apply. Train. Work.',
    description:
      'AI Lab, Facility Management, Digital Marketing, and AI BPO. US company, now in Jordan.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        {children}
        <Analytics />
        <SpeedInsights />
        {/* JSON-LD Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'SteadyWrk',
              legalName: 'SteadyWrk LLC',
              url: 'https://steadywrk.app',
              logo: 'https://steadywrk.app/logo.webp',
              description: 'AI Lab, Facility Management, Digital Marketing, and AI BPO services.',
              foundingDate: '2026',
              address: [
                {
                  '@type': 'PostalAddress',
                  addressLocality: 'Amman',
                  addressCountry: 'JO',
                },
                {
                  '@type': 'PostalAddress',
                  addressCountry: 'US',
                },
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@steadywrk.app',
                contactType: 'sales',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
