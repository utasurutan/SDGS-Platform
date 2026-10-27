import { useState, useEffect } from 'react'
import LandingPage from '../frontend/landing-page.jsx'
import SignUp from '../frontend/sign-up.jsx'
import SignIn from '../frontend/sign-in.jsx'
import PreferencePage from '../frontend/preference.jsx'
import ForgotPassword from '../frontend/forgot-password.jsx'
import ResetPassword from '../frontend/reset-password.jsx'
import ConnectDevice from '../frontend/connect-device.jsx'
import Dashboard from '../frontend/dashboard.jsx'
import SettingsPage from '../frontend/settings.jsx'
import FaqPage from '../frontend/faq.jsx'

function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Routing conditions
  if (
    currentPath === '/sign-up' ||
    currentPath === '/signup' ||
    currentPath === '/frontend/sign-up.html' ||
    currentPath.endsWith('sign-up.html')
  ) {
    return <SignUp onNavigate={navigate} />
  }

  if (
    currentPath === '/sign-in' ||
    currentPath === '/signin' ||
    currentPath === '/frontend/sign-in.html' ||
    currentPath.endsWith('sign-in.html')
  ) {
    return <SignIn onNavigate={navigate} />
  }

  if (
    currentPath === '/dashboard' ||
    currentPath === '/beranda' ||
    currentPath === '/frontend/dashboard.html' ||
    currentPath.endsWith('dashboard.html')
  ) {
    return <Dashboard onNavigate={navigate} />
  }

  if (
    currentPath === '/settings' ||
    currentPath === '/pengaturan' ||
    currentPath === '/frontend/settings.html' ||
    currentPath.endsWith('settings.html')
  ) {
    return <SettingsPage onNavigate={navigate} />
  }

  if (
    currentPath === '/faq' ||
    currentPath === '/bantuan' ||
    currentPath === '/pertanyaan' ||
    currentPath === '/frontend/faq.html' ||
    currentPath.endsWith('faq.html')
  ) {
    return <FaqPage onNavigate={navigate} />
  }

  if (
    currentPath === '/connect-device' ||
    currentPath === '/hubungkan-perangkat'
  ) {
    return <ConnectDevice onNavigate={navigate} />
  }

  if (
    currentPath === '/preference' ||
    currentPath === '/preferences' ||
    currentPath === '/frontend/preference.html' ||
    currentPath.endsWith('preference.html')
  ) {
    return <PreferencePage onNavigate={navigate} />
  }

  if (
    currentPath === '/forgot-password' ||
    currentPath === '/lupa-password' ||
    currentPath === '/lupa-sandi' ||
    currentPath === '/frontend/forgot-password.html' ||
    currentPath.endsWith('forgot-password.html')
  ) {
    return <ForgotPassword onNavigate={navigate} />
  }

  if (
    currentPath === '/reset-password' ||
    currentPath === '/kata-sandi-baru' ||
    currentPath === '/frontend/reset-password.html' ||
    currentPath.endsWith('reset-password.html')
  ) {
    return <ResetPassword onNavigate={navigate} />
  }

  return <LandingPage onNavigate={navigate} />
}

export default App
