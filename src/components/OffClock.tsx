"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { INTERESTS, PURSUITS } from "@/content/site";
import { PlaceholderTag } from "./Cite";
import { SectionHead } from "./SectionHead";
import { Swatch } from "./Swatch";

/* One pigment per pursuit, in order: sap green, burnt sienna, cerulean, ochre. */
const PIGMENTS = ["#5c8a66", "#cf5f37", "#6b93b3", "#b78a3a"];

const pad = (n: number) => String(n).padStart(2, "0");

/** Interests on a loop. Scroll speed leans on it; it settles when you stop. */
function Ticker() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const loop = gsap.to("[data-track]", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      const settle = gsap.quickTo(loop, "timeScale", { duration: 0.8, ease: "power2.out" });
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity() / 350;
          gsap.killTweensOf(loop, "timeScale");
          loop.timeScale(gsap.utils.clamp(-6, 6, 1 + v));
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
      {INTERESTS.map((t) => (
        <li key={t} className="flex items-center">
          <span className="display whitespace-nowrap px-[0.35em] text-[clamp(2rem,5vw,4.5rem)] [--wdth:100]">
            {t}
          </span>
          <span aria-hidden="true" className="font-mono text-[clamp(1.25rem,2.4vw,2.25rem)] text-pen">
            +
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className="mt-[clamp(4rem,9vw,8rem)]">
      <p className="label mx-[var(--pad)] mb-4 text-muted">Also interested in</p>
      <div className="overflow-hidden border-y border-ink py-5 motion-reduce:overflow-x-auto">
        <div data-track className="flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}

export function OffClock() {
  return (
    <section id="off-the-clock" className="pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead
        index="03"
        title={
          <>
            Off the
            <br />
            clock
          </>
        }
        tally={`${pad(PURSUITS.length)} pursuits`}
      />

      <ul className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-1 border-t border-ink mx-[var(--pad)] sm:grid-cols-2 lg:grid-cols-4">
        {PURSUITS.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            className="flex min-h-[11rem] flex-col justify-between gap-8 border-b border-rule py-5 sm:pr-6 lg:min-h-[15rem] lg:border-b-0 lg:border-r lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="label text-muted">{pad(i + 1)}</span>
              <Swatch color={PIGMENTS[i % PIGMENTS.length]} seed={i * 13 + 4} className="-mr-2 -mt-3 w-[min(17rem,78%)]" />
            </div>
            <div>
              <h3 className="display text-[clamp(1.75rem,2.8vw,2.75rem)] [--wdth:100]">{p.title}</h3>
              {p.blurb ? (
                <p className="mt-3 font-serif text-xl italic leading-snug text-ink-2">{p.blurb}</p>
              ) : (
                <p className="mt-3">
                  <PlaceholderTag>Placeholder — one line</PlaceholderTag>
                </p>
              )}
              {p.photos && (
                <ul className="mt-5 grid grid-cols-3 gap-2">
                  {p.photos.map((src, j) => (
                    <li key={j} className="aspect-[3/4]">
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <span className="label flex h-full items-end border border-dashed border-pen p-1.5 text-[0.5625rem] text-pen">
                          Photo {pad(j + 1)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Ticker />
    </section>
  );
}
