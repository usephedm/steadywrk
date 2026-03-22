'use client';

import {
  Calendar,
  ExternalLink,
  Filter,
  Link2,
  Mail,
  Search,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export type HiringCandidateStatus =
  | 'applied'
  | 'screening'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface HiringCandidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  roleSlug: string;
  teamInterest: string | null;
  status: HiringCandidateStatus;
  appliedDate: string;
  score: number | null;
  availability: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  cvUrl: string | null;
  challengeResponse: string | null;
  reviewerNotes: string | null;
  pdplConsent: boolean;
  answers: {
    q1: string;
    q2: string;
    q3: string;
  };
  skills: Array<{
    name: string;
    value: number;
  }>;
}

const PIPELINE_COLUMNS: { status: HiringCandidateStatus; label: string; color: string }[] = [
  { status: 'applied', label: 'Applied', color: '#6B6B66' },
  { status: 'screening', label: 'Screening', color: '#E58A0F' },
  { status: 'assessment', label: 'Assessment', color: '#0F6B6F' },
  { status: 'interview', label: 'Interview', color: '#4D7A3A' },
  { status: 'offer', label: 'Offer', color: '#7B5AF8' },
  { status: 'rejected', label: 'Rejected', color: '#A03D4A' },
  { status: 'withdrawn', label: 'Withdrawn', color: '#8A8A82' },
];

const ANSWER_PROMPTS = [
  {
    key: 'q1' as const,
    label: 'What’s the most interesting thing you’ve built or organized?',
  },
  {
    key: 'q2' as const,
    label: 'Why does AI in Jordan matter to you?',
  },
  {
    key: 'q3' as const,
    label: 'Describe a time you turned chaos into order.',
  },
];

function getScoreTone(score: number | null) {
  if (score === null) return { bg: '#F5F5F3', text: '#6B6B66' };
  if (score >= 85) return { bg: '#4D7A3A', text: '#FFFFFF' };
  if (score >= 70) return { bg: '#E58A0F', text: '#FFFFFF' };
  return { bg: '#A03D4A', text: '#FFFFFF' };
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-4">
      <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B0B0AB] mb-1">
        {label}
      </p>
      <p className="text-sm text-[#23211D] break-words">{value}</p>
    </div>
  );
}

