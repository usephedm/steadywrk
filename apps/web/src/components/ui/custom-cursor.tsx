'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!dot || !glow) return;

    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;
    let visible = false;
    let rafId = 0;
    let idle = true;
    let idleTimer = 0;
    let isAction = false;

    const startLoop = () => {
      if (!idle) return;
      idle = false;
      rafId = requestAnimationFrame(animateGlow);
    };

    const markIdle = () => {
      idle = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Detect hovering interactive elements — cursor changes state
      const target = e.target as HTMLElement;
      const overAction = target.closest?.('button, a, [data-interactive]') !== null;
      if (overAction !== isAction) {
        isAction = overAction;
        dot.style.boxShadow = isAction
          ? '0 0 0 3px rgba(245,158,11,0.25), 0 0 14px rgba(245,158,11,0.4)'
          : 'none';
      }

      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;

      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        glow.style.opacity = '1';
      }

      clearTimeout(idleTimer);
      startLoop();
      idleTimer = window.setTimeout(markIdle, 150);
    };

    const onMouseLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      glow.style.opacity = '0';
      idle = true;
    };

    // Smooth glow trail — stops when mouse idle
    const animateGlow = () => {
      if (idle) return;

      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.transform = `translate(${glowX - 16}px, ${glowY - 16}px)`;

      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      if (dx * dx + dy * dy < 0.5) {
        glow.style.transform = `translate(${mouseX - 16}px, ${mouseY - 16}px)`;
        idle = true;
        return;
      }

      rafId = requestAnimationFrame(animateGlow);
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
      clearTimeout(idleTimer);
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#F59E0B',
          opacity: 0,
          transition: 'opacity 0.2s, box-shadow 0.2s',
          willChange: 'transform',
          mixBlendMode: 'difference',
          contain: 'layout paint',
        }}
      />
      <div
        ref={glowRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%)',
          opacity: 0,
          transition: 'opacity 0.3s',
          willChange: 'transform',
          filter: 'blur(2px)',
          contain: 'layout paint',
        }}
      />
    </>
  );
}
