import { Link, useParams } from 'react-router';
import { getPost } from '../content/posts.js';

/**
 * Post — a single article.
 * Prose styling lives here rather than in a global stylesheet so MDX output
 * stays unstyled everywhere else. The measure is capped at ~68ch; the display
 * face carries headings, Jost carries the body.
 */
export default function Post() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-[78rem] px-5 py-3xl sm:px-8">
        <h1 className="text-4xl">No such post</h1>
        <p className="mt-m text-ink-2">
          That one doesn&rsquo;t exist — try the{' '}
          <Link to="/writing" className="text-accent underline underline-offset-4">
            index
          </Link>
          .
        </p>
      </div>
    );
  }

  const { Component } = post;

  return (
    <article className="mx-auto max-w-[78rem] px-5 sm:px-8">
      <header className="border-b border-rule py-3xl">
        <p className="font-display text-xs tracking-label text-muted uppercase">
          <time dateTime={post.date}>{post.displayDate}</time>
          {post.draft && ' · draft'}
        </p>
        <h1 className="mt-m max-w-[22ch] text-display-s text-balance text-ink">
          {post.title}
        </h1>
      </header>

      <div className="prose-editorial py-2xl">
        <Component />
      </div>

      <p className="border-t border-rule py-2xl">
        <Link
          to="/writing"
          className="group text-xs tracking-label text-accent uppercase no-underline"
        >
          <span
            aria-hidden="true"
            className="mr-2 inline-block transition-transform duration-base ease-out-quiet group-hover:-translate-x-1"
          >
            &larr;
          </span>
          All writing
        </Link>
      </p>
    </article>
  );
}
