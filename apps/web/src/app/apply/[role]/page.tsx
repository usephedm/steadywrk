'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ROLES } from '@/lib/data';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Save, Sparkles, Upload } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ─── Types ─── */
interface FormData {
  name: string;
  email: string;
  phone: string;
  team: string;
  pdplConsent: boolean;
  cvFile: File | null;
  answer1: string;
  answer2: string;
  answer3: string;
  portfolioUrl: string;
  githubUrl: string;
  behanceUrl: string;
  skills: Record<string, number>;
  availability: string;
  challengeResponse: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  team: '',
  pdplConsent: false,
  cvFile: null,
  answer1: '',
  answer2: '',
  answer3: '',
  portfolioUrl: '',
  githubUrl: '',
  behanceUrl: '',
  skills: {},
  availability: '',
  challengeResponse: '',
};

const TEAMS = [
  { id: 'ai-lab', label: 'AI Lab', emoji: '\u{1F9E0}' },
  { id: 'engineering', label: 'Engineering', emoji: '\u{1F6E0}\uFE0F' },
  { id: 'operations', label: 'Operations', emoji: '\u{26A1}' },
  { id: 'marketing', label: 'Growth', emoji: '\u{1F4C8}' },
  { id: 'bpo', label: 'BPO', emoji: '\u{1F4AC}' },
];

const SKILL_OPTIONS = [
  'Communication',
  'Problem Solving',
  'Technical Writing',
  'Team Leadership',
  'Data Analysis',
  'Customer Service',
];

const STEPS = [
  { label: 'The Hook', time: '30 sec' },
  { label: 'Your Story', time: '2 min' },
  { label: 'Skills Signal', time: '3 min' },
  { label: 'The Challenge', time: '5–10 min' },
  { label: 'Confirmation', time: '' },
];

const STORAGE_KEY = 'steadywrk-apply-draft';

