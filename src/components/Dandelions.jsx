import { useEffect, useRef } from 'react';
import { DANDELIONS } from '../content/site.js';

/**
 * Dandelions — the ambient seed layer.
 *
 * Each seed enters the viewport as a lone parachute and fills out into a
 * complete clock as it crosses, then respawns as a seed again. The morph is
 * the point of the layer: a field of static shapes is decoration, whereas a
 * field of things visibly becoming something reads as a place with weather in
 * it.
 *
 * On hallmark's motion rules — it bans parallax, scroll-scrubbed animation and
 * infinite loops ("they pull the eye and never let go"). This is a deliberate,
 * user-directed exception built to defuse each objection:
 *   · Not parallax — independent objects with their own drift, not background
 *     planes moving at fractional scroll rates.
 *   · Not scroll-scrubbed — scroll adds an impulse to a physics loop that
 *     settles on its own; nothing is keyed to scroll offset.
 *   · The loop is invisible — seeds respawn at randomised positions with
 *     randomised lifespans, so there's no cycle to lock onto.
 *   · Peak opacity is 0.38 on the nearest plane; text always wins.
 *
 * Rendering bypasses React entirely. Positions and per-arc opacities are
 * written straight to `style` inside one rAF loop — re-rendering fourteen
 * components at 60fps would cost far more than the effect is worth.
 */

/* Three depth planes. Far seeds are small, faint, blurred and slow; near ones
   large, sharp and quick. This is what turns a flat scatter of shapes into
   something that reads as air with depth in it. */
const PLANES = [
  { scale: 0.5, opacity: 0.2, blur: 1.4, speed: 0.45 },
  { scale: 0.82, opacity: 0.3, blur: 0.4, speed: 0.8 },
  { scale: 1.25, opacity: 0.38, blur: 0, speed: 1.25 },
];

const BRISTLES = 13;
const PETALS = 20;

/* Maturity is measured in distance travelled, not elapsed time, so a seed's
   morph is locked to its journey across the page rather than to a clock that
   can finish early. A seed matures over this fraction of a viewport height —
   under 1 so the bloom always completes before the seed leaves the screen. */
