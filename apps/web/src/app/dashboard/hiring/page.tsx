'use client';

import { PIPELINE_CANDIDATES, ROLES } from '@/lib/data';
import type { CandidateStatus } from '@/lib/data';
import { ArrowRight, Calendar, Filter, Search, Star, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const PIPELINE_COLUMNS: { status: CandidateStatus; label: string; color: string }[] = [
  { status: 'applied', label: 'Applied', color: '#6B6B66' },
  { status: 'screening', label: 'Screening', color: '#E58A0F' },
  { status: 'assessment', label: 'Assessment', color: '#0F6B6F' },
  { status: 'interview', label: 'Interview', color: '#4D7A3A' },
  { status: 'offer', label: 'Offer', color: '#E58A0F' },
  { status: 'rejected', label: 'Rejected', color: '#A03D4A' },
];

const SCORECARD_DIMENSIONS = [
  { name: 'Technical', weight: 30, key: 'technical' as const },
  { name: 'Organizational', weight: 20, key: 'organizational' as const },
  { name: 'Communication', weight: 15, key: 'communication' as const },
  { name: 'Growth', weight: 15, key: 'growth' as const },
  { name: 'Cultural', weight: 10, key: 'cultural' as const },
  { name: 'Initiative', weight: 10, key: 'initiative' as const },
];

type ScoreKey =
  | 'technical'
  | 'organizational'
  | 'communication'
  | 'growth'
  | 'cultural'
  | 'initiative';

import { getPipelineCandidates } from '@/app/actions/hiring';
import { HiringBoard } from '@/components/dashboard/hiring-board';

export default async function HiringPage() {
  const candidates = await getPipelineCandidates();

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
              Hiring Pipeline
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white bg-[#E58A0F] px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <p className="text-[#6B6B66] mt-2 text-sm">
            Manage candidates across the hiring pipeline. Click a card to view details.
          </p>
        </div>

        <HiringBoard initialCandidates={candidates as any} />
      </div>
    </div>
  );
}