export default function ApplyPage() {
  const params = useParams();
  const roleSlug = params.role as string;
  const role = ROLES.find((r) => r.slug === roleSlug);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed, cvFile: null }));
        if (parsed._step) setStep(parsed._step);
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (submitted) return;
    const timeout = setTimeout(() => {
      try {
        const { cvFile, ...saveable } = form;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saveable, _step: step }));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [form, step, submitted]);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, 5));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const body = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        team: form.team,
        position: role?.title ?? roleSlug,
        answers: {
          q1: form.answer1,
          q2: form.answer2,
          q3: form.answer3,
        },
        portfolioUrl: form.portfolioUrl,
        githubUrl: form.githubUrl,
        behanceUrl: form.behanceUrl,
        skills: form.skills,
        availability: form.availability,
        challengeResponse: form.challengeResponse,
      };
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setSubmitted(true);
      setStep(5);
      localStorage.removeItem(STORAGE_KEY);

      // Confetti burst with brand colors
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E58A0F', '#F5C563', '#CC7408'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#E58A0F', '#F5C563'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#E58A0F', '#F5C563'],
        });
      }, 250);
    } catch {
      // silently handle — form data is in localStorage
    } finally {
      setSubmitting(false);
    }
  }, [form, role, roleSlug]);

  if (!role) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center">
            <h1
              className="text-2xl font-bold text-[#23211D] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Role not found
            </h1>
            <p className="text-[#6E695F] mb-6">
              The position you&rsquo;re looking for doesn&rsquo;t exist.
            </p>
            <a href="/careers" className="text-[#E58A0F] font-medium hover:underline">
              View all open positions
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const progress = step === 5 ? 100 : ((step - 1) / 4) * 100;

  return (
    <>
      <Navbar />

      <main className="pt-16 bg-[#FAFAF8] min-h-screen">
        <div ref={formRef} className="max-w-2xl mx-auto px-6 py-10 md:py-16">
          {/* Progress bar */}
          {step < 5 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium text-[#23211D]">
                  Step {step} of 5 —{' '}
                  {step <= 4 && <span className="text-[#6E695F]">you&apos;re doing great.</span>}
                </span>
                <div className="flex items-center gap-1.5 text-[13px] text-[#B0B0AB]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~6–8 minutes total</span>
                </div>
              </div>
              <div className="h-2 bg-[#E5E5E2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E58A0F] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {STEPS.slice(0, 4).map((s, i) => (
                  <span
                    key={s.label}
                    className={`text-[11px] font-medium ${
                      i + 1 <= step ? 'text-[#E58A0F]' : 'text-[#B0B0AB]'
                    }`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Role header */}
          {step < 5 && (
            <div className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#E58A0F]">
                Applying for
              </span>
              <h1
                className="text-[24px] font-bold text-[#23211D] tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {role.title}
              </h1>
            </div>
          )}

          {/* ━━━ Step 1: The Hook ━━━ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  Full name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  Email address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms]"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  Phone number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms]"
                  placeholder="+962 7XX XXX XXXX"
                />
              </div>

              <fieldset>
                <legend className="block text-[14px] font-medium text-[#23211D] mb-3">
                  Which team excites you? *
                </legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TEAMS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => update('team', t.id)}
                      className={`p-4 rounded-xl border text-center transition-all duration-[180ms] ${
                        form.team === t.id
                          ? 'border-[#E58A0F] bg-[#FFF4E6] shadow-[0_0_0_3px_rgba(229,138,15,0.1)]'
                          : 'border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#E58A0F]/30'
                      }`}
                    >
                      <span className="text-[20px] block mb-1">{t.emoji}</span>
                      <span className="text-[13px] font-medium text-[#23211D]">{t.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pdplConsent}
                  onChange={(e) => update('pdplConsent', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-[#E5E7EB] text-[#E58A0F] focus:ring-[#E58A0F]"
                />
                <span className="text-[13px] text-[#6E695F] leading-relaxed">
                  I consent to STEADYWRK processing my personal data for recruitment purposes in
                  accordance with Jordan&rsquo;s Personal Data Protection Law (PDPL). *
                </span>
              </label>
            </div>
          )}

          {/* ━━━ Step 2: Your Story ━━━ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="block text-[14px] font-medium text-[#23211D] mb-1.5">
                  Upload your CV <span className="text-[#B0B0AB]">(optional)</span>
                </p>
                <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 text-center hover:border-[#E58A0F]/30 transition-colors duration-[180ms] cursor-pointer">
                  <Upload className="w-6 h-6 text-[#B0B0AB] mx-auto mb-3" />
                  <p className="text-[14px] text-[#6E695F] mb-1">
                    {form.cvFile ? form.cvFile.name : 'Drop your CV here or click to browse'}
                  </p>
                  <p className="text-[12px] text-[#B0B0AB]">PDF, DOCX, or TXT — max 5MB</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => update('cvFile', e.target.files?.[0] ?? null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    style={{ position: 'relative' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="a1" className="block text-[14px] font-medium text-[#23211D] mb-1.5">
                  What&rsquo;s the most interesting thing you&rsquo;ve built or organized? *
                </label>
                <textarea
                  id="a1"
                  value={form.answer1}
                  onChange={(e) => update('answer1', e.target.value)}
                  maxLength={900}
                  rows={4}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms] resize-none"
                  placeholder="Tell us about something you're proud of..."
                />
                <p className="text-[12px] text-[#B0B0AB] mt-1 text-right">
                  {form.answer1.split(/\s+/).filter(Boolean).length}/150 words
                </p>
              </div>

              <div>
                <label htmlFor="a2" className="block text-[14px] font-medium text-[#23211D] mb-1.5">
                  Why does AI in Jordan matter to you? *
                </label>
                <textarea
                  id="a2"
                  value={form.answer2}
                  onChange={(e) => update('answer2', e.target.value)}
                  maxLength={900}
                  rows={4}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms] resize-none"
                  placeholder="Share your perspective..."
                />
                <p className="text-[12px] text-[#B0B0AB] mt-1 text-right">
                  {form.answer2.split(/\s+/).filter(Boolean).length}/150 words
                </p>
              </div>

              <div>
                <label htmlFor="a3" className="block text-[14px] font-medium text-[#23211D] mb-1.5">
                  Describe a time you turned chaos into order. *
                </label>
                <textarea
                  id="a3"
                  value={form.answer3}
                  onChange={(e) => update('answer3', e.target.value)}
                  maxLength={900}
                  rows={4}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms] resize-none"
                  placeholder="Walk us through the situation..."
                />
                <p className="text-[12px] text-[#B0B0AB] mt-1 text-right">
                  {form.answer3.split(/\s+/).filter(Boolean).length}/150 words
                </p>
              </div>
            </div>
          )}

          {/* ━━━ Step 3: Skills Signal ━━━ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="portfolio"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  Portfolio URL <span className="text-[#B0B0AB]">(optional)</span>
                </label>
                <input
                  id="portfolio"
                  type="url"
                  value={form.portfolioUrl}
                  onChange={(e) => update('portfolioUrl', e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms]"
                  placeholder="https://your-portfolio.com"
                />
              </div>

              <div>
                <label
                  htmlFor="github"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  GitHub URL <span className="text-[#B0B0AB]">(optional)</span>
                </label>
                <input
                  id="github"
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => update('githubUrl', e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms]"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label
                  htmlFor="behance"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  Behance / Dribbble <span className="text-[#B0B0AB]">(optional)</span>
                </label>
                <input
                  id="behance"
                  type="url"
                  value={form.behanceUrl}
                  onChange={(e) => update('behanceUrl', e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms]"
                  placeholder="https://behance.net/yourusername"
                />
              </div>

              {/* Skill sliders */}
              <fieldset>
                <legend className="block text-[14px] font-medium text-[#23211D] mb-3">
                  Self-assess your skills <span className="text-[#B0B0AB]">(drag to rate)</span>
                </legend>
                <div className="space-y-4">
                  {SKILL_OPTIONS.map((skill) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] text-[#6E695F]">{skill}</span>
                        <span className="text-[12px] text-[#E58A0F] font-medium">
                          {form.skills[skill] ?? 5}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={form.skills[skill] ?? 5}
                        onChange={(e) =>
                          update('skills', {
                            ...form.skills,
                            [skill]: Number(e.target.value),
                          })
                        }
                        className="w-full h-2 bg-[#E5E5E2] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E58A0F] [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* Availability */}
              <fieldset>
                <legend className="block text-[14px] font-medium text-[#23211D] mb-3">
                  Availability *
                </legend>
                <div className="space-y-2">
                  {['Immediately', 'Within 2 weeks', 'Within 1 month', 'More than 1 month'].map(
                    (opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          value={opt}
                          checked={form.availability === opt}
                          onChange={(e) => update('availability', e.target.value)}
                          className="w-4 h-4 text-[#E58A0F] border-[#E5E7EB] focus:ring-[#E58A0F]"
                        />
                        <span className="text-[14px] text-[#23211D]">{opt}</span>
                      </label>
                    ),
                  )}
                </div>
              </fieldset>
            </div>
          )}

          {/* ━━━ Step 4: The Challenge ━━━ */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-[#FFF4E6] rounded-xl p-6 border border-[#E58A0F]/10">
                <h3
                  className="text-[16px] font-bold text-[#23211D] mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  The Challenge
                </h3>
                <p className="text-[14px] text-[#6E695F] leading-relaxed">
                  This is our first filter. We use assessments to find the best mutual fit — not to
                  trick you. Take your time and show us how you think.
                </p>
              </div>

              <div>
                <label
                  htmlFor="challenge"
                  className="block text-[14px] font-medium text-[#23211D] mb-1.5"
                >
                  Scenario Response *
                </label>
                <p className="text-[14px] text-[#6E695F] mb-3 leading-relaxed">
                  A property manager calls at 11 PM furious that their HVAC system is down in a
                  200-unit building. Write your response to the property manager and your next 3
                  action steps.
                </p>
                <textarea
                  id="challenge"
                  value={form.challengeResponse}
                  onChange={(e) => update('challengeResponse', e.target.value)}
                  rows={10}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3 text-[16px] text-[#23211D] placeholder:text-[#B0B0AB] input-brand transition-all duration-[180ms] resize-none"
                  placeholder="Write your response here..."
                />
              </div>
            </div>
          )}

          {/* ━━━ Step 5: Confirmation ━━━ */}
          {step === 5 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4D7A3A]/10 mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#4D7A3A]" strokeWidth={1.5} />
              </div>
              <h1
                className="text-[clamp(2rem,1.2rem+2.5vw,3rem)] font-bold text-[#23211D] mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Application submitted!
              </h1>
              <p className="text-[#6E695F] text-[17px] leading-relaxed max-w-md mx-auto mb-10">
                We&rsquo;ll review your application within 48 hours. Here&rsquo;s what happens next:
              </p>

              {/* Pipeline timeline */}
              <div className="max-w-sm mx-auto space-y-4 text-left mb-12">
                {[
                  { step: 'Application review', time: 'Within 48 hours', active: true },
                  { step: 'Skills assessment', time: 'If shortlisted', active: false },
                  { step: 'Video interview', time: '3 async questions', active: false },
                  { step: 'Live interview', time: '45 min with team lead', active: false },
                  { step: 'Offer', time: 'With growth plan', active: false },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                          s.active ? 'bg-[#E58A0F] text-white' : 'bg-[#E5E5E2] text-[#6E695F]'
                        }`}
                      >
                        {i + 1}
                      </div>
                      {i < 4 && <div className="w-px h-6 bg-[#E5E5E2] mt-1" />}
                    </div>
                    <div className="pt-1">
                      <p className="text-[14px] font-medium text-[#23211D]">{s.step}</p>
                      <p className="text-[12px] text-[#B0B0AB]">{s.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/careers"
                  className="inline-flex items-center gap-2 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-8 py-3.5 rounded-lg transition-colors duration-[180ms]"
                >
                  Explore more roles
                </a>
                <a
                  href="/"
                  className="text-[14px] font-medium text-[#6E695F] hover:text-[#23211D] transition-colors"
                >
                  Back to home
                </a>
              </div>
            </div>
          )}

          {/* ━━━ Navigation ━━━ */}
          {step < 5 && (
            <div className="mt-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prev}
                    className="flex items-center gap-2 text-[14px] font-medium text-[#6E695F] hover:text-[#23211D] transition-colors duration-[180ms]"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const { cvFile, ...saveable } = form;
                      localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({ ...saveable, _step: step }),
                      );
                    } catch {
                      // ignore
                    }
                  }}
                  className="flex items-center gap-1.5 text-[13px] text-[#B0B0AB] hover:text-[#6E695F] transition-colors duration-[180ms]"
                >
                  <Save className="w-3.5 h-3.5" /> Save & continue later
                </button>
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center gap-2 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-7 py-3 rounded-lg transition-colors duration-[180ms]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium text-[15px] px-7 py-3 rounded-lg transition-colors duration-[180ms] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                  {!submitting && <Sparkles className="w-4 h-4" />}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
