import { CONTACT, NOW, PROFILE } from '../../content/me.js';

/**
 * Colophon — hallmark footer archetype Ft6 (letter close).
 * Signs off rather than sitting the reader in front of four columns of links.
 * The personal register is the point; the links are an afterthought by design.
 */
export default function Colophon() {
  const links = [
    CONTACT.email && { label: 'Email', href: `mailto:${CONTACT.email}` },
    CONTACT.linkedin && { label: 'LinkedIn', href: CONTACT.linkedin },
    CONTACT.github && { label: 'GitHub', href: CONTACT.github },
    CONTACT.resume && { label: 'Résumé', href: CONTACT.resume },
  ].filter(Boolean);

  return (
    <footer className="mt-3xl border-t border-rule bg-gradient-to-b from-paper-3/70 to-paper-3">
      <div className="mx-auto max-w-[78rem] px-5 py-3xl sm:px-8">
        <div className="max-w-[46ch]">
          <p className="font-display text-display-s leading-tight text-ink sm:text-4xl">
            Thanks for reading this far.
          </p>
          <p className="mt-m text-base leading-relaxed text-ink-2">
            More gets added here as it gets built. The writing is where most of
            the thinking ends up.
          </p>

          {links.length > 0 && (
            <ul className="mt-l flex flex-wrap gap-x-6 gap-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer noopener' }
                      : {})}
                    className="group inline-flex items-center gap-2 text-base text-accent no-underline transition-colors duration-fast hover:text-accent-deep"
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className="inline-block text-sm transition-transform duration-base ease-out-quiet group-hover:translate-x-0.5"
                    >
                      &rarr;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3xl flex flex-col gap-2 border-t border-rule-2 pt-m text-xs text-muted sm:flex-row sm:items-baseline sm:justify-between">
          <p>
            {PROFILE.name} · {NOW.basedIn}
          </p>
          <p>Set in Fraunces &amp; Switzer. Built with React.</p>
        </div>
      </div>
    </footer>
  );
}
