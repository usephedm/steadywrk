'use client';

import { ArrowRight, Download, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';

export function ScorecardClient({ assessment }: { assessment: any }) {
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { applicantId, score, role, percentile } = assessment;

  const ogImageUrl = `/api/scorecards?id=${applicantId}`;

  const handleShare = async (platform: 'linkedin' | 'twitter') => {
    setSharing(true);

    try {
      await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicantId, platform }),
      });
    } catch {
      // Non-blocking telemetry
    }

    const text = `I just ranked in the ${percentile} of assessed candidates for the ${role} cohort on STEADYWRK.\\n\\nIf you're building an AI team and need pre-vetted engineers in Amman, you know where to look.`;
    const url = 'https://steadywrk.app';

    if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank',
      );
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank',
      );
    }

    setTimeout(() => setSharing(false), 1000);
  };

  const handleDownload = () => {
    setDownloading(true);
    const a = document.createElement('a');
    a.href = ogImageUrl;
    a.download = `steadywrk-scorecard-${role.toLowerCase().replace(' ', '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 1000);
  };

  if (!applicantId) {
    return (
      <div className="p-6 md:p-10 max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#23211D] mb-4 font-[var(--font-display)]">
          Scorecard Unavailable
        </h1>
        <p className="text-[#6B6B66]">
          You have not completed an assessment yet. Please complete your pipeline stages to unlock
          your scorecard.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#23211D] mb-2 font-[var(--font-display)]">
          Your Assessment Scorecard
        </h1>
        <p className="text-[#6B6B66]">
          You have successfully passed the technical assessment barrier. This verifiable credential
          is yours to keep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column: The Rendered Scorecard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl overflow-hidden border border-[rgba(0,0,0,0.06)] shadow-xl bg-[#0A0A0A] aspect-[1200/630] relative"
        >
          <Image
            src={ogImageUrl}
            alt="Your STEADYWRK Scorecard"
            fill
            className="object-cover"
            unoptimized // Since it's dynamically generated per user
          />
        </motion.div>

        {/* Right Column: Actions & Next Steps */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="bg-white rounded-xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#6B6B66] uppercase tracking-wider mb-4">
              Signal Your Competence
            </h3>

            <button
              type="button"
              onClick={() => handleShare('linkedin')}
              disabled={sharing}
              className="w-full mb-3 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share on LinkedIn
            </button>

            <button
              type="button"
              onClick={() => handleShare('twitter')}
              disabled={sharing}
              className="w-full mb-3 bg-[#111110] hover:bg-[#23211D] text-white px-6 py-3.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share on X
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-[#F5F5F3] hover:bg-[#E5E5E2] text-[#23211D] px-6 py-3.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 border border-[#E5E5E2]"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </div>

          <div className="bg-[#FFF4E6] rounded-xl border border-[#E58A0F]/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-[#E58A0F]" />
              <h3 className="font-bold text-[#23211D]">Next Steps</h3>
            </div>
            <p className="text-sm text-[#6E695F] mb-4">
              Because you scored in the {percentile}, you have bypassed the standard queue. Our
              matching engine is currently profiling your stack against 3 open US requisitions.
            </p>
            <button
              type="button"
              className="text-[#E58A0F] font-medium text-sm flex items-center gap-1 hover:underline"
            >
              View your pipeline <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
