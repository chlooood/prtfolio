/**
 * A single loaded brushstroke of watercolour, drawn with SVG filters: the
 * shape is displaced by low-frequency noise for a wet edge, then broken up
 * by fine noise for granulation. Overlapping passes multiply, so the stroke
 * is darker where the "brush" went over itself.
 */
export function Swatch({
  color,
  seed = 1,
  className = "",
}: {
  color: string;
  seed?: number;
  className?: string;
}) {
  const id = `wc-${seed}`;
  return (
    <svg
      viewBox="0 0 240 120"
      aria-hidden="true"
      className={className}
      style={{ mixBlendMode: "multiply", overflow: "visible" }}
    >
      <defs>
        <filter id={id} x="-15%" y="-25%" width="130%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014 0.03" numOctaves="3" seed={seed} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" xChannelSelector="R" yChannelSelector="G" result="wet" />
          <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="3" seed={seed + 7} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.75 1.18" result="mask" />
          <feComposite in="wet" in2="mask" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} fill={color}>
        <path d="M14 66 C40 34 96 30 150 38 C190 44 224 50 228 62 C230 80 190 92 140 92 C90 94 30 96 14 66Z" opacity="0.5" />
        <path d="M30 64 C60 44 110 42 160 48 C196 52 212 58 210 66 C204 80 160 84 120 84 C80 86 40 84 30 64Z" opacity="0.42" />
        <path
          d="M14 66 C40 34 96 30 150 38 C190 44 224 50 228 62 C230 80 190 92 140 92 C90 94 30 96 14 66Z"
          fill="none"
          stroke={color}
          strokeWidth="3"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
