import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/geist/index.css'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth'
import { MockSessionProvider } from '@/lib/mock-session'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <MockSessionProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MockSessionProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
