import { Link } from 'react-router';
import Reveal from '../components/Reveal.jsx';
import { getAllPosts } from '../content/posts.js';

const posts = getAllPosts();

/**
 * Writing — the blog index.
 * Editorial register intensifies here: the index is a dated list, not a card
 * grid. Rules between entries, no thumbnails, the title carries the weight.
 */
export default function Writing() {
  return (
    <div className="mx-auto max-w-[78rem] px-5 sm:px-8">
      <section className="py-3xl">
        <Reveal>
          <h1 className="max-w-[20ch] text-display-s text-ink">Writing</h1>
        </Reveal>
        <Reveal index={1}>
          <p className="mt-m max-w-[54ch] text-xl leading-relaxed text-ink-2">
            Longer thoughts, mostly about software, school, and the places the
            two collide.
          </p>
        </Reveal>
      </section>

      {posts.length === 0 ? (
        <p className="border-t border-rule py-2xl text-muted">
          Nothing published yet.
        </p>
      ) : (
        <ul className="border-t border-rule pb-3xl">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Reveal index={i}>
                <Link
                  to={`/writing/${post.slug}`}
                  className="group grid grid-cols-1 items-baseline gap-x-10 gap-y-2 border-b border-rule-2 py-l no-underline sm:grid-cols-[9rem_minmax(0,1fr)]"
                >
                  <time
                    dateTime={post.date}
                    className="font-display text-xs tracking-label text-muted uppercase tabular-nums"
                  >
                    {post.displayDate}
                    {post.draft && ' · draft'}
                  </time>
                  <div>
                    <h2 className="text-3xl text-ink transition-colors duration-fast group-hover:text-accent">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="mt-2 max-w-[64ch] text-base leading-relaxed text-ink-2">
                        {post.summary}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
