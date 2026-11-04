import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Experience from './pages/Experience.jsx';
import Writing from './pages/Writing.jsx';
import Post from './pages/Post.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/writing" element={<Writing />} />
        <Route path="/writing/:slug" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-[78rem] px-5 py-3xl sm:px-8">
      <h1 className="text-4xl">Nothing here</h1>
      <p className="mt-m max-w-[48ch] text-ink-2">
        This page doesn&rsquo;t exist — which is at least honest.
      </p>
    </div>
  );
}

export default App;
