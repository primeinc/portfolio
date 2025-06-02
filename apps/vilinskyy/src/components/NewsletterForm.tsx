import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './NewsletterForm.module.css'

interface NewsletterFormProps {
  variant?: 'default' | 'inline' | 'hero'
  placeholder?: string
  buttonText?: string
  successMessage?: string
}

export default function NewsletterForm({
  variant = 'default',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  successMessage = 'Thank you! Check your email to confirm your subscription.',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate success
      setStatus('success')
      setMessage(successMessage)
      setEmail('')

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form
      className={`${styles.form} ${styles[variant]}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.formContent}>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className={styles.input}
            disabled={status === 'loading' || status === 'success'}
            aria-label="Email address"
            aria-invalid={status === 'error'}
            aria-describedby={message ? 'newsletter-message' : undefined}
          />
          {variant === 'inline' && (
            <button
              type="submit"
              className={styles.submitButton}
              disabled={status === 'loading' || status === 'success'}
              aria-busy={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className={styles.spinner} aria-label="Loading" />
              ) : status === 'success' ? (
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                buttonText
              )}
            </button>
          )}
        </div>

        {variant !== 'inline' && (
          <motion.button
            type="submit"
            className={styles.submitButton}
            disabled={status === 'loading' || status === 'success'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-busy={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className={styles.spinner} aria-label="Loading" />
            ) : status === 'success' ? (
              <>
                <svg
                  className={styles.checkIcon}
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    fill="currentColor"
                  />
                </svg>
                Success!
              </>
            ) : (
              buttonText
            )}
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            id="newsletter-message"
            className={`${styles.message} ${styles[status]}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-live="polite"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}
