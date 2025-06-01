import React from 'react'
import styles from './DreamsTracker.module.css'

interface Dream {
  id: string
  text: string
  completed: boolean
  isLink?: boolean
  linkUrl?: string
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
  { id: '10', text: 'Invest in 10 startups', completed: true },
  { id: '11', text: 'Design a better OS', completed: true },
  { id: '12', text: 'Design a custom font', completed: true },
  { id: '13', text: 'Design a physical object', completed: true },
  { id: '14', text: 'Build a £100M business', completed: false },
  { id: '15', text: 'Make 20 friends rich', completed: false },
  { id: '16', text: 'Design a physical tool', completed: false },
  { id: '17', text: 'Renovate a castle', completed: false },
  {
    id: '18',
    text: 'Meet you',
    completed: false,
    isLink: true,
    linkUrl: 'https://calendar.notion.so/meet/vilinskyy/3n69c4l3c',
  },
]

// Real site uses these exact SVG URLs
const DONE_EMOJI_URL =
  'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/659c375e44aa66f46b025916_%F4%80%87%BA.svg'
const UNDONE_EMOJI_URL =
  'https://cdn.prod.website-files.com/626afc293bf3f633eda3488b/659c38d234df1a7dc8eaedc8_%F4%80%9F%86.svg'

const DreamsTracker: React.FC = () => {
  return (
    <div className={styles.divBlock37}>
      <h3 className={styles.h3}>Dreams Tracker</h3>
      <div className={styles.todoList}>
        {dreams.map((dream) => (
          <div
            key={dream.id}
            className={`${styles.todoItem} ${dream.completed ? styles.done : styles.undone}`}
          >
            <img
              src={dream.completed ? DONE_EMOJI_URL : UNDONE_EMOJI_URL}
              loading="lazy"
              alt=""
              className={dream.completed ? '' : styles.undone}
            />
            <div>
              {dream.isLink ? (
                <a href={dream.linkUrl} className={styles.hiddenLink}>
                  {dream.text}
                </a>
              ) : (
                dream.text
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DreamsTracker
