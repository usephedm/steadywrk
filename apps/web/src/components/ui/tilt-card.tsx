'use client';

import { useTouchDevice } from '@/lib/hooks/use-touch-device';
import { useCallback, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

export function TiltCard({ children, className = '', tiltAmount = 4 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useTouchDevice();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || isTouch) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -tiltAmount;
      const rotateY = (x - 0.5) * tiltAmount;

      ref.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [tiltAmount, isTouch],
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.15s ease-out',
        willChange: isTouch ? undefined : 'transform',
        transformStyle: isTouch ? undefined : 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}
