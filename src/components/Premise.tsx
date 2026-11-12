"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { PROFILE } from "@/content/site";
import { Paper } from "./Paper";

/**
 * Just below the confluence: the premise, inked in word by word as you
 * scroll, and the two streams written out as what each one carries.
 */
export function Premise() {
  const root = useRef<HTMLElement>(null);
  const words = PROFILE.intro.split(" ");

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-premise]", start: "top 82%", end: "bottom 50%", scrub: 0.4 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="premise" ref={root} aria-label="Premise" className="px-[var(--pad)] pt-[clamp(8rem,26vh,18rem)]">
      <Paper
        data-sheet
        tilt={0.5}
        className="mx-auto max-w-[76rem] px-[clamp(1.25rem,5vw,5rem)] py-[clamp(2rem,6vw,5.5rem)]"
      >
        <p className="label mb-[clamp(1.25rem,3vw,2.5rem)] text-muted">Below the confluence</p>
        <p data-premise className="statement text-[clamp(1.75rem,4.4vw,4.5rem)]">
          {words.map((w, i) => (
            <span key={i} data-word>
              {w}{" "}
            </span>
          ))}
        </p>

        <dl className="mt-[clamp(2.5rem,6vw,5rem)] grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-stretch">
          <Paper flat tilt={-1.5} sheet="var(--color-forest)" data-reveal className="px-5 py-4 text-cream">
            <dt className="label opacity-80">Left stream — Business</dt>
            <dd className="mt-2 font-serif text-[clamp(1.25rem,2vw,1.75rem)] italic leading-tight">what matters</dd>
          </Paper>
          <Paper flat tilt={1.2} sheet="var(--color-sea)" data-reveal className="px-5 py-4 text-cream">
            <dt className="label opacity-80">Right stream — Computer Science</dt>
            <dd className="mt-2 font-serif text-[clamp(1.25rem,2vw,1.75rem)] italic leading-tight">
              whether you&rsquo;re actually right
            </dd>
          </Paper>
          <Paper flat tilt={-0.8} sheet="var(--color-vermilion)" data-reveal className="px-5 py-4 text-cream">
            <dt className="label opacity-80">Together</dt>
            <dd className="mt-2 font-serif text-[clamp(1.25rem,2vw,1.75rem)] italic leading-tight">one river</dd>
          </Paper>
        </dl>
      </Paper>
    </section>
  );
}
