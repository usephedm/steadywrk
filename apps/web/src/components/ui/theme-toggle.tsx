'use client';

import { Moon, Sun } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(root.classList.contains('dark'));
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    setIsDark(next);
    // Persist in cookie for SSR hint
    document.cookie = `theme=${next ? 'dark' : 'light'};path=/;max-age=31536000;SameSite=Lax`;
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="p-2 rounded-lg text-[#6E695F] hover:text-[#23211D] dark:text-white/50 dark:hover:text-white/80 transition-colors duration-[180ms]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
