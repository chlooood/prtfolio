"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Keep timelines on the wall clock so a throttled tab catches up instead of
  // leaving intro states half-applied.
  gsap.ticker.lagSmoothing(0);
}

/** Media queries every animation is gated behind. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export { gsap, ScrollTrigger };
