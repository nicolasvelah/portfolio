import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import NerdThinkingLoader from './components/animations/loadings/NerdThinkingLoader';

const Home = lazy(() => import('./pages/Home.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={
          <div className="loading w-full h-[220px] text-center grid place-items-center">
            <NerdThinkingLoader label="Thinkng…" />
          </div>
        }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="*" element={<div style={{padding: 24}}>Not found</div>} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
