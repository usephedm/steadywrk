'use client';

import { WhatsAppFloat } from '@/components/ui/whatsapp-float';
import { COMPANY, SERVICES } from '@/lib/data';
import { Bot, Brain, Building2, type LucideIcon, Megaphone } from 'lucide-react';
import Link from 'next/link';

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Building2,
  Megaphone,
  Bot,
};

export default function ServicesPage() {
  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <WhatsAppFloat />

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Our Services
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            What we build. Four verticals, one platform.
          </p>
        </div>

        {/* Service sections */}
        <div className="space-y-6">
          {SERVICES.map((service) => {
            const IconComponent = ICON_MAP[service.icon];
            return (
              <div
                key={service.id}
                className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-6">
                  {IconComponent && (
                    <div className="shrink-0 p-4 rounded-xl bg-[#FFF4E6]">
                      <IconComponent className="h-8 w-8 text-[#E58A0F]" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="space-y-3">
                    <h2 className="font-[var(--font-display)] text-xl font-bold text-[#23211D]">
                      {service.title}
                    </h2>
                    <p className="text-[#6B6B66] text-sm leading-relaxed">{service.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-[#6B6B66] text-xs flex items-center gap-2"
                        >
                          <span className="text-[#E58A0F] text-[10px]">&#9656;</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Company overview */}
        <div className="mt-12 text-center space-y-4">
          <div className="inline-block px-6 py-3 rounded-full border border-[#E5E5E2] bg-white">
            <p className="text-[#6B6B66] text-sm">
              US company. Now in Jordan. Building the future of work.
            </p>
          </div>
          <p className="text-[#B0B0AB] text-xs">{COMPANY.legal}</p>
          <Link
            href="/dashboard/contact"
            className="inline-flex items-center gap-2 text-[#E58A0F] text-sm font-medium hover:underline mt-4 group min-h-[44px]"
          >
            Interested? Get in touch
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
