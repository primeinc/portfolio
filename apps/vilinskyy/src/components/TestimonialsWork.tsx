import React from 'react'
import styles from './TestimonialsWork.module.css'

interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  initials: string
  highlighted?: string[] // Words to highlight in bold
}

const coachTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Watching Rylee shave 82 seconds off her 5K wasn't just impressive—it was systematic. She approached improvement like a scientist: hypothesis, test, measure, repeat. That mindset translates to everything.",
    author: 'Coach Thompson',
    role: 'Head Cross Country Coach, Lapeer High School',
    initials: 'CT',
    highlighted: ['systematic', 'approached improvement like a scientist'],
  },
  {
    id: '2',
    quote:
      "Most athletes train hard. Rylee trains smart. She'd show up with questions about interval timing, recovery protocols, mental strategies. Then she'd execute flawlessly. It's rare to find someone who thinks AND performs at that level.",
    author: 'Coach Martinez',
    role: 'Assistant Track Coach, Lapeer High School',
    initials: 'AM',
    highlighted: ['trains smart', 'thinks AND performs'],
  },
  {
    id: '3',
    quote:
      'Setting three school records in distance events requires rare determination. Rylee approached every workout with purpose and helped create a culture of excellence in our program.',
    author: 'Coach Johnson',
    role: 'Distance Running Coach, Lapeer Lightning',
    initials: 'BJ',
    highlighted: ['rare determination', 'culture of excellence'],
  },
]

const directorTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "I've directed dozens of productions. Rylee was different. She didn't just choreograph—she transformed chaos into artistry. Forty-five teenagers moving in perfect synchronization? That takes vision AND logistics mastery.",
    author: 'Ms. Fenner',
    role: 'Theater Director, Lapeer Lightning Performing Arts',
    initials: 'SF',
    highlighted: ['professional-level organization', 'remarkable'],
  },
  {
    id: '2',
    quote:
      'Rylee managed choreography rehearsals with the poise of someone twice her age. She created an inclusive environment where every cast member felt valued and capable of achieving their best.',
    author: 'Mr. Davidson',
    role: 'Music Director, Mamma Mia! Production',
    initials: 'MD',
    highlighted: ['poise', 'inclusive environment'],
  },
  {
    id: '3',
    quote:
      'Balancing AP coursework, athletics, and leading our choreography team would overwhelm most students. Rylee made it look effortless while inspiring others to push their own boundaries.',
    author: 'Ms. Chen',
    role: 'Assistant Director, Lapeer High School Theater',
    initials: 'LC',
    highlighted: ['made it look effortless', 'inspiring others'],
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

  const renderInitials = (initials: string) => (
    <div className={styles.initialsCircle}>
      <span>{initials}</span>
    </div>
  )

  return (
    <>
      {/* Coach Testimonials */}
      <div
        className={`${styles.wLayoutBlockcontainer} ${styles.reviewsBlock} ${styles.wContainer}`}
      >
        <div className={styles.reviewsRow}>
          <div className={styles.reviewRowTight}>
            <h3 className={styles.h3}>
              What happens when potential meets obsession
            </h3>
            <div className={`${styles.bodyText} ${styles.listDescription}`}>
              Honestly? I didn't think I was special. Just someone willing to
              show up when it mattered. Turns out, that's rarer than talent.
              <br />
            </div>
            <div className={styles.reviewStack}>
              {coachTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.reviewDesigner}>
                  <p className={styles.reviewBody}>
                    {renderQuoteWithHighlights(
                      testimonial.quote,
                      testimonial.highlighted
                    )}
                    <br />
                  </p>
                  <div className={styles.reviewBio}>
                    {renderInitials(testimonial.initials)}
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

      {/* Divider between testimonial sections */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#e4e4e4',
          maxWidth: '800px',
          margin: '48px auto',
        }}
      />

      {/* Director Testimonials */}
      <div
        className={`${styles.wLayoutBlockcontainer} ${styles.reviewsBlock} ${styles.wContainer}`}
      >
        <div className={styles.reviewsRow}>
          <div className={styles.reviewRowTight}>
            <h3 className={styles.h3}>
              Why creative leadership feels like second nature
            </h3>
            <div className={`${styles.bodyText} ${styles.listDescription}`}>
              <span className={styles.h3}>‍</span>Here's what I learned
              directing a musical: talent without organization creates chaos.
              Organization without vision creates mediocrity. Get both right?
              Magic happens.
              <br />
            </div>
            <div className={styles.reviewStack}>
              {directorTestimonials.map((testimonial) => (
                <div key={testimonial.id} className={styles.reviewDesigner}>
                  <p className={styles.reviewBody}>
                    {renderQuoteWithHighlights(
                      testimonial.quote,
                      testimonial.highlighted
                    )}
                    <br />
                  </p>
                  <div className={styles.reviewBio}>
                    {renderInitials(testimonial.initials)}
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
