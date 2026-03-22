'use client';

import { Check, Copy, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export function ReferralsClient({ initialStats }: { initialStats: any }) {
  const [copied, setCopied] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [vouchCode, setVouchCode] = useState<string | null>(null);

  const stats = [
    { label: 'Total Referrals', value: initialStats.totalReferrals.toString(), icon: Users },
    {
      label: 'Successful Hires',
      value: initialStats.successfulHires.toString(),
      icon: ShieldCheck,
    },
    { label: 'Bounty Earned', value: `$${initialStats.bountyEarned}`, icon: Sparkles },
  ];

  const handleGenerate = () => {
    setGenerateLoading(true);
    setTimeout(() => {
      setVouchCode(initialStats.vouchCode || 'VOUCH-X7K9P2');
      setGenerateLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    if (vouchCode) {
      navigator.clipboard.writeText(`https://steadywrk.app/apply/ai-engineer?vouch=${vouchCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#23211D] mb-2 font-[var(--font-display)]">
          The Network Loop
        </h1>
        <p className="text-[#6B6B66]">
          Vouch for top-tier engineers. If they pass the assessment and get hired, you earn a
          placement bounty and unlock priority access to future cohorts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-[rgba(0,0,0,0.06)] p-6 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#FAFAF8] rounded-lg">
                  <Icon className="w-5 h-5 text-[#E58A0F]" />
                </div>
                <p className="text-sm font-medium text-[#6B6B66]">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-[#23211D]">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-8 shadow-sm">
        <h3 className="text-xl font-bold text-[#23211D] mb-2">Generate Vouch Link</h3>
        <p className="text-[#6B6B66] text-sm mb-6 max-w-2xl">
          Generating a vouch link allows your referral to completely bypass the Stage 1 resume
          screening. Your reputation is tied to the quality of your referrals.
        </p>

        {!vouchCode ? (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generateLoading}
            className="bg-[#111110] hover:bg-[#23211D] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {generateLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Single-Use Link
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <code className="flex-1 bg-[#F5F5F3] px-4 py-3 rounded-lg text-sm text-[#23211D] flex items-center border border-[#E5E5E2] font-mono">
              https://steadywrk.app/apply/ai-engineer?vouch={vouchCode}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-[#E58A0F] hover:bg-[#CC7408] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 min-w-[120px]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
