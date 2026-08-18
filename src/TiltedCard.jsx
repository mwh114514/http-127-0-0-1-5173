import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import './TiltedCard.css'

const spring = { damping: 30, stiffness: 100, mass: 1.6 }

export default function TiltedCard({ children, className = '', rotateAmplitude = 5, scaleOnHover = 1.015 }) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), spring)
  const rotateY = useSpring(useMotionValue(0), spring)
  const scale = useSpring(1, spring)

  const handleMove = event => {
    if (!ref.current || window.matchMedia('(pointer: coarse)').matches) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    rotateX.set(y * -rotateAmplitude * 2)
    rotateY.set(x * rotateAmplitude * 2)
  }

  const reset = () => { rotateX.set(0); rotateY.set(0); scale.set(1) }

  return <motion.div ref={ref} className={`tilted-card-figure ${className}`} onMouseMove={handleMove} onMouseEnter={() => scale.set(scaleOnHover)} onMouseLeave={reset} style={{ rotateX, rotateY, scale }}>
    <div className="tilted-card-inner">{children}</div>
  </motion.div>
}
