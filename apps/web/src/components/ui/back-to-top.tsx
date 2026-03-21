'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 2;

    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-20 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-[#E58A0F] text-white shadow-lg shadow-[#E58A0F]/20 hover:bg-[#CC7408] hover:shadow-[#E58A0F]/40 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