const JOURNEY = 0.72;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function Dandelions() {
  const seedRefs = useRef([]);
  const frameRef = useRef(0);

  const { mode, count } = DANDELIONS;

  useEffect(() => {
    if (mode === 'off') return undefined;

    // Reduced motion outranks the config: no drift, no seeds, no exceptions.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const nodes = seedRefs.current.filter(Boolean);
    if (nodes.length === 0) return undefined;

    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const seeds = nodes.map((node, i) => {
      const plane = PLANES[i % PLANES.length];
      return {
        node,
        plane,
        seedArt: node.querySelector('[data-seed]'),
        bloomArt: node.querySelector('[data-bloom]'),
        x: Math.random() * vw,
        y: Math.random() * vh,
        // Tuned so a crossing runs ~40s on the near plane and ~110s on the far
        // one. Slower than this and the morph outlasts the visit; faster and
        // the field starts competing with the text.
        vx: (0.44 + Math.random() * 0.5) * plane.speed,
        vy: (-0.38 - Math.random() * 0.44) * plane.speed,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.0005 + Math.random() * 0.0007,
        swayAmount: (9 + Math.random() * 16) * plane.speed,
        // A slow tumble, not a spin: more than a few degrees a second looks
        // mechanical rather than carried.
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        // Maturity, 0 → 1, advanced by distance travelled. Every seed starts
        // below the 0.5 handover point, so all of them are seen as seeds first
        // and every one visibly blossoms. The spread staggers them so the
        // field never turns over in unison.
        life: Math.random() * 0.4,
      };
    });

    let scrollImpulse = 0;
    let lastScrollY = window.scrollY;

    function onScroll() {
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Clamped so a trackpad fling can't launch the field off-screen.
      scrollImpulse += Math.max(-40, Math.min(40, delta)) * 0.06;
    }

    if (mode === 'scroll') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /** Respawn as a bare seed somewhere off the edge it just left. */
    function reseed(seed, edge) {
      const margin = 80;
      if (edge === 'top') {
        seed.y = vh + margin;
        seed.x = Math.random() * vw;
      } else if (edge === 'bottom') {
        seed.y = -margin;
        seed.x = Math.random() * vw;
      } else {
        seed.x = -margin;
        seed.y = Math.random() * vh;
      }
      seed.life = 0;
    }

    let journeyLen = (vh + 160) * JOURNEY;
    let last = performance.now();

    function tick(now) {
      // Normalised against a 60fps frame so drift is refresh-rate independent.
      const dt = Math.min(32, now - last) / 16.67;
      last = now;

      // Bleeds off over roughly half a second, so the field settles back to its
      // resting drift instead of coasting.
      scrollImpulse *= Math.pow(0.88, dt);

      for (const seed of seeds) {
        const { plane } = seed;

        seed.swayPhase += seed.swaySpeed * dt * 16.67;
        const dx = seed.vx * dt;
        // Depth scales the scroll response too — near seeds react hardest.
        const dy = (seed.vy - scrollImpulse * plane.speed) * dt;
        seed.x += dx;
        seed.y += dy;
        seed.rot += (seed.rotSpeed + scrollImpulse * 0.09) * dt;
        // Distance-driven, so scrolling a seed across the page also ages it —
        // the bloom is something the seed's journey does, not something a
        // timer does to it.
        seed.life = Math.min(1, seed.life + Math.hypot(dx, dy) / journeyLen);

        const margin = 80;
        if (seed.y < -margin) reseed(seed, 'top');
        else if (seed.y > vh + margin) reseed(seed, 'bottom');
        else if (seed.x > vw + margin) reseed(seed, 'side');

        // Maturity runs the two acts. The seed flies for the first half of its
        // life, then hands over to the flower — the crossfade overlaps by a
        // little so there's never a frame with neither on screen.
        const p = seed.life;
        if (seed.seedArt) {
          seed.seedArt.style.opacity = String(clamp01((0.62 - p) / 0.18));
        }
        if (seed.bloomArt) {
          seed.bloomArt.style.opacity = String(clamp01((p - 0.5) / 0.2));
        }

        // A gentle swell as it matures — a bloom is bodily larger than the
        // seed that became it.
        const grow = plane.scale * (0.66 + 0.34 * p);
        const sway = Math.sin(seed.swayPhase) * seed.swayAmount;
        seed.node.style.transform = `translate3d(${seed.x + sway}px, ${seed.y}px, 0) rotate(${seed.rot}deg) scale(${grow})`;
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    function onResize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      journeyLen = (vh + 160) * JOURNEY;
      for (const seed of seeds) {
        seed.x = Math.random() * vw;
        seed.y = Math.random() * vh;
      }
    }
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      if (mode === 'scroll') window.removeEventListener('scroll', onScroll);
    };
  }, [mode]);

  if (mode === 'off') return null;

  return (
    <div
      aria-hidden="true"
      className={[
        'pointer-events-none fixed inset-0 z-0 overflow-hidden',
        mode === 'hero'
          ? '[mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_85%)]'
          : '',
      ].join(' ')}
    >
      <Defs />

      {Array.from({ length: count }, (_, i) => {
        const plane = PLANES[i % PLANES.length];
        return (
          <span
            key={i}
            ref={(node) => {
              seedRefs.current[i] = node;
            }}
            className="absolute top-0 left-0 will-change-transform"
            style={{
              opacity: plane.opacity,
              filter: plane.blur ? `blur(${plane.blur}px)` : undefined,
            }}
          >
            <Dandelion seed={i} />
          </span>
        );
      })}
    </div>
  );
}

/**
 * Shared gradient definitions. One hidden <svg> holds them and every seed
 * references them by fragment id — SVG paint references resolve document-wide,
 * so this costs one node instead of fourteen copies.
 */
function Defs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {/* Bristles fade toward their tips, which is what makes the crown look
            feathery rather than drawn with a compass. */}
        <linearGradient id="dl-filament" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0.95" />
          <stop offset="65%" stopColor="var(--color-sage)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-paper-2)" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="dl-halo">
          <stop offset="0%" stopColor="var(--color-paper-2)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--color-paper-2)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-paper-2)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * One drifting dandelion, in two acts.
 *
 * Act one is an unmistakable flying seed: a parachute of bristles over a
 * trailing stalk and achene. Act two is the yellow flower. The rAF loop
 * crossfades between the two groups as the seed matures, so a seed visibly
 * becomes a bloom on its way across the page.
 *
 * The stalk stays put through act one — a bare radial crown with nothing
 * hanging off it reads as a snowflake, which is the failure this shape is
 * drawn to avoid.
 */
