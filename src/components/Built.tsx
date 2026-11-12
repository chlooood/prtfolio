"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, FINE_POINTER } from "@/lib/gsap";
import { PROJECTS, type Project } from "@/content/site";
import { Cite, PlaceholderTag } from "./Cite";
import { OddsSim } from "./OddsSim";
import { Paper, SheetHead } from "./Paper";

const pad = (n: number) => String(n).padStart(2, "0");
const SHEETS = ["var(--color-pink)", "var(--color-mustard)", "var(--color-forest)"];

/** The image plate for a project — or a labelled empty scrap if none is set. */
function Plate({ project, n }: { project: Project; n: number }) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <Paper flat sheet={SHEETS[n % SHEETS.length]} className="flex h-full w-full flex-col justify-between p-5 text-ink">
      <span className="label">Plate {pad(n)}</span>
      <span className="display text-[6rem] text-ink/20">{pad(n)}</span>
      <span className="label">Add an image → /public/work/{pad(n)}.jpg</span>
    </Paper>
  );
}

export function Built() {
  const [feature, ...rest] = PROJECTS;
  const listRef = useRef<HTMLOListElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // On fine pointers a paper plate trails the cursor over the index, swinging
  // with the direction of travel.
  useEffect(() => {
    const list = listRef.current;
    const plate = plateRef.current;
    if (!list || !plate) return;
    const mm = gsap.matchMedia();
    mm.add(FINE_POINTER, () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = reduce ? 0 : 0.5;
      const x = gsap.quickTo(plate, "x", { duration: d, ease: "power3" });
      const y = gsap.quickTo(plate, "y", { duration: d, ease: "power3" });
      const rot = gsap.quickTo(plate, "rotation", { duration: reduce ? 0 : 0.8, ease: "power3" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        if (!reduce) rot(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.45));
        lastX = e.clientX;
      };
      const leave = () => {
        setActive(null);
        rot(0);
      };
      list.addEventListener("pointermove", move);
      list.addEventListener("pointerleave", leave);
      return () => {
        list.removeEventListener("pointermove", move);
        list.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="built" className="px-[var(--pad)] pt-[clamp(10rem,42vh,26rem)]">
      <Paper
        data-sheet
        tilt={-0.4}
        className="mx-auto max-w-[78rem] px-[clamp(1.25rem,4vw,4rem)] py-[clamp(2rem,5vw,4.5rem)]"
      >
        <SheetHead
          place="Mile 01"
          title="Built"
          tally={`${pad(PROJECTS.filter((p) => !p.placeholder).length)} on the water`}
        />

        {feature && (
          <article className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-4 gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-8">
            <div className="col-span-4 md:col-span-5">
              <p data-reveal className="label flex gap-6 text-muted">
                <span>No. 01</span>
                <span className="text-vermilion">● {feature.year}</span>
              </p>
              <h3 data-reveal className="statement mt-4 text-[clamp(2.25rem,4.4vw,4.25rem)] !leading-[0.98] text-balance">
                {feature.name}
              </h3>
              <p data-reveal className="mt-6 max-w-[34rem] text-[1.125rem] leading-[1.55] text-ink-2">
                {feature.blurb}
              </p>
              <ul data-reveal className="mt-7 flex flex-wrap gap-2">
                {feature.stack.map((s, i) => (
                  <Paper
                    as="li"
                    key={s}
                    flat
                    tilt={i % 2 ? 1.5 : -1.5}
                    sheet="var(--color-paper-2)"
                    className="label px-3 py-1.5"
                  >
                    {s}
                  </Paper>
                ))}
              </ul>
              {feature.repo && (
                <p data-reveal className="mt-8">
                  <Paper
                    as="a"
                    flat
                    tilt={-1}
                    sheet="var(--color-ink)"
                    href={feature.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="tag label text-cream"
                  >
                    Read the source <span aria-hidden="true">↗</span>
                  </Paper>
                </p>
              )}
            </div>

            <figure data-reveal className="col-span-4 md:col-span-7">
              <OddsSim />
              <figcaption className="mt-5 font-serif text-[0.9375rem] italic leading-snug text-ink-2">
                Fig. 1 — The premise, small enough to play with. Turn up the latency and watch the
                market start contradicting itself.
                <Cite n={3} />
              </figcaption>
            </figure>
          </article>
        )}

        {rest.length > 0 && (
          <div className="mt-[clamp(3rem,7vw,6rem)]">
            <p className="label mb-3 text-muted">Further downstream</p>
            <ol ref={listRef} className="border-t-2 border-ink">
              {rest.map((p, i) => {
                const n = i + 2;
                const href = p.live ?? p.repo;
                const Row = href ? "a" : "div";
                return (
                  <li key={n} data-reveal className="border-b border-rule">
                    <Row
                      {...(href ? { href, target: "_blank", rel: "noreferrer noopener" } : {})}
                      onPointerEnter={() => setActive(i)}
                      className="group grid grid-cols-4 items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-12 md:gap-x-8"
                    >
                      <span className="label col-span-1 text-muted">{pad(n)}</span>
                      <span className="col-span-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-6">
                        <span
                          className={`statement text-[clamp(1.5rem,3.2vw,3rem)] transition-[font-variation-settings,translate] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2 group-hover:[font-variation-settings:'SOFT'_100,'WONK'_1,'opsz'_96] ${p.placeholder ? "text-ink/40" : ""}`}
                        >
                          {p.name}
                        </span>
                        {p.placeholder && <PlaceholderTag />}
                      </span>
                      <span className="label col-span-3 col-start-2 text-muted md:col-span-3 md:col-start-auto">
                        {p.stack.join(" · ")}
                      </span>
                      <span className="label hidden text-right text-muted md:col-span-2 md:block">{p.year}</span>
                      <span className="col-span-3 col-start-2 font-serif italic text-ink-2 md:col-span-6 md:col-start-2">
                        {p.blurb}
                      </span>
                    </Row>
                  </li>
                );
              })}
            </ol>
            {rest.some((p) => p.placeholder) && (
              <p className="label mt-4 text-vermilion">Placeholder rows — edit PROJECTS in src/content/site.ts</p>
            )}

            <div
              ref={plateRef}
              aria-hidden="true"
              className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
            >
              <div
                className="relative h-[19rem] w-[15rem] -translate-y-1/2 translate-x-8 transition-[scale,opacity] duration-500 ease-[var(--ease-spring)]"
                style={{ scale: active === null ? "0.6" : "1", opacity: active === null ? 0 : 1 }}
              >
                {rest.map((p, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: active === i ? 1 : 0 }}
                  >
                    <Plate project={p} n={i + 2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Paper>
    </section>
  );
}
