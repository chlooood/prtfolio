"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

/**
 * Site-wide scroll behaviour, declared once and driven by data attributes:
 *
 *   data-sheet   a large paper scrap: slides up and settles from a crooked
 *                angle, as if just put down
 *   data-reveal  smaller pieces: a short rise with a little overshoot,
 *                staggered among siblings
 *
 * Everything sits behind the reduced-motion query; without it the page is
 * simply static and fully visible.
 */
export function MotionRoot() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-sheet]").forEach((el, i) => {
        gsap.from(el, {
          y: 120,
          rotation: i % 2 ? -1.5 : 1.5,
          transformOrigin: "50% 0%",
          autoAlpha: 0,
          duration: 1.3,
          ease: "back.out(1.1)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      gsap.set("[data-reveal]", { autoAlpha: 0, y: 26 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "back.out(1.5)",
            stagger: 0.07,
            overwrite: true,
          }),
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, []);

  return null;
}
