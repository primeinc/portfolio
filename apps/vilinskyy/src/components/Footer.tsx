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
              <p className={styles.h3}>What I'm up to currently?</p>
              <p className={styles.caption}>
                Helping venture groups and early stage founders with product
                roadmap, design, hiring creatives and developers to launch
                projects and grow.
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
                <div
                  className={`${styles.successMessage} ${styles.wFormDone}`}
                  tabIndex={-1}
                  role="region"
                  aria-label="Email success"
                >
                  <div className={styles.textBlock4}>
                    Phew, it worked!
                    <br />
                    Your email is in safe hands.
                  </div>
                </div>
                <div
                  className={`${styles.errorMessage} ${styles.wFormFail}`}
                  tabIndex={-1}
                  role="region"
                  aria-label="Email failure"
                >
                  <div>
                    Fuck. I broke something...
                    <br />
                    Message me on{' '}
                    <a
                      href="http://twitter.com/vilinskyy"
                      target="_blank"
                      className={styles.link2}
                    >
                      Twitter
                    </a>{' '}
                    about it.
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.footerGroup}>
              <p className={styles.caption}>
                I'm in "genius mode" 4 hours a day and you can book me to spend
                them on your project. Contact me by{' '}
                <a href="mailto:avilinskyy@gmail.com">
                  <span className={styles.emailText}>avilinskyy@gmail.com</span>
                </a>
              </p>
            </div>
          </div>
          <div className={`${styles.divider1px} ${styles.footer}`}></div>
          <div className={styles.subFooter}>
            <p>London, UK. 2008 - infinity.</p>
            <p>
              <a href="/" aria-current="page" className={styles.wCurrent}>
                vilinskyy.com
              </a>
            </p>
          </div>
          <img
            src="https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/66a61b52aeb29192b7b401db_ScreenRecording_07-28-2024%2011-05-01_1%202.gif"
            loading="lazy"
            width="836"
            alt=""
            className={`${styles.illustration} ${styles.signature}`}
          />
        </div>
        <img
          className={styles.parkedPorsche}
          src="https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6813970699c1fddff2b4bf2b_996_p15_l.png"
          width="858"
          alt=""
          loading="lazy"
          sizes="(max-width: 991px) 100vw, 858px"
          srcSet="https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6813970699c1fddff2b4bf2b_996_p15_l-p-500.png 500w, https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6813970699c1fddff2b4bf2b_996_p15_l-p-800.png 800w, https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6813970699c1fddff2b4bf2b_996_p15_l-p-1080.png 1080w, https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6813970699c1fddff2b4bf2b_996_p15_l-p-1600.png 1600w, https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6813970699c1fddff2b4bf2b_996_p15_l.png 1716w"
        />
      </section>

      {/* Brain Load Meter */}
      <div className={styles.metricExperiment}>
        <div className={styles.appName}>Current brain load:</div>
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
