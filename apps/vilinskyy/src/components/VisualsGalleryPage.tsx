import { useState } from 'react'
import styles from './VisualsGalleryPage.module.css'

// Use inline SVGs encoded as base64 so no binary assets are needed in the repo
const images = [
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiLz48L3N2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJncmVlbiIvPjwvc3ZnPgo=',
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibHVlIi8+PC9zdmc+Cg==',
]

export default function VisualsGalleryPage() {
  const [active, setActive] = useState<string | null>(null)
  return (
    <div>
      <div className={styles.grid}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`visual ${i}`}
            onClick={() => setActive(src)}
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
