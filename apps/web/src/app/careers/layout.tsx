import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers — Open Positions',
  description:
    'Join STEADYWRK. Ship production AI systems from week one. Structured hiring, transparent criteria, 14-day timeline. We respond to every applicant within 48 hours.',
  openGraph: {
    title: 'Careers at STEADYWRK',
    description: 'Open positions across engineering, AI, operations, and marketing. Amman, Jordan.',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
