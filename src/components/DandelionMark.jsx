/**
 * DandelionMark — the site mark beside the wordmark.
 *
 * One 11s cycle, in two acts: the white seed clock opens outward from its
 * parachute, then gives way to the yellow flower blossoming in its place.
 * (Botanically it runs the other way — a bloom becomes a clock — but as a mark
 * the clock-into-blossom direction is the better reveal, so that's the order.)
 *
 * On why it's drawn this way: a radially symmetric starburst with no stem
 * reads as a snowflake. Three things fix that, and all three are load-bearing —
 *   · the stem is permanent (a dandelion sits on a stem; a snowflake floats),
 *   · a leaf breaks the symmetry and says "plant",
 *   · the crown is dense and fine-stroked with tufted tips, so it reads as a
 *     soft sphere rather than a ring of discrete spokes.
 *
 * CSS-driven on purpose — this is a handful of elements animating opacity and
 * scale. Pulling it into the seed layer's physics loop would mean running that
 * loop for the header even when the field is switched off. Under
 * `prefers-reduced-motion` the cycle is dropped and the mark renders as the
 * finished yellow flower.
 */

const ARCS = 4;
const BRISTLES = 32;
const PETALS = 26;

export default function DandelionMark({ className = '' }) {
  const cx = 15;
  const cy = 12;
  const radius = 9.6;

  /* ── The seed clock ── */
  const bristles = Array.from({ length: BRISTLES }, (_, i) => {
    const angle = -180 + (i * 360) / BRISTLES;
    const rad = (angle * Math.PI) / 180;
    // Bow each bristle perpendicular to its direction so it curves like a hair.
    const bow = ((i % 2 === 0 ? 1 : -1) * radius) / 6;
    const midR = radius * 0.56;
    const cpx = cx + Math.cos(rad) * midR - Math.sin(rad) * bow;
    const cpy = cy + Math.sin(rad) * midR + Math.cos(rad) * bow;
    // Slight length jitter keeps the silhouette off a perfect circle.
    const r = radius * (i % 3 === 0 ? 0.9 : i % 3 === 1 ? 1 : 0.96);
    const ex = cx + Math.cos(rad) * r;
    const ey = cy + Math.sin(rad) * r;
    const fromTop = Math.abs(((angle + 90 + 540) % 360) - 180);
    return { d: `M${cx} ${cy} Q${cpx} ${cpy} ${ex} ${ey}`, ex, ey, fromTop, key: i };
  }).sort((a, b) => b.fromTop - a.fromTop);

  const perArc = Math.ceil(bristles.length / ARCS);
  const arcGroups = Array.from({ length: ARCS }, (_, a) =>
    bristles.slice(a * perArc, (a + 1) * perArc),
  );

  /* ── The bloom ──
     A dandelion flower is a dense head of narrow strap-shaped ray florets, not
     a daisy with a few broad petals. Two rings of many short rays is what sells
     it at this size. */
  const rays = (ring) => {
    const n = ring === 0 ? PETALS : Math.round(PETALS * 0.7);
    const inner = ring === 0 ? 1.6 : 1.1;
    const outer = ring === 0 ? 8.6 : 6.1;
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
    <svg
      viewBox="0 0 30 34"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`dl-mark ${className}`.trim()}
    >
      {/* Stem — permanent, and the main reason this reads as a dandelion. */}
      <path
        d={`M${cx} ${cy + 1} Q${cx + 1.4} ${cy + 11} ${cx - 0.8} ${cy + 21}`}
        stroke="var(--color-sage)"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* A single leaf, low on the stem, to break the radial symmetry. */}
      <path
        d={`M${cx + 0.6} ${cy + 14} Q${cx - 4.6} ${cy + 12.2} ${cx - 6.2} ${cy + 15.4}
            Q${cx - 2.8} ${cy + 17.6} ${cx + 0.6} ${cy + 14} Z`}
        fill="var(--color-sage)"
        opacity="0.5"
      />

      {/* ── Act one · the seed clock ── */}
      <g className="dl-mark__clock">
        {arcGroups.map((group, a) => (
          <g key={a} className="dl-mark__arc" style={{ '--arc': a }}>
            <g stroke="var(--color-sage)" strokeWidth="0.4" strokeLinecap="round" opacity="0.7">
              {group.map(({ d, key }) => (
                <path key={key} d={d} />
              ))}
            </g>
            {/* Tufted tips — the soft outer edge of the clock. */}
            {group.map(({ ex, ey, key }) => (
              <circle key={key} cx={ex} cy={ey} r="0.62" fill="var(--color-sage)" opacity="0.3" />
            ))}
          </g>
        ))}
        <circle cx={cx} cy={cy} r="1.15" fill="var(--color-sage)" opacity="0.6" />
      </g>

      {/* ── Act two · the bloom ── */}
      <g className="dl-mark__bloom">
        <g stroke="var(--color-bloom-deep)" strokeWidth="1.15" strokeLinecap="round" opacity="0.8">
          {rays(1).map(({ x1, y1, x2, y2, key }) => (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g stroke="var(--color-bloom)" strokeWidth="1.05" strokeLinecap="round">
          {rays(0).map(({ x1, y1, x2, y2, key }) => (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r="2.1" fill="var(--color-bloom-deep)" />
        <circle cx={cx} cy={cy} r="1.1" fill="var(--color-bloom)" />
      </g>
    </svg>
  );
}
