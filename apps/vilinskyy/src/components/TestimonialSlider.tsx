import { useEffect, useState } from 'react'
import styles from './TestimonialSlider.module.css'

const testimonials = [
  { id: 1, text: 'Great collaborator!' },
  { id: 2, text: 'Highly recommended.' },
  { id: 3, text: 'Delivered fantastic results.' },
]

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className={styles.slider}>
      <div className={styles.slide}>{testimonials[index]?.text || ''}</div>
      <button onClick={() => setIndex((index + 1) % testimonials.length)}>
        Next
      </button>
    </section>
  )
}
