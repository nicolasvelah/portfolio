import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <HashRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,            // si usas data routers
      v7_skipActionErrorRevalidation: true
    }}
  >
    <App />
  </HashRouter>
);
