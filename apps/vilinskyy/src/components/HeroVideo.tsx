import React from 'react'
import styles from './HeroVideo.module.css'

const HeroVideo: React.FC = () => {
  return (
    <div className={styles.heroVideo}>
      <div className={styles.loomHolder}>
        <div
          className={`${styles.loomVideoEmb} ${styles.wEmbed} ${styles.wIframe}`}
        >
          {/* Professional video placeholder */}
          <div className={styles.videoPlaceholder}>
            <div className={styles.videoContent}>
              <button className={styles.playButton} aria-label="Play video">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="40"
                    cy="40"
                    r="39"
                    fill="rgba(255, 255, 255, 0.1)"
                    stroke="rgba(255, 255, 255, 0.4)"
                    strokeWidth="2"
                  />
                  <path d="M33 28L50 40L33 52V28Z" fill="white" />
                </svg>
              </button>
              <h3 className={styles.placeholderTitle}>My Journey to MSU</h3>
              <p className={styles.placeholderSubtitle}>
                International Relations • Distance Running • Leadership
              </p>
              <span className={styles.duration}>3:42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroVideo
