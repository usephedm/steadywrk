import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Careers — We're Hiring AI Engineers, Marketers & Operations",
  description:
    'Join SteadyWrk — open positions in Engineering, AI Lab, Marketing, Operations, and BPO. Remote-friendly and Amman, Jordan-based roles available now.',
  alternates: {
    canonical: 'https://steadywrk.app/dashboard/hiring',
  },
  openGraph: {
    title: "We're Hiring | SteadyWrk Careers",
    description: 'Open positions in AI, marketing, operations, and BPO. Join the team.',
    url: 'https://steadywrk.app/dashboard/hiring',
  },
};

export default function HiringLayout({ children }: { children: React.ReactNode }) {
  return children;
}
