import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppHuerto from './AppHuerto.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppHuerto />
  </StrictMode>,
)
