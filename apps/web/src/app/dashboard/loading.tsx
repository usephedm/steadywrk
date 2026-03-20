export default function DashboardLoading() {
  return (
    <div className="min-h-[calc(100dvh-8rem)] flex flex-col items-center justify-center px-6 py-16">
      {/* Title skeleton */}
      <div className="text-center mb-14 w-full max-w-md">
        <div
          className="h-14 w-3/4 mx-auto rounded-lg mb-8"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(245,158,11,0.06) 50%, rgba(255,255,255,0.03) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer-loading 2s ease-in-out infinite',
          }}
        />
        <div
          className="h-4 w-1/2 mx-auto rounded"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(245,158,11,0.04) 50%, rgba(255,255,255,0.02) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer-loading 2s ease-in-out infinite 0.2s',
          }}
        />
      </div>

      {/* Card grid skeleton */}
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-[20rem]">
          {/* biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list */}
          {[4, 2, 2, 2, 2].map((span, i) => (
            <div
              key={i}
              className={`lg:col-span-${span} rounded-2xl border border-white/[0.04]`}
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.01) 25%, rgba(245,158,11,0.03) 50%, rgba(255,255,255,0.01) 75%)',
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
