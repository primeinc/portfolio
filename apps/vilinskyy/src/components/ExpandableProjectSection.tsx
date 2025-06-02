import { useState } from 'react'
import styles from './ExpandableProjectSection.module.css'

interface Project {
  id: string
  summary: {
    title: string
    shortDescription: string
    category?: string
  }
  detail: {
    longDescription: string
    images: string[]
    role?: string
    duration?: string
    link?: string
  }
}

export default function ExpandableProjectSection({
  project,
}: {
  project: Project
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded((v) => !v)
  }

  return (
    <div className={styles.expandableSection} onClick={toggleExpand}>
      <div className={styles.projectSummary}>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectTitle}>{project.summary.title}</h3>
          <p className={styles.projectDescription}>
            {project.summary.shortDescription}
          </p>
        </div>
        <button
          className={styles.toggleButton}
          aria-expanded={isExpanded}
          aria-controls={`project-detail-${project.id}`}
        >
          {isExpanded ? 'Close' : 'Read More'}
        </button>
      </div>

      {isExpanded && (
        <div
          id={`project-detail-${project.id}`}
          className={styles.detailContainer}
        >
          <div className={styles.detailContent}>
            {project.detail.longDescription
              .split('\n')
              .map(
                (paragraph, index) =>
                  paragraph.trim() && <p key={index}>{paragraph}</p>
              )}

            {(project.detail.role ||
              project.detail.duration ||
              project.detail.link) && (
              <div className={styles.projectMeta}>
                {project.detail.role && (
                  <span>Role: {project.detail.role}</span>
                )}
                {project.detail.duration && (
                  <span>Duration: {project.detail.duration}</span>
                )}
                {project.detail.link && project.detail.link !== '#' && (
                  <a
                    href={project.detail.link}
                    className={styles.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Project →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
