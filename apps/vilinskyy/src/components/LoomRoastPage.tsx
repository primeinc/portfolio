import { useState } from 'react'

export default function LoomRoastPage() {
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) {
      setMessage('Submitted! We will review your project.')
      setUrl('')
    }
  }

  return (
    <section>
      <h2>Loom Roast</h2>
      <p>Submit your project link for a detailed review.</p>
      <form onSubmit={handleSubmit}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Project URL"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p role="status">{message}</p>}
    </section>
  )
}
