import React from 'react'
import styles from './HeroLogos.module.css'

const HeroLogos: React.FC = () => {
  const achievements = [
    {
      value: '3',
      label: 'Records Set',
      detail: 'From zero to unbeaten',
    },
    {
      value: '82',
      label: 'Seconds Shaved',
      detail: 'What obsession looks like',
    },
    {
      value: '45',
      label: 'People Choreographed',
      detail: 'While maintaining 3.8+ GPA',
    },
    {
      value: '$2,000',
      label: 'Merit Earned',
      detail: 'Before others applied',
    },
  ]

  return (
    <div className={styles.achievementsSection}>
      <div className={styles.achievementsBar}>
        {achievements.map((item, index) => (
          <div key={index} className={styles.statItem}>
            <div className={styles.statValue}>{item.value}</div>
            <div className={styles.statLabel}>{item.label}</div>
            <div className={styles.statDetail}>{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroLogos
