"use client";

import { useEffect, useRef } from "react";

/**
 * The sun keeps you company the whole way down. It comes up over the
 * bottom-left of the screen as you leave the source, climbs to the top by the
 * middle of the page, and goes down bottom-right as you reach the sea.
 *
 * It is pinned to the screen and drawn twice: as solid gouache on the map,
 * and as a transparent wash (multiply) over the paper, the way a watercolour
 * sun goes over whatever is already on the sheet — so it is bright against
 * the land and text still reads where it crosses a sheet.
 */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixRgb = (a: number[], b: number[], t: number) =>
  `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(" ")})`;

const LOW = [240, 128, 52]; // at the horizon
const HIGH = [248, 204, 84]; // overhead

export function Sun() {
  const ref = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const base = baseRef.current;
    if (!el || !base) return;

    let conf = window.innerHeight * 0.9;
    let sea = document.documentElement.scrollHeight;
    const measure = () => {
      const c = document.querySelector<HTMLElement>("[data-confluence]");
      const s = document.querySelector<HTMLElement>("[data-sea]");
      conf = c ? c.offsetTop + c.offsetHeight * 0.9 : window.innerHeight * 0.9;
      sea = s ? s.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
      place();
    };

    let raf = 0;
    const place = () => {
      raf = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const start = 0.45 * conf;
      const end = sea - 0.2 * h;
      const t = (window.scrollY + 0.5 * h - start) / Math.max(end - start, 1);
      const tc = Math.min(1.15, Math.max(-0.15, t));
      const arc = Math.sin(Math.PI * tc);
      const high = Math.pow(Math.max(arc, 0), 0.7);
      const size = Math.max(84, Math.min(w * 0.085, 150)) * (1.12 - 0.12 * high);
      const x = w * lerp(0.08, 0.92, tc);
      const y = h * (1.06 - 0.9 * arc);
      const c = mixRgb(LOW, HIGH, high);
      for (const d of [el, base]) {
        d.style.width = d.style.height = `${size}px`;
        d.style.transform = `translate3d(${(x - size / 2).toFixed(1)}px, ${(y - size / 2).toFixed(1)}px, 0)`;
        d.style.backgroundColor = c;
      }
      el.style.boxShadow = `0 0 ${size * 0.55}px ${size * 0.22}px ${c.replace("rgb(", "rgb(").replace(")", " / 0.38)")}`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const shape = {
    borderRadius: "49% 51% 52% 48% / 52% 48% 51% 49%",
    transform: "translate3d(-200px,-200px,0)",
  };
  return (
    <>
      {/* Solid gouache on the map, under the paper… */}
      <div
        ref={baseRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[6] will-change-transform"
        style={shape}
      />
      {/* …and a transparent wash over the paper, so text reads through it. */}
      <div
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-20 mix-blend-multiply will-change-transform"
        style={shape}
      />
    </>
  );
}
