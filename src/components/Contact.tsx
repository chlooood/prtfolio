import { CITATIONS, CONTACT, PROFILE } from "@/content/site";
import { Landscape } from "./Landscape";

/**
 * The end of the page: the footnotes, then the opening view by moonlight with
 * the name set over the night sky. Links live quietly in the last line.
 */
export function Contact() {
  const links = [
    CONTACT.email && { label: "Email", href: `mailto:${CONTACT.email}` },
    CONTACT.linkedin && { label: "LinkedIn", href: CONTACT.linkedin },
    CONTACT.github && { label: "GitHub", href: CONTACT.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer id="contact" className="bg-ink pt-[clamp(4rem,8vw,7rem)] text-paper">
      <section
        aria-labelledby="citations-title"
        className="grid grid-cols-4 gap-x-4 px-[var(--pad)] md:grid-cols-12 md:gap-x-6"
      >
        <h2 id="citations-title" className="label col-span-4 mb-6 text-paper/70 md:col-span-3">
          Citations
        </h2>
        <ol className="col-span-4 space-y-4 md:col-span-7">
          {CITATIONS.map((c, i) => (
            <li
              key={i}
              id={`cite-${i + 1}`}
              className="grid scroll-mt-24 grid-cols-[2.5rem_1fr] font-serif text-[1.0625rem] leading-snug text-paper/85 target:text-pen-soft"
            >
              <span className="label pt-1 text-pen-soft">{i + 1}</span>
              <span>
                {c}{" "}
                <a
                  href={`#cite-ref-${i + 1}`}
                  aria-label={`Back to reference ${i + 1}`}
                  className="label link ml-1 inline-block px-1 py-1 text-paper/70"
                >
                  ↩
                </a>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Plate III — the opening view, twelve hours on. */}
      <div className="relative mt-[clamp(2rem,5vw,4rem)]">
        <Landscape phase="night" className="block h-[clamp(22rem,60vw,46rem)] w-full" />
        <p
          data-wdth
          aria-hidden="true"
          className="display pointer-events-none absolute inset-x-[var(--pad)] top-[8%] text-[clamp(2.75rem,10.4vw,11rem)] text-paper/90"
        >
          {PROFILE.firstName} {PROFILE.lastName}
        </p>
      </div>

      <div className="label flex flex-col gap-3 border-t border-paper/20 px-[var(--pad)] py-6 text-paper/70 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {PROFILE.firstName} {PROFILE.lastName}
        </p>
        {links.length > 0 && (
          <ul className="flex gap-6">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="link py-2 text-paper"
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                >
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        )}
        <p>
          <a href="#top" className="link">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
