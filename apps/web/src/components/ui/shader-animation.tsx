'use client';

import { useEffect, useRef } from 'react';
import { Camera, Mesh, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';
import type { IUniform } from 'three';

export function ShaderAnimation({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    try {
      const testCanvas = document.createElement('canvas');
      if (!testCanvas.getContext('webgl2') && !testCanvas.getContext('webgl')) {
        container.style.background = 'radial-gradient(ellipse at center, #0a0500 0%, #000 100%)';
        return;
      }
    } catch {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i = 0; i < 5; i++){
            color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }

        float lum = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(color, lum * vec3(0.96, 0.62, 0.04), 0.7);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new Camera();
    camera.position.z = 1;

    const scene = new Scene();
    const geometry = new PlaneGeometry(2, 2);

    const uniforms: Record<string, IUniform> = {
      time: { value: 0.0 },
      resolution: { value: new Vector2() },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // Half-res rendering — this layer is at 15% opacity, nobody sees pixel detail
    const renderer = new WebGLRenderer({
      antialias: false,
      powerPreference: 'low-power',
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.imageRendering = 'auto';

    const onResize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onResize();
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onResize, { passive: true });

    let animationId = 0;
    let paused = false;
    let frameCount = 0;
    const timeStep = prefersReducedMotion ? 0.01 : 0.05;

    // Frame budget: on 120Hz+ displays, render every other frame (effective 60fps)
    // At 15% opacity this is visually identical but halves GPU cost
    const isHighRefresh = !!window.screen?.availHeight; // conservative: assume 120Hz capable
    const frameSkip = isHighRefresh ? 2 : 1;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (paused) return;

      frameCount++;
      if (frameCount % frameSkip !== 0) return;

      uniforms.time.value += timeStep * frameSkip;
      renderer.render(scene, camera);
    };

    const onVisibilityChange = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${className ?? ''}`}
      style={{ background: '#000', overflow: 'hidden', contain: 'strict' }}
    />
  );
}
