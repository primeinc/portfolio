import React from 'react'
import styles from './DreamsTracker.module.css'

interface Dream {
  id: string
  text: string
  completed: boolean
}

const dreams: Dream[] = [
  { id: '1', text: 'Win "Exceptional Talent"', completed: true },
  { id: '2', text: 'Move to the UK', completed: true },
  { id: '3', text: 'Buy a Porsche 911', completed: true },
  { id: '4', text: 'Work at unicorn', completed: true },
  { id: '5', text: 'Overcome depression', completed: true },
  { id: '6', text: 'Speak at a big conference', completed: true },
  { id: '7', text: 'Start a design studio', completed: true },
  { id: '8', text: "Donate £35'000", completed: true },
  { id: '9', text: 'Meet 3000 founders', completed: true },
  { id: '10', text: 'Invest in 10 startups', completed: false },
  { id: '11', text: 'Design a better OS', completed: false },
  { id: '12', text: 'Design a custom font', completed: false },
  { id: '13', text: 'Design a physical object', completed: false },
  { id: '14', text: 'Build a £100M business', completed: false },
  { id: '15', text: 'Make 20 friends rich', completed: false },
  { id: '16', text: 'Design a physical tool', completed: false },
  { id: '17', text: 'Renovate a castle', completed: false },
  { id: '18', text: 'Meet you', completed: false },
]

const DreamsTracker: React.FC = () => {
  return (
    <section className={styles.dreamsSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Dreams Tracker</h2>
        <div className={styles.dreamsList}>
          {dreams.map((dream) => (
            <div key={dream.id} className={styles.dreamItem}>
              <input
                type="checkbox"
                id={`dream-${dream.id}`}
                checked={dream.completed}
                readOnly
                className={styles.checkbox}
              />
              <label
                htmlFor={`dream-${dream.id}`}
                className={`${styles.dreamLabel} ${dream.completed ? styles.completed : ''}`}
              >
                {dream.text}
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DreamsTracker
