import React from 'react'
import styles from './HeroSectionVideoIntro.module.css'
import {
  TRACK_RECORD_800M_BADGE,
  TRACK_RECORD_1600M_BADGE,
  TRACK_RECORD_3200M_BADGE,
  AP_SCHOLAR_BADGE,
  SCHOLARSHIP_BADGE,
  CHOREOGRAPHER_BADGE,
  ALL_LEAGUE_BADGE,
  TEAM_CHAMPION_BADGE,
  MSU_JMC_BADGE,
  DISTANCE_RUNNER_BADGE,
  LEADER_FUND_BADGE,
} from '../assets/svgData'

const HeroSectionVideoIntro: React.FC = () => {
  // Rylee's achievement badges
  const firstLogoGrid = [
    {
      href: '#track-records',
      src: TRACK_RECORD_800M_BADGE,
      alt: '800m Record: 2:27.62',
    },
    {
      href: '#track-records',
      src: TRACK_RECORD_1600M_BADGE,
      alt: '1600m Record: 5:30.15',
    },
    {
      href: '#track-records',
      src: TRACK_RECORD_3200M_BADGE,
      alt: '3200m Record: 11:46.47',
    },
    {
      href: '#ap-scholar',
      src: AP_SCHOLAR_BADGE,
      alt: 'AP Scholar 2023',
    },
    {
      href: '#scholarships',
      src: SCHOLARSHIP_BADGE,
      alt: '$2,000 in Scholarships',
    },
    {
      href: '#mamma-mia',
      src: CHOREOGRAPHER_BADGE,
      alt: 'Student Choreographer - Mamma Mia!',
    },
  ]

  const secondLogoGrid = [
    {
      href: '#cross-country',
      src: ALL_LEAGUE_BADGE,
      alt: 'All-League Cross Country',
    },
    {
      href: '#team-success',
      src: TEAM_CHAMPION_BADGE,
      alt: 'Lapeer Lightning Champions',
    },
    {
      href: 'https://jmc.msu.edu',
      src: MSU_JMC_BADGE,
      alt: 'MSU James Madison College',
    },
    {
      href: '#distance-running',
      src: DISTANCE_RUNNER_BADGE,
      alt: 'Distance Runner',
    },
    {
      href: '#leader-fund',
      src: LEADER_FUND_BADGE,
      alt: 'LEADER Fund Recipient',
    },
  ]

  return (
    <div className={styles.twoColumns}>
      <div className={`${styles.mainAboutme} ${styles.slideFromBottom}`}>
        {/* Video Intro Title with Link - MUST BE FIRST IN DOM */}
        <h1 className={`${styles.h3} ${styles.loomTitle}`}>
          <a
            href="https://www.loom.com/share/placeholder-rylee-journey-to-msu"
            className={styles.paragraphlink}
          >
            My Journey to MSU
          </a>
          <br />
        </h1>

        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.h3}>
            Rylee Brasseur
            <br />
          </h1>

          <div className={styles.horizontalFlex}>
            <div className={`${styles.bodyText} ${styles.smallText}`}>
              International Relations scholar and record-setting distance runner
              at Michigan State University's James Madison College
              <br />
              <br />
              International Relations student at{' '}
              <a href="https://jmc.msu.edu" className={styles.paragraphlink}>
                James Madison College
              </a>
              , Michigan State University's residential college for public
              affairs.
              <br />
              <br />
              High school achievements include{' '}
              <a href="#ap-scholar" className={styles.paragraphlink}>
                AP Scholar
              </a>{' '}
              recognition, choreographing{' '}
              <a href="#mamma-mia" className={styles.paragraphlink}>
                Mamma Mia!
              </a>{' '}
              for 45 cast members, and setting three{' '}
              <a href="#track-records" className={styles.paragraphlink}>
                school track records
              </a>
              .
              <br />
              <br />
              Currently training with MSU's distance running community while
              pursuing diplomatic career preparation.
            </div>
          </div>
        </div>

        {/* First Logo Grid */}
        <div className={styles.logosBlock}>
          <div className={styles.logosGrid2}>
            {firstLogoGrid.map((logo, index) => (
              <a key={index} href={logo.href} className={styles.wInlineBlock}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logoGrid2}
                  width="96"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Second Logo Grid */}
        <div className={styles.logosGrid}>
          {secondLogoGrid.map((logo, index) => (
            <a
              key={index}
              href={logo.href}
              className={`${styles.logoDiv} ${styles.wInlineBlock}`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={styles.logoGrid}
                width="96"
                loading="lazy"
              />
            </a>
          ))}
        </div>

        {/* Loom Video Holder */}
        <div className={styles.loomHolder}>
          <div
            className={`${styles.loomVideoEmb} ${styles.wEmbed} ${styles.wIframe}`}
          >
            <iframe
              className={styles.loomVideoEmb}
              src="https://www.loom.com/embed/placeholder-rylee-journey-to-msu"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>

        {/* Newsletter and Social Links section */}
        <div className={styles.reviewRowTight}>
          <div className={`${styles.bodyText} ${styles.smallText}`}>
            Follow my academic and athletic journey. Connect with me on{' '}
            <a href="#linkedin-placeholder" className={styles.paragraphlink}>
              LinkedIn
            </a>
            ,{' '}
            <a href="#instagram-placeholder" className={styles.paragraphlink}>
              Instagram
            </a>
            , or reach out about International Relations, distance running, or
            student life at MSU.
            <br />
          </div>

          {/* Newsletter Form */}
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
                placeholder="mailto:your.email@msu.edu"
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
                Oops! Something went wrong. Please try again or email me
                directly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSectionVideoIntro
