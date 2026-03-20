'use client';

import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const prefersReduced = usePrefersReducedMotion();
  const smoothProgress = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (prefersReduced) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(scrollTop / docHeight);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX: smoothProgress,
        background: 'linear-gradient(90deg, #F59E0B, #F59E0B 80%, rgba(245,158,11,0.3))',
        boxShadow: '0 0 10px rgba(245,158,11,0.5), 0 0 20px rgba(245,158,11,0.2)',
      }}
    />
  );
}
