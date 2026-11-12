"use client";

import { useEffect, useRef } from "react";
import { channelX } from "@/lib/river";

/**
 * A few small sailboats, seen from above, painted in watercolour and riding
 * the river. Each keeps its own place down the screen and steers by the
 * channel beneath it, so as the page scrolls they follow every bend: two come
 * down each tributary, meet at the confluence and carry on to the sea. They
 * rock a little on their own, and more if the cursor comes close. They sail
 * between the map and the paper, so they pass under the content.
 */

const BOATS: { at: number; side: -1 | 1; sail: string }[] = [
  { at: 0.2, side: -1, sail: "#fffaf0" },
  { at: 0.36, side: 1, sail: "#f6d9cf" },
  { at: 0.54, side: -1, sail: "#fbe9b7" },
  { at: 0.72, side: 1, sail: "#fffaf0" },
];

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
    const measure = () => {
      const c = document.querySelector<HTMLElement>("[data-confluence]");
      conf = c ? c.offsetTop + c.offsetHeight * 0.9 : window.innerHeight * 0.9;
    };
    measure();

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let first = true;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const f = { w, h, conf };
      const scale = w < 768 ? 0.8 : 1.25;

      boats.forEach((b, i) => {
        const s = state[i];
        const { at, side } = BOATS[i];
        const y = h * at + (reduce ? 0 : Math.sin(t * 0.35 + i * 1.9) * 14);
        const pageY = window.scrollY + y;
        const tx = channelX(pageY, f, side);
        const heading = Math.atan2(channelX(pageY + 40, f, side) - channelX(pageY - 40, f, side), 80);

        // Ease toward the channel so a fast scroll reads as the boat tacking.
        const k = first || reduce ? 1 : 1 - Math.pow(0.0006, dt);
        s.x += (tx - s.x) * k;

        const d = Math.hypot(s.x - mouse.x, y - mouse.y);
        const near = Math.max(0, 1 - d / 160);
        s.rock += (near - s.rock) * 0.08;
        const sway = reduce ? 0 : Math.sin(t * 1.3 + i * 2.3) * (0.07 + s.rock * 0.32);
        s.a += (-heading + sway - s.a) * (first ? 1 : 0.2);

        b.style.transform = `translate3d(${s.x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${s.a.toFixed(3)}rad) scale(${scale})`;
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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
    };
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", start);
    if (reduce) window.addEventListener("scroll", start, { passive: true });
    else window.addEventListener("pointermove", onMove, { passive: true });
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
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* A wet, slightly uneven edge for anything painted small. */}
          <filter id="wash" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {BOATS.map((boat, i) => (
        <div
          key={i}
          data-boat
          className="absolute left-0 top-0 -ml-[17px] -mt-[30px] will-change-transform"
          style={{ transform: "translate3d(50vw,-200px,0)" }}
        >
          {/* Drawn bow-down: sailing downstream. */}
          <svg width="34" height="60" viewBox="0 0 34 60" style={{ overflow: "visible" }}>
            {/* wake, trailing upstream */}
            <g fill="none" stroke="#f7eed8" strokeLinecap="round" opacity="0.75">
              <path d="M12 6C9 0 7-8 8-15" strokeWidth="1.3" />
              <path d="M22 6c3-6 5-14 4-21" strokeWidth="1.3" />
              <path d="M17 2c0-6 0-11 0-17" strokeWidth="0.9" opacity="0.6" />
            </g>
            <g filter="url(#wash)">
              {/* shadow on the water */}
              <path d="M19 6c7 8 9 22 7 34-1 8-4 14-7 18-3-4-6-10-7-18C10 28 12 14 19 6z" fill="#102c56" opacity="0.28" transform="translate(3 4)" />
              {/* hull */}
              <path d="M17 4c7 8 9 22 7 34-1 8-4 14-7 18-3-4-6-10-7-18C8 26 10 12 17 4z" fill="#a85a2a" />
              <path d="M17 9c5 7 6 18 5 28-1 6-3 11-5 14-2-3-4-8-5-14-1-10 0-21 5-28z" fill="#f1dcae" />
              <path d="M17 12v36" stroke="#a85a2a" strokeWidth="1" opacity="0.6" />
              {/* sail, set out to one side */}
              <path d="M17 16C27 18 33 27 32 40L17 41z" fill={boat.sail} />
              <path d="M17 16C27 18 33 27 32 40L17 41z" fill="none" stroke="#c7401f" strokeWidth="0.9" opacity="0.55" />
              <path d="M19 30c5 0 9 2 12 5" stroke="#c7401f" strokeWidth="1.6" fill="none" opacity="0.8" />
              {/* a wash of shade in the belly of the sail */}
              <path d="M17 22c6 2 10 8 11 16l-11 1z" fill="#6b93b3" opacity="0.22" />
              {/* mast */}
              <circle cx="17" cy="16" r="1.6" fill="#221a17" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
