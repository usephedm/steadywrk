'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function SubmitSalaryPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    jobTitle: '',
    country: '',
    yearsOfExperience: 0,
    baseSalaryUsd: 0,
    isRemote: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStatus === 'loading') return;
    setFormStatus('loading');

    try {
      const res = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Submission failed');
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-[#FAFAF8] pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-[var(--font-display)] text-4xl md:text-5xl font-extrabold text-[#23211D] tracking-tight mb-4">
              Contribute to Open Salary Data
            </h1>
            <p className="text-[#6B6B66] text-lg">
              Help us map the true tech salary landscape across the MENA region. All submissions are
              100% anonymous.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.06)] p-8 shadow-sm">
            {formStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E58A0F]/10 text-[#E58A0F] mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#23211D] mb-2">Thank you!</h3>
                <p className="text-[#6B6B66]">
                  Your data has been successfully ingested. It will be included in the next regional
                  benchmarking update.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-[#23211D] mb-2"
                  >
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    required
                    placeholder="e.g. Senior AI Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E58A0F] focus:ring-1 focus:ring-[#E58A0F] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-[#23211D] mb-2"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E58A0F] focus:ring-1 focus:ring-[#E58A0F] transition-all"
                    >
                      <option value="" disabled>
                        Select Country...
                      </option>
                      <option value="Jordan">Jordan</option>
                      <option value="KSA">Saudi Arabia</option>
                      <option value="UAE">UAE</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="yearsOfExperience"
                      className="block text-sm font-medium text-[#23211D] mb-2"
                    >
                      Experience (Years)
                    </label>
                    <input
                      id="yearsOfExperience"
                      type="number"
                      required
                      min="0"
                      max="50"
                      value={formData.yearsOfExperience || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yearsOfExperience: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E58A0F] focus:ring-1 focus:ring-[#E58A0F] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="baseSalaryUsd"
                    className="block text-sm font-medium text-[#23211D] mb-2"
                  >
                    Base Salary (USD/Year)
                  </label>
                  <input
                    id="baseSalaryUsd"
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    placeholder="e.g. 75000"
                    value={formData.baseSalaryUsd || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseSalaryUsd: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#F5F5F3] border border-[#E5E5E2] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E58A0F] focus:ring-1 focus:ring-[#E58A0F] transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isRemote"
                    checked={formData.isRemote}
                    onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
                    className="w-5 h-5 rounded border-[#E5E5E2] text-[#E58A0F] focus:ring-[#E58A0F]"
                  />
                  <label htmlFor="isRemote" className="text-sm font-medium text-[#23211D]">
                    Is this a fully remote role?
                  </label>
                </div>

                {formStatus === 'error' && (
                  <p className="text-[#A03D4A] text-sm" role="alert">
                    Failed to submit data. Please check your inputs and try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full bg-[#E58A0F] hover:bg-[#CC7408] text-white font-medium py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {formStatus === 'loading' ? 'Submitting...' : 'Submit Anonymously'}
                  {!formStatus && <ChevronRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
