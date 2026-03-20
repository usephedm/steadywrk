'use client';

import { useEffect, useRef, useState } from 'react';

interface TransparentLogoProps {
  src: string;
  alt: string;
  className?: string;
  threshold?: number;
  brightness?: number;
  maxCanvasSize?: number;
}

export function TransparentLogo({
  src,
  alt,
  className,
  threshold = 195,
  brightness = 1.3,
  maxCanvasSize = 2048,
}: TransparentLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    const processImage = async () => {
      // Fetch + decode via createImageBitmap — faster than new Image() on modern browsers
      const response = await fetch(src);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      if (cancelled) return;

      const scale = Math.min(1, maxCanvasSize / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);

      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = 'high';
      offCtx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close(); // Free memory immediately

      const imageData = offCtx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Remove white/light background with smooth edge gradient
      let minX = w;
      let minY = h;
      let maxX = 0;
      let maxY = 0;
      const gradientRange = 60;

      for (let i = 0, len = data.length; i < len; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        if (avg > threshold) {
          data[i + 3] = 0;
        } else if (avg > threshold - gradientRange) {
          const t = (avg - (threshold - gradientRange)) / gradientRange;
          data[i + 3] = Math.round(255 * (1 - t * t * (3 - 2 * t)));
        }

        if (data[i + 3] > 10) {
          const pixelIndex = i >> 2;
          const x = pixelIndex % w;
          const y = (pixelIndex / w) | 0;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }

      offCtx.putImageData(imageData, 0, 0);

      const pad = 20;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(w, maxX + pad) - cropX;
      const cropH = Math.min(h, maxY + pad) - cropY;

      if (cancelled) return;

      canvas.width = cropW;
      canvas.height = cropH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(offscreen, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      setReady(true);
    };

    processImage().catch(() => {
      // Fallback: if createImageBitmap fails, use Image element
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        const scale = Math.min(1, maxCanvasSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        setReady(true);
      };
    });

    return () => {
      cancelled = true;
    };
  }, [src, threshold, maxCanvasSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.6s ease',
        imageRendering: 'auto',
        filter: [
          `brightness(${brightness})`,
          'drop-shadow(0 0 16px rgba(245, 158, 11, 0.6))',
          'drop-shadow(0 0 60px rgba(245, 158, 11, 0.25))',
        ].join(' '),
        contain: 'layout paint',
      }}
    />
  );
}
