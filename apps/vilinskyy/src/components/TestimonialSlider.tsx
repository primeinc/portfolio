import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './TestimonialSlider.module.css'

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company?: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Rylee's dedication and competitive spirit transformed our entire team dynamic. She doesn't just meet expectations—she obliterates them.",
    author: 'Coach Michael Thompson',
    role: 'Head Swimming Coach',
    company: 'Michigan State University',
  },
  {
    id: '2',
    quote:
      "In 20 years of coaching, I've never seen someone combine raw talent with such relentless work ethic. Rylee is a force of nature.",
    author: 'Sarah Martinez',
    role: 'Assistant Coach',
    company: 'MSU Swimming',
  },
  {
    id: '3',
    quote:
      'When Rylee joined Model UN, she brought the same intensity she shows in the pool. Her geopolitical insights are as sharp as her butterfly stroke.',
    author: 'Dr. James Chen',
    role: 'Model UN Director',
    company: 'Michigan State University',
  },
  {
    id: '4',
    quote:
      "Watching Rylee break three school records in one season was like watching history being written. She's just getting started.",
    author: 'Lisa Johnson',
    role: 'Athletic Director',
    company: 'MSU Athletics',
  },
  {
    id: '5',
    quote:
      "Rylee's analytical approach to swimming is what sets her apart. She treats every practice like a science experiment—and the results speak for themselves.",
    author: 'Mark Stevens',
    role: 'Performance Coach',
    company: 'Elite Performance Lab',
  },
]

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>What People Say</h2>

        <div className={styles.sliderContainer}>
          <button
            onClick={handlePrevious}
            className={styles.navButton}
            aria-label="Previous testimonial"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className={styles.testimonialWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[currentIndex].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={styles.testimonialContent}
              >
                <blockquote className={styles.quote}>
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <div className={styles.authorInfo}>
                  <div className={styles.authorDetails}>
                    <cite className={styles.authorName}>
                      {testimonials[currentIndex].author}
                    </cite>
                    <p className={styles.authorRole}>
                      {testimonials[currentIndex].role}
                      {testimonials[currentIndex].company && (
                        <span className={styles.company}>
                          {' at '}
                          {testimonials[currentIndex].company}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={handleNext}
            className={styles.navButton}
            aria-label="Next testimonial"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className={styles.dots}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
