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
  // Foundation built (ages 16-18)
  { id: '1', text: 'Master the art of impossible timelines', completed: true },
  {
    id: '2',
    text: 'Turn 22:22 into 21:40 through systematic obsession',
    completed: true,
  },
  {
    id: '3',
    text: 'Lead 45 people while excelling in AP courses',
    completed: true,
  },
  {
    id: '4',
    text: 'Earn merit recognition in competitive talent pools',
    completed: true,
  },
  {
    id: '5',
    text: 'Break three school records that stood for years',
    completed: true,
  },
  {
    id: '6',
    text: 'Navigate complex creative projects under pressure',
    completed: true,
  },
  {
    id: '7',
    text: 'Access elite academic programs (James Madison College)',
    completed: true,
  },
  {
    id: '8',
    text: 'Validate that excellence is a skill, not luck',
    completed: true,
  },

  // Strategic expansion (college years)
  {
    id: '9',
    text: 'Achieve sub-20:00 5K while mastering international law',
    completed: false,
  },
  {
    id: '10',
    text: 'Lead Model UN delegations to victory at nationals',
    completed: false,
  },
  {
    id: '11',
    text: 'Secure Geneva summer program (Graduate Institute)',
    completed: false,
  },
  {
    id: '12',
    text: 'Fluent Mandarin conversations by sophomore spring',
    completed: false,
  },
  {
    id: '13',
    text: 'State Department internship before junior year',
    completed: false,
  },
  {
    id: '14',
    text: 'Present research at international policy conferences',
    completed: false,
  },
  {
    id: '15',
    text: 'Build relationships with future diplomatic leaders',
    completed: false,
  },
  {
    id: '16',
    text: 'Develop specialized expertise in conflict resolution',
    completed: false,
  },
  {
    id: '17',
    text: 'Partner with someone who thinks in decades, not semesters',
    completed: false,
    isLink: true,
    linkUrl: 'mailto:brasse25@msu.edu',
  },
]

// Using simple checkmark and circle symbols instead of external SVGs
const DONE_SYMBOL = '✓'
const UNDONE_SYMBOL = '○'

const DreamsTracker: React.FC = () => {
  return (
    <div className={styles.divBlock37}>
      <h3 className={styles.h3}>
        Strategic Roadmap: From High School to High Stakes
      </h3>
      <div className={styles.todoList}>
        {dreams.map((dream) => (
          <div
            key={dream.id}
            className={`${styles.todoItem} ${dream.completed ? styles.done : styles.undone}`}
          >
            <span
              className={`${styles.symbol} ${dream.completed ? styles.doneSymbol : styles.undoneSymbol}`}
            >
              {dream.completed ? DONE_SYMBOL : UNDONE_SYMBOL}
            </span>
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
