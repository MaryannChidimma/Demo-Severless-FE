import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNavigation from '../components/BottomNavigation'
import ErrorBoundary from '../components/ErrorBoundary'
import Footer from '../components/Footer'
import Header from '../components/Header'
import MobileHeader from '../components/MobileHeader'

const USING_MOCK_API = import.meta.env.MODE === 'mock'

export default function AppLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {USING_MOCK_API && <p className="demo-banner">Demo data — local mock API</p>}
      <Header />
      <MobileHeader />
      <main id="main" className="app__main" tabIndex={-1}>
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  )
}
