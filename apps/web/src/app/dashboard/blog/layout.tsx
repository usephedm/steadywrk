import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — AI, Marketing & Future of Work Insights',
  description:
    'Insights and updates on AI, facility management, digital marketing, and building the future of work from SteadyWrk in Amman, Jordan.',
  alternates: {
    canonical: 'https://steadywrk.app/dashboard/blog',
  },
  openGraph: {
    title: 'SteadyWrk Blog | Thoughts & Updates',
    description: 'AI, marketing, and future of work — from the SteadyWrk team.',
    url: 'https://steadywrk.app/dashboard/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
