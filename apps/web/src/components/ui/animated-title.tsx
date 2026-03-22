'use client';

import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { motion } from 'motion/react';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedTitle({ text, className = '', delay = 0 }: AnimatedTitleProps) {
  const prefersReduced = usePrefersReducedMotion();
  const letters = text.split('');

  if (prefersReduced) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,
            delayChildren: delay,
          },
        },
      }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          className="inline-block"
          style={letter === ' ' ? { width: '0.3em' } : undefined}
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              rotateX: -90,
              filter: 'blur(8px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              transition: {
                type: 'spring',
                damping: 20,
                stiffness: 200,
              },
            },
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}
