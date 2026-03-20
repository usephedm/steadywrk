import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SteadyWrk Blog | Thoughts & Updates',
  description:
    'Insights on AI, facility management, digital marketing, and building the future of work from Jordan.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
