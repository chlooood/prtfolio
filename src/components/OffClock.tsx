"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { INTERESTS, PURSUITS } from "@/content/site";
import { CutTitle } from "./CutTitle";
import { Paper } from "./Paper";

const pad = (n: number) => String(n).padStart(2, "0");

/* Disc colour and ring colour, per pursuit. */
const DISCS = [
  { fill: "#2f6b4f", line: "#f1e3b5" },
  { fill: "#f4ecdb", line: "#8a2331" },
  { fill: "#e57f32", line: "#221a17" },
  { fill: "#e2b043", line: "#5a2f1a" },
];

/** One irregular closed ring: a circle that never quite is. */
function ringPath(r: number, seed: number, wobble: number) {
  const pts: string[] = [];
  const N = 72;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      wobble *
        (Math.sin(3 * a + seed) + 0.5 * Math.sin(5 * a + seed * 2.3) + 0.3 * Math.sin(9 * a + seed * 4.1));
    pts.push(`${(Math.cos(a) * r * k).toFixed(2)} ${(Math.sin(a) * r * k).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

/** A cross-section of a tree, cut from paper: one ring per year, more or less. */
function RingDisc({ i }: { i: number }) {
  const c = DISCS[i % DISCS.length];
  const seed = i * 2.7 + 1.3;
  const rings: { r: number; w: number }[] = [];
  let r = 5;
  let n = 0;
  while (r < 88) {
    rings.push({ r, w: n % 4 === 3 ? 2.6 : 1.2 });
    r += 4.2 + 3.2 * Math.abs(Math.sin(n * 1.7 + seed));
    n++;
  }
  return (
    <svg viewBox="-104 -104 208 208" aria-hidden="true" className="h-full w-full overflow-visible">
      <g style={{ filter: "url(#torn) drop-shadow(0 10px 14px rgb(34 20 12 / 0.32))" }}>
        <path d={ringPath(96, seed, 0.035)} fill={c.fill} />
      </g>
      <g fill="none" stroke={c.line} strokeLinecap="round">
        {rings.map((ring, k) => (
          <path key={k} d={ringPath(ring.r, seed + k * 0.11, 0.03 + k * 0.0012)} strokeWidth={ring.w} />
        ))}
        {/* a check: the split every dried round has */}
        <path d={`M0 0 L${(96 * Math.cos(seed)).toFixed(1)} ${(96 * Math.sin(seed)).toFixed(1)}`} strokeWidth="1.4" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Interests on a paper ribbon. Scroll speed leans on it; it settles after. */
function Ribbon() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const loop = gsap.to("[data-track]", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      const settle = gsap.quickTo(loop, "timeScale", { duration: 0.8, ease: "power2.out" });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          gsap.killTweensOf(loop, "timeScale");
          loop.timeScale(gsap.utils.clamp(-6, 6, 1 + self.getVelocity() / 350));
          settle(1);
        },
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      });
      if (!st.isActive) loop.pause();
    });
    return () => mm.revert();
  }, []);

  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {INTERESTS.map((t, i) => (
        <li key={t} className="flex items-center">
          <span
            className={`whitespace-nowrap px-[0.45em] text-[clamp(2rem,5vw,4.5rem)] ${i % 2 ? "statement italic" : "display"}`}
          >
            {t}
          </span>
          <span aria-hidden="true" className="h-[0.6em] w-[0.6em] rounded-full bg-mustard text-[clamp(2rem,5vw,4.5rem)]" />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className="-mx-[4vw] mt-[clamp(4rem,10vw,9rem)]">
      <Paper tilt={-1.6} sheet="var(--color-forest)" className="py-[clamp(1rem,2vw,1.75rem)] text-cream">
        <p className="label mb-2 px-[calc(4vw+var(--pad))] opacity-80">Also interested in</p>
        <div className="overflow-hidden motion-reduce:overflow-x-auto">
          <div data-track className="flex w-max">
            <Row />
            <Row hidden />
          </div>
        </div>
      </Paper>
    </div>
  );
}

/**
 * No sheet here: the pursuits are laid straight onto the map as tree rounds,
 * each with a caption scrap tucked under its edge.
 */
export function OffClock() {
  return (
    <section id="off-the-clock" className="pt-[clamp(10rem,42vh,26rem)]">
      <CutTitle
        lines={["Off the", "clock"]}
        label={`Mile 03 · ${pad(PURSUITS.length)} pursuits`}
        className="px-[var(--pad)]"
      />

      <ul className="mt-[clamp(2rem,6vw,5rem)] grid grid-cols-2 gap-x-[4vw] gap-y-16 px-[var(--pad)] lg:grid-cols-4 lg:gap-x-0">
        {PURSUITS.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            data-drag
            className={`disc relative ${i % 2 ? "lg:mt-[7vw]" : ""} ${i > 0 ? "lg:-ml-[2.5vw]" : ""}`}
            style={{ zIndex: PURSUITS.length - i }}
          >
            <div className="aspect-square w-full">
              <RingDisc i={i} />
            </div>
            <Paper
              flat
              tilt={i % 2 ? 2 : -2.5}
              className="relative -mt-[16%] ml-[6%] w-fit max-w-[88%] px-4 py-3 sm:px-5 sm:py-4"
            >
              <p className="label text-muted">{pad(i + 1)}</p>
              <h3 className="display mt-1 text-[clamp(1.5rem,2.6vw,2.5rem)]">{p.title}</h3>
              {p.photos && p.photos.length > 0 && (
                <ul className="mt-3 grid grid-cols-3 gap-1.5">
                  {p.photos.slice(0, 3).map((src) => (
                    <li key={src} className="aspect-[3/4] bg-paper-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </li>
                  ))}
                </ul>
              )}
              {p.strava && (
                <iframe
                  src={p.strava}
                  title={`${p.title} on Strava`}
                  loading="lazy"
                  className="mt-3 h-[22rem] w-full border-0"
                />
              )}
            </Paper>
          </li>
        ))}
      </ul>

      <Ribbon />
    </section>
  );
}
