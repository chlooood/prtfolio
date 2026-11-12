import { FINISHED, FINISHED_YEAR, READING } from "@/content/site";
import { SectionHead } from "./SectionHead";

const pad = (n: number) => String(n).padStart(2, "0");

/* Pigments and heights cycle, so the shelf looks hand-arranged at any length. */
const PIGMENTS = ["#6b93b3", "#cf5f37", "#5c8a66", "#b78a3a", "#8573a8", "#3f6a63"];
const HEIGHTS = [92, 100, 76, 96, 84, 100];

/**
 * A painted spine: a rectangle of watercolour (wet edge, granulation, a
 * second pass where the brush overlapped) with the title set up its length.
 */
function Spine({ title, author, i }: { title: string; author: string; i: number }) {
  const color = PIGMENTS[i % PIGMENTS.length];
  const id = `spine-${i}`;
  return (
    <li
      className="book group relative min-w-0 flex-1 transition-transform duration-700 ease-[var(--ease-expo)] hover:-translate-y-3"
      style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%` }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 400"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible mix-blend-multiply"
      >
        <defs>
          <filter id={id} x="-10%" y="-4%" width="120%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.006" numOctaves="3" seed={i * 7 + 3} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G" result="wet" />
            <feTurbulence type="fractalNoise" baseFrequency="0.4 0.1" numOctaves="3" seed={i * 5 + 11} result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.2" result="mask" />
            <feComposite in="wet" in2="mask" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${id})`} fill={color}>
          <rect x="5" y="5" width="90" height="395" opacity="0.6" />
          <rect x="14" y="40" width="72" height="330" opacity="0.32" />
          <rect x="5" y="5" width="90" height="395" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
          {/* bands, like cloth binding */}
          <rect x="5" y="30" width="90" height="5" opacity="0.5" />
          <rect x="5" y="368" width="90" height="5" opacity="0.5" />
        </g>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center py-[12%] [writing-mode:vertical-rl]">
        <span className="rotate-180 text-center font-serif text-[clamp(1.0625rem,2.3vw,2.25rem)] leading-[1.05] tracking-[-0.01em] text-ink">
          {title}
          <span className="label mt-[1em] block text-[0.5625rem] tracking-[0.12em] text-ink/75 md:text-[0.6875rem]">
            {author}
          </span>
        </span>
      </span>
    </li>
  );
}

export function Read() {
  return (
    <section id="read" className="pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead index="02" title="Read" tally={`${pad(FINISHED.length)} finished · ${pad(READING.length)} open`} />

      <div className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-4 gap-x-4 gap-y-14 px-[var(--pad)] md:grid-cols-12 md:gap-x-6">
        {READING.length > 0 && (
          <div className="col-span-4 md:col-span-3">
            <p className="label mb-4 flex items-center gap-2 text-pen">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-pen" /> Open on the desk
            </p>
            <ul className="border-t border-ink">
              {READING.map((b) => (
                <li key={b.title} data-reveal className="border-b border-rule py-4">
                  <p className="font-serif text-2xl italic leading-tight">{b.title}</p>
                  <p className="label mt-2 text-muted">{b.author}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {FINISHED.length > 0 && (
          <div className="col-span-4 md:col-span-9">
            <p className="label mb-4 text-muted">Finished, {FINISHED_YEAR}</p>
            <ul
              data-reveal
              className="shelf flex h-[clamp(24rem,40vw,34rem)] items-end gap-[clamp(0.375rem,1vw,1rem)] border-b-2 border-ink px-[2%] pt-4"
            >
              {FINISHED.map((b, i) => (
                <Spine key={b.title} title={b.title} author={b.author} i={i} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
