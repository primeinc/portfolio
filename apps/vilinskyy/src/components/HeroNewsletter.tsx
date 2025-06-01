import React from 'react'
import styles from './HeroNewsletter.module.css'

const HeroNewsletter: React.FC = () => {
  return (
    <div className={styles.heroNewsletter}>
      <div className={styles.reviewRowTight}>
        <div className={`${styles.bodyText} ${styles.smallText}`}>
          Twice a year I write an issue with updates from my life, projects, thoughts, links and some photos. Follow me on{' '}
          <a href="https://twitter.com/vilinskyy">
            <span className={styles.paragraphlink}>Twitter</span>
          </a>
          ,{' '}
          <a href="https://linkedin.com/in/vilinskyy">
            <span className={styles.paragraphlink}>LinkedIn</span>
          </a>
          ,{' '}
          <a href="https://instagram.com/vilinskyy">
            <span className={styles.paragraphlink}>Instagram</span>
          </a>
          ,{' '}
          <a href="https://www.youtube.com/channel/UCZpuBPAdMSYJFzPzkdiFkdA">
            <span className={styles.paragraphlink}>YouTube</span>
          </a>
          ,{' '}
          <a href="https://bsky.app/profile/vilinskyy.bsky.social">Bluesky</a>.
          <br />
        </div>
        <div className={`${styles.formBlock} ${styles.wForm}`}>
          <form 
            id="Newsletter-Email" 
            name="wf-form-Email" 
            data-name="Email" 
            method="get" 
            className={styles.form}
            aria-label="Email"
          >
            <input 
              className={`${styles.textField} ${styles.wInput}`}
              maxLength={256}
              name="Email-2" 
              data-name="Email 2" 
              placeholder="main@email.com" 
              type="email" 
              id="Email-2" 
              required
            />
            <input 
              type="submit" 
              data-wait="Please wait..." 
              className={`${styles.buttonClassic} ${styles.fullwidth} ${styles.wButton}`}
              value="Subscribe"
            />
          </form>
          <div className={`${styles.successMessage} ${styles.wFormDone}`} tabIndex={-1} role="region" aria-label="Email success">
            <div className={styles.textBlock4}>
              Phew, it worked!<br />Your email is in safe hands.
            </div>
          </div>
          <div className={`${styles.errorMessage} ${styles.wFormFail}`} tabIndex={-1} role="region" aria-label="Email failure">
            <div>
              Fuck. I broke something...<br />
              Message me on <a href="http://twitter.com/vilinskyy" target="_blank" className={styles.link2}>Twitter</a> about it.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroNewsletter