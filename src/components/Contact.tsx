import { CITATIONS, CONTACT, PROFILE } from "@/content/site";
import { Landscape } from "./Landscape";
import { SectionHead } from "./SectionHead";

/** The closing spread: ink ground, three ways in, and the footnotes. */
export function Contact() {
  const links = [
    CONTACT.email && { label: "Email", href: `mailto:${CONTACT.email}`, text: CONTACT.email },
    CONTACT.linkedin && {
      label: "LinkedIn",
      href: CONTACT.linkedin,
      text: CONTACT.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
    },
    CONTACT.github && {
      label: "GitHub",
      href: CONTACT.github,
      text: CONTACT.github.replace(/^https?:\/\/(www\.)?/, ""),
    },
  ].filter(Boolean) as { label: string; href: string; text: string }[];

  return (
    <footer id="contact" className="bg-ink pt-[clamp(4rem,9vw,8rem)] text-paper">
      <SectionHead
        invert
        index="06"
        title={
          <>
            Find
            <br className="md:hidden" /> me
          </>
        }
        tally="End of ledger"
      />

      <div className="mt-[clamp(2.5rem,6vw,5rem)] grid grid-cols-4 gap-x-4 px-[var(--pad)] md:grid-cols-12 md:gap-x-6">
        {CONTACT.note && (
          <p className="col-span-4 mb-10 font-serif text-[clamp(1.375rem,2.2vw,2rem)] italic leading-tight text-paper/75 md:col-span-3 md:mb-0">
            {CONTACT.note}
          </p>
        )}
        <ul className="col-span-4 border-t border-paper/30 md:col-span-9">
          {links.map((l) => (
            <li key={l.label} data-reveal className="border-b border-paper/20">
              <a
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="group flex items-baseline justify-between gap-6 py-6 md:py-8"
              >
                <span className="stretch display text-[clamp(2.25rem,7vw,7rem)] [--wdth:80] group-hover:[--wdth:125] group-focus-visible:[--wdth:125]">
                  {l.label}
                </span>
                <span className="label flex shrink-0 items-center gap-3 text-paper/70 transition-colors group-hover:text-pen-soft">
                  <span className="hidden sm:inline">{l.text}</span>
                  <span
                    aria-hidden="true"
                    className="text-base transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-1 group-hover:translate-x-1"
                  >
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <section
        aria-labelledby="citations-title"
        className="mt-[clamp(5rem,11vw,10rem)] grid grid-cols-4 gap-x-4 px-[var(--pad)] md:grid-cols-12 md:gap-x-6"
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

      {/* The opening view again, twelve hours later. */}
      <Landscape night className="mt-[clamp(3rem,6vw,5rem)] block h-[clamp(17rem,46vw,34rem)] w-full" />

      <div className="label flex flex-col gap-2 border-t border-paper/20 px-[var(--pad)] py-6 text-paper/70 md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {PROFILE.firstName} {PROFILE.lastName}
        </p>
        <p>Set in Archivo, Newsreader &amp; DM Mono</p>
        <p>
          <a href="#top" className="link">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
