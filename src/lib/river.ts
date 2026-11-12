/**
 * The river's course, in page pixels. The shader (RiverMap) draws it and the
 * birds follow it, so both read the same numbers from here. If you change a
 * constant, change it in RiverMap's GLSL `course()` too — they are mirrors.
 */

export type RiverFrame = {
  /** Viewport width, px. */
  w: number;
  /** Viewport height, px. */
  h: number;
  /** Page y of the confluence, px. */
  conf: number;
};

/** Reference scale: map features never get smaller than this many px. */
export const scaleOf = (w: number) => Math.max(w, 700);

/** Centre of the main channel at page-y `y` (below the confluence). */
export function riverX(y: number, f: RiverFrame): number {
  const S = scaleOf(f.w);
  const Y = y / S;
  const Yc = f.conf / S;
  const env = smooth(Yc, Yc + 0.9, Y);
  const m = 0.62 * Math.sin(Y * 1.15 + 0.6) + 0.28 * Math.sin(Y * 2.7 + 2.1) + 0.1 * Math.sin(Y * 6.1 + 1.0);
  return 0.5 * f.w + 0.3 * f.w * m * env;
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
