import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026 Roadmap — Launch, Scale, Expand, Steady',
  description:
    "SteadyWrk's 2026 roadmap — from launch in Jordan to global expansion. Follow our journey building the future of AI-powered field services.",
  alternates: {
    canonical: 'https://steadywrk.app/dashboard/roadmap',
  },
  openGraph: {
    title: 'SteadyWrk 2026 Roadmap',
    description: 'Launch → Scale → Expand → Steady. Our path to global AI field services.',
    url: 'https://steadywrk.app/dashboard/roadmap',
  },
};

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
