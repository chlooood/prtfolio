import Layout from './components/layout/Layout.jsx';

function App() {
  return (
    <Layout>
      <section className="container text-center" style={{ paddingBlock: 'var(--ea-section-y)' }}>
        <p className="eyebrow mb-3">Style, Recipes &amp; Stories</p>
        <p className="font-script text-primary fs-1 mb-1">Welcome, Friend!</p>
        <h1 className="display-2 mb-3">Etta's Acres</h1>
        <p className="lead text-secondary">
          Baseline layout architecture is live. Tokens, fonts, and Bootstrap are wired.
        </p>
      </section>
    </Layout>
  );
}

export default App;