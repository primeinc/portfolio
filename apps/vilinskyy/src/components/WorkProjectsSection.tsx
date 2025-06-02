import React from 'react'
import styles from './WorkProjectsSection.module.css'

interface TimelineItem {
  id: string
  year: string
  name: string
  detail?: string
}

interface FocusArea {
  id: string
  name: string
  description: string
  link?: string
  className: string
}

interface LearningItem {
  title: string
  description: string
  link?: string
}

const pastAchievements: TimelineItem[] = [
  {
    id: '1',
    year: '2012',
    name: 'I discovered competitive drive',
    detail: '(Archery Champion, age 6)',
  },
  {
    id: '2',
    year: '2022',
    name: 'I joined varsity as a junior',
    detail: '(Cross Country, 22:22 PR)',
  },
  {
    id: '3',
    year: '2023',
    name: 'I led while performing',
    detail: '(Choreographed 45-person cast)',
  },
  {
    id: '4',
    year: '2023',
    name: 'I proved academic excellence',
    detail: '(AP Scholar recognition)',
  },
  {
    id: '5',
    year: '2024',
    name: 'I rewrote school history',
    detail: '(3 distance records broken)',
  },
]

const focusAreas: FocusArea[] = [
  {
    id: '1',
    name: 'International Relations',
    description:
      'Focusing on diplomatic relations, global security, and international law at James Madison College. Preparing for careers in foreign service and global policy.',
    link: 'https://jmc.msu.edu',
    className: styles.green,
  },
  {
    id: '2',
    name: 'Athletic Development',
    description:
      'Training with MSU distance running community. Building endurance, mental toughness, and leadership skills that translate beyond the track.',
    link: undefined,
    className: styles.orange,
  },
  {
    id: '3',
    name: 'Leadership Growth',
    description:
      'From choreographing musicals to captaining teams, developing skills in project management, creative direction, and inspiring collaborative excellence.',
    link: undefined,
    className: styles.purple,
  },
  {
    id: '4',
    name: 'Cultural Fluency',
    description:
      'Studying languages and international cultures. Currently focusing on Spanish with plans to add Mandarin for diplomatic career preparation.',
    link: undefined,
    className: styles.lime,
  },
]

const learningAreas: LearningItem[] = [
  {
    title: 'Model United Nations',
    description:
      'Preparing to join MSU Model UN to develop negotiation skills and understanding of international diplomacy.',
  },
  {
    title: 'Study Abroad Programs',
    description:
      'Exploring opportunities in Geneva, Brussels, or Beijing to gain firsthand international experience.',
  },
  {
    title: 'Research Projects',
    description:
      'Planning undergraduate research on international conflict resolution and diplomatic communication.',
  },
  {
    title: 'Language Immersion',
    description:
      'Seeking intensive language programs to achieve professional fluency in multiple languages.',
  },
  {
    title: 'Internship Preparation',
    description:
      'Building skills and network for State Department internships and international organization placements.',
  },
]

const WorkProjectsSection: React.FC = () => {
  return (
    <div className={styles.workHistoryBlock}>
      <div className={styles.workHistoryBox}>
        {/* Timeline Section */}
        <div>
          <h3 className={styles.h3}>
            Evolution: From Local Champion to Global Thinker
          </h3>
          <div className={styles.divBlock26}>
            {pastAchievements.map((item) => (
              <div key={item.id} className={styles.textBlock3}>
                <span className={styles.textBlock2}>{item.year}</span>{' '}
                {item.name}{' '}
                {item.detail && (
                  <span className={styles.gray}>{item.detail}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Focus Areas Section */}
        <div>
          <div className={styles.divBlock27}>
            <div className={styles.divBlock28}>Force Multipliers</div>
            <h3 className={styles.h3}>
              How compound skills create exponential outcomes
            </h3>
          </div>
          <div className={`${styles.bodyText} ${styles.listDescription}`}>
            Athletic precision meets creative vision meets academic rigor meets
            diplomatic instincts. Each domain strengthens the others. The whole
            becomes exponentially greater than the sum.
            <br />
          </div>
          <div className={styles.divBlock29}>
            {focusAreas.map((area) => (
              <div key={area.id} className={styles.divBlock30}>
                <div>
                  {area.link ? (
                    <a
                      href={area.link}
                      className={area.className}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {area.name}
                    </a>
                  ) : (
                    <span className={area.className}>{area.name}</span>
                  )}
                  <br />
                </div>
                <div className={styles.listDescription2}>
                  {area.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Learning & Development Section */}
        <div>
          <h3 className={styles.h3}>Next-Level Development</h3>
          <div className={`${styles.bodyText} ${styles.listDescription}`}>
            The same systematic approach that turned a 22:22 runner into a
            record-holder now applies to mastering international relations.
            Progress is predictable when principles are transferable.
            <br />
          </div>
          <div className={styles.divBlock31}>
            {learningAreas.map((item, index) => (
              <div key={index} className={styles.investmentItem}>
                <strong>{item.title}</strong> {item.description}
                {item.link && (
                  <>
                    {' '}
                    <a
                      href={item.link}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Student Note */}
        <div className={styles.aiComment}>
          <p className={styles.bodyText}>
            The person who breaks records doesn't just run faster—they think
            differently about what's possible. Ready to explore what that
            mindset could create in your world?
          </p>
        </div>
      </div>
    </div>
  )
}

export default WorkProjectsSection
