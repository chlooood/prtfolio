"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { NOW, PROFILE, PROJECTS } from "@/content/site";
import { Cite } from "./Cite";
import { Paper } from "./Paper";

const WORDS = [PROFILE.firstName, PROFILE.lastName];
const WORD_GAP_EM = 0.22;

/**
 * The source. Two streams come down from the top corners and meet at the foot
 * of this section. The name is cut from cream paper and laid across the
 * highlands like a masthead.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  // Fit the name to the measure (one line on desktop, two on mobile).
  useEffect(() => {
    const h1 = nameRef.current;
    if (!h1) return;
    const probes = Array.from(h1.querySelectorAll<HTMLElement>("[data-probe]"));
    const fit = () => {
      const widths = probes.map((p) => p.getBoundingClientRect().width / 100);
      const oneLine = window.matchMedia("(min-width: 48rem)").matches;
      const em = oneLine
        ? widths.reduce((a, b) => a + b, 0) + WORD_GAP_EM * (widths.length - 1)
        : Math.max(...widths);
      if (em > 0) h1.style.fontSize = `${(h1.clientWidth / em) * 0.89}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(h1);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
      gsap.set(letters, { yPercent: 120, rotation: () => gsap.utils.random(-14, 14) });
      gsap.set("[data-hero-in]", { autoAlpha: 0, y: 40, rotation: 4 });
      gsap.set("[data-stream]", { autoAlpha: 0 });

      gsap
        .timeline({ delay: 0.5 })
        .to(letters, { yPercent: 0, rotation: 0, duration: 1.2, ease: "back.out(1.4)", stagger: 0.05 })
        .to("[data-stream]", { autoAlpha: 1, duration: 1.2, stagger: 0.2 }, 0.9)
        .to("[data-hero-in]", { autoAlpha: 1, y: 0, rotation: 0, duration: 1.1, ease: "back.out(1.2)", stagger: 0.12 }, 1.1);

      gsap.to(nameRef.current, {
        yPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });
    });
    return () => mm.revert();
  }, []);

  const feature = PROJECTS.find((p) => !p.placeholder);

  return (
    <section
      id="top"
      ref={root}
      data-confluence
      className="relative flex min-h-[100svh] flex-col px-[var(--pad)] pt-[calc(var(--nav-h)+0.75rem)]"
    >
      <h1
        ref={nameRef}
        aria-label={`${PROFILE.firstName} ${PROFILE.lastName}`}
        className="display cutout flex flex-col text-[21vw] md:flex-row md:gap-[0.22em] md:text-[12vw]"
      >
        {WORDS.map((word) => (
          <span
            key={word}
            aria-hidden="true"
            className="relative -mb-[0.1em] flex flex-auto justify-between overflow-hidden pb-[0.24em] pt-[0.06em]"
          >
            {word.split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block origin-bottom">
                {ch}
              </span>
            ))}
            <span data-probe className="invisible absolute left-0 top-0 whitespace-nowrap" style={{ fontSize: 100, letterSpacing: "-0.035em" }}>
              {word}
            </span>
          </span>
        ))}
      </h1>

      <div className="mt-auto flex flex-col gap-5 pb-[clamp(1.25rem,3vw,2.5rem)] pt-[30vh] md:flex-row md:items-end md:justify-between md:pt-10">
        <Paper
          tilt={-1.2}
          data-hero-in
          data-drag
          className="max-w-[36rem] px-[clamp(1.25rem,2.4vw,2.25rem)] py-[clamp(1.25rem,2.2vw,2rem)] md:w-[44%]"
        >
          <p className="statement text-[clamp(1.625rem,2.9vw,2.875rem)] text-balance">
            {PROFILE.headline}
            <Cite n={2} />
          </p>
          <p className="mt-4 font-serif text-[1.0625rem] italic text-ink-2">
            — {PROFILE.signature}
            <Cite n={1} />
          </p>
        </Paper>

        <p data-stream className="cutout label pointer-events-none hidden self-center pb-2 text-center md:block">
          Downstream
          <br />↓
        </p>

        <Paper
          as="dl"
          tilt={1.4}
          flat
          sheet="var(--color-mustard)"
          data-hero-in
          data-drag
          className="label grid max-w-[22rem] grid-cols-[auto_1fr] gap-x-4 gap-y-2 self-end px-5 py-4 md:w-[26%]"
        >
          <dt className="text-ink/70">Based</dt>
          <dd>
            {NOW.basedIn}
            {NOW.currentlyIn && <span className="text-ink/70"> · now in {NOW.currentlyIn}</span>}
          </dd>
          <dt className="text-ink/70">Studying</dt>
          <dd>
            {PROFILE.role}, &rsquo;{String(PROFILE.gradYear).slice(2)}
          </dd>
          {feature && (
            <>
              <dt className="text-ink/70">Building</dt>
              <dd>
                <a href="#built" className="link">
                  {feature.name}
                </a>
              </dd>
            </>
          )}
        </Paper>
      </div>
    </section>
  );
}
