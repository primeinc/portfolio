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
    quote: "Alexander's work on our design system was transformative. He brought clarity to complex problems and delivered solutions that scaled beautifully.",
    author: "Sarah Chen",
    role: "VP of Product",
    company: "Grammarly",
  },
  {
    id: '2',
    quote: "Working with Alexander was a game-changer for our startup. His ability to balance user needs with business goals is exceptional.",
    author: "Marcus Williams",
    role: "Founder & CEO",
    company: "Decipad",
  },
  {
    id: '3',
    quote: "Alexander doesn't just design interfaces, he designs experiences. His work on Spark helped us reimagine what email could be.",
    author: "Elena Rodriguez",
    role: "Head of Design",
    company: "Readdle",
  },
  {
    id: '4',
    quote: "I've worked with many designers, but Alexander's strategic thinking sets him apart. He sees the bigger picture while nailing the details.",
    author: "James Park",
    role: "Product Manager",
    company: "Unicorn Platform",
  },
  {
    id: '5',
    quote: "Alexander's energy management course changed how I work. I'm more productive and creative than ever before.",
    author: "Lisa Thompson",
    role: "Creative Director",
    company: "Freelance",
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
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                transition={{ duration: 0.3, ease: "easeInOut" }}
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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