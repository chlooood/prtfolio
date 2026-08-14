/**
 * Site configuration — knobs for how the site behaves, not what it says.
 * Everything about Chloe lives in `me.js`; this file is the design side.
 */
export const NAV_LINKS = [
  { label: 'Index', href: '/' },
  { label: 'Experience', href: '/experience' },
  { label: 'Writing', href: '/writing' },
];

/**
 * Ambient dandelion layer.
 *   'scroll'  — seeds drift, and scrolling pushes them
 *   'ambient' — seeds drift at a constant slow rate, scroll ignored
 *   'hero'    — drift confined to the first viewport, fading out below it
 *   'off'     — no seed layer at all
 *
 * Any mode is overridden to 'off' when the visitor asks for reduced motion.
 * `count` is the total across all three depth planes.
 */
export const DANDELIONS = {
  mode: 'scroll',
  count: 14,
};

/**
 * The painted sky-and-meadow backdrop.
 *
 * `intensity` is the master dial, 0 → 1. It sits behind body copy, so this is
 * a legibility trade, not just taste:
 *   0      — off entirely, plain cream paper
 *   0.18   — a suggestion of weather; text unaffected
 *   0.32   — current. Clearly painted, still comfortably readable
 *   0.5+   — vivid like the reference painting, but paragraph contrast starts
 *            to suffer and the editorial character gives way to illustration
 */
export const BACKDROP = {
  intensity: 0.32,
};
