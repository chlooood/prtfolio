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
    <footer className="mt-3xl border-t border-rule bg-paper-3/70">
      <div className="mx-auto max-w-[78rem] px-5 py-2xl sm:px-8">
        <div className="max-w-[46ch]">
          <p className="font-display text-3xl leading-tight text-ink">
            Thanks for reading this far.
          </p>
          {/* No invitation to make contact — there's no inbox published, and an
              invitation with no way to act on it is worse than silence. The
              LinkedIn link below stands on its own. */}
          <p className="mt-m text-base leading-relaxed text-ink-2">
            More gets added here as it gets built. The writing is where most of
            the thinking ends up.
          </p>

          {links.length > 0 && (
            <ul className="mt-l flex flex-wrap gap-x-6 gap-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer noopener' }
                      : {})}
                    className="text-base text-accent underline decoration-gold decoration-1 underline-offset-4 transition-colors duration-fast hover:text-accent-deep"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2xl flex flex-col gap-2 border-t border-rule-2 pt-m text-xs text-muted sm:flex-row sm:items-baseline sm:justify-between">
          <p>
            {PROFILE.name} · {NOW.basedIn}
          </p>
          <p>Set in Fraunces &amp; Switzer. Built with React.</p>
        </div>
      </div>
    </footer>
  );
}
