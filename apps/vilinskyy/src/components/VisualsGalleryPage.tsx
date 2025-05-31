import { useState } from 'react'
import styles from './VisualsGalleryPage.module.css'
import { GALLERY_IMAGES } from '../assets/svgData'

export default function VisualsGalleryPage() {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div>
      <div className={styles.grid}>
        {GALLERY_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`visual ${i}`}
            onClick={() => setActive(src)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActive(src)
              }
            }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      {active && (
        <div className={styles.overlay} onClick={() => setActive(null)}>
          <img src={active} alt="full" />
        </div>
      )}
    </div>
  )
}