export default function HiringBoard({ candidates }: { candidates: HiringCandidate[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    candidates[0]?.id ?? null,
  );

  const roleOptions = useMemo(() => {
    return ['All', ...new Set(candidates.map((candidate) => candidate.role))];
  }, [candidates]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'All' || candidate.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [candidates, roleFilter, searchQuery]);

  const selected =
    filteredCandidates.find((candidate) => candidate.id === selectedCandidate) ??
    (selectedCandidate === null ? null : (filteredCandidates[0] ?? null));
  const scoredCount = candidates.filter((candidate) => candidate.score !== null).length;
  const activeCount = candidates.filter(
    (candidate) => candidate.status !== 'rejected' && candidate.status !== 'withdrawn',
  ).length;

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-6 py-10">
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
            Read-only live pipeline sourced from applicant records. Status mutation still needs a
            separate admin pass.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard label="Total applicants" value={String(candidates.length)} />
          <SummaryCard label="Active pipeline" value={String(activeCount)} />
          <SummaryCard label="Scored candidates" value={String(scoredCount)} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0AB]" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-lg border border-[#E5E5E2] bg-white text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0AB]" />
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
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

        {candidates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E5E5E2] bg-white p-10 text-center">
            <p className="text-lg font-semibold text-[#23211D] mb-2">No applicant records yet</p>
            <p className="text-sm text-[#6B6B66]">
              Once applications start landing in the database, they’ll appear here automatically.
            </p>
          </div>
        ) : (
          <>
            <div
              className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6"
              style={{ scrollbarWidth: 'thin' }}
            >
              {PIPELINE_COLUMNS.map((column) => {
                const columnCandidates = filteredCandidates.filter(
                  (candidate) => candidate.status === column.status,
                );
                return (
                  <div key={column.status} className="shrink-0 w-[280px]">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="text-sm font-bold text-[#23211D]">{column.label}</h3>
                      <span className="text-[10px] font-mono text-[#6B6B66] bg-[#F5F5F3] px-1.5 py-0.5 rounded-full">
                        {columnCandidates.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {columnCandidates.map((candidate) => {
                        const scoreTone = getScoreTone(candidate.score);
                        return (
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
                              <div>
                                <p className="text-sm font-medium text-[#23211D]">
                                  {candidate.name}
                                </p>
                                <p className="text-[11px] text-[#B0B0AB] mt-1">{candidate.email}</p>
                              </div>
                              <span
                                className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ background: scoreTone.bg, color: scoreTone.text }}
                              >
                                {candidate.score ?? '—'}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B6B66] mb-1.5">{candidate.role}</p>
                            <div className="flex items-center gap-1 text-[11px] text-[#B0B0AB]">
                              <Calendar className="h-3 w-3" />
                              {candidate.appliedDate}
                            </div>
                          </button>
                        );
                      })}

                      {columnCandidates.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[#E5E5E2] p-6 text-center bg-white">
                          <p className="text-xs text-[#B0B0AB]">No candidates</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selected ? (
              <div className="mt-8 rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between p-6 border-b border-[#E5E5E2]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="font-[var(--font-display)] text-xl font-bold text-[#23211D]">
                        {selected.name}
                      </h2>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] bg-[#F5F5F3] px-2 py-0.5 rounded-full">
                        {selected.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#6B6B66] mt-1">
                      {selected.role} · Applied {selected.appliedDate}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${selected.email}`}
                      className="px-4 py-2 min-h-[44px] rounded-lg bg-[#E58A0F] text-white text-sm font-medium transition-all duration-[180ms] hover:bg-[#CC7408] inline-flex items-center gap-1.5"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                    {selected.portfolioUrl && (
                      <a
                        href={selected.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 min-h-[44px] rounded-lg border border-[#E5E5E2] text-[#23211D] text-sm font-medium transition-all duration-[180ms] hover:bg-[#F5F5F3] inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Portfolio
                      </a>
                    )}
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

                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <SummaryCard
                      label="Overall score"
                      value={selected.score === null ? 'Not scored yet' : `${selected.score}/100`}
                    />
                    <SummaryCard
                      label="Availability"
                      value={selected.availability ?? 'Not provided'}
                    />
                    <SummaryCard
                      label="Team interest"
                      value={selected.teamInterest ?? 'Not provided'}
                    />
                    <SummaryCard
                      label="PDPL consent"
                      value={selected.pdplConsent ? 'Granted' : 'Missing'}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-5">
                      <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D] mb-4">
                        Contact & links
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B0B0AB] mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${selected.email}`}
                            className="text-[#23211D] hover:text-[#E58A0F] break-all"
                          >
                            {selected.email}
                          </a>
                        </div>
                        {selected.phone && (
                          <div>
                            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B0B0AB] mb-1">
                              Phone
                            </p>
                            <a
                              href={`tel:${selected.phone}`}
                              className="text-[#23211D] hover:text-[#E58A0F] break-all"
                            >
                              {selected.phone}
                            </a>
                          </div>
                        )}
                        <div className="space-y-2 pt-1">
                          {selected.githubUrl && (
                            <a
                              href={selected.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-[#23211D] hover:text-[#E58A0F]"
                            >
                              <Link2 className="h-4 w-4" />
                              GitHub
                            </a>
                          )}
                          {selected.linkedinUrl && (
                            <a
                              href={selected.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-[#23211D] hover:text-[#E58A0F] ml-4"
                            >
                              <Link2 className="h-4 w-4" />
                              LinkedIn
                            </a>
                          )}
                          {selected.cvUrl && (
                            <a
                              href={selected.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-[#23211D] hover:text-[#E58A0F] ml-4"
                            >
                              <Link2 className="h-4 w-4" />
                              CV
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-5">
                      <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D] mb-4">
                        Reviewer state
                      </h3>
                      <div className="space-y-3 text-sm text-[#23211D]">
                        <div className="flex items-center gap-2 text-[#6B6B66]">
                          <ShieldCheck className="h-4 w-4 text-[#E58A0F]" />
                          <span>This view is live and read-only.</span>
                        </div>
                        <div>
                          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B0B0AB] mb-1">
                            Notes
                          </p>
                          <p className="text-sm text-[#23211D] whitespace-pre-wrap">
                            {selected.reviewerNotes?.trim() || 'No reviewer notes recorded yet.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-4 w-4 text-[#E58A0F]" />
                      <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D]">
                        Skill self-assessment
                      </h3>
                    </div>
                    {selected.skills.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {selected.skills.map((skill) => (
                          <div
                            key={skill.name}
                            className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-[#23211D]">{skill.name}</span>
                              <span className="text-xs font-medium text-[#23211D]">
                                {skill.value}/10
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-[#E5E5E2] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#E58A0F]"
                                style={{ width: `${Math.max(0, Math.min(skill.value, 10)) * 10}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#E5E5E2] bg-[#FAFAF8] p-6 text-center">
                        <p className="text-sm text-[#6B6B66]">No skill ratings submitted.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D]">
                      Application answers
                    </h3>
                    {ANSWER_PROMPTS.map((prompt) => {
                      const answer = selected.answers[prompt.key].trim();
                      return (
                        <div
                          key={prompt.key}
                          className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-5"
                        >
                          <p className="text-sm font-medium text-[#23211D] mb-2">{prompt.label}</p>
                          <p className="text-sm text-[#6B6B66] whitespace-pre-wrap">
                            {answer || 'No response provided.'}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-5">
                    <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D] mb-2">
                      Scenario response
                    </h3>
                    <p className="text-sm text-[#6B6B66] whitespace-pre-wrap">
                      {selected.challengeResponse?.trim() || 'No challenge response submitted.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-[#E5E5E2] bg-white p-10 text-center">
                <p className="text-sm text-[#6B6B66]">No candidate matches the current filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
