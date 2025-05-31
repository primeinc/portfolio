import React, { useState } from 'react'
import styles from './Navigation.module.css'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'visuals', label: 'Visuals', href: '/visuals' },
    { id: 'loom-roast', label: 'Loom Roast', href: '/loom-roast' },
    {
      id: 'networking',
      label: 'Networking for Designers',
      href: '/networking',
    },
  ]

  const handleNavClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault()
    onNavigate(page)
    setIsMenuOpen(false)
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <div className={styles.navContent}>
          <a
            href="/"
            className={styles.logo}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            Alexander Vilinskyy
          </a>

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.menuIcon}></span>
          </button>

          <ul
            className={`${styles.navList} ${isMenuOpen ? styles.navListOpen : ''}`}
          >
            {navItems.map((item) => (
              <li key={item.id} className={styles.navItem}>
                <a
                  href={item.href}
                  className={`${styles.navLink} ${currentPage === item.id ? styles.navLinkActive : ''}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
