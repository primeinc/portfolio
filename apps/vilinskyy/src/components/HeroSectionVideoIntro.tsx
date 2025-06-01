import React from 'react'
import styles from './HeroSectionVideoIntro.module.css'

const HeroSectionVideoIntro: React.FC = () => {
  // Real site logo data
  const firstLogoGrid = [
    {
      href: 'https://grammarly.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c22_logo_grammarly.svg',
      alt: 'Grammarly',
    },
    {
      href: 'https://tickets.ua',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c24_logo_tickets.svg',
      alt: 'Tickets UA',
    },
    {
      href: 'https://decipad.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c1a_logo_decipad.svg',
      alt: 'Decipad',
    },
    {
      href: 'https://axis.xyz',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c1c_logo_axis.svg',
      alt: 'Axis',
    },
    {
      href: 'https://wikihow.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c25_logo_wikihow.svg',
      alt: 'WikiHow',
    },
    {
      href: 'https://readdle.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c21_logo_readdle.svg',
      alt: 'Readdle',
    },
  ]

  const secondLogoGrid = [
    {
      href: 'https://grammarly.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c22_logo_grammarly.svg',
      alt: 'Grammarly',
    },
    {
      href: 'https://sparkmailapp.com/',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/674c414422e8e2b771b37fd8_logo_spark.svg',
      alt: 'Spark',
    },
    {
      href: 'https://pervasive.app',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/674c42b546b67e093eb3583f_logo_pervasive.svg',
      alt: 'Pervasive',
    },
    {
      href: 'https://focalbrief.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6777aab1764b43566dce1b2a_logo_focalbrief.svg',
      alt: 'Focalbrief',
    },
    {
      href: 'https://wikihow.com',
      src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c25_logo_wikihow.svg',
      alt: 'WikiHow',
    },
  ]

  return (
    <div className={styles.twoColumns}>
      <div className={`${styles.mainAboutme} ${styles.slideFromBottom}`}>
        {/* Video Intro Title with Link - MUST BE FIRST IN DOM */}
        <h1 className={`${styles.h3} ${styles.loomTitle}`}>
          <a
            href="https://www.loom.com/share/294297d4ba0949be8eb98f1d4f56851f?sid=4a486978-af75-4dc7-9645-2edac6a0ad0b"
            className={styles.paragraphlink}
          >
            Video Intro
          </a>
          <br />
        </h1>

        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.h3}>
            Alexander Vilinskyy
            <br />
          </h1>

          <div className={styles.horizontalFlex}>
            <div className={`${styles.bodyText} ${styles.smallText}`}>
              Digital designer and founder of{' '}
              <a
                href="https://www.superclear.uk"
                className={styles.paragraphlink}
              >
                Super Clear
              </a>{' '}
              — design agency for tech startups.
              <br />
              <br />
              Contributed to products used by{' '}
              <a
                href="https://apps.apple.com/us/app/grammarly-grammar-keyboard/id1158877342"
                className={styles.paragraphlink}
              >
                Grammarly
              </a>
              ,{' '}
              <a
                href="https://readdle.com/spark"
                className={styles.paragraphlink}
              >
                Spark
              </a>
              ,{' '}
              <a
                href="https://readdle.com/documents"
                className={styles.paragraphlink}
              >
                Documents
              </a>
              , <br />
              <a href="https://decipad.com" className={styles.paragraphlink}>
                Decipad
              </a>
              ,{' '}
              <a href="https://pervasive.app" className={styles.paragraphlink}>
                Pervasive
              </a>
              , and more.
              <br />
              <br />
              Live in the countryside with a wife and a daughter.
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
              src="https://www.loom.com/embed/294297d4ba0949be8eb98f1d4f56851f?sid=35aa5ed9-bfc0-4476-9b37-2f2cc1a69d96"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>

        {/* Newsletter and Social Links section */}
        <div className={styles.reviewRowTight}>
          <div className={`${styles.bodyText} ${styles.smallText}`}>
            Twice a year I write an issue with updates from my life, projects,
            thoughts, links and some photos. Follow me on{' '}
            <a
              href="https://twitter.com/vilinskyy"
              className={styles.paragraphlink}
            >
              Twitter
            </a>
            ,{' '}
            <a
              href="https://linkedin.com/in/vilinskyy"
              className={styles.paragraphlink}
            >
              LinkedIn
            </a>
            ,{' '}
            <a
              href="https://instagram.com/vilinskyy"
              className={styles.paragraphlink}
            >
              Instagram
            </a>
            ,{' '}
            <a
              href="https://www.youtube.com/channel/UCZpuBPAdMSYJFzPzkdiFkdA"
              className={styles.paragraphlink}
            >
              YouTube
            </a>
            ,{' '}
            <a href="https://bsky.app/profile/vilinskyy.bsky.social">Bluesky</a>
            .
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
      </div>
    </div>
  )
}

export default HeroSectionVideoIntro
