"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, FINE_POINTER } from "@/lib/gsap";
import { PROJECTS, type Project } from "@/content/site";
import { Cite, PlaceholderTag } from "./Cite";
import { OddsSim } from "./OddsSim";
import { SectionHead } from "./SectionHead";

const pad = (n: number) => String(n).padStart(2, "0");

/** The image plate for a project — or a labelled empty frame if none is set. */
function Plate({ project, n }: { project: Project; n: number }) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-paper-2 p-4 text-ink">
      {/* crop marks */}
      {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "left-2 bottom-2 border-l border-b", "right-2 bottom-2 border-r border-b"].map(
        (c) => (
          <i key={c} className={`absolute h-3 w-3 border-ink ${c}`} />
        ),
      )}
      <span className="label px-3 pt-2">Plate {pad(n)}</span>
      <span className="display px-3 text-[5rem] text-ink/15" style={{ ["--wdth" as string]: 62 }}>
        {pad(n)}
      </span>
      <span className="label px-3 pb-2 text-pen">Add an image → /public/work/{pad(n)}.jpg</span>
    </div>
  );
}

export function Built() {
  const [feature, ...rest] = PROJECTS;
  const listRef = useRef<HTMLOListElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // Lookbook hover: on fine pointers a plate trails the cursor over the index.
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
        if (!reduce) rot(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.35));
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
    <section id="built" className="pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead
        index="01"
        title="Built"
        tally={`${pad(PROJECTS.filter((p) => !p.placeholder).length)} on the books`}
      />

      {feature && (
        <article className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-4 gap-x-4 gap-y-12 px-[var(--pad)] md:grid-cols-12 md:gap-x-6">
          <div className="col-span-4 md:col-span-5">
            <p data-reveal className="label flex gap-6 text-muted">
              <span>No. 01</span>
              <span className="text-pen">● {feature.year}</span>
            </p>
            <h3
              data-reveal
              className="mt-5 font-serif text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.98] tracking-[-0.025em] text-balance"
            >
              {feature.name}
            </h3>
            <p data-reveal className="mt-7 max-w-[34rem] text-[1.125rem] leading-[1.55] text-ink-2">
              {feature.blurb}
            </p>
            <ul data-reveal className="label mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-4">
              {feature.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            {(feature.repo || feature.live) && (
              <p data-reveal className="mt-8 flex gap-8">
                {feature.repo && (
                  <a className="group label link inline-flex items-center gap-2 py-2" href={feature.repo} target="_blank" rel="noreferrer noopener">
                    Read the source
                    <span aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  </a>
                )}
                {feature.live && (
                  <a className="label link py-2" href={feature.live} target="_blank" rel="noreferrer noopener">
                    Live ↗
                  </a>
                )}
              </p>
            )}
          </div>

          <figure data-reveal className="col-span-4 md:col-span-6 md:col-start-7">
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
        <div className="mt-[clamp(4rem,9vw,8rem)] px-[var(--pad)]">
          <p className="label mb-3 text-muted">Index — continued</p>
          <ol ref={listRef} className="border-t border-ink">
            {rest.map((p, i) => {
              const n = i + 2;
              const href = p.live ?? p.repo;
              const Row = href ? "a" : "div";
              return (
                <li key={n} data-reveal className="border-b border-rule">
                  <Row
                    {...(href ? { href, target: "_blank", rel: "noreferrer noopener" } : {})}
                    onPointerEnter={() => setActive(i)}
                    className="group grid grid-cols-4 items-baseline gap-x-4 gap-y-2 py-6 md:grid-cols-12 md:gap-x-6 md:py-8"
                  >
                    <span className="label col-span-1 text-muted">{pad(n)}</span>
                    <span className="col-span-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-6">
                      <span
                        className={`stretch display text-[clamp(1.5rem,3.4vw,3.25rem)] [--wdth:88] group-hover:[--wdth:104] ${p.placeholder ? "text-ink/35" : ""}`}
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
            <p className="label mt-4 text-pen">
              Placeholder rows — edit PROJECTS in src/content/site.ts
            </p>
          )}

          <div
            ref={plateRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-30 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
          >
            <div
              className="h-[19rem] w-[15rem] -translate-y-1/2 translate-x-8 overflow-hidden shadow-[0_30px_60px_-30px_rgba(25,28,18,0.45)] transition-[clip-path,opacity] duration-500 ease-[var(--ease-expo)]"
              style={{
                clipPath: active === null ? "inset(50% 0 50% 0)" : "inset(0 0 0 0)",
                opacity: active === null ? 0 : 1,
              }}
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
    </section>
  );
}
