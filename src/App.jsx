import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="loading">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<div style={{padding: 24}}>Not found</div>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
