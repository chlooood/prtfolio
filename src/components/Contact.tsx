import { CITATIONS, CONTACT, PROFILE } from "@/content/site";
import { Paper } from "./Paper";

/**
 * The sea. The river opens out until the map is all water; the links float
 * on it as cut-out type, and the footnotes come ashore on one last scrap.
 */
export function Contact() {
  const links = [
    CONTACT.email && { label: "Email", href: `mailto:${CONTACT.email}` },
    CONTACT.linkedin && { label: "LinkedIn", href: CONTACT.linkedin },
    CONTACT.github && { label: "GitHub", href: CONTACT.github },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer id="contact" data-sea className="relative z-10 px-[var(--pad)] pt-[clamp(14rem,70vh,40rem)]">
      <p className="cutout label">The sea · where to find me</p>
      <ul className="mt-4">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="display cutout group inline-flex items-baseline gap-[0.2em] py-1 text-[clamp(3.5rem,13vw,12rem)]"
            >
              <span className="transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-rotate-2 group-hover:translate-x-3 group-focus-visible:translate-x-3">
                {l.label}
              </span>
              <span
                aria-hidden="true"
                className="text-[0.45em] transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-translate-y-[0.3em] group-hover:translate-x-[0.3em]"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>

      <Paper
        as="section"
        data-sheet
        tilt={-0.7}
        aria-labelledby="citations-title"
        className="mt-[clamp(4rem,10vw,8rem)] max-w-[46rem] px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.5rem)]"
      >
        <h2 id="citations-title" className="label mb-5 text-muted">
          Citations
        </h2>
        <ol className="space-y-3">
          {CITATIONS.map((c, i) => (
            <li
              key={i}
              id={`cite-${i + 1}`}
              className="grid scroll-mt-28 grid-cols-[2rem_1fr] font-serif text-[1.0625rem] leading-snug target:text-vermilion"
            >
              <span className="label pt-1 text-vermilion">{i + 1}</span>
              <span>
                {c}{" "}
                <a
                  href={`#cite-ref-${i + 1}`}
                  aria-label={`Back to reference ${i + 1}`}
                  className="label link ml-1 inline-block px-1 py-1 text-muted"
                >
                  ↩
                </a>
              </span>
            </li>
          ))}
        </ol>
      </Paper>

      <div className="cutout label mt-[clamp(3rem,8vw,6rem)] flex flex-col gap-2 pb-8 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {PROFILE.firstName} {PROFILE.lastName}
        </p>
        <p>Painted in code · set in Fraunces &amp; DM Mono</p>
        <p>
          <a href="#top" className="link">
            Back to the source ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
