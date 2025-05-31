import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Visuals from './pages/Visuals'
import Networking from './pages/Networking'
import LoomRoast from './pages/LoomRoast'

const routes: Record<string, () => JSX.Element> = {
  '/': Home,
  '/visuals': Visuals,
  '/networking-2024': Networking,
  '/loom-roast': LoomRoast,
}

// Minimal router using history API. React Router not used to keep dependencies small.
export default function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setPath(to)
  }

  const Component = routes[path] || Home

  return (
    <div>
      <nav>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
        >
          Home
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/visuals')
          }}
        >
          Visuals
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/networking-2024')
          }}
        >
          Networking 2024
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/loom-roast')
          }}
        >
          Loom Roast
        </a>
      </nav>
      <Component />
    </div>
  )
}
