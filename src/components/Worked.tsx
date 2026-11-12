"use client";

import { useState } from "react";
import { EXPERIENCE } from "@/content/site";
import { Cite } from "./Cite";
import { SectionHead } from "./SectionHead";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Experience as ledger lines. Each row is a disclosure: the organisation
 * stretches on the width axis when hovered or open, and the notes fold out
 * underneath.
 */
export function Worked() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="worked" className="pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead index="02" title="Worked" tally={`${pad(EXPERIENCE.length)} entries`} />

      <ol className="mx-[var(--pad)] mt-[clamp(2.5rem,6vw,5rem)] border-t border-ink">
        {EXPERIENCE.map((role, i) => {
          const isOpen = open === i;
          return (
            <li key={role.org} data-reveal className="border-b border-rule">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`role-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full grid-cols-4 items-baseline gap-x-4 gap-y-1 py-5 text-left md:grid-cols-12 md:gap-x-6 md:py-7"
                >
                  <span className="label col-span-4 text-muted md:col-span-2">{role.period}</span>
                  <span
                    className={`stretch display col-span-4 text-[clamp(1.75rem,4.4vw,4.25rem)] group-hover:[--wdth:125] md:col-span-7 ${isOpen ? "[--wdth:125]" : "[--wdth:80]"}`}
                  >
                    {role.org}
                  </span>
                  <span className="col-span-3 font-serif text-[1.0625rem] italic text-ink-2 md:col-span-2">
                    {role.role}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`label col-span-1 justify-self-end transition-transform duration-500 ease-[var(--ease-expo)] ${isOpen ? "rotate-45 text-pen" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div id={`role-${i}`} className="fold" data-open={isOpen} inert={!isOpen}>
                <div>
                  <div className="grid grid-cols-4 gap-x-4 pb-8 md:grid-cols-12 md:gap-x-6">
                    <p className="label col-span-4 mb-4 text-muted md:col-span-2 md:mb-0">{role.location}</p>
                    <ul className="col-span-4 space-y-3 md:col-span-7">
                      {role.notes.map((note, j) => (
                        <li key={j} className="relative max-w-[44rem] pl-6 text-[1.125rem] leading-[1.5]">
                          <span aria-hidden="true" className="label absolute left-0 top-[0.45em] text-pen">
                            {String.fromCharCode(97 + j)}
                          </span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="label mx-[var(--pad)] mt-4 text-muted">
        All figures
        <Cite n={4} />
      </p>
    </section>
  );
}
