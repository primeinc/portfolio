import React from 'react'
import styles from './Footer.module.css'

const Footer: React.FC = () => {
  // Generate brain load meter blocks
  const redBlocks = Array(17).fill(0)
  const emptyBlocks = Array(103).fill(0)

  return (
    <>
      <section className={styles.sectionFooter}>
        <div
          className={`${styles.wLayoutBlockcontainer} ${styles.container} ${styles.wContainer}`}
        >
          <div className={styles.footerMegaGroup}>
            <div className={styles.footerGroup}>
              <p className={styles.h3}>Want to follow the journey?</p>
              <p className={styles.caption}>
                Real talk: this is the messy, exhilarating process of turning
                big dreams into reality. Updates on diplomatic training, running
                breakthroughs, and the occasional existential crisis that comes
                with trying to change the world at 18.
              </p>
              <div className={styles.wForm}>
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
                    You're now tracking someone who turns impossible into
                    inevitable.
                    <br />
                    Updates coming your way before they hit the headlines.
                  </div>
                </div>
                <div
                  className={`${styles.errorMessage} ${styles.wFormFail}`}
                  tabIndex={-1}
                  role="region"
                  aria-label="Email failure"
                >
                  <div>
                    Oops! Something went wrong.
                    <br />
                    Please try again or email me directly.
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.footerGroup}>
              <p className={styles.caption}>
                Got advice about diplomatic careers? Questions about balancing
                elite athletics with academics? Or just want to share your own
                impossible goal? Let's connect:{' '}
                <a href="mailto:brasse25@msu.edu">
                  <span className={styles.emailText}>brasse25@msu.edu</span>
                </a>
                <br />
                <br />
                Want to see how this site was built?{' '}
                <a
                  href="https://github.com/ryleebrasseur/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.emailText}>Check out the code →</span>
                </a>
              </p>
            </div>
          </div>
          <div className={`${styles.divider1px} ${styles.footer}`}></div>
          <div className={styles.subFooter}>
            <p>East Lansing, MI. 2024 - infinity.</p>
            <p>
              <a href="/" aria-current="page" className={styles.wCurrent}>
                ryleebrasseur.com
              </a>
            </p>
          </div>
          <img
            src="/src/assets/sig.png"
            loading="lazy"
            width="400"
            alt="Rylee Brasseur signature"
            className={`${styles.illustration} ${styles.signature}`}
          />
        </div>
      </section>

      {/* Brain Load Meter - keeping it for the quirky student vibe */}
      <div className={styles.metricExperiment}>
        <div className={styles.appName}>Cognitive bandwidth utilization:</div>
        <div
          className={`${styles.wLayoutBlockcontainer} ${styles.metric} ${styles.wContainer}`}
        >
          {redBlocks.map((_, index) => (
            <div key={`red-${index}`} className={styles.metricRed}></div>
          ))}
          {emptyBlocks.map((_, index) => (
            <div key={`empty-${index}`} className={styles.divBlock19}></div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Footer
