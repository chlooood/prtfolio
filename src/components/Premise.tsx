"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { PROFILE } from "@/content/site";

/**
 * The premise: the intro paragraph inks in word by word against scroll, then
 * resolves into a double-entry line — business on one side, code on the other,
 * one balance underneath.
 */
export function Premise() {
  const root = useRef<HTMLElement>(null);
  const words = PROFILE.intro.split(" ");

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: "[data-premise]",
            start: "top 82%",
            end: "bottom 48%",
            scrub: 0.4,
          },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="premise"
      ref={root}
      aria-label="Premise"
      className="px-[var(--pad)] pb-[clamp(5rem,12vw,11rem)] pt-[clamp(5rem,14vw,13rem)]"
    >
      <div className="grid grid-cols-4 gap-x-4 md:grid-cols-12 md:gap-x-6">
        <p className="label col-span-4 mb-6 text-muted md:col-span-2 md:mb-0 md:pt-3">§ 00 — Premise</p>
        <p
          data-premise
          className="col-span-4 font-serif text-[clamp(1.75rem,4.3vw,4.5rem)] leading-[1.08] tracking-[-0.02em] md:col-span-10"
        >
          {words.map((w, i) => (
            <span key={i} data-word>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-[clamp(4rem,9vw,8rem)] grid grid-cols-4 gap-x-4 md:grid-cols-12 md:gap-x-6">
        <div className="col-span-4 md:col-span-10 md:col-start-3">
          <div data-rule className="h-px origin-left bg-ink" />
          <dl className="grid grid-cols-2 gap-x-4 md:gap-x-6">
            <div data-reveal className="border-r border-rule py-5 pr-4">
              <dt className="label text-muted">Dr. — Business</dt>
              <dd className="mt-3 font-serif text-[clamp(1.25rem,2.2vw,2rem)] italic leading-tight">
                what matters
              </dd>
            </div>
            <div data-reveal className="py-5">
              <dt className="label text-muted">Cr. — Computer Science</dt>
              <dd className="mt-3 font-serif text-[clamp(1.25rem,2.2vw,2rem)] italic leading-tight">
                whether you&rsquo;re actually right
              </dd>
            </div>
          </dl>
          <div data-rule className="h-px origin-left bg-ink" />
          <div className="mt-[3px] h-px bg-ink" />
          <p data-reveal className="label flex justify-between pt-3">
            <span className="text-muted">Balance</span>
            <span>One subject, not two tracks</span>
          </p>
        </div>
      </div>
    </section>
  );
}
