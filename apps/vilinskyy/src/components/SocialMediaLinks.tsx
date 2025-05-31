import styles from './SocialMediaLinks.module.css'

export default function SocialMediaLinks() {
  return (
    <ul className={styles.list}>
      <li>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          Twitter
        </a>
      </li>
      <li>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </li>
      <li>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          Instagram
        </a>
      </li>
      <li>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">
          YouTube
        </a>
      </li>
      <li>
        <a href="https://bsky.app" target="_blank" rel="noreferrer">
          Bluesky
        </a>
      </li>
    </ul>
  )
}
