/**
 * Layout
 * App-wide structural shell using semantic landmarks (header / main / footer).
 * Navbar and Footer mount into their slots in later phases. Keeping this
 * component thin means individual pages only render their own <main> content.
 */
export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        {/* Navbar mounts in Phase 2 */}
      </header>

      <main id="main-content" className="flex-grow-1">
        {children}
      </main>

      <footer>
        {/* Footer mounts in a later phase */}
      </footer>
    </div>
  );
}