"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

/**
 * Site-wide scroll behaviour, declared once and driven by data attributes:
 *
 *   data-wdth    display type opens from condensed to expanded as it enters
 *   data-reveal  quiet rise-and-fade, batched so siblings stagger
 *   data-rule    hairlines draw left to right
 *
 * Everything sits behind the reduced-motion query; without it the page is
 * simply static and fully visible.
 */
export function MotionRoot() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-wdth]").forEach((el) => {
        gsap.fromTo(
          el,
          { "--wdth": 62 },
          {
            "--wdth": 125,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 98%", end: "top 38%", scrub: 0.5 },
          },
        );
      });

      gsap.set("[data-reveal]", { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            overwrite: true,
          }),
      });

      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      // The margin rule inks in with page progress.
      gsap.to(".margin-rule > i", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    });

    // Layout shifts once webfonts land; re-measure triggers.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, []);

  return (
    <div className="margin-rule" aria-hidden="true">
      <i />
    </div>
  );
}
