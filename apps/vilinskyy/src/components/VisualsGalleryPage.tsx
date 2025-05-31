import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './VisualsGalleryPage.module.css'

interface Visual {
  id: string
  title: string
  category: 'ui' | 'branding' | 'motion' | 'illustration'
  thumbnail: string
  fullSize: string
  description: string
  client?: string
  year: string
}

const visuals: Visual[] = [
  {
    id: '1',
    title: 'Decipad Design System',
    category: 'ui',
    thumbnail: '/images/decipad-thumb.jpg',
    fullSize: '/images/decipad-full.jpg',
    description: 'Complete design system for Decipad including components, patterns, and guidelines',
    client: 'Decipad',
    year: '2023'
  },
  {
    id: '2',
    title: 'Grammarly Mobile Redesign',
    category: 'ui',
    thumbnail: '/images/grammarly-thumb.jpg',
    fullSize: '/images/grammarly-full.jpg',
    description: 'Mobile app redesign focusing on writing experience and AI suggestions',
    client: 'Grammarly',
    year: '2023'
  },
  {
    id: '3',
    title: 'Super Clear Brand Identity',
    category: 'branding',
    thumbnail: '/images/superclear-thumb.jpg',
    fullSize: '/images/superclear-full.jpg',
    description: 'Brand identity for design studio including logo, colors, and typography',
    year: '2022'
  },
  {
    id: '4',
    title: 'Spark Email Interactions',
    category: 'motion',
    thumbnail: '/images/spark-thumb.jpg',
    fullSize: '/images/spark-full.jpg',
    description: 'Micro-interactions and animations for email client',
    client: 'Readdle',
    year: '2023'
  },
  {
    id: '5',
    title: 'Productivity Icons Set',
    category: 'illustration',
    thumbnail: '/images/icons-thumb.jpg',
    fullSize: '/images/icons-full.jpg',
    description: 'Custom icon set for productivity applications',
    year: '2023'
  },
  {
    id: '6',
    title: 'Unicorn Platform Dashboard',
    category: 'ui',
    thumbnail: '/images/unicorn-thumb.jpg',
    fullSize: '/images/unicorn-full.jpg',
    description: 'Analytics dashboard design with data visualization',
    client: 'Unicorn Platform',
    year: '2022'
  },
  {
    id: '7',
    title: 'Motion Design Reel',
    category: 'motion',
    thumbnail: '/images/motion-thumb.jpg',
    fullSize: '/images/motion-full.jpg',
    description: 'Collection of motion design work for various clients',
    year: '2023'
  },
  {
    id: '8',
    title: 'AI & Dev Tools Branding',
    category: 'branding',
    thumbnail: '/images/aitools-thumb.jpg',
    fullSize: '/images/aitools-full.jpg',
    description: 'Branding for AI-powered development tools',
    client: 'AI & Dev Tools',
    year: '2023'
  }
]

const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'ui', label: 'UI Design' },
  { id: 'branding', label: 'Branding' },
  { id: 'motion', label: 'Motion' },
  { id: 'illustration', label: 'Illustration' }
]

const VisualsGalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVisual, setSelectedVisual] = useState<Visual | null>(null)

  const filteredVisuals = selectedCategory === 'all' 
    ? visuals 
    : visuals.filter(v => v.category === selectedCategory)

  return (
    <div className={styles.galleryPage}>
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button 
            onClick={() => window.history.back()} 
            className={styles.backButton}
            aria-label="Go back"
          >
            ← Back
          </button>
          <h1 className={styles.title}>Visual Gallery</h1>
          <p className={styles.subtitle}>
            A collection of my design work spanning UI, branding, motion, and illustration
          </p>
        </motion.div>

        <motion.div 
          className={styles.filters}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.filterButton} ${selectedCategory === category.id ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        <motion.div 
          className={styles.grid}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredVisuals.map((visual, index) => (
              <motion.div
                key={visual.id}
                className={styles.gridItem}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05
                }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedVisual(visual)}
              >
                <div className={styles.imageWrapper}>
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.categoryBadge}>{visual.category}</span>
                  </div>
                  <div className={styles.overlay}>
                    <h3 className={styles.visualTitle}>{visual.title}</h3>
                    <p className={styles.visualYear}>{visual.year}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedVisual && (
          <motion.div 
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVisual(null)}
          >
            <motion.div 
              className={styles.lightboxContent}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedVisual(null)}
                aria-label="Close"
              >
                ×
              </button>
              <div className={styles.lightboxImage}>
                <div className={styles.lightboxPlaceholder}>
                  {selectedVisual.title}
                </div>
              </div>
              <div className={styles.lightboxInfo}>
                <h2>{selectedVisual.title}</h2>
                <p className={styles.lightboxDescription}>{selectedVisual.description}</p>
                <div className={styles.lightboxMeta}>
                  {selectedVisual.client && (
                    <span>Client: {selectedVisual.client}</span>
                  )}
                  <span>Year: {selectedVisual.year}</span>
                  <span className={styles.categoryTag}>{selectedVisual.category}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VisualsGalleryPage