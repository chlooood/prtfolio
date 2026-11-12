"use client";

import { useEffect, useRef } from "react";

/**
 * The ground the whole site sits on: one aerial map, painted in bands of
 * gouache, fixed behind the page and scrolled with it.
 *
 * Two streams rise at the top corners, meet at the confluence at the foot of
 * the hero, and run on as one river to the sea at the end of the page. The
 * land is banded by distance from the water — strata, terraces, growth rings —
 * and rings gather around a few hills. The palette travels too: dark highland
 * greens and reds at the source, hot oranges mid-course, cool teals and sand
 * at the coast.
 *
 * The map is painted edge to edge at the source and at the sea. Through the
 * middle of the page it thins to a ribbon of colour along the river on clean
 * paper, so the content has room and quiet.
 *
 * Everything is computed per pixel; there is no image. The pointer presses a
 * soft dent into the bands, and on load the paint spreads outward from the
 * water. With reduced motion it renders still frames on scroll only.
 */

const VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;      // css px
  uniform float uDpr;
  uniform float uScroll;  // css px
  uniform float uDoc;     // css px
  uniform float uConf;    // css px, page y of the confluence
  uniform float uSea;     // css px, page y where the sea begins
  uniform float uTime;
  uniform float uReveal;
  uniform vec2 uMouse;    // css px, viewport; far off-screen when idle

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float hash1(float n) { return hash(vec2(n, n * 1.37 + 4.1)); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float a = 0.5, s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * noise(p);
      p = p * 2.03 + vec2(17.1, 3.7);
      a *= 0.5;
    }
    return s;
  }
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  vec3 hex(float r, float g, float b) { return vec3(r, g, b) / 255.0; }

  // Three eight-colour sets: highland, mid-course, coast.
  vec3 palA(int i) {
    if (i == 0) return hex(46.0, 94.0, 70.0);    // forest
    if (i == 1) return hex(31.0, 90.0, 98.0);    // deep teal
    if (i == 2) return hex(122.0, 34.0, 48.0);   // maroon
    if (i == 3) return hex(201.0, 67.0, 42.0);   // vermilion
    if (i == 4) return hex(95.0, 127.0, 63.0);   // moss
    if (i == 5) return hex(190.0, 136.0, 44.0);  // ochre
    if (i == 6) return hex(36.0, 70.0, 79.0);    // slate green
    return hex(168.0, 80.0, 31.0);               // rust
  }
  vec3 palB(int i) {
    if (i == 0) return hex(212.0, 69.0, 42.0);   // vermilion
    if (i == 1) return hex(229.0, 127.0, 50.0);  // orange
    if (i == 2) return hex(230.0, 181.0, 69.0);  // mustard
    if (i == 3) return hex(138.0, 35.0, 49.0);   // maroon
    if (i == 4) return hex(233.0, 165.0, 147.0); // pink
    if (i == 5) return hex(47.0, 107.0, 79.0);   // forest
    if (i == 6) return hex(46.0, 127.0, 134.0);  // teal
    return hex(240.0, 226.0, 196.0);             // cream
  }
  vec3 palC(int i) {
    if (i == 0) return hex(43.0, 127.0, 134.0);  // teal
    if (i == 1) return hex(158.0, 198.0, 211.0); // sky
    if (i == 2) return hex(188.0, 216.0, 195.0); // mint
    if (i == 3) return hex(235.0, 217.0, 176.0); // sand
    if (i == 4) return hex(30.0, 79.0, 134.0);   // deep blue
    if (i == 5) return hex(134.0, 176.0, 149.0); // sage
    if (i == 6) return hex(235.0, 177.0, 166.0); // pink
    return hex(226.0, 181.0, 81.0);              // mustard
  }

  // The main channel's centre line. Mirrors riverX() in lib/river.ts.
  float course(float Y, float Yc, float W) {
    float env = smoothstep(Yc, Yc + 0.9, Y);
    float m = 0.62 * sin(Y * 1.15 + 0.6) + 0.28 * sin(Y * 2.7 + 2.1) + 0.10 * sin(Y * 6.1 + 1.0);
    return 0.5 * W + 0.30 * W * m * env;
  }

  void main() {
    vec2 css = gl_FragCoord.xy / uDpr;
    float S = max(uRes.x, 700.0);
    float W = uRes.x / S;
    vec2 p = vec2(css.x, (uRes.y - css.y) + uScroll) / S; // page space, y down
    float L = uDoc / S;
    float v = clamp(p.y / L, 0.0, 1.0);
    float Yc = uConf / S;

    // Pointer: press a soft dent into the map.
    vec2 m = vec2(uMouse.x, uMouse.y + uScroll) / S;
    vec2 dm = p - m;
    p += dm * exp(-dot(dm, dm) * 55.0) * 0.4;

    // A little hand-wobble so nothing is ruled.
    vec2 q = p + 0.045 * vec2(fbm(p * 1.4 + 1.7), fbm(p * 1.4 + 9.2)) - 0.0225;

    // ── Water ────────────────────────────────────────────────────────────
    float e = 0.01;
    float c = course(q.y, Yc, W);
    float slope = (course(q.y + e, Yc, W) - course(q.y - e, Yc, W)) / (2.0 * e);
    float wMain = mix(0.010, 0.026, v);
    float dRiver = (abs(q.x - c) - wMain) / sqrt(1.0 + slope * slope);

    // Above the confluence: two tributaries closing on the centre.
    float u = clamp((Yc - q.y) / Yc, 0.0, 1.0);
    float spread = 0.36 * W * pow(u, 0.7);
    float c1 = 0.5 * W - spread - 0.03 * W * sin(q.y * 5.0 + 1.0) * u;
    float c2 = 0.5 * W + spread + 0.03 * W * sin(q.y * 4.3 + 3.0) * u;
    float sl = 0.36 * W * 0.7 * pow(max(u, 0.02), -0.3) / Yc;
    float wTrib = wMain * 0.62;
    float dTrib = (min(abs(q.x - c1), abs(q.x - c2)) - wTrib) / sqrt(1.0 + sl * sl);
    float upstream = step(q.y, Yc);
    // Upstream the main channel fades out and only the tributaries remain.
    dRiver = mix(dRiver, min(dTrib, dRiver + u * 4.0), upstream);

    // The sea: the channel opens until it is everything.
    float seaT = smoothstep(uSea - 0.3 * uRes.y, uSea + 0.5 * uRes.y, p.y * S);
    dRiver -= seaT * seaT * (1.4 * W + 0.3);

    // ── Land: banded by distance from the water, ringed around hills ─────
    float f = dRiver;
    for (int i = 0; i < 9; i++) {
      float fi = float(i);
      float hy = (fi + 0.35 + 0.5 * hash1(fi * 3.1)) / 9.0 * L;
      float side = mod(fi, 2.0) < 1.0 ? -1.0 : 1.0;
      float hx = course(hy, Yc, W) + side * (0.20 + 0.22 * hash1(fi * 7.7)) * W;
      float dh = length(q - vec2(hx, hy)) - 0.012;
      f = smin(f, dh * 0.9 + 0.035, 0.11);
    }

    float t = f * 25.0 + 1.2 * fbm(p * 2.1 + 4.0) + uTime * 0.012;
    float idx = floor(t);
    float fr = fract(t);

    // Some bands carry a thin second stripe along one edge.
    float thin = step(0.62, hash1(idx * 5.3)) * step(0.74, fr);
    float id = idx + thin * 0.5;

    int k = int(floor(hash1(id * 17.3 + 3.1) * 8.0));
    // The zone boundary wanders, so where one palette gives way to the next
    // the join is a loose painted edge, never a ruled line.
    float vz = v + (fbm(p * 1.1 + 20.0) - 0.5) * 0.22;
    float zoneB = smoothstep(0.10, 0.30, vz);
    float zoneC = smoothstep(0.62, 0.86, vz);
    // Zones change band by band rather than by blending, so every stripe
    // stays a pure pigment instead of a muddy in-between.
    float pick = hash1(id * 2.9 + 11.0);
    vec3 land = palA(k);
    land = mix(land, palB(k), smoothstep(-0.012, 0.012, zoneB - pick));
    land = mix(land, palC(k), smoothstep(-0.012, 0.012, zoneC - pick));

    // Gouache: each band its own density, streaks along the stroke, grain.
    float along = p.y * 2.0 + p.x * 3.0;
    land *= 0.93 + 0.12 * hash1(id * 9.1);
    land *= 0.955 + 0.09 * noise(vec2(t * 16.0, along * 2.2));
    // Dry-brush edges: where strokes meet, paper shows through in places.
    float edge = thin > 0.5 ? min(fr - 0.74, 1.0 - fr) : min(fr, (hash1(idx * 5.3) > 0.62 ? 0.74 : 1.0) - fr);
    float gap = smoothstep(0.03, 0.0, edge) * smoothstep(0.42, 0.62, noise(vec2(idx * 3.7, along * 7.0)));
    vec3 paper = hex(244.0, 236.0, 219.0);
    land = mix(land, paper, gap * 0.85);
    land *= 1.0 - smoothstep(0.07, 0.0, edge) * 0.07;

    // Clean paper. The opening and the coast are painted edge to edge; in
    // between, the colour keeps to a few bands either side of the river (and
    // to rings around the hills) and the rest of the sheet is left bare. The
    // reach wanders, and the last band is dry-brushed out.
    float ypx = p.y * S;
    float corridor = smoothstep(uConf + 0.05 * uRes.y, uConf + 0.95 * uRes.y, ypx)
                   * (1.0 - smoothstep(uSea - 1.15 * uRes.y, uSea - 0.3 * uRes.y, ypx));
    float reach = 4.6 + 2.6 * noise(vec2(p.y * 1.3, 3.0)) + 1.4 * noise(vec2(p.y * 4.1, 9.0));
    float tv = t - uTime * 0.012;
    // Widening is done by reach, stripe by stripe — never by fading.
    reach += (1.0 - corridor) * 70.0;
    float bare = smoothstep(reach - 0.3, reach, tv + (noise(vec2(along * 9.0, idx)) - 0.5) * 0.55);
    land = mix(land, paper, bare);

    // ── Water colour: deep blue, lighter threads drifting downstream ─────
    vec3 water = mix(hex(28.0, 78.0, 138.0), hex(22.0, 60.0, 112.0), seaT);
    float across = (q.x - c) / max(wMain, 0.001);
    float thread = noise(vec2(across * 2.2 + q.x * 30.0 * seaT, q.y * 9.0 - uTime * 0.22));
    // Out at sea the threads calm down so type can sit on the water.
    float calm = 1.0 - 0.55 * seaT;
    water = mix(water, hex(108.0, 164.0, 214.0), smoothstep(0.56, 0.7, thread) * 0.75 * calm);
    water = mix(water, hex(16.0, 44.0, 86.0), smoothstep(0.3, 0.12, thread) * 0.5 * calm);
    water *= 0.96 + 0.08 * noise(p * 60.0);

    vec3 col = land;
    // A line of sand where land meets water.
    col = mix(col, hex(238.0, 222.0, 184.0), smoothstep(0.007, 0.002, dRiver) * (1.0 - zoneC * 0.3));
    col = mix(col, water, smoothstep(0.0015, -0.0015, dRiver + (noise(p * 40.0) - 0.5) * 0.003));

    // Paint spreads outward from the water on load.
    float shown = smoothstep(0.0, 0.06, uReveal * 1.25 - 0.02 - max(f, 0.0) * 1.6 - fbm(p * 3.0) * 0.12);
    col = mix(paper * (0.97 + 0.03 * noise(p * 50.0)), col, shown);

    // Paper tooth over everything.
    float tooth = noise(css * 0.9) * 0.6 + noise(css * 2.3) * 0.4;
    col *= 0.965 + 0.07 * tooth;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function RiverMap() {
  const ref = useRef<HTMLCanvasElement>(null);

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
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
      } catch {
        canvas.style.display = "none";
        return;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const uniforms = {
        uRes: { value: new THREE.Vector2(1, 1) },
        uDpr: { value: 1 },
        uScroll: { value: 0 },
        uDoc: { value: 1 },
        uConf: { value: 1 },
        uSea: { value: 1 },
        uTime: { value: 0 },
        uReveal: { value: reduce ? 1 : 0 },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
      };
      const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, depthTest: false });
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.Camera();

      const measure = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 1.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w, h);
        uniforms.uDpr.value = dpr;
        uniforms.uDoc.value = document.documentElement.scrollHeight;
        const conf = document.querySelector<HTMLElement>("[data-confluence]");
        const sea = document.querySelector<HTMLElement>("[data-sea]");
        uniforms.uConf.value = conf ? conf.offsetTop + conf.offsetHeight * 0.9 : h * 0.9;
        uniforms.uSea.value = sea ? sea.getBoundingClientRect().top + window.scrollY : uniforms.uDoc.value - h;
        draw();
      };

      let raf = 0;
      let last = performance.now();
      const born = last;
      const target = new THREE.Vector2(-9999, -9999);

      const draw = () => {
        uniforms.uScroll.value = window.scrollY;
        renderer.render(scene, camera);
      };
      const frame = (now: number) => {
        raf = 0;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        uniforms.uTime.value += dt;
        // Wall-clock, so a throttled or background tab still ends up fully painted.
        uniforms.uReveal.value = Math.min(1, (now - born) / 2800);
        uniforms.uMouse.value.lerp(target, 1 - Math.pow(0.0005, dt));
        draw();
        if (!document.hidden) raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (!raf && !reduce) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "mouse") target.set(e.clientX, e.clientY);
      };
      const onLeave = () => target.set(-9999, -9999);

      const ro = new ResizeObserver(measure);
      ro.observe(document.body);
      window.addEventListener("resize", measure);
      document.addEventListener("visibilitychange", start);
      if (reduce) {
        window.addEventListener("scroll", draw, { passive: true });
      } else {
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
      }
      measure();
      start();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", draw);
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
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
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 z-0 h-full w-full" />;
}
