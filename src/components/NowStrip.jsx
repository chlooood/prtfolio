import Reveal from './Reveal.jsx';
import { NOW } from '../content/me.js';

/**
 * NowStrip — the standing "what's true today" band.
 *
 * Three cells: where she is, what she's reading, what she's building. This is
 * the one part of the page that dates quickly by design, which is the point —
 * a personal site that can't answer "what are you up to right now" is just a
 * résumé with better margins.
 *
 * Each cell renders only if its data exists, so a half-filled NOW block
 * degrades to a narrower strip rather than a row of empty boxes.
 */
export default function NowStrip() {
  const { basedIn, currentlyIn, reading, building } = NOW;

  // `reading` accepts either a single book or a list — two at once is normal.
  // Normalising here means the field can be edited either way in me.js without
  // the component caring.
  const reads = (Array.isArray(reading) ? reading : [reading])
    .filter((book) => book?.title)
    .slice(0, 2);

  const hasBuilding = Boolean(building?.title);

  return (
    <Reveal>
      <aside
        aria-label="Currently"
        className="grid gap-px overflow-hidden rounded-round border border-rule-2 bg-rule-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_minmax(0,1.2fr)]"
      >
        {/* ── Where ── */}
        <Cell label="Where">
          <p className="text-base leading-snug text-ink">
            Based in <Strong>{basedIn}</Strong>
            {currentlyIn && currentlyIn !== basedIn && (
              <>
                ,<br />
                currently in <Strong>{currentlyIn}</Strong>
              </>
            )}
          </p>
        </Cell>

        {/* ── Reading ── */}
        <Cell label="Reading">
          {reads.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {reads.map((book) => (
                <li key={book.title}>
                  <p className="text-base leading-snug text-ink">
                    {book.url ? (
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-gold decoration-1 underline-offset-4 transition-colors duration-fast hover:text-accent"
                      >
                        <Strong>{book.title}</Strong>
                      </a>
                    ) : (
                      <Strong>{book.title}</Strong>
                    )}
                    {book.author && <span className="text-ink-2"> · {book.author}</span>}
                  </p>
                  <ProgressBar pages={book.pages} of={book.of} />
                </li>
              ))}
            </ul>
          ) : (
            <Pending>Current book pending</Pending>
          )}
        </Cell>

        {/* ── Building ──
            Spans both columns at the 2-up breakpoint: three cells in a 2-col
            grid would otherwise leave a fourth slot showing the container's
            background as an empty grey box. */}
        <Cell label="Building" className="sm:col-span-2 lg:col-span-1">
          {hasBuilding ? (
            <>
              <p className="text-base leading-snug text-ink">
                {building.url ? (
                  <a
                    href={building.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-gold decoration-1 underline-offset-4 transition-colors duration-fast hover:text-accent"
                  >
                    <Strong>{building.title}</Strong>
                  </a>
                ) : (
                  <Strong>{building.title}</Strong>
                )}
              </p>
              {building.stack?.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {building.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Pending>Current project pending</Pending>
          )}
        </Cell>
      </aside>
    </Reveal>
  );
}

function Cell({ label, children, className = '' }) {
  return (
    <div className={`flex flex-col bg-paper-2 px-m py-m ${className}`.trim()}>
      <p className="mb-2.5 font-display text-xs tracking-label text-muted uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function Strong({ children }) {
  return <span className="font-medium text-ink">{children}</span>;
}

function Pending({ children }) {
  return <p className="text-base text-muted italic">{children}</p>;
}

/**
 * Reading progress. Exposed as a real progressbar to assistive tech — the
 * visual bar alone communicates nothing to a screen reader.
 */
function ProgressBar({ pages, of }) {
  if (!of || of <= 0) return null;

  const pct = Math.max(0, Math.min(100, Math.round((pages / of) * 100)));

  // Sits under its own book now that two can stack, so no auto-margin.
  return (
    <div className="mt-2">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Reading progress: page ${pages} of ${of}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-paper-3"
      >
        <div
          className="h-full rounded-full bg-sage transition-[width] duration-slow ease-out-quiet"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted tabular-nums">
        page {pages} of {of} · {pct}%
      </p>
    </div>
  );
}
