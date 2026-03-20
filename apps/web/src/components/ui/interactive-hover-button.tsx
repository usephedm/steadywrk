'use client';

import { useTouchDevice } from '@/lib/hooks/use-touch-device';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface InteractiveHoverButtonProps extends Omit<HTMLMotionProps<'button'>, 'onClick'> {
  text?: string;
  hoverText?: string;
  classes?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function InteractiveHoverButton({
  text = 'Button',
  hoverText,
  classes,
  onClick,
  disabled = false,
  ...props
}: InteractiveHoverButtonProps) {
  const revealText = hoverText ?? text;
  const isTouch = useTouchDevice();

  const handleTap = () => {
    if (disabled) return;
    // Haptic feedback on supported devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    onClick?.();
  };

  return (
    <motion.button
      type="button"
      aria-label={text}
      aria-disabled={disabled}
      data-interactive
      className={cn(
        'group relative flex min-w-40 items-center justify-center overflow-hidden rounded-full border p-2 px-6 font-semibold',
        disabled && 'opacity-60 pointer-events-none',
        classes,
      )}
      onClick={handleTap}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'bg-[#F59E0B] h-2 w-2 rounded-full transition-transform duration-500',
            !isTouch && 'group-hover:scale-[40]',
            isTouch && 'animate-pulse',
          )}
        />
        <span
          className={cn(
            'inline-block transition-all duration-500',
            !isTouch && 'group-hover:translate-x-20 group-hover:opacity-0',
          )}
        >
          {text}
        </span>
        {/* Desktop: reveal on hover. Touch: hidden (tap triggers directly) */}
        {!isTouch && (
          <div className="text-primary-foreground absolute top-0 left-0 z-10 flex h-full w-full -translate-x-16 items-center justify-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            <span>{revealText}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </motion.button>
  );
}
