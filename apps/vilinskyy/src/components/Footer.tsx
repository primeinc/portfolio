import React from 'react'
import styles from './Footer.module.css'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.location}>London, UK. 2008 - infinity.</p>
        <p className={styles.website}>
          <a href="https://vilinskyy.com" className={styles.websiteLink}>
            vilinskyy.com
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
