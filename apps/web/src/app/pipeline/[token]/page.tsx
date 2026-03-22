import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { getApplicantPipelineByToken } from '@/lib/applicant-pipeline';
import { Calendar, Clock, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PipelinePageProps {
  params: Promise<{ token: string }>;
}

export default async function PipelinePage({ params }: PipelinePageProps) {
  const { token } = await params;
  const pipeline = await getApplicantPipelineByToken(token);

  if (!pipeline) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-[#FAFAF8] pt-20">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
                Your application pipeline
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B66] bg-[#F5F5F3] px-2 py-1 rounded-full">
                {pipeline.applicant.statusLabel}
              </span>
            </div>
            <p className="text-[#6B6B66] text-sm max-w-2xl">
              This is your live status for the {pipeline.applicant.role} application. Keep this page
              bookmarked — it is tied to your signed application token.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-8">
            <div className="space-y-8">
              <section className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-[#E58A0F]" />
                  <h2 className="font-[var(--font-display)] text-xl font-bold text-[#23211D]">
                    Status overview
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B0B0AB] mb-1">
                      Applicant
                    </p>
                    <p className="text-sm text-[#23211D]">{pipeline.applicant.name}</p>
                    <p className="text-sm text-[#6B6B66] break-all">{pipeline.applicant.email}</p>
                  </div>
                  <div className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAF8] p-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#B0B0AB] mb-1">
                      Role
                    </p>
                    <p className="text-sm text-[#23211D]">{pipeline.applicant.role}</p>
                    <p className="text-sm text-[#6B6B66]">Applied {pipeline.applicant.createdAt}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {pipeline.stages.map((stage, index) => (
                    <div key={stage.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                            stage.complete || stage.active
                              ? 'bg-[#E58A0F] text-white'
                              : 'bg-[#E5E5E2] text-[#6B6B66]'
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < pipeline.stages.length - 1 && (
                          <div className="w-px h-8 bg-[#E5E5E2] mt-1" />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="text-sm font-medium text-[#23211D]">{stage.label}</p>
                        <p className="text-xs text-[#6B6B66]">
                          {stage.active
                            ? 'Current stage'
                            : stage.complete
                              ? 'Completed'
                              : 'Upcoming'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {pipeline.interview && (
                <section className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <h2 className="font-[var(--font-display)] text-xl font-bold text-[#23211D] mb-4">
                    Upcoming interview
                  </h2>
                  <div className="space-y-3 text-sm text-[#23211D]">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#E58A0F]" />
                      {pipeline.interview.scheduledAt}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#E58A0F]" />
                      {pipeline.interview.duration} minutes
                    </p>
                    {pipeline.interview.interviewerName && (
                      <p>Interviewer: {pipeline.interview.interviewerName}</p>
                    )}
                    {pipeline.interview.notes && (
                      <p className="text-[#6B6B66]">{pipeline.interview.notes}</p>
                    )}
                    {pipeline.interview.meetingUrl && (
                      <a
                        href={pipeline.interview.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#E58A0F] font-medium hover:underline"
                      >
                        Join meeting <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </section>
              )}
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-[#E58A0F]/20 bg-[#FFF4E6] p-6">
                <h2 className="font-[var(--font-display)] text-xl font-bold text-[#23211D] mb-3">
                  Next step
                </h2>
                <p className="text-sm text-[#6E695F] leading-relaxed">{pipeline.nextStep}</p>
              </section>

              <section className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                <h2 className="font-[var(--font-display)] text-lg font-bold text-[#23211D] mb-3">
                  Need help?
                </h2>
                <a
                  href="mailto:hello@steadywrk.app"
                  className="inline-flex items-center gap-2 text-sm text-[#E58A0F] font-medium hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  hello@steadywrk.app
                </a>
                <p className="text-xs text-[#6B6B66] mt-3">
                  For security, only share this link with people you trust. It is tied to your
                  signed application token.
                </p>
              </section>

              <Link
                href="/careers"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#23211D] hover:text-[#E58A0F]"
              >
                Explore more roles
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
