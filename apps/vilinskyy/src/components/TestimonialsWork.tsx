import React from 'react'
import styles from './TestimonialsWork.module.css'

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  avatar: string
  highlighted?: string[] // Words to highlight in bold
}

const workTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Alexander's collaborative and direct leadership style drive focus on what matters, especially in fast-paced and early stage environments. Building alongside Alex is a joy.",
    author: 'Kelly McEttrick',
    role: 'Co-Founder at Decipad',
    avatar:
      'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/65bf741467c2d3e3642d96b1_1651720281189.jpg',
    highlighted: ['Building alongside Alex is a joy.'],
  },
  {
    id: '2',
    quote:
      "Alexander is a highly empathetic and impactful product thinker. He pushes what's best for the user, his process cuts through ambiguity, and his designs are highly effective.",
    author: 'Renato Valdés Olmos',
    role: 'Head of Design at Grammarly',
    avatar:
      'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/65bf741cc82767caef14d197_1544110241352.jpg',
    highlighted: ['his designs are highly effective.'],
  },
  {
    id: '3',
    quote:
      "Alex is one of the most professional and talented designers I've ever known. His communication skills and out of the box thinking inspire the team to achieve higher results together.",
    author: 'Eugene Plokhoj',
    role: 'Head of Product at Readdle',
    avatar:
      'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/66559402303d430d8f41cc49_12063485_904418929612036_3331580916230658577_n.jpg',
    highlighted: ['inspire the team'],
  },
]

const managementTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Alexander has built clear, transparent process compared to all other jobs I had. I had a space for freedom, opportunities, creativity, and rare trust on multiple projects that we finished together.',
    author: 'Kolom',
    role: 'Motion Design at Super Clear',
    avatar:
      'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/65bf6e1d77a6b18b998df3cb_photo_2024-02-04%2010.59.07.jpeg',
    highlighted: ['process'],
  },
  {
    id: '2',
    quote:
      'The creative process by Alexander made him the best design manager I ever worked with and his creative direction is unique. He rapidly gets all aspects and helps you exceed your own expectations.',
    author: 'Dmytro',
    role: 'Concept Design at Super Clear',
    avatar:
      'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/65bf6e254a24cfd131e4b7f4_photo_2024-02-04%2010.59.16.jpeg',
    highlighted: ['creative direction'],
  },
  {
    id: '3',
    quote:
      'I was hired by Alexander and no one came close to his level of empathy, clarity and support. I could always rely on his judgement and make sure I was safe making bold decisions and get his support.',
    author: 'Anna',
    role: 'Design Lead at Decipad',
    avatar:
      'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/65c0fa8e797a98a093aba669_Photo%2002.03.2023%2C%2011%2041%2047%20copy%20(1)%20Small.jpeg',
    highlighted: ['empathy'],
  },
]

const TestimonialsWork: React.FC = () => {
  const renderQuoteWithHighlights = (quote: string, highlights?: string[]) => {
    if (!highlights || highlights.length === 0) return quote

    let processedQuote = quote
    highlights.forEach((highlight) => {
      processedQuote = processedQuote.replace(
        highlight,
        `<span class="${styles.bold}">${highlight}</span>`
      )
    })

    return <span dangerouslySetInnerHTML={{ __html: processedQuote }} />
  }

  return (
    <>
      {/* Work Testimonials */}
      <div
        className={`${styles.wLayoutBlockcontainer} ${styles.reviewsBlock} ${styles.wContainer}`}
      >
        <div className={styles.reviewsRow}>
          <div className={styles.reviewRowTight}>
            <h3 className={styles.h3}>What people say about my work</h3>
            <div className={`${styles.bodyText} ${styles.listDescription}`}>
              When I'm hired by founders, they receive a bundle of my
              "features": workbooks of progress, team management, creative
              direction, and zoom jokes.
              <br />
            </div>
            <div className={styles.reviewStack}>
              {workTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.reviewDesigner}>
                  <p className={styles.reviewBody}>
                    {renderQuoteWithHighlights(
                      testimonial.quote,
                      testimonial.highlighted
                    )}
                    <br />
                  </p>
                  <div className={styles.reviewBio}>
                    <img
                      src={testimonial.avatar}
                      loading="lazy"
                      width="24"
                      height="24"
                      alt=""
                      className={`${styles.reviewPicture} ${styles.designers}`}
                    />
                    <p className={styles.reviewName}>
                      <strong className={styles.boldText7}>
                        {testimonial.author}
                      </strong>
                      , {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Management Testimonials */}
      <div
        className={`${styles.wLayoutBlockcontainer} ${styles.reviewsBlock} ${styles.wContainer}`}
      >
        <div className={styles.reviewsRow}>
          <div className={styles.reviewRowTight}>
            <h3 className={styles.h3}>What people say about my management</h3>
            <div className={`${styles.bodyText} ${styles.listDescription}`}>
              <span className={styles.h3}>‍</span>I build creative teams to
              create world-class product and design. I made dozens of great
              hires, who delivered the project to 100%&nbsp;and stayed within
              their teams for years.
              <br />
            </div>
            <div className={styles.reviewStack}>
              {managementTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.reviewDesigner}>
                  <p className={styles.reviewBody}>
                    {renderQuoteWithHighlights(
                      testimonial.quote,
                      testimonial.highlighted
                    )}
                    <br />
                  </p>
                  <div className={styles.reviewBio}>
                    <img
                      src={testimonial.avatar}
                      loading="lazy"
                      width="24"
                      height="24"
                      alt=""
                      className={`${styles.reviewPicture} ${styles.designers}`}
                    />
                    <p className={styles.reviewName}>
                      <strong className={styles.boldText7}>
                        {testimonial.author}
                      </strong>
                      , {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TestimonialsWork
