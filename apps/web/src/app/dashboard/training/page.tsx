'use client';

import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Rocket,
  Satellite,
  Shield,
  Target,
} from 'lucide-react';
import { useState } from 'react';

type WeekStatus = 'completed' | 'active' | 'locked';

interface QuestTask {
  label: string;
  completed: boolean;
}

interface QuestWeek {
  week: number;
  theme: string;
  subtitle: string;
  badge: string;
  badgeIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  status: WeekStatus;
  tasks: QuestTask[];
}

const QUEST_WEEKS: QuestWeek[] = [
  {
    week: 1,
    theme: 'Launch Sequence',
    subtitle: 'Get oriented. Meet your crew. Settle in.',
    badge: 'Launched',
    badgeIcon: Rocket,
    status: 'completed',
    tasks: [
      { label: 'Complete welcome ritual', completed: true },
      { label: 'Meet your onboarding buddy', completed: true },
      { label: 'Finish Orientation Orbit modules', completed: true },
      { label: 'Set up workspace and tools', completed: true },
      { label: 'Join team Slack channels', completed: true },
    ],
  },
  {
    week: 2,
    theme: 'First Contact',
    subtitle: 'Shadow a lead. Ship your first deliverable.',
    badge: 'First Build',
    badgeIcon: Target,
    status: 'active',
    tasks: [
      { label: 'Shadow a team lead for one full day', completed: true },
      { label: 'Complete first deliverable', completed: false },
      { label: 'Set 30/60/90 day goals with manager', completed: false },
      { label: 'Attend first team standup', completed: true },
      { label: 'Submit first code review or work output', completed: false },
    ],
  },
  {
    week: 3,
    theme: 'Into Orbit',
    subtitle: 'Own a task. Present at demo day. Contribute.',
    badge: 'Orbital',
    badgeIcon: Satellite,
    status: 'locked',
    tasks: [
      { label: 'Own and complete a task independently', completed: false },
      { label: 'Present at demo day', completed: false },
      { label: 'Make 3 Slack contributions (answers, ideas, feedback)', completed: false },
      { label: 'Pair with a teammate on a project', completed: false },
      { label: 'Document a process or write a how-to', completed: false },
    ],
  },
  {
    week: 4,
    theme: 'Steady State',
    subtitle: 'Reflect. Get feedback. Level up.',
    badge: 'Steady',
    badgeIcon: Shield,
    status: 'locked',
    tasks: [
      { label: 'Complete project review with manager', completed: false },
      { label: 'Collect peer feedback (3 teammates)', completed: false },
      { label: 'Write a reflection post for the team', completed: false },
      { label: 'Set goals for month 2', completed: false },
      { label: 'Celebrate at cohort gathering', completed: false },
    ],
  },
];

const LEVELS = [
  { name: 'Explorer', range: '0–999 pts', active: false },
  { name: 'Contributor', range: '1,000–1,999 pts', active: true },
  { name: 'Builder', range: '2,000–3,499 pts', active: false },
  { name: 'Leader', range: '3,500+ pts', active: false },
];

