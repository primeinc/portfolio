import React from 'react'
import styles from './MultiColumnLayout.module.css'

interface ColumnData {
  title: string
  items: string[]
}

interface MultiColumnLayoutProps {
  title?: string
  columns: ColumnData[]
  variant?: 'default' | 'compact'
}

const MultiColumnLayout: React.FC<MultiColumnLayoutProps> = ({ 
  title, 
  columns, 
  variant = 'default' 
}) => {
  return (
    <section className={`${styles.multiColumnSection} ${styles[variant]}`}>
      <div className={styles.container}>
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        
        <div className={`${styles.columnsGrid} ${styles[`cols-${columns.length}`]}`}>
          {columns.map((column, index) => (
            <div key={index} className={styles.column}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.columnList}>
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={styles.columnItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MultiColumnLayout