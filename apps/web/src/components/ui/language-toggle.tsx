'use client';

import { useState } from 'react';

interface LanguageToggleProps {
  children: (lang: 'en' | 'ar') => React.ReactNode;
}

export function LanguageToggle({ children }: LanguageToggleProps) {
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-[180ms] ${
            lang === 'en'
              ? 'bg-[#E58A0F] text-white'
              : 'bg-[#F5F5F3] text-[#6B6B66] hover:bg-[#EAE3D8]'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLang('ar')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-[180ms] ${
            lang === 'ar'
              ? 'bg-[#E58A0F] text-white'
              : 'bg-[#F5F5F3] text-[#6B6B66] hover:bg-[#EAE3D8]'
          }`}
        >
          العربية
        </button>
      </div>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} lang={lang}>
        {children(lang)}
      </div>
    </div>
  );
}
