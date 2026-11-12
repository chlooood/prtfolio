"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { PROFILE } from "@/content/site";
import { Paper } from "./Paper";

/**
 * The premise, on its own sheet, inked in word by word as you scroll.
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
        <p data-premise className="statement text-[clamp(1.75rem,4.4vw,4.5rem)]">
          {words.map((w, i) => (
            <span key={i} data-word>
              {w}{" "}
            </span>
          ))}
        </p>
      </Paper>
    </section>
  );
}
