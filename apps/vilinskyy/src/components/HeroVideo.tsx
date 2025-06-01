import React from 'react'
import styles from './HeroVideo.module.css'

const HeroVideo: React.FC = () => {
  return (
    <div className={styles.heroVideo}>
      <div className={styles.loomHolder}>
        <div className={`${styles.loomVideoEmb} ${styles.wEmbed} ${styles.wIframe}`}>
          <iframe 
            className={styles.loomVideoEmb}
            src="https://www.loom.com/embed/294297d4ba0949be8eb98f1d4f56851f?sid=35aa5ed9-bfc0-4476-9b37-2f2cc1a69d96"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

export default HeroVideo