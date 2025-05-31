import { motion } from 'framer-motion'
import styles from './styles.module.css'

const HeroSectionBoldTypography = () => (
  <section className={styles.hero}>
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={styles.title}
    >
      Jeremy Stokes
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={styles.subtitle}
    >
      Product Designer &amp; Developer
    </motion.p>
  </section>
)

export default HeroSectionBoldTypography
