import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './LoomRoastPage.module.css'

interface Testimonial {
  quote: string
  author: string
  company: string
  improvement: string
}

const testimonials: Testimonial[] = [
  {
    quote: "Alexander's Loom roast was brutal but brilliant. He spotted UX issues I'd been blind to for months.",
    author: "Michael Chen",
    company: "TechFlow",
    improvement: "+47% conversion rate"
  },
  {
    quote: "20 minutes of feedback that saved us from a failed launch. Worth every penny.",
    author: "Jessica Park",
    company: "Streamline AI",
    improvement: "3x faster onboarding"
  },
  {
    quote: "The most valuable design feedback I've ever received. Completely transformed our product.",
    author: "Tom Williams",
    company: "DataSync",
    improvement: "-68% support tickets"
  }
]

const examples = [
  {
    title: "SaaS Dashboard Redesign",
    before: "Cluttered interface, 42% task completion",
    after: "Clean design, 89% task completion",
    category: "B2B SaaS"
  },
  {
    title: "E-commerce Checkout Flow",
    before: "5-step process, 31% cart abandonment",
    after: "2-step process, 12% cart abandonment",
    category: "E-commerce"
  },
  {
    title: "Mobile App Onboarding",
    before: "7 screens, 58% drop-off",
    after: "3 screens, 18% drop-off",
    category: "Mobile"
  }
]

const LoomRoastPage: React.FC = () => {
  const [formData, setFormData] = useState({
    projectUrl: '',
    email: '',
    projectType: '',
    specificQuestions: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate submission
    setIsSubmitted(true)
    setTimeout(() => {
      setFormData({
        projectUrl: '',
        email: '',
        projectType: '',
        specificQuestions: ''
      })
      setIsSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className={styles.roastPage}>
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
          
          <h1 className={styles.title}>Get Your Design Roasted</h1>
          <p className={styles.subtitle}>
            Honest, actionable feedback on your product design delivered via personalized Loom video
          </p>
          
          <div className={styles.valueProps}>
            <div className={styles.valueProp}>
              <span className={styles.valueIcon}>🔥</span>
              <span>Brutally Honest</span>
            </div>
            <div className={styles.valueProp}>
              <span className={styles.valueIcon}>🎯</span>
              <span>Actionable Insights</span>
            </div>
            <div className={styles.valueProp}>
              <span className={styles.valueIcon}>⚡</span>
              <span>48hr Delivery</span>
            </div>
          </div>
        </div>
      </motion.div>

      <section className={styles.process}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.steps}>
            <motion.div 
              className={styles.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.stepNumber}>1</div>
              <h3>Submit Your Project</h3>
              <p>Share your URL and tell me what specific areas you want feedback on</p>
            </motion.div>
            <motion.div 
              className={styles.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.stepNumber}>2</div>
              <h3>I Record Your Roast</h3>
              <p>15-20 minute Loom video with detailed UX/UI analysis and recommendations</p>
            </motion.div>
            <motion.div 
              className={styles.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.stepNumber}>3</div>
              <h3>Implement & Improve</h3>
              <p>Get your video within 48 hours with timestamps and priority action items</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.examples}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Recent Roasts</h2>
          <div className={styles.exampleGrid}>
            {examples.map((example, index) => (
              <motion.div 
                key={index}
                className={styles.exampleCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className={styles.exampleCategory}>{example.category}</span>
                <h3>{example.title}</h3>
                <div className={styles.beforeAfter}>
                  <div>
                    <strong>Before:</strong>
                    <p>{example.before}</p>
                  </div>
                  <div>
                    <strong>After:</strong>
                    <p>{example.after}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What Founders Say</h2>
          <div className={styles.testimonialGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <blockquote>"{testimonial.quote}"</blockquote>
                <cite>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.company}</span>
                </cite>
                <div className={styles.improvement}>{testimonial.improvement}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.form}>
        <div className={styles.container}>
          <motion.div 
            className={styles.formCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Get Your Loom Roast</h2>
            <p className={styles.formSubtitle}>
              One-time fee: <strong>$299</strong> • Delivered within 48 hours
            </p>
            
            <form onSubmit={handleSubmit} className={styles.roastForm}>
              <div className={styles.formGroup}>
                <label htmlFor="projectUrl">Project URL *</label>
                <input
                  type="url"
                  id="projectUrl"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  placeholder="https://your-project.com"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="projectType">Project Type *</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select project type</option>
                  <option value="saas">SaaS Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="portfolio">Portfolio/Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="specificQuestions">Specific Areas for Feedback (Optional)</label>
                <textarea
                  id="specificQuestions"
                  name="specificQuestions"
                  value={formData.specificQuestions}
                  onChange={handleChange}
                  placeholder="What specific aspects would you like me to focus on?"
                  rows={4}
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitted}
              >
                {isSubmitted ? (
                  <span>Submitting...</span>
                ) : (
                  <>Get Roasted for $299</>
                )}
              </button>
              
              {isSubmitted && (
                <motion.p 
                  className={styles.successMessage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ✅ Thank you! Check your email for payment instructions.
                </motion.p>
              )}
            </form>
            
            <p className={styles.formNote}>
              💡 <strong>Pro tip:</strong> The more context you provide, the more valuable your roast will be!
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default LoomRoastPage