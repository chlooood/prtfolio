/**
 * Post registry.
 * Every `.mdx` file in `posts/` is a published post — no index to maintain.
 * Front matter supplies the metadata; the default export is the rendered body.
 *
 * Required front matter: `title`, `date` (YYYY-MM-DD).
 * Optional: `summary`, `draft`.
 */
const modules = import.meta.glob('./posts/*.mdx', { eager: true });

function toDisplayDate(iso) {
  // Parsed as UTC so a date-only string doesn't shift a day in western zones.
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const meta = mod.meta ?? {};
    return {
      slug: path.replace('./posts/', '').replace(/\.mdx$/, ''),
      title: meta.title ?? 'Untitled',
      date: meta.date ?? '1970-01-01',
      displayDate: toDisplayDate(meta.date ?? '1970-01-01'),
      summary: meta.summary ?? '',
      draft: Boolean(meta.draft),
      Component: mod.default,
    };
  })
  // Drafts stay out of production; they still render in `vite dev`.
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts() {
  return posts;
}

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}
