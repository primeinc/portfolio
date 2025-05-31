import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PropsWithChildren, useEffect } from 'react'

const ScrollAppearEffect = ({ children }: PropsWithChildren) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, margin: '-50px' })

  useEffect(() => {
    if (inView) controls.start('visible')
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollAppearEffect
