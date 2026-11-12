import { FINISHED, FINISHED_YEAR, READING } from "@/content/site";
import { SectionHead } from "./SectionHead";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The reading list set as one running paragraph of titles, each carrying its
 * author like a citation. Hover a title and the rest of the shelf steps back.
 */
export function Read() {
  return (
    <section id="read" className="pb-[clamp(5rem,12vw,11rem)]">
      <SectionHead index="03" title="Read" tally={`${pad(FINISHED.length)} finished · ${pad(READING.length)} open`} />

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
            <p
              data-reveal
              className="shelf border-t border-ink pt-5 font-serif text-[clamp(2rem,5.4vw,5.5rem)] leading-[1.02] tracking-[-0.025em]"
            >
              {FINISHED.map((b, i) => (
                <span key={b.title} className="book">
                  <span className={i % 2 ? "italic" : ""}>{b.title}</span>
                  <span className="label ml-[0.6em] whitespace-nowrap align-[0.9em] tracking-[0.1em] text-muted">
                    {b.author}
                  </span>
                  {i < FINISHED.length - 1 && (
                    <span aria-hidden="true" className="mx-[0.25em] font-normal not-italic text-pen">
                      /
                    </span>
                  )}{" "}
                </span>
              ))}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
