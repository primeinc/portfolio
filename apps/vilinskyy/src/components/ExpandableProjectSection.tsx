import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectSummary from './ProjectSummary'
import ProjectDetail from './ProjectDetail'
import styles from './ExpandableProjectSection.module.css'

interface Project {
  id: string
  summary: {
    title: string
    shortDescription: string
  }
  detail: {
    longDescription: string
    images: string[]
  }
}

export default function ExpandableProjectSection({
  project,
}: {
  project: Project
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleExpand = () => setIsExpanded((v) => !v)

  return (
    <div className={styles.expandableSection}>
      <ProjectSummary
        title={project.summary.title}
        shortDescription={project.summary.shortDescription}
        isExpanded={isExpanded}
        onToggle={toggleExpand}
        ariaControls={`project-detail-${project.id}`}
      />
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4 }}
            id={`project-detail-${project.id}`}
            aria-hidden={!isExpanded}
            ref={contentRef}
            className={styles.detailContainer}
          >
            <ProjectDetail
              longDescription={project.detail.longDescription}
              images={project.detail.images}
            />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
