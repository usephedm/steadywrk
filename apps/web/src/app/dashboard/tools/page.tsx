'use client';

import { BarChart3, BookOpen, Calendar, Database, Phone } from 'lucide-react';
import Link from 'next/link';

const TOOLS = [
  {
    title: 'Dialer',
    description: 'Launch the dispatch dialer',
    icon: Phone,
    color: '#E58A0F',
    href: '#',
  },
  {
    title: 'Scripts Library',
    description: 'Access call scripts and SOPs',
    icon: BookOpen,
    color: '#0F6B6F',
    href: '#',
  },
  {
    title: 'Knowledge Base',
    description: 'Search internal documentation',
    icon: Database,
    color: '#4D7A3A',
    href: '#',
  },
  {
    title: 'Schedule',
    description: 'View your shift schedule',
    icon: Calendar,
    color: '#A03D4A',
    href: '#',
  },
  {
    title: 'Performance',
    description: 'Track your metrics',
    icon: BarChart3,
    color: '#E58A0F',
    href: '#',
  },
] as const;

export default function ToolsPage() {
  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Work Tools
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            Your operational toolkit. Everything you need to get work done.
          </p>
        </div>

        {/* Tool cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] min-h-[44px]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105"
                  style={{ backgroundColor: `${tool.color}15` }}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: tool.color }} />
                </div>
                <h3 className="font-[var(--font-display)] text-lg font-bold text-[#23211D] mb-1">
                  {tool.title}
                </h3>
                <p className="text-sm text-[#6B6B66]">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
