'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <span className="text-amber-500 text-2xl">!</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
          Something went wrong
        </h2>
        <p className="text-white/30 text-sm max-w-md mx-auto mb-8">
          An unexpected error occurred. Try again or head back to the hub.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-lg text-sm tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          Try Again
        </button>
        <a
          href="/dashboard"
          className="bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white px-6 py-3 rounded-lg text-sm tracking-wider uppercase transition-all duration-300"
        >
          Back to Hub
        </a>
      </div>

      <p className="text-white/10 text-[10px] tracking-[0.25em] uppercase font-mono mt-16">
        SteadyWrk™
      </p>
    </div>
  );
}
