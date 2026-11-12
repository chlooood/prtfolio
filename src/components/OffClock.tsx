"use client";

import { useEffect, useRef, useState } from "react";
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
  const [selected, setSelected] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const pursuit = PURSUITS.find((entry) => entry.title === selected);
  const photos = pursuit?.photos ?? [];
  const hasMedia = photos.length > 0;
  const count = photos.length;

  // The gallery gently turns like a stack of prints; motion preference wins.
  useEffect(() => {
    if (!selected || count < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % count), 5400);
    return () => window.clearInterval(timer);
  }, [selected, count, paused]);

  const choose = (title: string) => {
    setSelected((current) => current === title ? null : title);
    setSlide(0);
  };

  return (
    <section id="off-the-clock" className="pt-[clamp(10rem,42vh,26rem)]">
      <CutTitle
        lines={["Off the", "clock"]}
        label={`Mile 04 · ${pad(PURSUITS.length)} pursuits`}
        className="px-[var(--pad)]"
      />

      <ul className="mt-[clamp(2rem,6vw,5rem)] grid grid-cols-2 gap-x-[clamp(.75rem,4vw,4rem)] gap-y-12 px-[var(--pad)] lg:grid-cols-4 lg:gap-x-[2vw]">
        {PURSUITS.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            className={`disc relative min-w-0 ${i % 2 ? "lg:mt-[4vw]" : ""}`}
          >
            <button
              type="button"
              aria-expanded={selected === p.title}
              aria-controls="pursuit-gallery"
              onClick={() => choose(p.title)}
              className="group block w-full cursor-pointer text-left focus-visible:outline-offset-4"
            >
              <div className="aspect-square w-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-2">
                <RingDisc i={i} />
              </div>
              <Paper
                flat
                tilt={i % 2 ? 2 : -2.5}
                className="relative -mt-[16%] ml-[6%] w-fit max-w-[90%] px-4 py-3 sm:px-5 sm:py-4"
              >
                <span className="label block text-muted">{pad(i + 1)} / Open scrapbook</span>
                <span className="statement mt-1 block text-[clamp(1.5rem,2.5vw,2.5rem)]">
                  {p.title}<span className="ml-2 text-lg text-vermilion" aria-hidden="true">{selected === p.title ? "−" : "+"}</span>
                </span>
              </Paper>
            </button>
          </li>
        ))}
      </ul>

      <div id="pursuit-gallery" className="px-[var(--pad)]" aria-live="polite">
        {pursuit && (
          <Paper
            key={pursuit.title}
            tilt={-0.45}
            className="mx-auto mt-12 max-w-5xl px-[clamp(1.25rem,4vw,3rem)] py-[clamp(1.5rem,4vw,3rem)] motion-safe:animate-[exchange-unfold_.55s_cubic-bezier(.16,1,.3,1)_both]"
          >
            <div className="flex flex-wrap items-start justify-between gap-5 border-b border-rule pb-5">
              <div>
                <p className="label text-vermilion">The scrapbook / {pursuit.title}</p>
                <h3 className="statement mt-2 text-[clamp(2rem,5vw,4rem)]">{pursuit.title}, in pictures.</h3>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="tag label cursor-pointer border border-ink focus-visible:outline-vermilion">
                Close ×
              </button>
            </div>
            {hasMedia ? (
              <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
                <figure className="mt-7">
                  <div className="relative mx-auto aspect-[4/3] max-h-[37rem] overflow-hidden bg-paper-2 sm:aspect-[16/10]">
                    {photos.map((photo, i) => (
                      // Images remain on their original visual plane and crossfade like prints.
                      <img
                        key={photo.src}
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        aria-hidden={i !== slide}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${i === slide ? "opacity-100" : "pointer-events-none opacity-0"}`}
                      />
                    ))}
                  </div>
                  <figcaption className="mt-3 flex items-start justify-between gap-4">
                    <span className="font-serif text-lg italic text-ink-2">{photos[slide]?.caption ?? pursuit.title}</span>
                    <span className="label shrink-0 text-muted">{pad(slide + 1)} / {pad(count)}</span>
                  </figcaption>
                </figure>
                {count > 1 && (
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <button type="button" onClick={() => setSlide((slide + count - 1) % count)} className="tag label cursor-pointer border border-rule">
                      ← Previous
                    </button>
                    <div className="flex items-center gap-2" role="group" aria-label="Choose photograph">
                      {photos.map((photo, i) => (
                        <button key={photo.src} type="button" aria-label={`Photo ${i + 1}`} aria-current={i === slide ? "true" : undefined} onClick={() => setSlide(i)}
                          className={`h-2.5 w-2.5 cursor-pointer rounded-full border border-ink ${i === slide ? "bg-vermilion" : "bg-paper-2"}`} />
                      ))}
                    </div>
                    <button type="button" onClick={() => setSlide((slide + 1) % count)} className="tag label cursor-pointer border border-rule">
                      Next →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-7 grid min-h-52 place-content-center border border-dashed border-ink/30 bg-paper-2/40 px-6 py-12 text-center">
                <p className="font-serif text-3xl italic">A few good moments, soon.</p>
                <p className="label mt-4 text-muted">Photographs for {pursuit.title.toLowerCase()} are still being collected.</p>
              </div>
            )}
            {pursuit.strava && (
              <iframe src={pursuit.strava} title={`${pursuit.title} on Strava`} loading="lazy" className="mt-6 h-[22rem] w-full border-0" />
            )}
          </Paper>
        )}
      </div>
      <Ribbon />
    </section>
  );
}
