export default function ProgramsLoading() {
  return (
    <main className="pt-16 min-h-dvh bg-[#FAFAF8]">
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-4 w-32 bg-[#E5E5E2] rounded animate-pulse mb-4" />
          <div className="h-12 w-96 max-w-full bg-[#E5E5E2] rounded animate-pulse mb-12" />
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-[#E5E5E2] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
