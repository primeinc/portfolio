import React from 'react'
import styles from './HeroHeader.module.css'

const HeroHeader: React.FC = () => {
  return (
    <div className={styles.heroHeader}>
      {/* Video Intro link - exists in DOM but styled differently */}
      <div className={styles.videoIntroLink}>
        <a href="https://www.loom.com/share/294297d4ba0949be8eb98f1d4f56851f?sid=4a486978-af75-4dc7-9645-2edac6a0ad0b" 
           className={styles.videoLink}>
          Video Intro
        </a>
      </div>
      
      <h1 className={styles.h3}>
        Alexander Vilinskyy
        <br />
      </h1>
      <div className={styles.bodyText}>
        Digital designer and founder of{' '}
        <a href="https://www.superclear.uk" className={styles.highlight}>
          Super Clear
        </a>{' '}
        — design studio for early stage startups. Based in London, often in NYC/SF.
        <br />
        <br />
        Bootstrapped profitable businesses, worked on consumer brands and led creative product teams. Worked with startups like{' '}
        <a href="https://grammarly.com" className={styles.highlight}>
          Grammarly
        </a>
        ,{' '}
        <a href="https://sparkmailapp.com/" className={styles.highlight}>
          Spark
        </a>
        , and{' '}
        <a href="https://readdle.com/documents" className={styles.highlight}>
          Documents
        </a>
        , as well as hundreds of productivity and communication apps.
      </div>
    </div>
  )
}

export default HeroHeader