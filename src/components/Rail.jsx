import Reveal from './Reveal.jsx';

/**
 * Rail — the Ecosystem Index divider language.
 * Each discovery surface is a titled band: a numbered serif label on the left,
 * an optional "see more" at the far edge, a hairline underneath, then the
 * surface's own content. The numbering is what makes the page read as an index
 * rather than a stack of marketing sections.
 */
export default function Rail({ number, title, action, children }) {
  return (
    <section className="border-t border-rule pt-m">
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="flex items-baseline gap-4 text-base">
            <span
              aria-hidden="true"
              className="font-display text-xs tracking-label text-muted tabular-nums"
            >
              {String(number).padStart(2, '0')}
            </span>
            <span className="font-display text-xs font-medium tracking-label text-ink uppercase">
              {title}
            </span>
          </h2>
          {action}
        </div>
      </Reveal>

      <div className="mt-l">{children}</div>
    </section>
  );
}
