import { currentUser } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Careers — We're Hiring AI Engineers, Marketers & Operations",
  description:
    'Join SteadyWrk — open positions in Engineering, AI Lab, Marketing, Operations, and BPO. Remote-friendly and Amman, Jordan-based roles available now.',
  robots: { index: false, follow: false },
  openGraph: {
    title: "We're Hiring | SteadyWrk Careers",
    description: 'Open positions in AI, marketing, operations, and BPO. Join the team.',
  },
};

function hasAdminAccess(publicMetadata: unknown): boolean {
  if (!publicMetadata || typeof publicMetadata !== 'object') {
    return false;
  }

  const metadata = publicMetadata as {
    role?: unknown;
    roles?: unknown;
    isAdmin?: unknown;
  };

  if (metadata.isAdmin === true) {
    return true;
  }

  if (metadata.role === 'admin') {
    return true;
  }

  if (Array.isArray(metadata.roles) && metadata.roles.includes('admin')) {
    return true;
  }

  return false;
}

export default async function HiringLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user || !hasAdminAccess(user.publicMetadata)) {
    notFound();
  }

  return children;
}
