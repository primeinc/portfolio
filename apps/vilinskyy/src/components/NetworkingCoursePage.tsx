import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './NetworkingCoursePage.module.css'
import NewsletterForm from './NewsletterForm'

const NetworkingCoursePage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState('pro')

  const tiers = [
    {
      id: 'basic',
      name: 'Self-Study',
      price: '$297',
      description: 'Perfect for independent learners',
      features: [
        'Complete course content',
        'Video lessons & exercises',
        'Downloadable templates',
        'Email support',
        'Lifetime access',
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$597',
      popular: true,
      description: 'Most popular choice',
      features: [
        'Everything in Self-Study',
        '3 x 1-on-1 coaching calls',
        'Custom networking strategy',
        'LinkedIn profile review',
        'Priority email support',
        'Private community access',
      ],
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: '$1,497',
      description: 'Maximum results guaranteed',
      features: [
        'Everything in Professional',
        '6 x 1-on-1 coaching calls',
        'Done-for-you templates',
        'Introduction to my network',
        'WhatsApp support',
        '90-day action plan',
      ],
    },
  ]

  const testimonials = [
    {
      quote:
        'This course transformed how I approach networking. I went from dreading events to landing 3 new clients in 2 months!',
      author: 'Sarah Martinez',
      role: 'Freelance Designer',
    },
    {
      quote:
        "Alexander's framework is pure gold. The ROI on this course paid for itself within the first week.",
      author: 'David Chen',
      role: 'Startup Founder',
    },
    {
      quote:
        "I've taken many networking courses, but this one actually delivers. The energy management module alone is worth the price.",
      author: 'Emily Thompson',
      role: 'Product Manager',
    },
  ]

  const modules = [
    {
      number: '01',
      title: 'Energy Management Fundamentals',
      description: 'Master your energy to maximize networking effectiveness',
    },
    {
      number: '02',
      title: 'Strategic Relationship Building',
      description: 'Build meaningful connections that lead to opportunities',
    },
    {
      number: '03',
      title: 'Digital Networking Mastery',
      description: 'Leverage LinkedIn and social platforms for growth',
    },
    {
      number: '04',
      title: 'The Follow-Up Framework',
      description: 'Turn connections into lasting professional relationships',
    },
    {
      number: '05',
      title: 'Personal Brand Amplification',
      description: 'Position yourself as a thought leader in your industry',
    },
    {
      number: '06',
      title: 'Advanced Tactics & Case Studies',
      description: 'Real-world applications and proven strategies',
    },
  ]

  return (
    <div className={styles.coursePage}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.container}>
          <button
            onClick={() => window.history.back()}
            className={styles.backButton}
            aria-label="Go back"
          >
            ← Back
          </button>

          <h1 className={styles.title}>
            Master the Art of Professional Networking
          </h1>
          <p className={styles.subtitle}>
            Transform your career with proven networking strategies used by top
            performers in tech and creative industries
          </p>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Students</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>4.9★</span>
              <span className={styles.statLabel}>Rating</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>87%</span>
              <span className={styles.statLabel}>Success Rate</span>
            </div>
          </div>
        </div>
      </motion.div>

      <section className={styles.modules}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What You'll Learn</h2>
          <div className={styles.moduleGrid}>
            {modules.map((module, index) => (
              <motion.div
                key={module.number}
                className={styles.moduleCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className={styles.moduleNumber}>{module.number}</span>
                <h3 className={styles.moduleTitle}>{module.title}</h3>
                <p className={styles.moduleDescription}>{module.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Success Stories</h2>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className={styles.testimonialCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <blockquote className={styles.testimonialQuote}>
                  "{testimonial.quote}"
                </blockquote>
                <cite className={styles.testimonialAuthor}>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.role}</span>
                </cite>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.pricing}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Choose Your Path</h2>
          <p className={styles.pricingSubtitle}>
            Select the package that best fits your goals and learning style
          </p>

          <div className={styles.tierGrid}>
            {tiers.map((tier) => (
              <motion.div
                key={tier.id}
                className={`${styles.tierCard} ${tier.popular ? styles.popular : ''} ${selectedTier === tier.id ? styles.selected : ''}`}
                onClick={() => setSelectedTier(tier.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {tier.popular && (
                  <span className={styles.popularBadge}>Most Popular</span>
                )}
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.tierPrice}>{tier.price}</div>
                <p className={styles.tierDescription}>{tier.description}</p>
                <ul className={styles.tierFeatures}>
                  {tier.features.map((feature, index) => (
                    <li key={index}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={styles.tierButton}>
                  {selectedTier === tier.id ? 'Selected' : 'Select This Plan'}
                </button>
              </motion.div>
            ))}
          </div>

          <div className={styles.guarantee}>
            <h3>30-Day Money-Back Guarantee</h3>
            <p>
              If you're not completely satisfied with the course, get a full
              refund within 30 days. No questions asked.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Network?</h2>
          <p className={styles.ctaSubtitle}>
            Join 500+ professionals who have accelerated their careers through
            strategic networking
          </p>
          <NewsletterForm
            variant="hero"
            placeholder="Enter your email to get started"
            buttonText="Get Instant Access"
            successMessage="Check your email for course access details!"
          />
          <p className={styles.ctaNote}>
            Start learning immediately • Lifetime access • Risk-free guarantee
          </p>
        </div>
      </section>
    </div>
  )
}

export default NetworkingCoursePage