export default function TrainingPage() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(2);

  const totalTasks = QUEST_WEEKS.reduce((sum, w) => sum + w.tasks.length, 0);
  const completedTasks = QUEST_WEEKS.reduce(
    (sum, w) => sum + w.tasks.filter((t) => t.completed).length,
    0,
  );
  const overallPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Training Quest Line
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            Your 30-day onboarding journey. Complete each week to earn badges and level up.
          </p>
        </div>

        {/* Overall progress */}
        <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[var(--font-display)] text-base font-bold text-[#23211D]">
              Overall Progress
            </h2>
            <span className="text-sm font-medium text-[#E58A0F]">
              {completedTasks}/{totalTasks} tasks · {overallPercent}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#F5F5F3] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${overallPercent}%`,
                background: 'linear-gradient(90deg, #E58A0F, #F5C563)',
              }}
            />
          </div>
        </div>

        {/* Level system */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {LEVELS.map((level, i) => (
            <div key={level.name} className="flex items-center gap-2 shrink-0">
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  level.active
                    ? 'bg-[#E58A0F] text-white shadow-[0_0_12px_rgba(229,138,15,0.3)]'
                    : 'bg-[#F5F5F3] text-[#6B6B66]'
                }`}
              >
                {level.name}
                <span className="ml-1.5 text-[10px] opacity-70">{level.range}</span>
              </div>
              {i < LEVELS.length - 1 && <div className="w-6 h-px bg-[#E5E5E2]" />}
            </div>
          ))}
        </div>

        {/* Quest timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, #E58A0F, rgba(229,138,15,0.2), #E5E5E2)',
            }}
          />

          <div className="space-y-6">
            {QUEST_WEEKS.map((week) => {
              const weekCompleted = week.tasks.filter((t) => t.completed).length;
              const weekTotal = week.tasks.length;
              const weekPercent = Math.round((weekCompleted / weekTotal) * 100);
              const isExpanded = expandedWeek === week.week;
              const BadgeIcon = week.badgeIcon;

              return (
                <div key={week.week} className="relative pl-14">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-[14px] top-6 w-3 h-3 rounded-full border-2 ${
                      week.status === 'completed'
                        ? 'bg-[#4D7A3A] border-[#4D7A3A]'
                        : week.status === 'active'
                          ? 'bg-[#E58A0F] border-[#E58A0F] shadow-[0_0_8px_rgba(229,138,15,0.4)]'
                          : 'bg-[#E5E5E2] border-[#E5E5E2]'
                    }`}
                  />

                  <div
                    className={`rounded-xl border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
                      week.status === 'active' ? 'border-[#E58A0F]/20' : 'border-[rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {/* Week header */}
                    <button
                      type="button"
                      onClick={() => setExpandedWeek(isExpanded ? null : week.week)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 min-h-[44px]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B66]">
                            Week {week.week}
                          </span>
                          {week.status === 'active' && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#E58A0F] bg-[#FFF4E6] px-1.5 py-0.5 rounded">
                              Current
                            </span>
                          )}
                          {week.status === 'completed' && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4D7A3A] bg-[#4D7A3A]/10 px-1.5 py-0.5 rounded">
                              Done
                            </span>
                          )}
                        </div>
                        <h3 className="font-[var(--font-display)] text-lg font-bold text-[#23211D]">
                          {week.theme}
                        </h3>
                        <p className="text-[#6B6B66] text-sm mt-1">{week.subtitle}</p>

                        {/* Week progress bar */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 h-1.5 rounded-full bg-[#F5F5F3] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${weekPercent}%`,
                                background:
                                  week.status === 'completed'
                                    ? '#4D7A3A'
                                    : 'linear-gradient(90deg, #E58A0F, #F5C563)',
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#6B6B66] shrink-0">
                            {weekCompleted}/{weekTotal}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Badge */}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                            week.status === 'completed'
                              ? 'text-white'
                              : week.status === 'active'
                                ? 'text-[#E58A0F] bg-[#FFF4E6]'
                                : 'text-[#B0B0AB] bg-[#F5F5F3]'
                          }`}
                          style={
                            week.status === 'completed'
                              ? { background: 'linear-gradient(135deg, #0F6B6F, #4D7A3A)' }
                              : undefined
                          }
                        >
                          <BadgeIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                          {week.badge}
                        </div>

                        <ChevronDown
                          className={`h-5 w-5 text-[#B0B0AB] transition-transform duration-200 shrink-0 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expandable tasks */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-[#E5E5E2]">
                        <div className="pt-4 space-y-2.5">
                          {week.tasks.map((task) => (
                            <div key={task.label} className="flex items-center gap-3">
                              {task.completed ? (
                                <CheckCircle2
                                  className="h-5 w-5 text-[#4D7A3A] shrink-0"
                                  strokeWidth={1.5}
                                />
                              ) : week.status === 'locked' ? (
                                <Circle
                                  className="h-5 w-5 text-[#E5E5E2] shrink-0"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                <Circle
                                  className="h-5 w-5 text-[#B0B0AB] shrink-0"
                                  strokeWidth={1.5}
                                />
                              )}
                              <span
                                className={`text-sm ${
                                  task.completed
                                    ? 'text-[#6B6B66] line-through'
                                    : week.status === 'locked'
                                      ? 'text-[#B0B0AB]'
                                      : 'text-[#23211D]'
                                }`}
                              >
                                {task.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
