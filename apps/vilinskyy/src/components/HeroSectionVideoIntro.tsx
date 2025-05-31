import React from 'react'
import styles from './HeroSectionVideoIntro.module.css'
import SocialMediaLinks from './SocialMediaLinks'
import NewsletterForm from './NewsletterForm'

const HeroSectionVideoIntro: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Alexander Vilinskyy</h1>
          <p className={styles.heroTagline}>
            Digital designer and founder of{' '}
            <a href="https://superclear.xyz" target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
              Super Clear
            </a>
            {' '}— design studio for early stage startups. Based in London, often in NYC/SF.
          </p>
          <p className={styles.heroDescription}>
            Bootstrapped profitable businesses, worked on consumer brands and led creative product teams. Worked with startups like{' '}
            <span className={styles.companyHighlight}>Grammarly</span>,{' '}
            <span className={styles.companyHighlight}>Spark</span>, and{' '}
            <span className={styles.companyHighlight}>Decipad</span>, as well as hundreds of productivity and communication apps.
          </p>
          
          <div className={styles.socialIcons}>
            <SocialMediaLinks variant="compact" />
          </div>
        </div>
        
        <div className={styles.videoWrapper}>
          <div className={styles.videoContainer}>
            <iframe
              src="https://www.loom.com/embed/YOUR_LOOM_VIDEO_ID"
              frameBorder="0"
              allowFullScreen
              className={styles.video}
              title="Alexander Vilinskyy Introduction"
            ></iframe>
            <div className={styles.videoPlaceholder}>
              <svg className={styles.playIcon} viewBox="0 0 68 48" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M66.52.00C63.90.00 61.79 2.11 61.79 4.73V43.27C61.79 45.89 63.90 48.00 66.52 48.00C69.14 48.00 71.25 45.89 71.25 43.27V4.73C71.25 2.11 69.14.00 66.52.00ZM1.48.00C4.10.00 6.21 2.11 6.21 4.73V43.27C6.21 45.89 4.10 48.00 1.48 48.00C-1.14 48.00-3.25 45.89-3.25 43.27V4.73C-3.25 2.11-1.14.00 1.48.00ZM26.52 7.91C28.55 6.62 31.15 6.62 33.18 7.91L48.20 17.18C50.23 18.47 51.23 20.73 51.23 23.00V25.00C51.23 27.27 50.23 29.53 48.20 30.82L33.18 40.09C31.15 41.38 28.55 41.38 26.52 40.09L11.50 30.82C9.47 29.53 8.47 27.27 8.47 25.00V23.00C8.47 20.73 9.47 18.47 11.50 17.18L26.52 7.91Z" fill="currentColor"/>
              </svg>
              <p className={styles.videoDuration}>57 sec</p>
            </div>
          </div>
          <p className={styles.videoCaption}>
            Twice a year I write an issue with updates from my life, projects, thoughts, links and some photos. Follow me on{' '}
            <a href="https://twitter.com/alexandervilin" target="_blank" rel="noopener noreferrer">Twitter</a>,{' '}
            <a href="https://linkedin.com/in/alexandervilinskyy" target="_blank" rel="noopener noreferrer">LinkedIn</a>,{' '}
            <a href="https://instagram.com/alexandervilin" target="_blank" rel="noopener noreferrer">Instagram</a>,{' '}
            <a href="https://youtube.com/@alexandervilinskyy" target="_blank" rel="noopener noreferrer">YouTube</a>,{' '}
            <a href="https://dribbble.com/alexandervilin" target="_blank" rel="noopener noreferrer">Dribbble</a>.
          </p>
        </div>
        
        <div className={styles.newsletterSection}>
          <NewsletterForm 
            variant="inline" 
            placeholder="mail@email.com"
            buttonText="Subscribe"
            successMessage="Thanks for subscribing! Check your email for confirmation."
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSectionVideoIntro