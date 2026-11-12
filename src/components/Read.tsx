import { FINISHED, FINISHED_YEAR, READING } from "@/content/site";
import { CutTitle } from "./CutTitle";
import { Paper } from "./Paper";

const pad = (n: number) => String(n).padStart(2, "0");

/* Spines are cut from the map's own colours. `light` says which take ink. */
const SPINES = [
  { sheet: "var(--color-vermilion)", light: false },
  { sheet: "var(--color-teal)", light: false },
  { sheet: "var(--color-mustard)", light: true },
  { sheet: "var(--color-forest)", light: false },
  { sheet: "var(--color-pink)", light: true },
  { sheet: "var(--color-sea)", light: false },
];
const HEIGHTS = [92, 100, 78, 96, 85, 100];
const LEAN = [-1.6, 0.8, -0.5, 1.8, -1, 4];

/**
 * The reading list, standing straight on the map: a shelf of cut-paper
 * spines with the two open books on a scrap beside it. Each spine lifts when
 * touched and the rest step back.
 */
export function Read() {
  return (
    <section id="read" className="px-[var(--pad)] pt-[clamp(10rem,40vh,24rem)]">
      <CutTitle
        lines={["Read"]}
        label={`Mile 02 · ${pad(FINISHED.length)} finished · ${pad(READING.length)} open`}
        className="md:text-right"
      />

      <div className="mt-[clamp(1.5rem,4vw,3.5rem)] grid grid-cols-1 items-end gap-y-10 md:grid-cols-12 md:gap-x-8">
        {READING.length > 0 && (
          <Paper
            data-sheet
            data-drag
            tilt={-2.2}
            className="px-5 py-5 md:col-span-3 md:mb-[4vw]"
          >
            <p className="label mb-3 flex items-center gap-2 text-vermilion">
              <span className="inline-block h-2 w-2 rounded-full bg-vermilion" /> Open on the desk
            </p>
            <ul className="border-t-2 border-ink">
              {READING.map((b) => (
                <li key={b.title} className="border-b border-rule py-3 last:border-b-0">
                  <p className="font-serif text-2xl italic leading-tight">{b.title}</p>
                  <p className="label mt-2 text-muted">{b.author}</p>
                </li>
              ))}
            </ul>
          </Paper>
        )}

        {FINISHED.length > 0 && (
          <div className="md:col-span-9">
            <p className="mb-5 font-mono text-xs tracking-[.04em] text-ink-2">Finished, {FINISHED_YEAR}</p>
            <ul
              data-reveal
              className="shelf flex h-[clamp(24rem,42vw,36rem)] items-end gap-[clamp(0.25rem,0.9vw,0.875rem)] px-[2%]"
            >
              {FINISHED.map((b, i) => {
                const s = SPINES[i % SPINES.length];
                return (
                  <Paper
                    as="li"
                    key={b.title}
                    tilt={LEAN[i % LEAN.length]}
                    sheet={s.sheet}
                    className={`book min-w-0 flex-1 origin-bottom hover:-translate-y-5 ${s.light ? "text-ink" : "text-cream"}`}
                    style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%` }}
                  >
                    <span className="absolute inset-x-0 top-[5%] h-[3px] bg-current opacity-50" />
                    <span className="absolute inset-x-0 bottom-[5%] h-[3px] bg-current opacity-50" />
                    <span className="absolute inset-0 flex items-center justify-center py-[14%] [writing-mode:vertical-rl]">
                      <span className="rotate-180 text-center font-serif text-[clamp(1.0625rem,2.4vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.01em]">
                        {b.title}
                        <span className="label mt-[1em] block text-[0.5625rem] tracking-[0.12em] opacity-80 md:text-[0.6875rem]">
                          {b.author}
                        </span>
                      </span>
                    </span>
                  </Paper>
                );
              })}
            </ul>
            {/* the shelf itself: one long strip of dark paper */}
            <Paper flat tilt={-0.3} sheet="var(--color-ink)" className="-mx-[1%] h-3">
              <span className="sr-only">Shelf</span>
            </Paper>
          </div>
        )}
      </div>
    </section>
  );
}
