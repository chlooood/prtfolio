import { Link, NavLink } from 'react-router';
import { NAV_LINKS } from '../../content/site.js';
import { PROFILE } from '../../content/me.js';
import DandelionMark from '../DandelionMark.jsx';

/**
 * Masthead — hallmark nav archetype N1a (wordmark + 2 links).
 *
 * Replaces the N6 newspaper masthead, which was centring a high-contrast serif
 * wordmark in wide-tracked caps — the exact recipe for a restaurant menu. N1a
 * is edge-aligned and asymmetric, which reads as a portfolio immediately.
 *
 * hallmark warns that N1a is a common AI fingerprint and to reach for it only
 * when a page genuinely has two destinations. This one has exactly two, which
 * is also why there is no drawer: two links fit at 320px, so the offcanvas
 * pattern (and its focus trap) is dead weight here.
 */
export default function Masthead() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only rounded-full focus:not-sr-only focus:fixed focus:top-3 focus:left-1/2 focus:z-[60] focus:-translate-x-1/2 focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>

      <div className="sticky top-0 z-50 border-b border-rule-2 bg-paper/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[78rem] items-center justify-between gap-4 px-5 py-3 sm:gap-6 sm:px-8 sm:py-4">
          <Link to="/" className="group flex min-w-0 items-center gap-2 no-underline sm:gap-3">
            <DandelionMark className="text-[clamp(1.15rem,2.4vw,1.6rem)]" />
            <span className="flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-3">
              <span className="font-display text-[clamp(1.1rem,2.4vw,1.6rem)] font-semibold tracking-wordmark whitespace-nowrap text-ink transition-colors duration-fast group-hover:text-accent">
                {PROFILE.name}
              </span>
              <span className="hidden truncate text-xs text-muted sm:inline">{PROFILE.signature}</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="flex shrink-0 items-center gap-4 sm:gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink
                key={href}
                to={href}
                end={href === '/'}
                className={({ isActive }) =>
                  [
                    'group relative py-1 text-sm whitespace-nowrap no-underline transition-colors duration-fast',
                    isActive ? 'text-accent' : 'text-ink-2 hover:text-accent',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {/* Gold hairline opens from the centre — the one
                        microinteraction the bar carries. */}
                    <span
                      aria-hidden="true"
                      className={[
                        'absolute -bottom-0.5 h-px bg-gold transition-all duration-base ease-out-quiet',
                        isActive ? 'inset-x-0' : 'inset-x-1/2 group-hover:inset-x-0',
                      ].join(' ')}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
