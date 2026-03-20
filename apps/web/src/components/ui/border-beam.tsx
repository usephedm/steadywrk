'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  color?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  delay = 0,
  color = '#F59E0B',
  colorTo = 'rgba(245, 158, 11, 0)',
}: BorderBeamProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // JS-driven rotation fallback — works on all browsers including Safari <15.4
  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;
    const durationMs = duration * 1000;
    const delayMs = delay * 1000;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime - delayMs;

      if (elapsed >= 0) {
        const angle = ((elapsed / durationMs) * 360) % 360;
        const gradientBeam = `conic-gradient(from ${angle}deg, ${colorTo} 0%, ${color} 10%, ${colorTo} 20%)`;
        const gradientGlow = `conic-gradient(from ${angle}deg, transparent 0%, ${color}22 5%, transparent 15%)`;

        if (beamRef.current) {
          beamRef.current.style.background = gradientBeam;
        }
        if (glowRef.current) {
          glowRef.current.style.background = gradientGlow;
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [duration, delay, color, colorTo]);

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden',
        className,
      )}
    >
      <div
        ref={beamRef}
        className="absolute inset-[-1px] rounded-[inherit]"
        style={{
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      <div
        ref={glowRef}
        className="absolute rounded-[inherit]"
        style={{
          inset: -size / 2,
          filter: `blur(${size / 4}px)`,
        }}
      />
    </div>
  );
}
