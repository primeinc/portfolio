import React from 'react'
import styles from './TestimonialsWork.module.css'

interface Testimonial {
  id: string
  quote: string
  author: string
  company: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Many designers don't understand the interaction aspect as well as Alexander did. For the most time of my career I haven't had such a workflow with designers.",
    author: 'Leon',
    company: 'CommitClub',
  },
  {
    id: '2',
    quote:
      "Alexander's collaborative and direct leadership style drive focus on what matters, especially in fast-paced and early stage environments. Building alongside Alex is a joy.",
    author: 'Kelly McEttrick',
    company: 'Co-Founder at Decipad',
  },
  {
    id: '3',
    quote:
      'Alexander is a rare designer that combines a high creative vision with a focus on implementation and results. He brings a unique balance between creativity and speed of execution.',
    author: 'Renato Valdés Olmos',
    company: 'Grammarly',
  },
  {
    id: '4',
    quote:
      "Working with Alex was a pleasure. He's a very talented designer with a great eye for detail and a deep understanding of user experience. He's also a great communicator and collaborator.",
    author: 'Eugene Plokhoj',
    company: 'Readdle',
  },
]

const TestimonialsWork: React.FC = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>What people say about my work</h2>
        <div className={styles.testimonialsList}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialItem}>
              <blockquote className={styles.quote}>
                "{testimonial.quote}"
              </blockquote>
              <cite className={styles.author}>
                {testimonial.author} / {testimonial.company}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsWork
