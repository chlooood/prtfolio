"use client";

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

/**
 * A section title set straight on the page — in ink on clean paper, or cut
 * from cream where it sits on painted map. When it scrolls into view its
 * letters tumble up into place, as if someone were setting them down by hand.
 */
export function CutTitle({
  lines,
  label,
  tone = "ink",
  className = "",
}: {
  lines: string[];
  label?: string;
  /** "ink" on clean paper; "cream" when the title sits on painted map. */
  tone?: "ink" | "cream";
  className?: string;
}) {
  const cut = tone === "cream";
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.from("[data-l]", {
        yPercent: 125,
        rotation: () => gsap.utils.random(-9, 9),
        duration: 1.1,
        ease: "back.out(1.6)",
        stagger: 0.045,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <header ref={root} className={className}>
      {label &&
        (cut ? (
          <p className="cutout label">{label}</p>
        ) : (
          <p className="font-mono text-xs tracking-[.04em] text-muted">{label}</p>
        ))}
      <h2
        aria-label={lines.join(" ")}
        className={`display mt-3 text-[clamp(3.65rem,11.5vw,10.5rem)] ${cut ? "cutout" : "sticker"}`}
      >
        {lines.map((line) => (
          <span key={line} aria-hidden="true" className="-mb-[0.14em] block overflow-hidden pb-[0.26em] pt-[0.06em]">
            {line.split("").map((ch, i) => (
              <span key={i} data-l className="inline-block origin-bottom whitespace-pre">
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h2>
    </header>
  );
}
