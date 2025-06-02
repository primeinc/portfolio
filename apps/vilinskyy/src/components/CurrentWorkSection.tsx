import React from 'react'
import styles from './CurrentWorkSection.module.css'

const CurrentWorkSection: React.FC = () => {
  return (
    <section className={styles.currentWorkSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>What I'm up to currently?</h2>
        <p className={styles.description}>
          Breaking records in the pool while breaking down global conflicts in
          Model UN. Training for nationals while negotiating peace treaties.
          Living proof that excellence doesn't require choosing one path.
        </p>
        <p className={styles.email}>
          <a href="mailto:brasse25@msu.edu" className={styles.emailLink}>
            brasse25@msu.edu
          </a>
        </p>
        <p className={styles.geniusMode}>
          I train 20 hours a week and still make time for what matters. Want to
          discuss swimming, geopolitics, or both? Reach out at{' '}
          <a href="mailto:brasse25@msu.edu" className={styles.emailLink}>
            brasse25@msu.edu
          </a>
        </p>
      </div>
    </section>
  )
}

export default CurrentWorkSection
