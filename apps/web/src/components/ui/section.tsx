import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type SectionVariant = 'light' | 'ivory' | 'dark' | 'deep';

const variantClasses: Record<SectionVariant, string> = {
  light: 'bg-[#FAFAF8] text-[#23211D]',
  ivory: 'bg-[#F7F4EE] text-[#23211D]',
  dark: 'bg-[#0A0A0A] text-[#E8E8E6]',
  deep: 'bg-[#1A1A18] text-[#E8E8E6]',
};

interface SectionProps {
  variant?: SectionVariant;
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Section({ variant = 'light', id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('py-20 md:py-32 px-6', variantClasses[variant], className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}
