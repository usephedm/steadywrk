export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-10 min-h-dvh">
      <div className="h-8 w-64 bg-[#E5E5E2] rounded animate-pulse mb-2" />
      <div className="h-5 w-48 bg-[#E5E5E2] rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-[#E5E5E2] rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
