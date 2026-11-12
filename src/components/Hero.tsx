"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { NOW, PROFILE, PROJECTS } from "@/content/site";
import { Cite } from "./Cite";
import { Landscape } from "./Landscape";

const WORDS = [PROFILE.firstName, PROFILE.lastName];
const WORD_GAP_EM = 0.3;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  /* Fit the name to the measure. Letters are flex children spaced with
     space-between, so at full width they sit tight; as scroll narrows the
     width axis, the same letters drift apart across the same line. */
  useEffect(() => {
    const h1 = nameRef.current;
    if (!h1) return;
    const probes = Array.from(h1.querySelectorAll<HTMLElement>("[data-probe]"));

    const fit = () => {
      const widths = probes.map((p) => p.getBoundingClientRect().width / 100); // em
      const oneLine = window.matchMedia("(min-width: 48rem)").matches;
      const em = oneLine
        ? widths.reduce((a, b) => a + b, 0) + WORD_GAP_EM * (widths.length - 1)
        : Math.max(...widths);
      if (em > 0) h1.style.fontSize = `${(h1.clientWidth / em) * 0.995}px`;
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
      const count = { v: 0 };

      gsap.set(letters, { yPercent: 115 });
      gsap.set("[data-hero-in]", { autoAlpha: 0, y: 24 });

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .to(count, {
          v: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(count.v));
          },
        })
        .to(loaderRef.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, ">-0.1")
        .set(loaderRef.current, { display: "none" })
        .to(letters, { yPercent: 0, duration: 1.3, stagger: 0.045 }, "<-0.55")
        .to("[data-hero-in]", { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, "<0.35");

      // Scroll-driven typography: the name gives up its width as you leave.
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
        })
        .fromTo(nameRef.current, { "--wdth": 125 }, { "--wdth": 62, ease: "none" }, 0)
        .to("[data-hero-field]", { yPercent: 8, ease: "none" }, 0)
        .to("[data-hero-copy]", { yPercent: -18, ease: "none" }, 0);
    });

    return () => mm.revert();
  }, []);

  const feature = PROJECTS.find((p) => !p.placeholder);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-[var(--pad)] pt-[calc(var(--nav-h)+0.5rem)]"
    >
      <div ref={loaderRef} className="loader" aria-hidden="true">
        <p className="absolute bottom-[var(--pad)] left-[var(--pad)] font-serif text-[clamp(5rem,18vw,14rem)] leading-none tracking-[-0.04em]">
          <span ref={countRef}>0</span>
          <span className="align-super text-[0.3em] tracking-normal">%</span>
        </p>
        <p className="label absolute right-[var(--pad)] top-[var(--pad)] text-muted">
          Keeping score
        </p>
      </div>

      <h1
        ref={nameRef}
        aria-label={`${PROFILE.firstName} ${PROFILE.lastName}`}
        className="display relative z-10 flex flex-col text-[21vw] md:flex-row md:gap-[0.3em] md:text-[10.4vw]"
      >
        {WORDS.map((word) => (
          <span
            key={word}
            aria-hidden="true"
            className="relative flex flex-auto justify-between overflow-hidden pt-[0.04em]"
          >
            {word.split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block">
                {ch}
              </span>
            ))}
            {/* Fixed-size probe used only to measure the word's natural width. */}
            <span
              data-probe
              className="invisible absolute left-0 top-0 whitespace-nowrap"
              style={{ fontSize: 100, fontVariationSettings: '"wdth" 125, "wght" 800' }}
            >
              {word}
            </span>
          </span>
        ))}
      </h1>

      <div data-hero-field className="pointer-events-none absolute inset-x-0 bottom-[7.5rem] top-[26%] md:bottom-[4.5rem] md:top-[16%]">
        <Landscape delay={1.5} className="h-full w-full" />
      </div>

      <div
        data-hero-copy
        className="relative z-10 mt-[clamp(1.5rem,4vw,3.5rem)] grid flex-1 grid-cols-4 content-start gap-x-4 md:grid-cols-12 md:gap-x-6"
      >
        <p
          data-hero-in
          className="col-span-4 font-serif text-[clamp(1.75rem,3.5vw,3.6rem)] leading-[1.06] tracking-[-0.015em] text-balance md:col-span-7 lg:col-span-6"
        >
          {PROFILE.headline}
          <Cite n={2} />
        </p>
        <p
          data-hero-in
          className="col-span-4 mt-5 font-serif text-lg italic text-ink-2 md:col-span-7 md:col-start-1"
        >
          — {PROFILE.signature}
          <Cite n={1} />
        </p>
      </div>

      <dl
        data-hero-in
        className="label relative z-10 mt-10 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-ink py-4 md:grid-cols-12 md:gap-x-6"
      >
        <div className="md:col-span-3">
          <dt className="text-muted">Based</dt>
          <dd className="mt-1">
            {NOW.basedIn}
            {NOW.currentlyIn && <span className="text-muted"> · now in {NOW.currentlyIn}</span>}
          </dd>
        </div>
        <div className="md:col-span-3">
          <dt className="text-muted">Studying</dt>
          <dd className="mt-1">
            {PROFILE.role}, &rsquo;{String(PROFILE.gradYear).slice(2)}
          </dd>
        </div>
        {feature && (
          <div className="col-span-2 md:col-span-4">
            <dt className="text-muted">Building</dt>
            <dd className="mt-1">
              <a href="#built" className="link">
                {feature.name}
              </a>
            </dd>
          </div>
        )}
        <div className="hidden text-right md:col-span-2 md:block">
          <dt className="sr-only">Continue</dt>
          <dd>
            <a href="#premise" className="link">
              Scroll ↓
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
