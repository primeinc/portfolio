import React from 'react'
import styles from './HeroHeader.module.css'

const HeroHeader: React.FC = () => {
  return (
    <div className={styles.heroHeader}>
      {/* Video Intro link - exists in DOM but styled differently */}
      <div className={styles.videoIntroLink}>
        <a
          href="https://www.loom.com/share/placeholder-rylee-journey-to-msu"
          className={styles.videoLink}
        >
          My Journey to MSU
        </a>
      </div>

      <h1 className={styles.h3}>
        Rylee <span className={styles.lastname}>Brasseur</span>
        <br />
      </h1>
      <div className={styles.bodyText}>
        Most people debate whether talent or effort matters more. I proved they
        multiply.
        <br />
        <br />
        Three school records. 45-person creative team. $2,000 in competitive
        scholarships. All before age 18.
        <br />
        <br />
        Now studying International Relations at{' '}
        <a href="https://jmc.msu.edu" className={styles.highlight}>
          James Madison College
        </a>
        —where future diplomats learn to turn conflict into cooperation. (More
        Foreign Service officers per capita than the Ivies, if you're keeping
        score.)
        <br />
        <br />
        Next challenge: translating the mindset that{' '}
        <a href="#track-records" className={styles.highlight}>
          cuts 82 seconds off a 5K
        </a>{' '}
        into the skills that{' '}
        <a href="#diplomatic-training" className={styles.highlight}>
          negotiate peace treaties
        </a>
        . Same principles. Higher stakes.
        <br />
        <br />
        Ready to change the world? Let's start with a conversation.
      </div>
    </div>
  )
}

export default HeroHeader
