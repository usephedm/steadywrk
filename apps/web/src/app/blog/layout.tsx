import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Insights on AI Careers & the Jordan Tech Ecosystem',
  description:
    'Insights on AI careers, the Jordan tech ecosystem, and building the future of work. Read the latest from the STEADYWRK team.',
  alternates: {
    canonical: 'https://steadywrk.app/blog',
  },
  openGraph: {
    title: 'STEADYWRK Blog',
    description:
      'Insights on AI careers, the Jordan tech ecosystem, and building the future of work.',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
