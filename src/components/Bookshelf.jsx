import { Link } from 'react-router';

/**
 * Bookshelf — the shelf drawn as an object rather than a list of cards.
 *
 * Two planks of spines. Chloe's books are the only ones that carry a title and
 * a cloth colour; every other spine is blank filler. That split is deliberate
 * on two counts:
 *
 *   · Honesty — inventing titles to fill a shelf would be fabricating content.
 *     An unlabelled spine claims nothing; it's texture, the way a blurred
 *     crowd in a photograph isn't a claim about specific people.
 *   · Legibility — a wall of equally-loud spines is noise. Because the filler
 *     is desaturated and mute, the real books are the only things that resolve,
 *     so they read as the subject rather than as four items in a row.
 *
 * Books with a `review` become links; the rest are inert.
 */

const SPINE_TOKENS = [
  'var(--color-spine-1)',
  'var(--color-spine-2)',
  'var(--color-spine-3)',
  'var(--color-spine-4)',
  'var(--color-spine-5)',
  'var(--color-spine-6)',
];

/* Deterministic so a book keeps the same spine between renders — a shelf whose
   colours reshuffle on every navigation would be unsettling. */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** One spine's dimensions, derived from its own key so they never reshuffle. */
function spine(key, isBook, rowSeed, i) {
  const h = hash(key);
  return {
    key: `${rowSeed}-${i}`,
    // Filler stays narrow and short so the titled spines dominate.
    // Books sit only a little wider than the filler — enough to hold a line of
    // type, not enough to look like a different species of object. Height and
    // colour do the standing-out; width was just making them look fat.
    width: isBook ? 27 + (h % 4) * 4 : 10 + (h % 6) * 3,
    height: isBook ? 206 + (h % 5) * 13 : 130 + (h % 8) * 9,
    color: isBook ? SPINE_TOKENS[h % SPINE_TOKENS.length] : null,
    // The occasional filler spine leans, the way a real shelf does.
    lean: !isBook && h % 9 === 0 ? (h % 2 ? 4 : -4) : 0,
  };
}

/**
 * Lays out one plank.
 *
 * Real books go near the left with a couple of filler spines between them,
 * then a long tail of filler runs off to the right. That ordering is load
 * bearing: the row is clipped rather than wrapped (a wrapped shelf stops
 * looking like a shelf), so anything far right may be cut off at narrow
 * widths — and the titled books must never be the thing that gets cut.
 */
function buildRow(books, tailCount, rowSeed) {
  const out = [];
  let i = 0;

  books.forEach((book, b) => {
    // A little filler before each book, so they don't start flush at the edge.
    const lead = b === 0 ? 2 : 3;
    for (let k = 0; k < lead; k += 1, i += 1) {
      out.push({ ...spine(`f-${rowSeed}-${i}`, false, rowSeed, i), book: null });
    }
    out.push({ ...spine(book.title, true, rowSeed, i), book });
    i += 1;
  });

  for (let k = 0; k < tailCount; k += 1, i += 1) {
    out.push({ ...spine(`t-${rowSeed}-${i}`, false, rowSeed, i), book: null });
  }

  return out;
}

export default function Bookshelf({ books }) {
  if (!books || books.length === 0) return null;

  // One shelf. A long filler tail keeps the plank full at desktop widths; the
  // overflow is clipped, so an over-long tail costs nothing while an
  // under-long one leaves bare shelf showing.
  return <Plank spines={buildRow(books, 44, 1)} />;
}

function Plank({ spines }) {
  return (
    <div>
      {/* Spines sit on the plank's top edge, so the row is bottom-aligned.
          Never wraps — a wrapped shelf reads as two broken rows floating above
          one plank. The tail is clipped instead. */}
      <ul className="flex flex-nowrap items-end gap-[2px] overflow-hidden px-1">
        {spines.map(({ key, book, width, height, color, lean }) =>
          book ? (
            <li key={key}>
              <Spine book={book} width={width} height={height} color={color} />
            </li>
          ) : (
            <li
              key={key}
              aria-hidden="true"
              className="rounded-t-[3px] border-t border-paper-2/25 bg-rule"
              style={{
                width,
                height,
                transform: lean ? `rotate(${lean}deg)` : undefined,
                transformOrigin: 'bottom center',
                opacity: 0.55,
              }}
            />
          ),
        )}
      </ul>

      {/* The plank itself — kept thin so it reads as a ledge the books stand
          on rather than as a slab competing with them. */}
      <div
        aria-hidden="true"
        className="h-1.5 rounded-[1px] border-b border-shelf-edge bg-shelf shadow-[0_2px_5px_-3px_rgba(0,0,0,0.3)]"
      />
    </div>
  );
}

function Spine({ book, width, height, color }) {
  const { title, author, finished, note, review } = book;
  const isExternal = review && /^https?:/.test(review);
  const to = review ? (isExternal ? review : `/writing/${review}`) : null;

  const body = (
    <span
      className="relative flex h-full w-full flex-col items-center justify-between rounded-t-[3px] px-[3px] py-2 shadow-[inset_-2px_0_5px_-3px_rgba(0,0,0,0.45)]"
      style={{ backgroundColor: color }}
    >
      {/* Cloth banding near the head and tail of the spine. */}
      <span aria-hidden="true" className="h-px w-full bg-paper-2/35" />

      {/* In vertical writing mode the inline axis runs down the spine, so a
          flex row lays these out head-to-tail along its length — title at the
          top, author at the foot, exactly as a printed spine sets them.
          Previously they were inline siblings, which let the author reflow into
          the title's column and collide with it. */}
      <span
        className="flex flex-1 items-center justify-between gap-1.5 overflow-hidden py-1.5 text-paper-2"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {/* No nowrap: in vertical writing mode a wrap creates a second column
            running alongside the first, which is how printed spines carry a
            long title. Truncating with an ellipsis instead loses the one piece
            of information the spine exists to show. */}
        <span className="font-display text-[0.62rem] leading-[1.3] font-medium">{title}</span>
        {author && (
          <span className="shrink-0 overflow-hidden text-[0.48rem] whitespace-nowrap opacity-65">
            {author}
          </span>
        )}
      </span>

      <span aria-hidden="true" className="h-px w-full bg-paper-2/35" />

      {/* Gold foot marks a spine that leads somewhere. */}
      {review && <span aria-hidden="true" className="mt-1 h-1 w-1 rounded-full bg-bloom" />}
    </span>
  );

  const shell = 'block transition-transform duration-base ease-out-quiet will-change-transform';
  const label = [title, author, finished && `finished ${finished}`, note]
    .filter(Boolean)
    .join(' — ');

  if (!to) {
    return (
      <span className={shell} style={{ width, height }} title={label}>
        {body}
      </span>
    );
  }

  const props = {
    className: `${shell} rounded-t-[4px] hover:-translate-y-2 focus-visible:-translate-y-2`,
    style: { width, height },
    'aria-label': `${title}${author ? ` by ${author}` : ''} — read the review`,
    title: label,
  };

  return isExternal ? (
    <a {...props} href={to} target="_blank" rel="noreferrer noopener">
      {body}
    </a>
  ) : (
    <Link {...props} to={to}>
      {body}
    </Link>
  );
}
