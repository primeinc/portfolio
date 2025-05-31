import { PropsWithChildren } from 'react'
import styles from './styles.module.css'

const ResponsiveLayoutWrapper = ({ children }: PropsWithChildren) => (
  <div className={styles.container}>{children}</div>
)

export default ResponsiveLayoutWrapper
