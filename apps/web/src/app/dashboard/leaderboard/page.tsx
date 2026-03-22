'use client';

import { LEADERBOARD_DATA } from '@/lib/data';
import {
  ChevronDown,
  ChevronUp,
  Crown,
  Flame,
  Lock,
  Medal,
  Rocket,
  Satellite,
  Shield,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import { useState } from 'react';

type SortKey = 'points' | 'streak' | 'level';

const LEVEL_ORDER = { Explorer: 0, Contributor: 1, Builder: 2, Leader: 3 } as const;

const ALL_BADGES = [
  { name: 'Launched', icon: Rocket, description: 'Complete Week 1: Launch Sequence' },
  { name: 'First Build', icon: Target, description: 'Complete Week 2: First Contact' },
  { name: 'Orbital', icon: Satellite, description: 'Complete Week 3: Into Orbit' },
  { name: 'Steady', icon: Shield, description: 'Complete Week 4: Steady State' },
] as const;

export default function LeaderboardPage() {
  const [sortBy, setSortBy] = useState<SortKey>('points');
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...LEADERBOARD_DATA].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'points') diff = a.points - b.points;
    else if (sortBy === 'streak') diff = a.streak - b.streak;
    else diff = LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
    return sortDesc ? -diff : diff;
  });

  const currentUser = LEADERBOARD_DATA.find((e) => e.isCurrentUser);
  const currentRank = sorted.findIndex((e) => e.isCurrentUser) + 1;

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDesc(!sortDesc);
    else {
      setSortBy(key);
      setSortDesc(true);
    }
  };

  const renderSortIcon = (field: SortKey) => {
    if (sortBy !== field) return <ChevronDown className="h-3 w-3 opacity-30" />;
    return sortDesc ? (
      <ChevronDown className="h-3 w-3 text-[#E58A0F]" />
    ) : (
      <ChevronUp className="h-3 w-3 text-[#E58A0F]" />
    );
  };

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Leaderboard
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            March 2026 cohort rankings. Earn points, maintain streaks, collect badges.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#FFF4E6]">
                <Star className="h-4 w-4 text-[#E58A0F]" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#23211D] tracking-tight">
              {currentUser?.points.toLocaleString()}
            </p>
            <p className="text-xs text-[#6B6B66] mt-1">Total Points</p>
          </div>
          <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#A03D4A]/10">
                <Flame className="h-4 w-4 text-[#A03D4A]" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#23211D] tracking-tight">
              {currentUser?.streak} days
            </p>
            <p className="text-xs text-[#6B6B66] mt-1">Current Streak</p>
          </div>
          <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#0F6B6F]/10">
                <Trophy className="h-4 w-4 text-[#0F6B6F]" strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#23211D] tracking-tight">#{currentRank}</p>
            <p className="text-xs text-[#6B6B66] mt-1">Your Rank</p>
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E2] bg-[#F5F5F3]">
                  <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-4 py-3 w-12">
                    #
                  </th>
                  <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-4 py-3">
                    Name
                  </th>
                  <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('points')}
                      className="flex items-center gap-1 min-h-[44px] -my-3 py-3"
                    >
                      Points {renderSortIcon('points')}
                    </button>
                  </th>
                  <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('streak')}
                      className="flex items-center gap-1 min-h-[44px] -my-3 py-3"
                    >
                      Streak {renderSortIcon('streak')}
                    </button>
                  </th>
                  <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('level')}
                      className="flex items-center gap-1 min-h-[44px] -my-3 py-3"
                    >
                      Level {renderSortIcon('level')}
                    </button>
                  </th>
                  <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-4 py-3 hidden sm:table-cell">
                    Badges
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((person, i) => {
                  const rank = i + 1;
                  return (
                    <tr
                      key={person.id}
                      className={`border-b border-[#E5E5E2] last:border-0 transition-colors ${
                        person.isCurrentUser ? 'bg-[#FFF4E6]' : 'hover:bg-[#F5F5F3]'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        {rank === 1 ? (
                          <Crown className="h-5 w-5 text-[#E58A0F]" strokeWidth={1.5} />
                        ) : rank === 2 ? (
                          <Medal className="h-5 w-5 text-[#B0B0AB]" strokeWidth={1.5} />
                        ) : rank === 3 ? (
                          <Medal className="h-5 w-5 text-[#CD7F32]" strokeWidth={1.5} />
                        ) : (
                          <span className="text-sm text-[#6B6B66]">{rank}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-sm font-medium ${
                            person.isCurrentUser ? 'text-[#E58A0F]' : 'text-[#23211D]'
                          }`}
                        >
                          {person.name}
                          {person.isCurrentUser && (
                            <span className="ml-1.5 text-[10px] font-mono uppercase tracking-wider text-[#E58A0F] bg-[#E58A0F]/10 px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-[#23211D]">
                        {person.points.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1 text-sm text-[#23211D]">
                          <Flame className="h-3.5 w-3.5 text-[#A03D4A]" />
                          {person.streak}d
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            person.level === 'Leader'
                              ? 'bg-[#E58A0F] text-white'
                              : person.level === 'Builder'
                                ? 'bg-[#0F6B6F]/10 text-[#0F6B6F]'
                                : person.level === 'Contributor'
                                  ? 'bg-[#4D7A3A]/10 text-[#4D7A3A]'
                                  : 'bg-[#F5F5F3] text-[#6B6B66]'
                          }`}
                        >
                          {person.level}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <div className="flex gap-1">
                          {ALL_BADGES.map((badge) => {
                            const earned = (person.badges as readonly string[]).includes(
                              badge.name,
                            );
                            const Icon = badge.icon;
                            return (
                              <div
                                key={badge.name}
                                className={`p-1 rounded ${
                                  earned ? 'text-[#E58A0F]' : 'text-[#E5E5E2]'
                                }`}
                                title={earned ? badge.name : `${badge.name} (locked)`}
                              >
                                <Icon className="h-4 w-4" strokeWidth={1.5} />
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badge collection */}
        <h2 className="font-[var(--font-display)] text-lg font-bold text-[#23211D] mb-4">
          Badge Collection
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const earned = (currentUser?.badges as readonly string[] | undefined)?.includes(
              badge.name,
            );
            const Icon = badge.icon;
            return (
              <div
                key={badge.name}
                className={`rounded-xl border p-5 text-center transition-all duration-[180ms] ease-out ${
                  earned
                    ? 'border-[#E58A0F]/20 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                    : 'border-[rgba(0,0,0,0.06)] bg-[#F5F5F3]'
                }`}
              >
                <div
                  className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    earned ? 'text-white' : 'bg-[#E5E5E2] text-[#B0B0AB]'
                  }`}
                  style={
                    earned ? { background: 'linear-gradient(135deg, #E58A0F, #F5C563)' } : undefined
                  }
                >
                  {earned ? (
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  ) : (
                    <Lock className="h-5 w-5" strokeWidth={1.5} />
                  )}
                </div>
                <p className={`text-sm font-bold ${earned ? 'text-[#23211D]' : 'text-[#B0B0AB]'}`}>
                  {badge.name}
                </p>
                <p className="text-[11px] text-[#6B6B66] mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
