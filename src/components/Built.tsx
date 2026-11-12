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

/* Each project's write-up scrap takes a different sheet, so the three read
   as three things rather than one long page. */
const NOTE_SHEETS = ["var(--color-paper)", "var(--color-pink)", "var(--color-mustard)"];

function Links({ project }: { project: Project }) {
  if (!project.repo && !project.live) return null;
  return (
    <p className="mt-8 flex flex-wrap gap-3">
      {project.live && (
        <Paper
          as="a"
          flat
          tilt={1}
          sheet="var(--color-vermilion)"
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          className="tag label text-cream"
        >
          Try the prototype <span aria-hidden="true">↗</span>
        </Paper>
      )}
      {project.repo && (
        <Paper
          as="a"
          flat
          tilt={-1}
          sheet="var(--color-ink)"
          href={project.repo}
          target="_blank"
          rel="noreferrer noopener"
          className="tag label text-cream"
        >
          Read the source <span aria-hidden="true">↗</span>
        </Paper>
      )}
    </p>
  );
}

/** One project: a write-up scrap and a working figure, overlapping. */
function Feature({ project, n }: { project: Project; n: number }) {
  const Figure = project.figure ? FIGURES[project.figure] : null;
  const flip = n % 2 === 0; // even-numbered projects put the figure on the left
  return (
    <article className="grid grid-cols-1 items-start gap-y-8 md:grid-cols-12">
      <Paper
        data-sheet
        tilt={flip ? 1.2 : -1.4}
        sheet={NOTE_SHEETS[(n - 1) % NOTE_SHEETS.length]}
        className={`relative z-[2] px-[clamp(1.25rem,2.6vw,2.5rem)] py-[clamp(1.5rem,2.8vw,2.75rem)] md:col-span-5 ${
          flip ? "md:order-2 md:mt-[7vw]" : ""
        }`}
      >
        <p className="label flex gap-6 text-ink-2">
          <span>No. {pad(n)}</span>
          <span className={project.year === "In progress" ? "text-vermilion" : ""}>
            {project.year === "In progress" ? "● " : ""}
            {project.year}
          </span>
        </p>
        <h3 className="statement mt-4 text-[clamp(2.25rem,4vw,3.75rem)] !leading-[0.98] text-balance">
          {project.name}
        </h3>
        <p className="mt-6 text-[1.125rem] leading-[1.55] text-ink-2">{project.blurb}</p>
        <ul className="mt-7 flex flex-wrap gap-2">
          {project.stack.map((s, i) => (
            <Paper as="li" key={s} flat tilt={i % 2 ? 1.5 : -1.5} sheet="var(--color-cream)" className="label px-3 py-1.5">
              {s}
            </Paper>
          ))}
        </ul>
        <Links project={project} />
      </Paper>

      {Figure && (
        <Paper
          as="figure"
          data-sheet
          tilt={flip ? -0.9 : 1.1}
          className={`relative z-[1] px-[clamp(1.25rem,2.6vw,2.5rem)] py-[clamp(1.5rem,2.8vw,2.75rem)] md:col-span-7 ${
            flip ? "md:order-1 md:-mr-[3%]" : "md:-ml-[3%] md:mt-[9vw]"
          }`}
        >
          <Figure />
          <figcaption className="mt-5 font-serif text-[0.9375rem] italic leading-snug text-ink-2">
            Fig. {n} — {project.caption}
            <Cite n={3} />
          </figcaption>
        </Paper>
      )}
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
      <CutTitle
        lines={["Built"]}
        label={`Mile 01 · ${pad(PROJECTS.filter((p) => !p.placeholder).length)} on the water`}
      />

      <div className="mt-[clamp(1.5rem,4vw,3.5rem)] space-y-[clamp(6rem,22vh,14rem)]">
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
