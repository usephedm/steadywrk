import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026 Roadmap — Launch, Scale, Expand, Steady',
  description:
    "SteadyWrk's 2026 roadmap — from launch in Jordan to global expansion. Follow our journey building the future of AI-powered field services.",
  robots: { index: false, follow: false },
  openGraph: {
    title: 'SteadyWrk 2026 Roadmap',
    description: 'Launch → Scale → Expand → Steady. Our path to global AI field services.',
  },
};

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
