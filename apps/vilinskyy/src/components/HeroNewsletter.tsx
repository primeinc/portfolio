import React from 'react'
import styles from './HeroNewsletter.module.css'

const HeroNewsletter: React.FC = () => {
  return (
    <div className={styles.heroNewsletter}>
      <div className={styles.reviewRowTight}>
        <div className={`${styles.bodyText} ${styles.smallText}`}>
          Follow my academic and athletic journey. Connect with me on{' '}
          <a href="#linkedin-placeholder">
            <span className={styles.paragraphlink}>LinkedIn</span>
          </a>
          ,{' '}
          <a href="#instagram-placeholder">
            <span className={styles.paragraphlink}>Instagram</span>
          </a>
          ,{' '}
          <a href="https://github.com/ryleebrasseur">
            <span className={styles.paragraphlink}>GitHub</span>
          </a>
          , or reach out if you need someone who delivers results ahead of
          schedule.
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
              placeholder="your.email@msu.edu"
              type="email"
              id="Email-2"
              required
            />
            <input
              type="submit"
              data-wait="Please wait..."
              className={`${styles.buttonClassic} ${styles.wButton}`}
              value="Subscribe"
            />
          </form>
          <div
            className={`${styles.successMessage} ${styles.wFormDone}`}
            tabIndex={-1}
            role="region"
            aria-label="Email success"
          >
            <div className={styles.textBlock4}>
              Thanks for subscribing! I'll keep you updated on my journey.
            </div>
          </div>
          <div
            className={`${styles.errorMessage} ${styles.wFormFail}`}
            tabIndex={-1}
            role="region"
            aria-label="Email failure"
          >
            <div>
              Oops! Something went wrong. Please try again or email me directly.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroNewsletter
