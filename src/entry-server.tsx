import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** HTML estático de la página, para inyectarlo en dist/index.html (scripts/prerender.mjs). */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
