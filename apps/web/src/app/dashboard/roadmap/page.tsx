'use client';

import { ROADMAP } from '@/lib/data';

export default function RoadmapPage() {
  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Steady...W-hat?
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            STEADYWRK 1.0 &mdash; 2026 Roadmap
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, #E58A0F, rgba(229,138,15,0.2), #E5E5E2)',
            }}
          />

          <div className="space-y-10">
            {ROADMAP.map((milestone, i) => {
              const isActive = i === 0;
              return (
                <div key={milestone.quarter} className="relative pl-12">
                  {/* Dot */}
                  <div
                    className={`absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ${
                      isActive
                        ? 'bg-[#E58A0F] ring-[#E58A0F]/20'
                        : 'bg-[#E5E5E2] ring-[#E5E5E2]/20'
                    }`}
                  />

                  <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span
                        className={`text-xs font-mono tracking-wider uppercase ${
                          isActive ? 'text-[#E58A0F]' : 'text-[#B0B0AB]'
                        }`}
                      >
                        {milestone.quarter}
                      </span>
                      <h2
                        className={`font-[var(--font-display)] text-xl font-bold ${
                          isActive ? 'text-[#23211D]' : 'text-[#6B6B66]'
                        }`}
                      >
                        {milestone.title}
                      </h2>
                      {isActive && (
                        <span className="text-[10px] font-mono text-[#E58A0F] bg-[#FFF4E6] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {milestone.items.map((item) => (
                        <li key={item} className="text-[#6B6B66] text-sm flex items-start gap-2.5">
                          <span className={`mt-0.5 shrink-0 ${isActive ? 'text-[#E58A0F]' : 'text-[#B0B0AB]'}`}>
                            {isActive ? '▸' : '›'}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
