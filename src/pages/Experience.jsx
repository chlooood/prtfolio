import Reveal from '../components/Reveal.jsx';
import { EXPERIENCE, PROFILE } from '../content/me.js';

/**
 * Experience — the CV, given its own room.
 *
 * Moved off the home page so the index stays a set of short surfaces. Here the
 * roles get the space to carry their detail: a dated left column against a
 * wide description column, hairlines between, no cards.
 */
export default function Experience() {
  return (
    <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
      <section className="pt-2xl pb-xl">
        <Reveal>
          <h1 className="max-w-[16ch] text-display-s leading-[1.04] text-ink">Experience</h1>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-m max-w-[54ch] text-xl leading-relaxed text-ink-2">
            {PROFILE.school} · {PROFILE.role}, expecting to graduate in{' '}
            {PROFILE.gradYear}.
          </p>
        </Reveal>
      </section>

      {EXPERIENCE.length === 0 ? (
        <p className="border-t border-rule py-2xl text-muted">Nothing listed yet.</p>
      ) : (
        <ul className="border-t border-rule pb-3xl">
          {EXPERIENCE.map((role, i) => (
            <li key={`${role.org}-${role.role}`}>
              <Reveal index={i}>
                <article className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-rule-2 py-l sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <p className="text-xs text-muted tabular-nums">{role.period}</p>
                  <div>
                    <h2 className="text-3xl text-ink">{role.org}</h2>
                    <p className="mt-1 text-base text-ink-2">
                      {role.role}
                      {role.location && <span className="text-muted"> · {role.location}</span>}
                    </p>
                    {role.notes?.length > 0 && (
                      <ul className="mt-4 flex max-w-[66ch] flex-col gap-2">
                        {role.notes.map((note) => (
                          <li
                            key={note}
                            className="relative pl-5 text-base leading-relaxed text-ink-2"
                          >
                            <span aria-hidden="true" className="absolute left-0 text-rule">
                              —
                            </span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
