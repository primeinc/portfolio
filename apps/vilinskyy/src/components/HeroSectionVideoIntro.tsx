import styles from './HeroSectionVideoIntro.module.css'

export default function HeroSectionVideoIntro() {
  // Using YouTube embed for quick video intro
  return (
    <section className={styles.hero}>
      <div className={styles.videoWrapper}>
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
          title="Intro Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
      <h1 className={styles.title}>Welcome to Vilinskyy Portfolio</h1>
    </section>
  )
}
