let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function isAudioEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  // Respect user preference
  if (localStorage.getItem('steadywrk-audio') === 'off') return false;
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}

/** Short PS5-style confirm tone — two sine waves ascending */
export function playConfirmSound() {
  if (!isAudioEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(880, now);
  osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.06);
  gain1.gain.setValueAtTime(0.06, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1320, now + 0.04);
  osc2.frequency.exponentialRampToValueAtTime(1540, now + 0.1);
  gain2.gain.setValueAtTime(0.04, now + 0.04);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.04);
  osc2.stop(now + 0.2);
}

/**
 * Subliminal ambient hum — adds "presence" to the space.
 * 60Hz sine at gain 0.005 — below conscious hearing threshold for most people.
 * NEVER auto-plays — requires user interaction to start.
 * Returns a cleanup function that fades out and stops.
 */
export function startAmbientHum(): () => void {
  if (!isAudioEnabled()) return () => {};

  const ctx = getAudioContext();
  if (!ctx) return () => {};

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 60;

  // Fade in over 4 seconds — undetectable entrance
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();

  let stopped = false;

  return () => {
    if (stopped) return;
    stopped = true;
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
    setTimeout(() => {
      try {
        osc.stop();
      } catch {
        // Already stopped
      }
    }, 600);
  };
}
