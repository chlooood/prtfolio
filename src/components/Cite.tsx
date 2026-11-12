import { CITATIONS } from "@/content/site";

/**
 * A footnote marker. Hover or focus shows the note in place on desktop;
 * activating it jumps to the full list in the colophon, which links back.
 */
export function Cite({ n }: { n: number }) {
  const note = CITATIONS[n - 1];
  if (!note) return null;
  return (
    <span className="cite">
      <a id={`cite-ref-${n}`} href={`#cite-${n}`} aria-label={`Footnote ${n}`}>
        {n}
      </a>
      <span className="cite-tip" aria-hidden="true">
        {note}
      </span>
    </span>
  );
}

export function PlaceholderTag({ children = "Placeholder" }: { children?: React.ReactNode }) {
  return <span className="ph-tag">{children}</span>;
}
