import styles from './MultiColumnLayout.module.css'

export default function MultiColumnLayout({ text }: { text: string }) {
  return <div className={styles.multiColumn}>{text}</div>
}
