import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import PaymentSuccess from './pages/PaymentSuccess.tsx'
import PaymentCanceled from './pages/PaymentCanceled.tsx'
import SimulationPage from './pages/SimulationPage.tsx'
import FeaturesPage from './pages/FeaturesPage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import PricingPage from './pages/PricingPage.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { QueryProvider } from './providers/QueryProvider.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/simulation" element={<SimulationPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/canceled" element={<PaymentCanceled />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
)
