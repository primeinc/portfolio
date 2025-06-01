import React from 'react'
import styles from './HeroLogos.module.css'

const HeroLogos: React.FC = () => {
  const logos = [
    { href: 'https://grammarly.com', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c22_logo_grammarly.svg' },
    { href: 'https://tickets.ua', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c24_logo_tickets.svg' },
    { href: 'https://decipad.com', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c1a_logo_decipad.svg' },
    { href: 'https://axis.xyz', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c1c_logo_axis.svg' },
    { href: 'https://wikihow.com', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c25_logo_wikihow.svg' },
    { href: 'https://readdle.com', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/673fa57e2032a8b009277c21_logo_readdle.svg' },
    { href: 'https://sparkmailapp.com/', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/674c414422e8e2b771b37fd8_logo_spark.svg' },
    { href: 'https://pervasive.app', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/674c42b546b67e093eb3583f_logo_pervasive.svg' },
    { href: 'https://focalbrief.com', src: 'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/6777aab1764b43566dce1b2a_logo_focalbrief.svg' },
  ]

  return (
    <div className={styles.heroLogos}>
      <div className={styles.logosGrid}>
        {logos.map((logo, index) => (
          <a key={index} href={logo.href} className={styles.wInlineBlock}>
            <img 
              src={logo.src} 
              loading="lazy" 
              width="100" 
              height="33" 
              alt="" 
              className={styles.logoImage}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default HeroLogos