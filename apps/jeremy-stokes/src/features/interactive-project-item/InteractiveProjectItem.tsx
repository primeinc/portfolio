import { motion } from 'framer-motion'
import { PropsWithChildren } from 'react'
import styles from './styles.module.css'

const InteractiveProjectItem = ({ children }: PropsWithChildren) => (
  <motion.div
    className={styles.wrapper}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.div>
)

export default InteractiveProjectItem
