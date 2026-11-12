/**
 * The ledger header every section opens with: a ruled line carrying the
 * section number and a tally, then the title set on the width axis.
 * `data-wdth` hands the title to MotionRoot, which opens it up on scroll.
 */
export function SectionHead({
  index,
  title,
  tally,
  children,
  invert = false,
}: {
  index: string;
  title: React.ReactNode;
  tally?: string;
  children?: React.ReactNode;
  invert?: boolean;
}) {
  return (
    <header className="px-[var(--pad)]">
      <div
        data-rule
        className={`h-px origin-left ${invert ? "bg-paper/25" : "bg-ink"}`}
      />
      <div
        className={`label flex items-baseline justify-between pt-3 ${invert ? "text-paper/70" : "text-muted"}`}
      >
        <span>§ {index}</span>
        {tally && <span>{tally}</span>}
      </div>
      <h2
        data-wdth
        className="display mt-[clamp(2rem,6vw,5rem)] text-[clamp(3.5rem,14.5vw,15rem)]"
      >
        {title}
      </h2>
      {children}
    </header>
  );
}
