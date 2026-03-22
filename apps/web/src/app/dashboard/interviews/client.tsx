'use client';

import { markInterviewCompleted } from '@/app/actions/interviews';
import { Calendar, CheckCircle2, Clock, Edit3, UserCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface InterviewRecord {
  id: string;
  scheduledAt: string;
  duration: number;
  interviewerName: string | null;
  meetingUrl: string | null;
  notes: string | null;
  completed: boolean;
  applicant: {
    id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    status: string | null;
  } | null;
}

export function InterviewsClient({ initialInterviews }: { initialInterviews: InterviewRecord[] }) {
  const router = useRouter();
  const [interviews] = useState(initialInterviews);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleCompleted(interview: InterviewRecord, completed: boolean) {
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      const result = await markInterviewCompleted(interview.id, completed);
      if (!result.success) {
        setError(result.error);
        return;
      }

      setFeedback(
        completed
          ? `Marked ${interview.applicant?.name ?? 'interview'} as completed.`
          : `Reopened ${interview.applicant?.name ?? 'interview'}.`,
      );
      router.refresh();
    });
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#23211D] mb-2 font-[var(--font-display)]">
            Interview Schedule
          </h1>
          <p className="text-[#6B6B66]">
            Live interview slots from the database. Schedule new interviews from the hiring board,
            then manage completion here.
          </p>
        </div>
      </div>

      {(feedback || error) && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            error
              ? 'border-[#A03D4A]/20 bg-[#FDF0F2] text-[#A03D4A]'
              : 'border-[#4D7A3A]/20 bg-[#EEF7ED] text-[#355C2D]'
          }`}
        >
          {error ?? feedback}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
        {interviews.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-[#E5E5E2] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#23211D]">No Interviews Scheduled</h3>
            <p className="text-[#6B6B66] text-sm mt-2 max-w-sm mx-auto">
              There are no upcoming interviews in the database yet. Create one from the hiring board
              when a candidate reaches the interview stage.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E5E2] bg-[#F5F5F3]">
                <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-6 py-4">
                  Candidate
                </th>
                <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-6 py-4">
                  Date & Time
                </th>
                <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-6 py-4">
                  Role
                </th>
                <th className="text-left text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-6 py-4">
                  Status
                </th>
                <th className="text-right text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => {
                const date = new Date(interview.scheduledAt);
                const isPast = date < new Date() && !interview.completed;

                return (
                  <tr
                    key={interview.id}
                    className={`border-b border-[#E5E5E2] last:border-0 hover:bg-[#FAFAF8] transition-colors ${interview.completed ? 'opacity-60' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F3] flex items-center justify-center text-[#E58A0F] font-bold font-[var(--font-display)]">
                          {interview.applicant?.name?.charAt(0) || (
                            <UserCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#23211D] text-sm">
                            {interview.applicant?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-[#6B6B66]">{interview.applicant?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#23211D]">
                        <Calendar className="w-4 h-4 text-[#B0B0AB]" />
                        {date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6B6B66] mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} (
                        {interview.duration}m)
                      </div>
                      {interview.interviewerName && (
                        <p className="text-xs text-[#6B6B66] mt-1">
                          Interviewer: {interview.interviewerName}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#F5F5F3] text-[#23211D]">
                        {interview.applicant?.role || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {interview.completed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#4D7A3A]/10 text-[#4D7A3A]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      ) : isPast ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#A03D4A]/10 text-[#A03D4A]">
                          Action Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E58A0F]/10 text-[#E58A0F]">
                          <Clock className="w-3.5 h-3.5" />
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {interview.meetingUrl && !interview.completed && (
                          <a
                            href={interview.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#F5F5F3] hover:bg-[#E5E5E2] rounded-lg text-[#23211D] transition-colors"
                            title="Join Meeting"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => toggleCompleted(interview, !interview.completed)}
                          className="p-2 border border-[#E5E5E2] hover:bg-[#F5F5F3] rounded-lg text-[#6B6B66] transition-colors disabled:opacity-50"
                          title={interview.completed ? 'Reopen interview' : 'Mark complete'}
                        >
                          {interview.completed ? (
                            <Edit3 className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {interview.notes && (
                        <p className="text-xs text-[#6B6B66] mt-2 max-w-[220px] ml-auto">
                          {interview.notes}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
