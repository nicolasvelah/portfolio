// App.tsx / App.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/layout/Layout.jsx';
import NerdThinkingLoader from './components/animations/loadings/NerdThinkingLoader';

const Home = lazy(() => import('./pages/Home.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.tsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.tsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.en.tsx'));

// Wrapper de página (animación de entrada/salida)
function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <Suspense
        fallback={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="loading w-full h-[220px] text-center grid place-items-center"
          >
            <NerdThinkingLoader label="Thinking…" />
          </motion.div>
        }
      >
        {/* AnimatePresence DENTRO de Suspense + initial={false} */}
        <AnimatePresence mode="wait" initial={false}>
          {/* key por pathname para forzar exit/enter en cada navegación */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/home" element={<Page><Home /></Page>} />
            <Route path="/projects" element={<Page><ProjectsPage /></Page>} />
            <Route path="/services" element={<Page><ServicesPage /></Page>} />
            <Route path="/contact" element={<Page><ContactPage /></Page>} />
            <Route path="*" element={<Page><div style={{ padding: 24 }}>Not found</div></Page>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}
