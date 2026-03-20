'use client';

import { useEffect, useRef } from 'react';

interface UnicornSceneProps {
  className?: string;
}

interface UnicornStudioScene {
  destroy: () => void;
}

interface UnicornStudioAPI {
  init: (opts: Record<string, unknown>) => Promise<UnicornStudioScene[]>;
}

export function UnicornScene({ className }: UnicornSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<UnicornStudioScene[] | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Desktop only — skip on mobile/tablet
    if (window.innerWidth < 1024) return;

    let cancelled = false;

    const script = document.createElement('script');
    script.src = 'https://cdn.unicorn.studio/v1.4.1/unicornStudio.umd.js';
    script.async = true;

    // Timeout: if script hasn't loaded in 8s, give up silently
    const timeout = setTimeout(() => {
      cancelled = true;
    }, 8000);

    script.onload = () => {
      if (cancelled) return;
      clearTimeout(timeout);

      const us = (window as unknown as Record<string, unknown>).UnicornStudio as
        | UnicornStudioAPI
        | undefined;

      if (!us) return;

      us.init({
        element: container,
        projectId: 'OMzqyUv6M3kSnv0JeAtC',
        scale: 1,
        lazyLoad: true,
        filePath: 'https://cdn.unicorn.studio/',
        interactivity: {
          mouse: { disableMobile: true },
        },
      })
        .then((scenes) => {
          if (!cancelled) {
            sceneRef.current = scenes;
          } else {
            scenes.forEach((s) => s.destroy());
          }
        })
        .catch(() => {
          // CDN or init failure — ambient gradient fallback is visible
        });
    };

    script.onerror = () => {
      clearTimeout(timeout);
    };

    document.head.appendChild(script);

    // Hide UnicornStudio branding watermark
    const observer = new MutationObserver(() => {
      const badges = container.querySelectorAll(
        'a[href*="unicorn.studio"], [class*="unicorn-badge"], [class*="us-badge"]',
      );
      for (const badge of badges) {
        (badge as HTMLElement).style.display = 'none';
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      observer.disconnect();
      if (sceneRef.current) {
        sceneRef.current.forEach((s) => s.destroy());
        sceneRef.current = null;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`hidden lg:block ${className ?? ''}`} aria-hidden="true" />
  );
}
