'use client';

import { CustomCursor } from '@/components/ui/custom-cursor';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import InteractiveHoverButton from '@/components/ui/interactive-hover-button';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { useTouchDevice } from '@/lib/hooks/use-touch-device';
import { playConfirmSound, startAmbientHum } from '@/lib/sound';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// Heavy WebGL layers — out of critical path
const ShaderAnimation = dynamic(
  () => import('@/components/ui/shader-animation').then((m) => m.ShaderAnimation),
  { ssr: false },
);
const UnicornScene = dynamic(
  () => import('@/components/ui/unicorn-scene').then((m) => m.UnicornScene),
  { ssr: false },
);

const ease = [0.16, 1, 0.3, 1] as const;

// Deterministic ember positions — no hydration mismatch
const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  left: `${((i * 37 + 13) % 86) + 7}%`,
  animationDelay: `${((i * 2.7) % 14).toFixed(1)}s`,
  animationDuration: `${(12 + ((i * 3.1) % 10)).toFixed(1)}s`,
  size: 1.5 + (i % 3) * 0.5,
  opacity: 0.15 + (i % 4) * 0.08,
}));

export default function Home() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const readyRef = useRef(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const humStopRef = useRef<(() => void) | null>(null);
  const humStartedRef = useRef(false);

  const prefersReduced = usePrefersReducedMotion();
  const isTouch = useTouchDevice();

  // Loading gate — wait for document + critical assets
  useEffect(() => {
    const checkLoaded = () => {
      if (document.readyState === 'complete') {
        // Faster timeout on mobile
        const delay = isTouch ? 200 : 400;
        setTimeout(() => setSiteLoaded(true), delay);
      }
    };

    if (document.readyState === 'complete') {
      const logo = document.querySelector('img[alt="SteadyWrk Logo"]') as HTMLImageElement;
      if (logo && !logo.complete) {
        logo.addEventListener('load', () => checkLoaded(), { once: true });
      } else {
        checkLoaded();
      }
    } else {
      window.addEventListener('load', checkLoaded, { once: true });
    }

    // Fallback — faster on mobile
    const fallbackMs = isTouch ? 3000 : 5000;
    const fallback = setTimeout(() => setSiteLoaded(true), fallbackMs);
    return () => clearTimeout(fallback);
  }, [isTouch]);

  // Cache bounding rect — resize only, not per-mousemove
  useEffect(() => {
    if (isTouch) return;
    const updateRect = () => {
      if (mainRef.current) {
        rectRef.current = mainRef.current.getBoundingClientRect();
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect, { passive: true });
    return () => window.removeEventListener('resize', updateRect);
  }, [isTouch]);

  // Mark interactive after entrance completes AND site loaded
  useEffect(() => {
    if (!siteLoaded) return;
    const t = setTimeout(() => {
      readyRef.current = true;
    }, 300);
    return () => clearTimeout(t);
  }, [siteLoaded]);

  // Keyboard — Enter or Space
  useEffect(() => {
    if (exiting) return;
    const handler = (e: KeyboardEvent) => {
      if (!readyRef.current || !siteLoaded || exiting) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnter();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [exiting, siteLoaded]);

  // Cleanup ambient hum on unmount
  useEffect(() => {
    return () => {
      humStopRef.current?.();
    };
  }, []);

  const triggerEnter = useCallback(() => {
    if (exiting || !siteLoaded) return;
    setExiting(true);
    humStopRef.current?.();
    if (!prefersReduced) {
      playConfirmSound();
    }
    setTimeout(() => router.push('/dashboard'), prefersReduced ? 100 : 900);
  }, [exiting, router, siteLoaded, prefersReduced]);

  // Mouse tracking — ambient glow + logo parallax + ambient hum trigger
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (exiting || isTouch) return;

      // Start ambient hum on first mouse interaction (never auto-play)
      if (!humStartedRef.current && !prefersReduced) {
        humStartedRef.current = true;
        humStopRef.current = startAmbientHum();
      }

      const rect = rectRef.current;
      if (!rect) return;

      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${nx * 100}% ${ny * 100}%, rgba(245,158,11,0.04), transparent 40%)`;
      }
      if (logoWrapRef.current) {
        const tiltX = (ny - 0.5) * -3;
        const tiltY = (nx - 0.5) * 3;
        logoWrapRef.current.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    },
    [exiting, isTouch, prefersReduced],
  );

  const handleMouseLeave = useCallback(() => {
    if (logoWrapRef.current) {
      logoWrapRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
    }
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  }, []);

  const showHeavyEffects = !isTouch && !prefersReduced;

  return (
    <>
      {!isTouch && <CustomCursor />}

      {/* Exit flash — portal opening effect */}
      <AnimatePresence>
        {exiting && !prefersReduced && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(245,158,11,0.25), rgba(255,255,255,0.08) 50%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.main
        ref={mainRef}
        className="relative h-dvh w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={
          exiting && !prefersReduced ? { scale: 1.05, opacity: 0 } : { opacity: 1, scale: 1 }
        }
        transition={prefersReduced ? { duration: 0.01 } : { duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: showHeavyEffects ? 'transform, opacity' : undefined }}
      >
        {/* Layer 0: Amber-tinted shader rings — desktop only, skip on reduced motion */}
        {showHeavyEffects && <ShaderAnimation className="absolute inset-0 z-0 opacity-[0.15]" />}

        {/* Layer 1: UnicornStudio 3D — desktop only */}
        {showHeavyEffects && <UnicornScene className="absolute inset-0 z-[1]" />}

        {/* Layer 1.5: Mobile/reduced-motion ambient — CSS pulsing glow */}
        {(isTouch || prefersReduced) && (
          <div
            className="absolute inset-0 z-[1] pointer-events-none flex items-center justify-center"
            style={{ contain: 'strict' }}
          >
            <div
              style={{
                width: '70vw',
                height: '40vh',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)',
                filter: 'blur(60px)',
                animation: prefersReduced ? 'none' : 'mobile-pulse 6s ease-in-out infinite',
              }}
            />
          </div>
        )}

        {/* Layer 2: Vignette */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            contain: 'strict',
            background:
              'radial-gradient(ellipse at 50% 40%, transparent 10%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.92) 100%)',
          }}
        />

        {/* Layer 3: Noise texture */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            contain: 'strict',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        {/* Layer 3.5: Ember particles — pure CSS, skip on reduced motion */}
        {!prefersReduced && (
          <div
            className="absolute inset-0 z-[3] pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            {EMBERS.map((ember, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: ember.left,
                  width: ember.size,
                  height: ember.size,
                  borderRadius: '50%',
                  background: '#F59E0B',
                  opacity: ember.opacity,
                  animation: `ember-float ${ember.animationDuration} ${ember.animationDelay} infinite linear`,
                  willChange: 'transform, opacity',
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 4: Mouse-follow ambient glow — desktop only */}
        {!isTouch && (
          <div
            ref={glowRef}
            className="absolute inset-0 z-[4] pointer-events-none"
            style={{ transition: 'background 0.3s ease', willChange: 'background' }}
          />
        )}

        {/* Layer 5: Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
          {/* Logo — parallax tilt wrapper (desktop only) */}
          <div
            ref={logoWrapRef}
            style={{
              transition: isTouch ? undefined : 'transform 0.2s ease-out',
              willChange: isTouch ? undefined : 'transform',
            }}
          >
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
              animate={
                exiting && !prefersReduced ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }
              }
              transition={prefersReduced ? { duration: 0.01 } : { duration: 1.4, ease }}
              className="relative w-[80vw] max-w-[900px] flex items-center justify-center"
            >
              {/* Pulsing ambient glow behind logo */}
              {!prefersReduced && (
                <motion.div
                  className="absolute -inset-x-24 -inset-y-16"
                  style={{
                    background:
                      'radial-gradient(ellipse, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                    contain: 'strict',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.8, 0.5] }}
                  transition={{
                    duration: 3,
                    ease: 'easeInOut',
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                />
              )}

              {/* Float animation — skip on reduced motion */}
              <motion.div
                animate={prefersReduced ? {} : { y: [0, -6, 0] }}
                transition={
                  prefersReduced
                    ? { duration: 0.01 }
                    : {
                        duration: 4,
                        ease: 'easeInOut',
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'loop',
                      }
                }
                className="w-full flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.webp"
                  alt="SteadyWrk Logo"
                  width={1620}
                  height={368}
                  className="w-full h-auto object-contain pointer-events-none select-none"
                  draggable={false}
                  decoding="async"
                  style={{
                    filter: [
                      'brightness(1.6)',
                      'drop-shadow(0 0 16px rgba(245,158,11,0.6))',
                      'drop-shadow(0 0 60px rgba(245,158,11,0.25))',
                    ].join(' '),
                    contain: 'layout paint',
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Tagline — morphing text */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: exiting ? 0 : 1, y: exiting ? -4 : 0 }}
            transition={prefersReduced ? { duration: 0.01 } : { duration: 0.8, delay: 0.3, ease }}
          >
            <GooeyText
              texts={['Apply', 'Train', 'Work', 'Steady']}
              morphTime={1.5}
              cooldownTime={0.5}
              className="h-8 sm:h-10 mt-3"
              textClassName="text-white/30 text-xs sm:text-sm tracking-[0.3em] uppercase font-mono"
              id="splash-gooey"
            />
          </motion.div>

          {/* Accent line — shimmer animation */}
          {!prefersReduced && (
            <motion.div
              className="w-[30vw] max-w-[300px] h-px mt-4 mb-6"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.08) 20%, rgba(245,158,11,0.3) 50%, rgba(245,158,11,0.08) 80%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 6s ease-in-out infinite',
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{
                opacity: exiting ? 0 : 1,
                scaleX: exiting ? 0 : 1,
              }}
              transition={{ duration: 1, delay: 0.5, ease }}
            />
          )}

          {/* Spacer for reduced motion (no shimmer line) */}
          {prefersReduced && <div className="h-6" />}

          {/* Button — "WRK" with loading gate */}
          <AnimatePresence>
            {!exiting && (
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={
                  prefersReduced ? { duration: 0.01 } : { duration: 0.6, delay: 0.7, ease }
                }
                className="relative"
              >
                {/* Loading ring — orbital animation while loading */}
                {!siteLoaded && !prefersReduced && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: 'calc(100% + 24px)',
                        height: 'calc(100% + 24px)',
                        border: '1px solid transparent',
                        borderTopColor: '#F59E0B',
                        animation: 'loading-orbit 1.2s linear infinite',
                        filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.6))',
                      }}
                    />
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: 'calc(100% + 32px)',
                        height: 'calc(100% + 32px)',
                        border: '1px solid transparent',
                        borderBottomColor: 'rgba(245,158,11,0.3)',
                        animation: 'loading-orbit 2s linear infinite reverse',
                      }}
                    />
                  </div>
                )}

                <InteractiveHoverButton
                  text={siteLoaded ? 'WRK' : '···'}
                  hoverText="ENTER"
                  onClick={triggerEnter}
                  disabled={!siteLoaded}
                  classes={
                    'bg-white/[0.07] backdrop-blur-md border-white/[0.15] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_50px_rgba(245,158,11,0.2)] hover:border-amber-500/25 px-14 py-4 text-xl font-mono tracking-[0.4em] font-bold transition-all duration-500 min-h-[56px] min-w-[56px]'
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom edge glow — suggests depth beyond */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-[5] pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(245,158,11,0.025), transparent)',
            contain: 'strict',
          }}
        />

        {/* Trademark */}
        <motion.div
          className="absolute bottom-6 sm:bottom-8 z-10 text-white/20 text-[10px] tracking-[0.25em] uppercase font-light font-mono"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={prefersReduced ? { duration: 0.01 } : { duration: 1, delay: 1.2 }}
        >
          SteadyWrk™ · SteadyWrk LLC
        </motion.div>
      </motion.main>
    </>
  );
}
