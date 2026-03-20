'use client';

import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AudioToggle() {
  const prefersReduced = usePrefersReducedMotion();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('steadywrk-audio');
    if (stored === 'on' && !prefersReduced) {
      setMuted(false);
    } else {
      setMuted(true);
    }
  }, [prefersReduced]);

  // Auto-mute when reduced motion is enabled
  useEffect(() => {
    if (prefersReduced) {
      setMuted(true);
      localStorage.setItem('steadywrk-audio', 'off');
    }
  }, [prefersReduced]);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('steadywrk-audio', next ? 'off' : 'on');
  };

  return (
    <button
      onClick={toggle}
      className="text-white/20 hover:text-amber-500/60 transition-colors p-1"
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      data-interactive
    >
      {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
    </button>
  );
}
