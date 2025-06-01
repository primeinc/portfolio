import React from 'react'
import styles from './WorkHistory.module.css'

interface TimelineItem {
  id: string
  year: string
  name: string
  accessory?: string
}

const workHistory: TimelineItem[] = [
  { id: '1', year: '2008', name: 'Hicell', accessory: '(first startup)' },
  { id: '2', year: '2009', name: 'Taplend', accessory: '(design studio)' },
  { id: '3', year: '2011', name: 'ImpactAIM', accessory: '(UI/UX refresh)' },
  { id: '4', year: '2012', name: 'WikiHow', accessory: '(I was designer #2)' },
  { id: '5', year: '2013', name: 'wikiHow' },
  { id: '6', year: '2014', name: 'Readdle', accessory: '(design lead)' },
  { id: '7', year: '2015', name: 'Spark Email' },
  { id: '8', year: '2016', name: 'Documents', accessory: '(design lead)' },
  { id: '9', year: '2018', name: 'Fluix', accessory: '(creative advisor)' },
  { id: '10', year: '2019', name: 'Grammarly' },
  {
    id: '11',
    year: '2020',
    name: 'Grammarly Desktop App',
    accessory: '(I helped design it)',
  },
  {
    id: '12',
    year: '2020',
    name: 'Grammarly Mobile Keyboard',
    accessory: '(I helped design it)',
  },
  {
    id: '13',
    year: '2020',
    name: 'Grammarly Mobile Editor',
    accessory: '(I helped design it)',
  },
  {
    id: '14',
    year: '2020',
    name: 'Grammarly Mobile Growth',
    accessory: '(I helped design it)',
  },
  {
    id: '15',
    year: '2020',
    name: 'Grammarly Safari Extension',
    accessory: '(WWDC)',
  },
  { id: '16', year: '2022', name: 'Decipad', accessory: '(Head of Design)' },
  { id: '17', year: '2023', name: 'Xian24' },
  { id: '18', year: '2024', name: 'Axis' },
  { id: '19', year: '2023', name: 'Jammable' },
  { id: '20', year: '2024', name: 'Pervasive' },
  { id: '21', year: '2024', name: 'ComplexChaos' },
  { id: '22', year: '2024', name: 'Context' },
  { id: '23', year: '2024', name: 'Tessl.ai' },
  { id: '24', year: '2024', name: 'Laminar' },
  { id: '25', year: '2023', name: 'ScienceSays' },
  { id: '26', year: '2024', name: 'FamilyTime' },
  { id: '27', year: '2024', name: 'SonicSpec' },
  { id: '28', year: '2024', name: 'Daylight Computer' },
  { id: '29', year: '2024', name: 'Bleachers' },
  { id: '30', year: '2024', name: 'Bullitt' },
  { id: '31', year: '2024', name: 'VCo2 Media' },
  { id: '32', year: '2024', name: 'Somite' },
  { id: '33', year: '2024', name: 'QuickCapture' },
  { id: '34', year: '2024', name: 'Personal Bingo' },
  { id: '35', year: '2024', name: 'FocalBrief' },
  { id: '36', year: '2024', name: 'FounderClass' },
  { id: '37', year: '2024', name: 'Fitz' },
  { id: '38', year: '2024', name: "Networking 24'" },
  { id: '39', year: '2024', name: 'Gromus' },
]

const WorkHistory: React.FC = () => {
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineList}>
        {workHistory.map((item) => (
          <div key={item.id} className={styles.timestamp}>
            <div className={styles.time}>
              {item.year}
              <br />
            </div>
            <div className={styles.timeName}>{item.name}</div>
            {item.accessory && (
              <div className={styles.timeAccessory}>
                {item.accessory}
                <br />
              </div>
            )}
          </div>
        ))}
        <h3 className={styles.h3}>Design Concepts for:</h3>
      </div>
    </div>
  )
}

export default WorkHistory
