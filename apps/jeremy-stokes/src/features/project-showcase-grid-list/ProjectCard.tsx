import { motion } from 'framer-motion'
import styles from './styles.module.css'
import type { Project } from './ProjectShowcaseGrid'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
}

const hoverEffect = { scale: 1.03, boxShadow: '0px 8px 20px rgba(0,0,0,0.12)' }

const ProjectCard = ({ project }: { project: Project }) => {
  const { title, category, imageUrl, description, detailsLink } = project

  const handleCardClick = () => {
    if (detailsLink) {
      if (detailsLink.startsWith('http')) {
        window.open(detailsLink, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = detailsLink
      }
    }
  }

  return (
    <motion.div
      className={styles.projectCard}
      variants={cardVariants}
      whileHover={hoverEffect}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyPress={(e) =>
        (e.key === 'Enter' || e.key === ' ') && handleCardClick()
      }
      role="link"
      aria-label={`View details for project: ${title}`}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${title} screenshot`}
          className={styles.projectImage}
        />
      )}
      <div className={styles.cardContent}>
        <h3 className={styles.projectTitle}>{title}</h3>
        {category && <p className={styles.projectCategory}>{category}</p>}
        {description && (
          <p className={styles.projectDescription}>{description}</p>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectCard
