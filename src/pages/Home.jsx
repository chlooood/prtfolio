import { Link } from 'react-router';
import Rail from '../components/Rail.jsx';
import Reveal from '../components/Reveal.jsx';
import NowStrip from '../components/NowStrip.jsx';
import Bookshelf from '../components/Bookshelf.jsx';
import { getAllPosts } from '../content/posts.js';
import { BOOKSHELF, HOBBIES, INTERESTS, PROFILE, PROJECTS } from '../content/me.js';

const posts = getAllPosts().slice(0, 3);

/* Four titled spines, spread over two planks and padded out with blank filler.
   The cap is about attention rather than space now — the shelf looks full
   either way, and past four the eye stops reading titles and starts skimming
   a pattern. Raise it here if you'd rather show more. */
const shelf = BOOKSHELF.slice(0, 4);

/**
 * Home — hallmark macrostructure 20 (Ecosystem Index).
 * Several titled rails, each surfacing a different cut of the site. No single
 * CTA: the brief called for a balanced introduction, so the page lets visitors
 * self-select into work, writing, or the personal material.
 *
 * Every rail reads from `content/me.js` and hides itself when its data is
 * empty, so the page is never padded with invented filler.
 */
export default function Home() {
  // Numbered in DOM order, but only over the rails that actually render —
  // otherwise an empty section leaves a hole in the sequence.
  let n = 0;
  const next = () => (n += 1);

  return (
    <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
      {/* ── Opening · positioning paragraph, no display headline (per macro) ── */}
      <section className="pt-2xl pb-xl">
        <Reveal>
          <p className="max-w-[26ch] font-display text-display-s leading-[1.04] text-balance text-ink">
            {PROFILE.headline}
          </p>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-l max-w-[56ch] text-xl leading-relaxed text-ink-2">
            {PROFILE.intro}
          </p>
        </Reveal>
      </section>

      <div className="pb-3xl">
        <NowStrip />
      </div>

      <div className="flex flex-col gap-3xl pb-2xl">
        {/* ── Selected work ── */}
        {PROJECTS.length > 0 && (
          <Rail number={next()} title="Selected work">
            <ul className="flex flex-col">
              {PROJECTS.map((project, i) => (
                <li key={project.name}>
                  <Reveal index={i}>
                    <ProjectRow {...project} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Rail>
        )}

        {/* ── Latest writing ── */}
        {posts.length > 0 && (
          <Rail
            number={next()}
            title="Latest writing"
            action={
              <Link
                to="/writing"
                className="group text-sm text-accent no-underline"
              >
                All posts
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform duration-base ease-out-quiet group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            }
          >
            <ul className="border-t border-rule-2">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <Reveal index={i}>
                    <Link
                      to={`/writing/${post.slug}`}
                      className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-1 border-b border-rule-2 py-m no-underline sm:grid-cols-[8rem_minmax(0,1fr)]"
                    >
                      <time
                        dateTime={post.date}
                        className="text-xs text-muted tabular-nums"
                      >
                        {post.displayDate}
                      </time>
                      <div>
                        <h3 className="text-2xl text-ink transition-colors duration-fast group-hover:text-accent">
                          {post.title}
                        </h3>
                        {post.summary && (
                          <p className="mt-1 max-w-[62ch] text-base text-ink-2">
                            {post.summary}
                          </p>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Rail>
        )}

        {/* ── Recently read ──
            Sits next to the writing rail on purpose: reading and writing are
            the same habit seen from two sides. */}
        {shelf.length > 0 && (
          <Rail number={next()} title="Recently read">
            <Reveal>
              <Bookshelf books={shelf} />
            </Reveal>
          </Rail>
        )}

        {/* Experience lives on its own route now — the index stays a set of
            short surfaces rather than absorbing the whole CV. */}

        {/* ── Off the clock ── */}
        {HOBBIES.filter((h) => h.blurb).length > 0 && (
          <Rail number={next()} title="Off the clock">
            <ul className="grid gap-m sm:grid-cols-2 lg:grid-cols-3">
              {HOBBIES.filter((h) => h.blurb).map((hobby, i) => (
                <li key={hobby.title}>
                  <Reveal index={i}>
                    <div className="group h-full rounded-card border-l-4 border-solid border-l-gold/60 bg-paper-2/80 px-m py-m shadow-[0_1px_3px_-1px_rgba(0,0,0,0.06)] transition-shadow duration-base hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]">
                      <h3 className="text-2xl text-ink">{hobby.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-ink-2">
                        {hobby.blurb}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Rail>
        )}

        {/* ── Interests ── */}
        {INTERESTS.length > 0 && (
          <Rail number={next()} title="Also interested in">
            <ul className="flex flex-wrap gap-2.5">
              {INTERESTS.map((interest) => (
                <li
                  key={interest}
                  className="rounded-full border border-rule bg-paper-2/70 px-4 py-2 text-sm text-ink-2 transition-all duration-base hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_3px_8px_-3px_rgba(0,0,0,0.08)]"
                >
                  {interest}
                </li>
              ))}
            </ul>
          </Rail>
        )}
      </div>
    </div>
  );
}

function ProjectRow({ name, year, blurb, stack, links }) {
  const primary = links?.live ?? links?.repo ?? null;

  return (
    <article className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-rule-2 py-l sm:grid-cols-[8rem_minmax(0,1fr)]">
      <p className="text-xs text-muted tabular-nums">{year}</p>
      <div>
        <h3 className="text-3xl text-ink">
          {primary ? (
            <a
              href={primary}
              target="_blank"
              rel="noreferrer noopener"
              className="no-underline transition-colors duration-fast hover:text-accent"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </h3>
        {blurb && (
          <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-ink-2">{blurb}</p>
        )}
        {stack?.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
