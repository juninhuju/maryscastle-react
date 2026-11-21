import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const normalizePath = (value = "") =>
  value === "/" ? "/" : value.replace(/\/+$/, "") || "/"

if (
  normalizePath(rootElement.dataset.prerenderPath) ===
  normalizePath(window.location.pathname)
) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
