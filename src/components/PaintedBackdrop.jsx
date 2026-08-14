import { BACKDROP } from '../content/site.js';

/**
 * PaintedBackdrop — the painterly field the dandelions drift across.
 *
 * Hand-built, no image asset. The painted quality comes from running flat
 * colour fields through `feTurbulence` + `feDisplacementMap`: the turbulence
 * generates organic noise, the displacement map pushes each pixel of the
 * shapes along that noise, so hard-edged ellipses come out with the ragged,
 * swept edges of a loaded brush. A final blur softens what's left.
 *
 * The filter is static — rendered once, never animated — so the cost is one
 * rasterisation at paint time rather than anything per-frame.
 *
 * On intensity: the reference image is a saturated painting, but this sits
 * behind body text. At full strength the sky would drag paragraph contrast
 * under WCAG AA. `BACKDROP.intensity` in site.js is the dial; the horizon and
 * text-area washes are additionally masked so copy always sits over near-paper.
 */
export default function PaintedBackdrop() {
  const { intensity } = BACKDROP;

  if (!intensity) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: intensity }}
        focusable="false"
      >
        <defs>
          {/* The brush. baseFrequency is deliberately anisotropic — lower on x
              than y — which stretches the noise horizontally and reads as
              sweeping strokes rather than static. */}
          <filter id="pb-brush" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.013 0.032"
              numOctaves="5"
              seed="11"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="42"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            {/* Kept low on purpose — blur is what turned this into a gradient
                on the first pass. The ragged displaced edge is the brush. */}
            <feGaussianBlur stdDeviation="0.45" />
          </filter>

          {/* A second, finer brush for the wisps that sit on top. */}
          <filter id="pb-wisp" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016 0.03"
              numOctaves="3"
              seed="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="1.4" />
          </filter>

          <linearGradient id="pb-sky" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="var(--color-sky-deep)" />
            <stop offset="55%" stopColor="var(--color-sky)" />
            <stop offset="100%" stopColor="var(--color-sky-pale)" />
          </linearGradient>

          <linearGradient id="pb-meadow" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="var(--color-meadow-light)" />
            <stop offset="100%" stopColor="var(--color-meadow)" />
          </linearGradient>

          {/* Keeps the sky off the top-left, where the wordmark and headline
              sit, and fades the whole thing out through the middle band where
              the reading copy lives. */}
          <linearGradient id="pb-sky-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
            <stop offset="60%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="pb-sky-mask">
            <rect x="0" y="0" width="100" height="62" fill="url(#pb-sky-fade)" />
          </mask>

          {/* The field holds far more of its weight than the sky does — it sits
              below most of the reading copy, so it can afford to. */}
          <linearGradient id="pb-meadow-fade" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="45%" stopColor="white" stopOpacity="0.92" />
            <stop offset="78%" stopColor="white" stopOpacity="0.45" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="pb-meadow-mask">
            <rect x="0" y="38" width="100" height="62" fill="url(#pb-meadow-fade)" />
          </mask>
        </defs>

        {/* ── Sky ──
            Built from overlapping angled strokes rather than one flat field.
            Each ellipse is a loaded brush dragged across the canvas; the
            turbulence tears their edges so they overlap like wet paint. */}
        <g mask="url(#pb-sky-mask)">
          <g filter="url(#pb-brush)">
            <rect x="-14" y="-16" width="128" height="58" fill="url(#pb-sky)" />
            {/* The swirl gathering weight toward the upper right. */}
            <ellipse
              cx="78"
              cy="4"
              rx="42"
              ry="17"
              fill="var(--color-sky-deep)"
              opacity="0.6"
              transform="rotate(-12 78 4)"
            />
            <ellipse
              cx="34"
              cy="-2"
              rx="38"
              ry="13"
              fill="var(--color-sky)"
              opacity="0.5"
              transform="rotate(8 34 -2)"
            />
            <ellipse
              cx="62"
              cy="20"
              rx="30"
              ry="9"
              fill="var(--color-sky-deep)"
              opacity="0.3"
              transform="rotate(-20 62 20)"
            />
          </g>
          {/* Pale wisps raked across, on their own finer brush. */}
          <g filter="url(#pb-wisp)">
            <ellipse
              cx="56"
              cy="12"
              rx="36"
              ry="3.6"
              fill="var(--color-sky-pale)"
              opacity="0.8"
              transform="rotate(-7 56 12)"
            />
            <ellipse
              cx="28"
              cy="23"
              rx="27"
              ry="2.6"
              fill="var(--color-sky-pale)"
              opacity="0.6"
              transform="rotate(5 28 23)"
            />
            <ellipse
              cx="84"
              cy="29"
              rx="24"
              ry="2.2"
              fill="var(--color-sky-pale)"
              opacity="0.5"
              transform="rotate(-14 84 29)"
            />
          </g>
        </g>

        {/* ── Meadow ──
            Built as a rising bank rather than a flat band: a deep body of
            colour, a lit shoulder where the sun catches it, and a darker
            shadow in the hollow. The crest sits well above the fold so the
            field reads as land you're standing in, not a stripe at the base. */}
        <g mask="url(#pb-meadow-mask)">
          <g filter="url(#pb-brush)">
            <ellipse cx="50" cy="96" rx="92" ry="48" fill="url(#pb-meadow)" />
            {/* Lit crest, swelling toward the left. */}
            <ellipse
              cx="24"
              cy="84"
              rx="54"
              ry="26"
              fill="var(--color-meadow-light)"
              opacity="0.8"
              transform="rotate(-5 24 84)"
            />
            {/* Deeper green in the hollow on the right. */}
            <ellipse
              cx="82"
              cy="94"
              rx="42"
              ry="22"
              fill="var(--color-meadow-deep)"
              opacity="0.55"
              transform="rotate(6 82 94)"
            />
            {/* A near band of grass at the very foot of the frame. */}
            <ellipse cx="58" cy="112" rx="80" ry="24" fill="var(--color-meadow-deep)" opacity="0.4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
