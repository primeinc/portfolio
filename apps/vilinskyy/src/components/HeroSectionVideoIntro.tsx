import React, { useState } from 'react'
import styles from './HeroSectionVideoIntro.module.css'
import SocialMediaLinks from './SocialMediaLinks'
import NewsletterForm from './NewsletterForm'

const HeroSectionVideoIntro: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const handlePlayVideo = () => {
    setIsVideoPlaying(true)
    // In a real implementation, this would play the video
  }

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <h1 className={styles.heroTitle}>Alexander Vilinskyy</h1>

        <p className={styles.heroDescription}>
          Digital designer and founder of{' '}
          <a href="https://superclear.xyz" className={styles.link}>
            Super Clear
          </a>{' '}
          — design studio for early stage startups. Based in London, often in
          NYC/SF.
        </p>

        <p className={styles.heroDescription}>
          Bootstrapped profitable businesses, worked on consumer brands and led
          creative product teams. Worked with startups like{' '}
          <a
            href="https://apps.apple.com/us/app/grammarly-grammar-keyboard/id1158877342"
            className={styles.link}
          >
            Grammarly
          </a>
          ,{' '}
          <a href="https://readdle.com/spark" className={styles.link}>
            Spark
          </a>
          , and{' '}
          <a href="https://readdle.com/documents" className={styles.link}>
            Documents
          </a>
          , as well as hundreds of productivity and communication apps.
        </p>

        {/* Social Media Links */}
        <SocialMediaLinks />

        {/* Video Container */}
        <div className={styles.videoContainer}>
          <div className={styles.videoThumbnail}>
            <div className={styles.videoInfo}>
              <span className={styles.videoTitle}>
                🎥 Alexander Vilinskyy Intro
              </span>
              <span className={styles.videoDuration}>57 sec</span>
            </div>
            <button
              className={styles.playButton}
              onClick={handlePlayVideo}
              aria-label="Play video introduction"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
            <div className={styles.videoIcons}>
              <button
                className={styles.iconButton}
                aria-label="10 seconds back"
              >
                ⏪ 10
              </button>
              <button className={styles.iconButton} aria-label="Playback speed">
                1x
              </button>
              <button
                className={styles.iconButton}
                aria-label="Closed captions"
              >
                CC
              </button>
              <button className={styles.iconButton} aria-label="Share">
                🔗
              </button>
              <button className={styles.iconButton} aria-label="Fullscreen">
                ⛶
              </button>
            </div>
          </div>
          {isVideoPlaying && (
            <div className={styles.videoPlayer}>
              {/* Video player would go here */}
              <p>Video player placeholder</p>
            </div>
          )}
        </div>

        {/* Logo grid */}
        <div className={styles.logoGrid}>
          <a
            href="https://grammarly.com"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Grammarly_Logo.svg/320px-Grammarly_Logo.svg.png"
              alt="Grammarly"
              className={styles.logoImage}
            />
          </a>
          <a
            href="https://sparkmailapp.com/"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Spark</div>
          </a>
          <a
            href="https://pervasive.app"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Pervasive</div>
          </a>
          <a
            href="https://focalbrief.com"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>FocalBrief</div>
          </a>
          <a
            href="https://wikihow.com"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/WikiHow_logo.svg/320px-WikiHow_logo.svg.png"
              alt="wikiHow"
              className={styles.logoImage}
            />
          </a>
          <a
            href="https://axis.xyz"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Axis</div>
          </a>
          <a
            href="https://tickets.ua"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Tickets</div>
          </a>
          <a
            href="https://readdle.com"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://readdle.com/assets/img/readdle-logo.svg"
              alt="Readdle"
              className={styles.logoImage}
            />
          </a>
          <a
            href="https://context.ai"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Context</div>
          </a>
          <a
            href="https://daylightcomputer.com/"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Daylight</div>
          </a>
          <a
            href="https://tessl.ai"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>Tessl</div>
          </a>
          <a
            href="https://complexchaos.ai"
            className={styles.logoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.logoPlaceholder}>ComplexChaos</div>
          </a>
        </div>

        {/* Newsletter Text and Form */}
        <p className={styles.newsletterText}>
          Twice a year I write an issue with updates from my life, projects,
          thoughts, links and some photos. Follow me on{' '}
          <a href="https://twitter.com/alexandervilin" className={styles.link}>
            Twitter
          </a>
          ,{' '}
          <a
            href="https://linkedin.com/in/alexandervilinskyy"
            className={styles.link}
          >
            LinkedIn
          </a>
          ,{' '}
          <a
            href="https://instagram.com/alexandervilin"
            className={styles.link}
          >
            Instagram
          </a>
          ,{' '}
          <a
            href="https://youtube.com/@alexandervilinskyy"
            className={styles.link}
          >
            YouTube
          </a>
          ,{' '}
          <a
            href="https://bsky.app/profile/alexandervilin.bsky.social"
            className={styles.link}
          >
            Bluesky
          </a>
          .
        </p>
        <NewsletterForm placeholder="main@email.com" />
      </div>
    </section>
  )
}

export default HeroSectionVideoIntro
