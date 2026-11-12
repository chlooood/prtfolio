"use client";

import { useEffect, useRef } from "react";
import { riverX } from "@/lib/river";

/**
 * A small flock, seen from above, following the river downstream. They hold a
 * loose V a third of the way down the screen, bank with the channel as you
 * scroll, and scatter from the cursor before drifting back into formation.
 * They fly between the map and the paper, so they never cross the text.
 */

const FORMATION: [number, number][] = [
  [0, 0],
  [-44, -34],
  [44, -34],
  [-90, -70],
  [90, -70],
  [-136, -108],
  [136, -108],
];

export function Birds() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const birds = Array.from(el.querySelectorAll<HTMLElement>("[data-bird]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = birds.map(() => ({ x: window.innerWidth / 2, y: -200, vx: 0, vy: 0, a: 0 }));
    const mouse = { x: -9999, y: -9999 };
    let conf = window.innerHeight * 0.9;
    const measure = () => {
      const c = document.querySelector<HTMLElement>("[data-confluence]");
      conf = c ? c.offsetTop + c.offsetHeight * 0.9 : window.innerHeight * 0.9;
    };
    measure();

    let raf = 0;
    let t = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const f = { w, h, conf };
      const scale = w < 768 ? 0.6 : 1;
      const baseY = h * 0.36 + Math.sin(t * 0.5) * 10;
      const pageY = window.scrollY + baseY;
      const cx = riverX(pageY, f);
      const heading = Math.atan2(riverX(pageY + 60, f) - riverX(pageY - 60, f), 120);
      const cos = Math.cos(heading);
      const sin = Math.sin(heading);

      birds.forEach((b, i) => {
        const s = state[i];
        const [fx, fy] = FORMATION[i];
        const ox = (fx * cos - fy * sin) * scale + Math.sin(t * 0.9 + i * 1.7) * 6;
        const oy = (fx * sin + fy * cos) * scale + Math.cos(t * 0.7 + i * 2.1) * 5;
        let tx = cx + ox;
        let ty = baseY + oy;

        // Shoo: steer away from the cursor.
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 170) {
          const push = (1 - d / 170) * 150;
          tx += (dx / (d || 1)) * push;
          ty += (dy / (d || 1)) * push;
        }

        // A soft spring toward the slot in formation.
        const k = reduce ? 1 : 1 - Math.pow(0.004 + i * 0.002, dt);
        const nx = s.x + (tx - s.x) * k;
        const ny = s.y + (ty - s.y) * k;
        s.vx = nx - s.x;
        s.vy = ny - s.y;
        s.x = nx;
        s.y = ny;
        const bank = Math.max(-0.6, Math.min(0.6, -s.vx * 0.06));
        s.a += (heading * -1 + bank - s.a) * 0.15;
        b.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotate(${s.a.toFixed(3)}rad) scale(${scale})`;
      });

      if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
    };
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", start);
    if (reduce) {
      window.addEventListener("scroll", start, { passive: true });
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", start);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      {FORMATION.map((_, i) => (
        <div key={i} data-bird className="absolute left-0 top-0 -ml-[30px] -mt-[22px] will-change-transform" style={{ transform: "translate3d(50vw,-200px,0)" }}>
          {/* Drawn heading down the screen: downstream. */}
          <svg
            width="60"
            height="44"
            viewBox="0 0 60 44"
            style={{ filter: "drop-shadow(9px 15px 0 rgb(30 16 10 / 0.24))", overflow: "visible" }}
          >
            <g className="bird-wings" style={{ animationDelay: `${-i * 0.37}s` }}>
              <path d="M30 14C20 3 8 2 0 9c9 0 17 5 26 15z" fill="#f7eed8" />
              <path d="M30 14C40 3 52 2 60 9c-9 0-17 5-26 15z" fill="#f7eed8" />
              <path d="M6 9c7 1 13 5 19 11M12 6c6 2 11 6 15 11M54 9c-7 1-13 5-19 11M48 6c-6 2-11 6-15 11" stroke="#7a2230" strokeWidth="0.9" fill="none" opacity="0.7" />
            </g>
            <path d="M30 2c3 4 4.500 12 4.500 20S33 36 30 40c-3-4-4.500-10-4.500-18S27 6 30 2z" fill="#f7eed8" />
            <path d="M30 2l-4-2 4 8 4-8z" fill="#f7eed8" />
            <path d="M30 30c2.600 0 4 2.400 4 5.500S32 42 30 44c-2-2-4-5.400-4-8.500S27.400 30 30 30z" fill="#221a17" />
            <path d="M30 12v14" stroke="#7a2230" strokeWidth="1.2" />
          </svg>
        </div>
      ))}
      <style>{`
        .bird-wings { transform-origin: 30px 16px; animation: flap 1.5s ease-in-out infinite; }
        @keyframes flap { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.78); } }
        @media (prefers-reduced-motion: reduce) { .bird-wings { animation: none; } }
      `}</style>
    </div>
  );
}
