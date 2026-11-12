import { FINISHED, FINISHED_YEAR, READING } from "@/content/site";
import { Paper, SheetHead } from "./Paper";

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
const LEAN = [-1.2, 0.6, -0.4, 1.4, -0.8, 0.3];

/**
 * The reading list as a shelf of cut-paper spines — bands of colour, like the
 * land outside. Each lifts when touched and the rest step back.
 */
export function Read() {
  return (
    <section id="read" className="px-[var(--pad)] pt-[clamp(10rem,42vh,26rem)]">
      <Paper
        data-sheet
        tilt={0.6}
        className="mx-auto max-w-[72rem] px-[clamp(1.25rem,4vw,4rem)] py-[clamp(2rem,5vw,4.5rem)]"
      >
        <SheetHead
          place="Mile 02"
          title="Read"
          tally={`${pad(FINISHED.length)} finished · ${pad(READING.length)} open`}
        />

        <div className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-12 md:gap-x-8">
          {READING.length > 0 && (
            <div className="col-span-4 md:col-span-3">
              <p className="label mb-4 flex items-center gap-2 text-vermilion">
                <span className="inline-block h-2 w-2 rounded-full bg-vermilion" /> Open on the desk
              </p>
              <ul className="border-t-2 border-ink">
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
                className="shelf flex h-[clamp(24rem,40vw,33rem)] items-end gap-[clamp(0.25rem,0.8vw,0.75rem)] border-b-[3px] border-ink px-[1%]"
              >
                {FINISHED.map((b, i) => {
                  const s = SPINES[i % SPINES.length];
                  return (
                    <Paper
                      as="li"
                      key={b.title}
                      flat
                      tilt={LEAN[i % LEAN.length]}
                      sheet={s.sheet}
                      className={`book min-w-0 flex-1 origin-bottom hover:-translate-y-4 ${s.light ? "text-ink" : "text-cream"}`}
                      style={{ height: `${HEIGHTS[i % HEIGHTS.length]}%`, rotate: `${LEAN[i % LEAN.length]}deg` }}
                    >
                      <span className="absolute inset-x-0 top-[5%] h-[3px] bg-current opacity-50" />
                      <span className="absolute inset-x-0 bottom-[5%] h-[3px] bg-current opacity-50" />
                      <span className="absolute inset-0 flex items-center justify-center py-[14%] [writing-mode:vertical-rl]">
                        <span className="rotate-180 text-center font-serif text-[clamp(1.0625rem,2.3vw,2.125rem)] font-medium leading-[1.05] tracking-[-0.01em]">
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
            </div>
          )}
        </div>
      </Paper>
    </section>
  );
}
