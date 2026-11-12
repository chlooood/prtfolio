import { ERRATA } from "@/content/site";
import { PlaceholderTag } from "./Cite";
import { SectionHead } from "./SectionHead";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "What I got wrong." Corrections, set the way a publication prints them:
 * the original claim struck through, the correction beside it in red.
 * Until entries exist in site.ts, ruled placeholder rows hold the space.
 */
export function Errata() {
  const empty = ERRATA.length === 0;
  const rows = empty ? [null, null, null] : ERRATA;

  return (
    <section id="errata" className="pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead index="05" title="Errata" tally={empty ? "Awaiting entries" : `${pad(ERRATA.length)} corrections`} />

      <div className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-4 gap-x-4 px-[var(--pad)] md:grid-cols-12 md:gap-x-6">
        <p className="col-span-4 mb-10 font-serif text-[clamp(1.375rem,2.2vw,2rem)] italic leading-tight text-ink-2 md:col-span-3 md:mb-0">
          What I got wrong, on the record.
        </p>

        <ol className="col-span-4 border-t border-ink md:col-span-9">
          {rows.map((e, i) => (
            <li
              key={i}
              data-reveal
              className="grid grid-cols-4 gap-x-4 gap-y-3 border-b border-rule py-6 md:grid-cols-9 md:gap-x-6"
            >
              <span className="label col-span-4 text-muted md:col-span-1">{pad(i + 1)}</span>
              {e ? (
                <>
                  <p className="col-span-4 text-[1.25rem] leading-snug text-ink-2 line-through decoration-pen decoration-1 md:col-span-4">
                    {e.claim}
                  </p>
                  <p className="col-span-4 font-serif text-[1.25rem] italic leading-snug text-pen md:col-span-4">
                    {e.correction}
                  </p>
                </>
              ) : (
                <>
                  <p className="col-span-4 text-[1.25rem] leading-snug text-ink/35 line-through decoration-pen decoration-1 md:col-span-4">
                    Something you believed.
                  </p>
                  <p className="col-span-4 font-serif text-[1.25rem] italic leading-snug text-ink/35 md:col-span-4">
                    What corrected it.
                  </p>
                </>
              )}
            </li>
          ))}
        </ol>
        {empty && (
          <p className="col-span-4 mt-4 md:col-span-9 md:col-start-4">
            <PlaceholderTag>Placeholder rows — add entries to ERRATA in src/content/site.ts</PlaceholderTag>
          </p>
        )}
      </div>
    </section>
  );
}
