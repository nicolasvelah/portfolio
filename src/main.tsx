import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// En producción el HTML viene prerenderizado (scripts/prerender.mjs): se hidrata en vez de re-renderizar.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
