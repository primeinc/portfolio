import React from 'react'
import styles from './CurrentWorkSection.module.css'

const CurrentWorkSection: React.FC = () => {
  return (
    <section className={styles.currentWorkSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>What I'm up to currently?</h2>
        <p className={styles.description}>
          Helping venture groups and early stage founders with product roadmap,
          design, hiring creatives and developers to launch projects and grow.
        </p>
        <p className={styles.email}>
          <a href="mailto:main@email.com" className={styles.emailLink}>
            main@email.com
          </a>
        </p>
        <p className={styles.geniusMode}>
          I'm in "genius mode" 4 hours a day and you can book me to spend them
          on your project. Contact me by{' '}
          <a href="mailto:avilinskyy@gmail.com" className={styles.emailLink}>
            avilinskyy@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}

export default CurrentWorkSection
