import ProjectCard from './ProjectCard'
import InteractiveProjectItem from '../interactive-project-item/InteractiveProjectItem'
import styles from './styles.module.css'
import { motion } from 'framer-motion'

export interface Project {
  id: string
  title: string
  category?: string
  imageUrl?: string
  description?: string
  tldrLink?: string
  detailsLink?: string
}

const projectsData: Project[] = [
  {
    id: 'petlove-quiz',
    title: 'Petlove Quiz',
    category: 'Freelance',
    imageUrl: 'https://via.placeholder.com/300x200',
    description: 'Quiz platform for pet lovers.',
    detailsLink: 'https://example.com/petlove',
  },
  {
    id: 'duolingo-courses',
    title: 'Duolingo Courses',
    category: 'Duolingo',
    imageUrl: 'https://via.placeholder.com/300x200',
    description: 'UI work for language courses.',
    detailsLink: 'https://example.com/duolingo',
  },
  {
    id: 'portfolio-cookbook',
    title: 'Portfolio Cookbook',
    category: 'Instagram',
    imageUrl: 'https://via.placeholder.com/300x200',
    description: 'Digital cookbook resource.',
    detailsLink: 'https://jeremystokes.gumroad.com',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const ProjectShowcaseGrid = () => (
  <motion.section
    className={styles.projectGridContainer}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    aria-labelledby="project-showcase-title"
  >
    <h2 id="project-showcase-title" className={styles.showcaseTitle}>
      What I’ve been up to recently...
    </h2>
    <div className={styles.grid}>
      {projectsData.map((project) => (
        <InteractiveProjectItem key={project.id}>
          <ProjectCard project={project} />
        </InteractiveProjectItem>
      ))}
    </div>
  </motion.section>
)

export default ProjectShowcaseGrid
