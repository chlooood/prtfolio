"use client";

import { useEffect, useRef } from "react";

/**
 * The site's painting: the North Shore mountains across the water, rendered
 * as a watercolour in a fragment shader. Nothing is an image file — the
 * ridges, washes, pigment pooling, granulation and dry-brush water are all
 * computed, which is why it can do three things a picture can't:
 *
 *   · paint itself in — pencil underdrawing first, then the washes bloom
 *   · set the sun as the hero scrolls away
 *   · come back as the same view at dusk mid-page and by moonlight at the end
 *
 * Three.js is imported lazily. With reduced motion it renders one finished
 * frame and stops.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uReveal;
  uniform float uNight;
  uniform float uDusk;
  uniform float uFull;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec3 uPaper;

  float hash(vec2 p) {
    // Hoskins hash: stays well-behaved at the large coordinates the
    // granulation and paper grain sample at.
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 5; i++) {
      s += a * noise(p);
      p = p * 2.03 + vec2(17.1, 3.7);
      a *= 0.5;
    }
    return s;
  }

  // A mountain profile: broad swells plus ridged detail. Roughly -0.5..0.5.
  float ridgeH(float x, float seed, float freq, float rough) {
    float n = fbm(vec2(x * freq + seed, seed * 1.73));
    float r = abs(2.0 * fbm(vec2(x * freq * 2.1 + seed * 3.1, 4.2 + seed)) - 1.0);
    return (n - 0.5) + (0.5 - r) * rough;
  }

  // By day pigment is transparent and multiplies the paper (glazing);
  // by night it sits on dark paper like gouache.
  vec3 glaze(vec3 col, vec3 pig, float dens) {
    dens = clamp(dens, 0.0, 1.0);
    return mix(col * mix(vec3(1.0), pig, dens), mix(col, pig, dens), uNight);
  }

  // One pigment, three times of day.
  vec3 tone(vec3 day, vec3 dusk, vec3 night) {
    return mix(mix(day, dusk, uDusk), night, uNight);
  }

  // Washes bloom in unevenly, the way water carries pigment across paper.
  float paintIn(vec2 p, float seed, float delay) {
    return smoothstep(0.0, 0.3, uReveal * 1.75 - delay - fbm(p * 1.7 + seed) * 0.55);
  }

  vec3 layer(vec3 col, vec2 p, float h, vec3 pig, float str, float seed, float delay, float fadeLen) {
    float wob = (noise(p * 36.0 + seed) - 0.5) * 0.007 + (noise(p * 8.0 + seed * 2.0) - 0.5) * 0.014;
    float d = h - p.y + wob;
    float inside = smoothstep(0.0, 0.0035, d);
    float pool = exp(-max(d, 0.0) * 60.0) * 0.5;            // pigment gathers at the wet edge
    float bloom = fbm(p * 2.4 + seed * 5.0);                 // back-runs
    float gran = noise(p * 240.0 + seed * 9.0);              // granulation
    float body = mix(1.0, 0.26, smoothstep(0.0, fadeLen, d)); // wash thins into mist
    float dens = str * ((0.5 + 0.6 * bloom) * body + pool);
    dens *= 0.86 + 0.28 * gran;
    dens *= inside * paintIn(p, seed, delay);
    col = glaze(col, pig, dens);

    // Pencil underdrawing, a hair off-register from the wash.
    float px = 1.5 / uRes.y;
    float line = smoothstep(px * 1.6, 0.0, abs(h - p.y - 0.004 + (noise(p * 60.0 + seed) - 0.5) * 0.004));
    line *= 0.35 + 0.45 * noise(vec2(p.x * 14.0, seed));
    line *= step(vUv.x, uReveal * 2.4 - delay * 0.5);
    col = mix(col, mix(vec3(0.25, 0.26, 0.24), vec3(0.72, 0.76, 0.8), uNight), line * 0.5);
    return col;
  }

  void main() {
    float asp = uRes.x / uRes.y;
    vec2 p = vec2(vUv.x * asp, vUv.y);
    float xn = vUv.x;
    float tilt = xn - 0.5;

    float grain = fbm(p * 90.0) * 0.5 + noise(p * 400.0) * 0.5;
    vec3 paper = uPaper * (1.0 - (grain - 0.5) * 0.05 * (1.0 - uNight)) + (grain - 0.5) * 0.018 * uNight;
    vec3 col = paper;

    // ── Sky: a loose wash. In the hero it keeps to the right so the left
    // stays clean paper for the headline; elsewhere it runs the full width.
    float skyX = mix(smoothstep(0.15, 0.7, xn), 1.0, uFull);
    float skyMask = skyX * smoothstep(1.0, 0.6, p.y) * smoothstep(0.1, 0.3, p.y);
    float cloud = fbm(vec2(p.x * 1.1 - uTime * 0.006, p.y * 2.6) + 3.0);
    vec3 skyPig = tone(vec3(0.70, 0.81, 0.88), vec3(0.95, 0.70, 0.62), vec3(0.17, 0.21, 0.31));
    col = glaze(col, skyPig, skyMask * (0.18 + 0.8 * smoothstep(0.35, 0.72, cloud)) * paintIn(p, 1.0, 0.0) * mix(0.85, 0.7, uNight));
    // A second, cooler pass high in the dusk sky.
    col = glaze(col, vec3(0.74, 0.72, 0.86), uDusk * smoothstep(0.55, 0.95, p.y) * (0.3 + 0.5 * fbm(p * 1.4 + 9.0)) * paintIn(p, 1.5, 0.05));

    // Stars, night only.
    float star = step(0.9982, hash(floor(p * uRes.y * 0.45)));
    col += star * 0.55 * uNight * smoothstep(0.35, 0.7, p.y) * (0.6 + 0.4 * sin(uTime * 1.5 + p.x * 40.0));

    // ── Sun / moon. High on the right in the morning (and it sinks as the
    // hero scrolls away), low on the left at dusk, back on the right at night.
    float sunY = mix(mix(0.5, 0.62, smoothstep(0.7, 1.4, asp)), 0.47, uDusk);
    float sunX = mix(0.70, 0.30, uDusk);
    vec2 sun = vec2(asp * sunX + uMouse.x * 0.012, sunY - uScroll * 0.24 + uMouse.y * 0.006);
    float sd = length(p - sun);
    vec3 glowPig = tone(vec3(0.97, 0.79, 0.64), vec3(0.99, 0.66, 0.38), vec3(0.30, 0.35, 0.44));
    col = glaze(col, glowPig, exp(-sd * mix(3.0, 2.0, uDusk)) * (0.75 + uScroll * 0.6 + uDusk * 0.2) * paintIn(p, 2.0, 0.05));

    float r = min(0.066, asp * 0.13) * (1.0 + uDusk * 0.25);
    float disc = smoothstep(r, r - 0.005, sd + (noise(p * 30.0) - 0.5) * 0.006);
    float ring = exp(-abs(sd - r + 0.004) * 110.0) * 0.35 * disc;
    vec3 sunPig = tone(vec3(0.84, 0.30, 0.15), vec3(0.86, 0.27, 0.12), vec3(0.94, 0.91, 0.83));
    col = glaze(col, sunPig, (disc * (0.72 + 0.3 * fbm(p * 5.0)) + ring) * (0.85 + 0.3 * noise(p * 240.0)) * paintIn(p, 3.0, 0.1));

    // ── Four ridges, far to near. Nearer ones slide more (parallax).
    float par = uMouse.x * 0.02 + uScroll * 0.22;
    float lean = tilt * (1.0 - uFull);

    float h1 = 0.47 + 0.20 * lean + 0.27 * ridgeH(p.x + par * 0.2, 11.0, 1.25, 0.5);
    col = layer(col, p, h1, tone(vec3(0.66, 0.75, 0.82), vec3(0.72, 0.62, 0.74), vec3(0.24, 0.29, 0.37)), 0.62, 11.0, 0.15, 0.34);

    float h2 = 0.385 + 0.13 * lean + 0.24 * ridgeH(p.x + par * 0.45, 23.0, 1.7, 0.42);
    col = layer(col, p, h2, tone(vec3(0.49, 0.61, 0.68), vec3(0.55, 0.47, 0.64), vec3(0.18, 0.23, 0.29)), 0.7, 23.0, 0.28, 0.32);

    float h3 = 0.295 + 0.05 * lean + 0.17 * ridgeH(p.x + par * 0.7, 37.0, 2.1, 0.34);
    col = layer(col, p, h3, tone(vec3(0.36, 0.50, 0.47), vec3(0.37, 0.34, 0.50), vec3(0.12, 0.17, 0.18)), 0.8, 37.0, 0.4, 0.3);

    float trees = pow(noise(vec2(p.x * 120.0, 3.0)), 2.0) * 0.016 + noise(vec2(p.x * 40.0, 7.0)) * 0.01;
    float h4 = 0.215 + 0.10 * ridgeH(p.x + par, 51.0, 2.8, 0.2) + trees;
    col = layer(col, p, h4, tone(vec3(0.21, 0.32, 0.27), vec3(0.17, 0.18, 0.26), vec3(0.04, 0.05, 0.035)), 0.92, 51.0, 0.52, 0.5);

    // ── Water: dry-brushed, paper showing through, the sun broken across it.
    float wl = 0.145;
    float wm = smoothstep(wl, wl - 0.004, p.y + (noise(p * 50.0) - 0.5) * 0.004);
    float wIn = paintIn(p, 7.0, 0.62);
    float streak = noise(vec2(p.x * 5.0 + uTime * 0.02, p.y * 170.0));
    float dry = smoothstep(0.55, 0.75, streak);
    float depth = (wl - p.y) / wl;
    vec3 w = glaze(paper, tone(vec3(0.60, 0.72, 0.80), vec3(0.86, 0.66, 0.64), vec3(0.14, 0.19, 0.27)),
                   (0.78 - 0.35 * depth) * (1.0 - dry * 0.9) * (0.8 + 0.3 * fbm(p * 3.0)) * wIn);
    w = glaze(w, tone(vec3(0.28, 0.40, 0.38), vec3(0.30, 0.28, 0.42), vec3(0.06, 0.08, 0.07)),
              exp(-(wl - p.y) * 36.0) * 0.8 * (1.0 - dry * 0.6) * wIn);
    float band = exp(-pow((p.x - sun.x) / 0.07, 2.0));
    float dash = smoothstep(0.5, 0.62, noise(vec2(p.x * 22.0, p.y * 120.0 - uTime * 0.12)));
    w = glaze(w, sunPig, band * dash * 0.85 * wIn);
    col = mix(col, w, wm);

    // Feather the top into flat paper so the canvas has no visible edge.
    col = mix(uPaper, col, smoothstep(1.0, 0.8, vUv.y));
    // Dusk is a vignette on the page, so its water dissolves into paper too.
    col = mix(col, mix(uPaper, col, smoothstep(0.0, 0.09, vUv.y - (noise(vec2(p.x * 6.0, 2.0)) - 0.5) * 0.03)), uDusk);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function Landscape({
  phase = "day",
  delay = 0,
  className = "",
}: {
  /** Which hour the view is painted at. */
  phase?: "day" | "dusk" | "night";
  /** Seconds to wait before painting in (the hero waits for the loader). */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const night = phase === "night";
  const dusk = phase === "dusk";

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power" });
      } catch {
        canvas.style.display = "none";
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const uniforms = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: night ? 40 : dusk ? 20 : 0 },
        uReveal: { value: reduce ? 1 : 0 },
        uNight: { value: night ? 1 : 0 },
        uDusk: { value: dusk ? 1 : 0 },
        uFull: { value: phase === "day" ? 0 : 1 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPaper: { value: new THREE.Color().setRGB(...(night ? [25 / 255, 28 / 255, 18 / 255] : [242 / 255, 238 / 255, 227 / 255]) as [number, number, number]) },
      };
      const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, depthTest: false });
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.Camera();

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (!w || !h) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w * dpr, h * dpr);
        if (reduce) renderer.render(scene, camera);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      resize();

      const target = new THREE.Vector2(0, 0);
      const onMove = (e: PointerEvent) => {
        target.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      };

      let raf = 0;
      let visible = false;
      let seenAt = 0;
      let last = performance.now();
      const frame = (now: number) => {
        raf = 0;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        uniforms.uTime.value += dt;
        if (now - seenAt > delay * 1000) {
          uniforms.uReveal.value = Math.min(1, uniforms.uReveal.value + dt / 3.4);
        }
        uniforms.uMouse.value.lerp(target, 1 - Math.pow(0.02, dt));
        if (phase === "day") {
          const rect = canvas.getBoundingClientRect();
          uniforms.uScroll.value = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1) + 0.12));
        }
        renderer.render(scene, camera);
        if (visible && !document.hidden) raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (!raf && !reduce && visible) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          const was = visible;
          visible = entry.isIntersecting;
          if (visible && !was && !seenAt) seenAt = performance.now();
          start();
        },
        { threshold: phase === "day" ? 0 : 0.25 },
      );
      io.observe(canvas);
      document.addEventListener("visibilitychange", start);
      if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", start);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [phase, night, dusk, delay]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={
        night
          ? "Watercolour of mountains across the water at night, under a pale moon"
          : dusk
            ? "Watercolour of the same mountains at dusk, violet ridges under a low orange sun"
            : "Watercolour of blue mountain ridges across the water, with a red sun"
      }
      className={className}
    />
  );
}
