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
