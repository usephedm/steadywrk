export default function CareersLoading() {
  return (
    <main className="pt-16 min-h-dvh bg-[#FAFAF8]">
      <div className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-4 w-24 bg-[#E5E5E2] rounded animate-pulse mb-4" />
          <div className="h-12 w-96 max-w-full bg-[#E5E5E2] rounded animate-pulse mb-5" />
          <div className="h-5 w-80 max-w-full bg-[#E5E5E2] rounded animate-pulse" />
          <div className="mt-16 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-[#E5E5E2] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
