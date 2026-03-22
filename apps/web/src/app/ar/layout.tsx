import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | STEADYWRK',
    default: 'STEADYWRK',
  },
};

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="rtl" lang="ar" className="font-body">
      {children}
    </div>
  );
}
