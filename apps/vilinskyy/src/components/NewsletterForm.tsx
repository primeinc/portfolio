import { useState } from 'react'
import styles from './NewsletterForm.module.css'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate async submission
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMessage('Thank you for subscribing!')
      setEmail('')
    } else {
      setMessage('Please enter a valid email.')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Subscribe</button>
      {message && <p role="status">{message}</p>}
    </form>
  )
}
