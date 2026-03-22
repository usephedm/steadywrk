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

export default function HiringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const roleOptions = ['All', ...ROLES.map((r) => r.title)] as const;

  const filteredCandidates = useMemo(() => {
    return PIPELINE_CANDIDATES.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || c.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter]);

  const selected = PIPELINE_CANDIDATES.find((c) => c.id === selectedCandidate);

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

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0AB]" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-lg border border-[#E5E5E2] bg-white text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0AB]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 min-h-[44px] rounded-lg border border-[#E5E5E2] bg-white text-sm text-[#23211D] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all appearance-none"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban board */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6"
          style={{ scrollbarWidth: 'thin' }}
        >
          {PIPELINE_COLUMNS.map((col) => {
            const colCandidates = filteredCandidates.filter((c) => c.status === col.status);
            return (
              <div key={col.status} className="shrink-0 w-[260px]">
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <h3 className="text-sm font-bold text-[#23211D]">{col.label}</h3>
                  <span className="text-[10px] font-mono text-[#6B6B66] bg-[#F5F5F3] px-1.5 py-0.5 rounded-full">
                    {colCandidates.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {colCandidates.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => setSelectedCandidate(candidate.id)}
                      className={`w-full text-left rounded-xl border p-4 transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
                        selectedCandidate === candidate.id
                          ? 'border-[#E58A0F]/30 bg-[#FFF4E6] shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                          : 'border-[rgba(0,0,0,0.06)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-[#23211D]">{candidate.name}</p>
                        <span
                          className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                          style={{
                            background:
                              candidate.score >= 85
                                ? '#4D7A3A'
                                : candidate.score >= 70
                                  ? '#E58A0F'
                                  : '#A03D4A',
                          }}
                        >
                          {candidate.score}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6B66] mb-1.5">{candidate.role}</p>
                      <div className="flex items-center gap-1 text-[11px] text-[#B0B0AB]">
                        <Calendar className="h-3 w-3" />
                        {candidate.appliedDate}
                      </div>
                    </button>
                  ))}
                  {colCandidates.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#E5E5E2] p-6 text-center">
                      <p className="text-xs text-[#B0B0AB]">No candidates</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Candidate detail panel */}
        {selected && (
          <div className="mt-8 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E5E2]">
              <div>
                <h2 className="font-[var(--font-display)] text-xl font-bold text-[#23211D]">
                  {selected.name}
                </h2>
                <p className="text-sm text-[#6B6B66] mt-1">
                  {selected.role} · Applied {selected.appliedDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 min-h-[44px] rounded-lg bg-[#E58A0F] text-white text-sm font-medium transition-all duration-[180ms] hover:bg-[#CC7408] flex items-center gap-1.5"
                >
                  Advance <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="px-4 py-2 min-h-[44px] rounded-lg border border-[#E5E5E2] text-[#6B6B66] text-sm font-medium transition-all duration-[180ms] hover:bg-[#F5F5F3]"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#B0B0AB] hover:text-[#23211D] hover:bg-[#F5F5F3] transition-all"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scorecard */}
            <div className="p-6">
              <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D] mb-4">
                Scorecard
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SCORECARD_DIMENSIONS.map((dim) => {
                  const score = selected.scores[dim.key as ScoreKey];
                  return (
                    <div key={dim.key} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#6B6B66]">
                            {dim.name} <span className="text-[#B0B0AB]">({dim.weight}%)</span>
                          </span>
                          <span className="text-xs font-medium text-[#23211D]">{score}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#F5F5F3] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${score}%`,
                              background:
                                score >= 85 ? '#4D7A3A' : score >= 70 ? '#E58A0F' : '#A03D4A',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall score */}
              <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-[#F5F5F3]">
                <Star className="h-5 w-5 text-[#E58A0F]" strokeWidth={1.5} />
                <span className="text-sm text-[#6B6B66]">Overall Score:</span>
                <span className="text-lg font-bold text-[#23211D]">{selected.score}/100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
