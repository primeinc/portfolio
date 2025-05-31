import styles from './ProjectDetail.module.css'

export default function ProjectDetail({
  longDescription,
  images,
}: {
  longDescription: string
  images: string[]
}) {
  return (
    <div className={styles.detailContent}>
      <p>{longDescription}</p>
      {images?.length > 0 && (
        <div className={styles.detailImages}>
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`detail ${i}`}
              className={styles.detailImage}
            />
          ))}
        </div>
      )}
    </div>
  )
}
