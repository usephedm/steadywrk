'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const VERTEX_SHADER = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform float u_time;
uniform vec2  u_resolution;

vec2 normCoord() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    return uv;
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

float smoothRing(vec2 p, float r, float thickness) {
    float d = abs(sdCircle(p, r)) - thickness * 0.5;
    return smoothstep(0.01, -0.01, d);
}

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = normCoord();
    float t  = u_time * 0.35;
    vec3 col = vec3(0.02, 0.03, 0.06);

    float yGrad = smoothstep(-1.0, 0.8, uv.y + 0.15);
    vec3 amber  = vec3(0.90, 0.54, 0.06);
    vec3 teal   = vec3(0.06, 0.42, 0.44);
    col += mix(teal * 0.35, amber * 0.45, yGrad);

    float curve = uv.x + 0.35 * sin(uv.y * 2.7 + t * 1.6);
    float ridge = smoothstep(0.08, 0.0, abs(curve));
    col += ridge * vec3(1.0, 0.80, 0.55);

    for (int i = 0; i < 4; ++i) {
        float fi   = float(i);
        float r    = 0.35 + fi * 0.18;
        float th   = mix(0.035, 0.015, fi / 3.0);
        float spin = t * (1.0 + fi * 0.35);
        vec2 p     = uv;
        p *= mat2(cos(spin), -sin(spin), sin(spin), cos(spin));
        float ring = smoothRing(p, r, th);
        float mask = smoothstep(-0.1, 0.35, uv.y);
        vec3 ringCol = mix(teal, amber, fi / 3.0);
        col += ring * mask * ringCol * 1.2;
    }

    vec2 grid = floor((uv + vec2(t * 0.15, 0.0)) * 12.0);
    float n   = hash(grid);
    float nodeMask = smoothstep(0.995, 1.0, n);
    vec2 nodePos = (grid + 0.5) / 12.0 * 2.0 - 1.0;
    nodePos.x *= u_resolution.x / u_resolution.y;
    float dNode = length(uv - nodePos);
    float node  = nodeMask * smoothstep(0.09, 0.0, dNode);
    col += node * vec3(1.2, 0.95, 0.70);

    float vign = smoothstep(1.2, 0.35, length(uv - vec2(-0.25, 0.1)));
    col *= vign;

    float grain = hash(uv * u_resolution.xy + vec2(t));
    col += (grain - 0.5) * 0.03;

    fragColor = vec4(pow(col, vec3(0.92)), 1.0);
}`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

interface OrbitalFieldProps {
  className?: string;
}

export function OrbitalField({ className }: OrbitalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = createProgram(gl, vs, fs);
    if (!program) return;

    // Full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    startRef.current = performance.now();

    const render = () => {
      resize();
      const t = (performance.now() - startRef.current) / 1000;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full', className)}
      aria-hidden="true"
      style={{ contain: 'strict' }}
    />
  );
}
