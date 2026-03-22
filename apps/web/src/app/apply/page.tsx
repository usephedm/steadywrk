import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: '/careers' },
};

export default function ApplyPage() {
  redirect('/careers');
}
