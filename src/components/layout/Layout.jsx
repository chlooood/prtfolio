import Masthead from './Masthead.jsx';
import Colophon from './Colophon.jsx';
import Dandelions from '../Dandelions.jsx';
import PaintedBackdrop from '../PaintedBackdrop.jsx';

/**
 * Layout
 * App-wide structural shell using semantic landmarks (header / main / footer).
 * Pages render only their own content; chrome lives here.
 *
 * The seed layer sits at z-0 and every landmark is lifted to z-10 above it —
 * a negative z-index would put the seeds behind the body background and make
 * them invisible.
 */
export default function Layout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Painted field first, seeds drifting over it, content above both. */}
      <PaintedBackdrop />
      <Dandelions />

      <header className="relative z-10">
        <Masthead />
      </header>

      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>

      <div className="relative z-10">
        <Colophon />
      </div>
    </div>
  );
}
