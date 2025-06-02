import React, { useEffect, useState } from 'react'
import Home from './pages/Home'
import Visuals from './pages/Visuals'
import Networking from './pages/Networking'
import LoomRoast from './pages/LoomRoast'
import Navigation from './components/Navigation'
import './index.css'

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

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
    window.scrollTo(0, 0)
  }

  const getCurrentPage = () => {
    switch (currentPath) {
      case '/visuals':
        return 'visuals'
      case '/networking':
      case '/networking-2024':
        return 'networking'
      case '/loom-roast':
        return 'loom-roast'
      default:
        return 'home'
    }
  }

  const handleNavigate = (page: string) => {
    const pathMap: Record<string, string> = {
      home: '/',
      visuals: '/visuals',
      networking: '/networking',
      'loom-roast': '/loom-roast',
    }
    navigate(pathMap[page] || '/')
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/visuals':
        return <Visuals />
      case '/networking':
      case '/networking-2024':
        return <Networking />
      case '/loom-roast':
        return <LoomRoast />
      default:
        return <Home />
    }
  }

  return (
    <div className="app">
      <Navigation currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
    </div>
  )
}

export default App
