import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <h1 className="text-[8rem] sm:text-[12rem] font-bold text-white/[0.03] leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-amber-500/80 text-xs font-mono tracking-[0.4em] uppercase mb-2">
            Lost in the void
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Page not found
          </h2>
        </div>
      </div>

      <div
        className="w-24 h-px my-8"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)',
        }}
      />

      <p className="text-white/30 text-sm max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/dashboard"
        className="bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 px-6 py-3 rounded-lg text-sm font-mono tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
      >
        Back to Hub
      </Link>

      <p className="text-white/10 text-[10px] tracking-[0.25em] uppercase font-mono mt-16">
        SteadyWrk™
      </p>
    </div>
  );
}
