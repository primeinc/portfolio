import React, { useEffect, useState } from 'react'
import Home from './pages/Home'
import Visuals from './pages/Visuals'
import Networking from './pages/Networking'
import LoomRoast from './pages/LoomRoast'
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

  const renderPage = () => {
    switch (currentPath) {
      case '/visuals':
        return <Visuals />
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
      <nav>
        <div className="container">
          <ul>
            <li>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/')
                }}
                className={currentPath === '/' ? 'active' : ''}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/visuals"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/visuals')
                }}
                className={currentPath === '/visuals' ? 'active' : ''}
              >
                Visuals
              </a>
            </li>
            <li>
              <a
                href="/networking-2024"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/networking-2024')
                }}
                className={currentPath === '/networking-2024' ? 'active' : ''}
              >
                Networking 2024
              </a>
            </li>
            <li>
              <a
                href="/loom-roast"
                onClick={(e) => {
                  e.preventDefault()
                  navigate('/loom-roast')
                }}
                className={currentPath === '/loom-roast' ? 'active' : ''}
              >
                Loom Roast
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <main>{renderPage()}</main>
    </div>
  )
}

export default App