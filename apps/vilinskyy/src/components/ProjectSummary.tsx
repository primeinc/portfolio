import { motion } from 'framer-motion'
import styles from './ProjectSummary.module.css'

interface Props {
  title: string
  shortDescription: string
  isExpanded: boolean
  onToggle: () => void
  ariaControls: string
}

export default function ProjectSummary({
  title,
  shortDescription,
  isExpanded,
  onToggle,
  ariaControls,
}: Props) {
  return (
    <div className={styles.summaryContainer}>
      <h3 className={styles.summaryTitle}>{title}</h3>
      <p className={styles.summaryDescription}>{shortDescription}</p>
      <motion.button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={ariaControls}
        className={styles.readMoreButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </motion.button>
    </div>
  )
}
