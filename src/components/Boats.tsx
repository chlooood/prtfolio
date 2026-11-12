"use client";

import { useEffect, useRef } from "react";
import { channelX } from "@/lib/river";

/**
 * Four tiny illustrated boats follow the river before fanning out at the sea.
 * Boats are decorative and respect reduced motion. No paddles/masts extend
 * outside their silhouettes: they should read as playful paper boats, not mixers.
 */
const BOATS: { at: number; side: -1 | 1; hull: string; sail: string; drift: number }[] = [
  { at: 0.20, side: -1, hull: "#c7401f", sail: "#f7eed8", drift: -0.34 },
  { at: 0.36, side: 1, hull: "#e2b043", sail: "#fff8df", drift: 0.31 },
  { at: 0.54, side: -1, hull: "#2f6b4f", sail: "#dce9cc", drift: -0.12 },
  { at: 0.72, side: 1, hull: "#1f6b73", sail: "#e9c6a5", drift: 0.15 },
];

const smooth = (a: number, b: number, value: number) => {
  const u = Math.max(0, Math.min(1, (value - a) / Math.max(1, b - a)));
  return u * u * (3 - 2 * u);
};

export function Boats() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const boats = Array.from(el.querySelectorAll<HTMLElement>("[data-boat]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = boats.map(() => ({ x: window.innerWidth / 2, a: 0, rock: 0 }));
    const mouse = { x: -9999, y: -9999 };
    let conf = window.innerHeight * 0.9;
    let sea = document.documentElement.scrollHeight - window.innerHeight;

    const measure = () => {
      const confluence = document.querySelector<HTMLElement>("[data-confluence]");
      const coast = document.querySelector<HTMLElement>("[data-sea]");
      conf = confluence ? confluence.offsetTop + confluence.offsetHeight * 0.9 : window.innerHeight * 0.9;
      // Start scattering where the river begins widening into the sea.
      sea = coast ? coast.offsetTop + coast.offsetHeight * 0.18 : document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();

    let raf = 0;
    let time = 0;
    let last = performance.now();
    let first = true;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const frameSize = { w: width, h: height, conf };
      const scale = width < 768 ? 0.67 : 0.90;

      boats.forEach((boatEl, i) => {
        const stateBoat = state[i];
        const boat = BOATS[i];
        const y = height * boat.at + (reduce ? 0 : Math.sin(time * 0.35 + i * 1.9) * 9);
        const pageY = window.scrollY + y;
        const river = channelX(pageY, frameSize, boat.side);
        const scatter = smooth(sea - 80, sea + Math.max(550, height * 0.9), pageY);
        const destination = Math.max(width * 0.12, Math.min(width * 0.88, width * (0.5 + boat.drift)));
        const targetX = river * (1 - scatter) + destination * scatter;
        const heading = Math.atan2(
          channelX(pageY + 40, frameSize, boat.side) - channelX(pageY - 40, frameSize, boat.side),
          80
        );
        const ease = first || reduce ? 1 : 1 - Math.pow(0.0006, dt);
        stateBoat.x += (targetX - stateBoat.x) * ease;

        const distance = Math.hypot(stateBoat.x - mouse.x, y - mouse.y);
        const near = Math.max(0, 1 - distance / 145);
        stateBoat.rock += (near - stateBoat.rock) * 0.08;
        const sway = reduce ? 0 : Math.sin(time * 1.3 + i * 2.3) * (0.06 + stateBoat.rock * 0.22);
        const turnToSea = scatter * boat.drift * 0.52;
        stateBoat.a += (-heading * (1 - scatter) + turnToSea + sway - stateBoat.a) * (first || reduce ? 1 : 0.2);
        boatEl.style.transform = `translate3d(${stateBoat.x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${stateBoat.a.toFixed(3)}rad) scale(${scale})`;
      });

      first = false;
      if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      }
    };
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", start);
    if (reduce) window.addEventListener("scroll", start, { passive: true });
    else window.addEventListener("pointermove", onMove, { passive: true });
    document.fonts?.ready.then(measure);
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
      {BOATS.map((boat, i) => (
        <div key={i} data-boat className="absolute left-0 top-0 -ml-[16px] -mt-[23px] will-change-transform" style={{ transform: "translate3d(50vw,-200px,0)" }}>
          <svg width="32" height="46" viewBox="0 0 32 46" style={{ overflow: "visible" }}>
            {/* A short, tidy V wake, rather than extended arms. */}
            <g fill="none" stroke="#f7eed8" strokeLinecap="round" opacity=".75">
              <path d="M11 6L7 2M21 6L25 2" strokeWidth="1.1" />
            </g>
            <path d="M16 3C22 7 26 19 24 30C23 37 19 42 16 44C13 42 9 37 8 30C6 19 10 7 16 3Z" fill="#092c25" opacity=".2" transform="translate(2 2)" />
            <path d="M16 2C23 7 26 18 24 30C23 37 19 42 16 44C13 42 9 37 8 30C6 18 9 7 16 2Z" fill={boat.hull} stroke="#221a17" strokeWidth=".8" />
            <path d="M16 7C20 13 22 26 19 37Q16 41 13 37C10 26 12 13 16 7Z" fill="#f4ecdb" opacity=".6" />
            {/* A single rounded sail silhouette inside the hull. */}
            <path d="M16 9Q8 18 11 33L16 35Z" fill={boat.sail} stroke="#221a17" strokeWidth=".65" />
            <path d="M18 12Q23 21 21 30L18 33Z" fill={boat.sail} opacity=".72" />
            <path d="M16 9V36" stroke="#775739" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="16" cy="10" r="1.6" fill="#221a17"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