function Dandelion({ seed = 0 }) {
  const cx = 16;
  const cy = 13;
  const radius = 8.4 + (seed % 3) * 0.7;

  // Parachute: bristles over the top ~200°, curved and tufted.
  const bristles = Array.from({ length: BRISTLES }, (_, i) => {
    const angle = -192 + (i * 204) / (BRISTLES - 1);
    const rad = (angle * Math.PI) / 180;
    const bow = ((i % 2 === 0 ? 1 : -1) * radius) / 6;
    const midR = radius * 0.55;
    const cpx = cx + Math.cos(rad) * midR - Math.sin(rad) * bow;
    const cpy = cy + Math.sin(rad) * midR + Math.cos(rad) * bow;
    const ex = cx + Math.cos(rad) * radius;
    const ey = cy + Math.sin(rad) * radius;
    return { d: `M${cx} ${cy} Q${cpx} ${cpy} ${ex} ${ey}`, ex, ey, key: i };
  });

  // Bloom: two offset rings of narrow ray florets.
  const rays = (ring) => {
    const n = ring === 0 ? PETALS : Math.round(PETALS * 0.7);
    const inner = ring === 0 ? 1.4 : 1;
    const outer = ring === 0 ? 8 : 5.7;
    const offset = ring === 0 ? 0 : 180 / n;
    return Array.from({ length: n }, (_, i) => {
      const rad = ((offset + (i * 360) / n) * Math.PI) / 180;
      const jitter = i % 3 === 0 ? 0.88 : i % 3 === 1 ? 1 : 0.94;
      return {
        x1: cx + Math.cos(rad) * inner,
        y1: cy + Math.sin(rad) * inner,
        x2: cx + Math.cos(rad) * outer * jitter,
        y2: cy + Math.sin(rad) * outer * jitter,
        key: i,
      };
    });
  };

  return (
    <svg width="32" height="34" viewBox="0 0 32 34" fill="none" focusable="false">
      {/* ── Act one · the flying seed ── */}
      <g data-seed>
        <ellipse cx={cx} cy={cy - 1} rx={radius} ry={radius - 1.5} fill="url(#dl-halo)" />
        <g stroke="url(#dl-filament)" strokeWidth="0.42" strokeLinecap="round">
          {bristles.map(({ d, key }) => (
            <path key={key} d={d} />
          ))}
        </g>
        {bristles.map(({ ex, ey, key }) => (
          <circle key={key} cx={ex} cy={ey} r="0.4" fill="var(--color-paper-2)" opacity="0.75" />
        ))}
        {/* Stalk and achene, trailing behind the parachute. */}
        <path
          d={`M${cx} ${cy + 0.6} Q${cx + 1.3} ${cy + 8} ${cx - 0.6} ${cy + 16}`}
          stroke="var(--color-sage)"
          strokeWidth="0.45"
          strokeLinecap="round"
          opacity="0.55"
        />
        <ellipse
          cx={cx - 0.6}
          cy={cy + 16.4}
          rx="0.7"
          ry="1.5"
          fill="var(--color-sage)"
          opacity="0.65"
        />
      </g>

      {/* ── Act two · the bloom ── */}
      <g data-bloom style={{ opacity: 0 }}>
        <g stroke="var(--color-bloom-deep)" strokeWidth="1.05" strokeLinecap="round" opacity="0.85">
          {rays(1).map(({ x1, y1, x2, y2, key }) => (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g stroke="var(--color-bloom)" strokeWidth="0.95" strokeLinecap="round">
          {rays(0).map(({ x1, y1, x2, y2, key }) => (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r="1.9" fill="var(--color-bloom-deep)" />
        <circle cx={cx} cy={cy} r="1" fill="var(--color-bloom)" />
      </g>
    </svg>
  );
}
