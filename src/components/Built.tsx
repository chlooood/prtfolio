"use client";

import { PROJECTS, type Project } from "@/content/site";
import { Cite, PlaceholderTag } from "./Cite";
import { CutTitle } from "./CutTitle";
import { NdtmFig } from "./NdtmFig";
import { OddsSim } from "./OddsSim";
import { Paper } from "./Paper";
import { RunwayFig } from "./RunwayFig";

const pad = (n: number) => String(n).padStart(2, "0");

const FIGURES = { odds: OddsSim, ndtm: NdtmFig, runway: RunwayFig } as const;

function Links({ project }: { project: Project }) {
  if (!project.repo && !project.live) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-7">
      {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" className="editorial-link text-[1rem] font-semibold">Try the prototype ↗</a>}
      {project.repo && <a href={project.repo} target="_blank" rel="noopener noreferrer" className="editorial-link text-[1rem] font-semibold">Read the source ↗</a>}
    </div>
  );
}

/** The story sits beside the working artifact, without decorative tag clutter. */
function Feature({ project, n }: { project: Project; n: number }) {
  const Figure = project.figure ? FIGURES[project.figure] : null;
  const flip = n % 2 === 0;
  return (
    <article className="grid grid-cols-1 items-start gap-x-[clamp(1.5rem,4vw,5rem)] gap-y-10 lg:grid-cols-12">
      <div
        data-sheet
        className={`relative min-w-0 border-t border-ink/25 pt-[clamp(1.5rem,3vw,3rem)] lg:col-span-5 ${flip ? "lg:order-2 lg:mt-20" : ""}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[.73rem] text-muted">
          <span>Selected work / {pad(n)}</span>
          <span>{project.year}</span>
        </div>
        <h3 className="display mt-7 text-[clamp(2.5rem,4.5vw,5.2rem)] leading-[1] text-balance">{project.name}</h3>
        <p className="mt-7 max-w-[55ch] text-[1.08rem] leading-[1.75] text-ink-2">{project.blurb}</p>

        {project.story && (
          <div className="mt-9 space-y-7 border-t border-ink/20 pt-7">
            <div>
              <h4 className="font-mono text-[.71rem] uppercase tracking-[.08em] text-muted">The question</h4>
              <p className="statement mt-2 text-[clamp(1.4rem,2.3vw,2.15rem)]">{project.story.question}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <h4 className="font-mono text-[.71rem] uppercase tracking-[.08em] text-muted">The approach</h4>
                <p className="mt-2 text-[.99rem] leading-[1.65] text-ink-2">{project.story.approach}</p>
              </div>
              <div>
                <h4 className="font-mono text-[.71rem] uppercase tracking-[.08em] text-muted">What matters</h4>
                <p className="mt-2 text-[.99rem] leading-[1.65] text-ink-2">{project.story.takeaway}</p>
              </div>
            </div>
            <p className="border-l-2 border-maroon/50 pl-4 font-serif text-[.98rem] italic text-ink-2">{project.story.evidence}</p>
          </div>
        )}

        <p className="mt-7 max-w-[46ch] border-t border-ink/15 pt-4 font-mono text-[.68rem] leading-[1.85] text-muted">
          {project.stack.join("  /  ")}
        </p>
        <Links project={project} />
      </div>

      <div className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        {Figure && (
          <Paper as="figure" data-sheet tilt={flip ? -0.55 : 0.65} className="px-[clamp(1.25rem,3vw,2.75rem)] py-[clamp(1.5rem,3vw,2.75rem)]">
            <Figure />
            <figcaption className="mt-7 border-t border-ink/20 pt-4 font-serif text-[.94rem] italic leading-[1.55] text-ink-2">
              Interactive study — {project.caption}<Cite n={3} />
            </figcaption>
          </Paper>
        )}
        {project.evidenceImages && project.evidenceImages.length > 0 && (
          <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {project.evidenceImages.map((item) => (
              <figure key={item.src} className="min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="mt-2 font-serif text-sm italic text-ink-2">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * The work, pinned along the river: each project is a write-up scrap and a
 * figure you can operate, alternating sides as you go downstream.
 */
export function Built() {
  const features = PROJECTS.filter((p) => p.figure);
  const rest = PROJECTS.filter((p) => !p.figure);

  return (
    <section id="built" className="px-[var(--pad)] pt-[clamp(10rem,40vh,24rem)]">
      <CutTitle lines={["Built"]} />
      <p className="statement mt-7 max-w-2xl text-[clamp(1.4rem,2.6vw,2.4rem)] text-ink-2">A few projects, each with a question worth following.</p>

      <div className="mt-[clamp(4rem,11vw,9rem)] space-y-[clamp(8rem,20vh,16rem)]">
        {features.map((p, i) => (
          <Feature key={p.name} project={p} n={i + 1} />
        ))}
      </div>

      {rest.length > 0 && (
        <Paper
          data-sheet
          tilt={-0.6}
          className="mt-[clamp(3rem,9vw,8rem)] px-[clamp(1.25rem,2.6vw,2.5rem)] py-[clamp(1.5rem,2.8vw,2.5rem)] md:ml-[12%] md:w-[80%]"
        >
          <p className="label mb-3 text-muted">Further downstream</p>
          <ol className="border-t-2 border-ink">
            {rest.map((p, i) => {
              const n = features.length + i + 1;
              const href = p.live ?? p.repo;
              const Row = href ? "a" : "div";
              return (
                <li key={n} className="border-b border-rule last:border-b-0">
                  <Row
                    {...(href ? { href, target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="group grid grid-cols-4 items-baseline gap-x-4 gap-y-2 py-5 md:grid-cols-12 md:gap-x-8"
                  >
                    <span className="label col-span-1 text-muted">{pad(n)}</span>
                    <span className="col-span-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-6">
                      <span
                        className={`statement text-[clamp(1.5rem,3vw,2.75rem)] transition-[translate] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2 ${p.placeholder ? "text-ink/40" : ""}`}
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
        </Paper>
      )}
    </section>
  );
}
