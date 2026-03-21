export default function DashboardLoading() {
  return (
    <div className="min-h-dvh bg-[#FAFAF8] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl">
        {/* Title skeleton */}
        <div className="mb-10">
          <div
            className="h-10 w-2/3 rounded-lg mb-3"
            style={{
              background:
                'linear-gradient(90deg, #F5F5F3 25%, #FAFAF8 50%, #F5F5F3 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-loading 2s ease-in-out infinite',
            }}
          />
          <div
            className="h-4 w-1/3 rounded"
            style={{
              background:
                'linear-gradient(90deg, #F5F5F3 25%, #FAFAF8 50%, #F5F5F3 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer-loading 2s ease-in-out infinite 0.2s',
            }}
          />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-[rgba(0,0,0,0.06)]"
              style={{
                background:
                  'linear-gradient(90deg, #F5F5F3 25%, #FAFAF8 50%, #F5F5F3 75%)',
                backgroundSize: '200% 100%',
                animation: `shimmer-loading 2s ease-in-out infinite ${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
