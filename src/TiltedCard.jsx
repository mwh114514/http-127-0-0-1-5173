import { useEffect, useRef } from 'react'
import './TiltedCard.css'
import './TiltedCard-light.css'

export default function TiltedCard({ children, className = '', rotateAmplitude = 5, scaleOnHover = 1.015 }) {
  const ref = useRef(null)
  const frame = useRef(0)

  useEffect(() => () => window.cancelAnimationFrame(frame.current), [])

  const update = (rotateX, rotateY, scale) => {
    window.cancelAnimationFrame(frame.current)
    frame.current = window.requestAnimationFrame(() => {
      const inner = ref.current?.firstElementChild
      if (!inner) return
      inner.style.setProperty('--tilt-x', `${rotateX}deg`)
      inner.style.setProperty('--tilt-y', `${rotateY}deg`)
      inner.style.setProperty('--tilt-scale', scale)
    })
  }

  const handleMove = event => {
    if (!ref.current || window.matchMedia('(pointer: coarse)').matches) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    update(y * -rotateAmplitude * 2, x * rotateAmplitude * 2, scaleOnHover)
  }

  const reset = () => update(0, 0, 1)

  return <div ref={ref} className={`tilted-card-figure ${className}`} onPointerMove={handleMove} onPointerEnter={() => update(0, 0, scaleOnHover)} onPointerLeave={reset}>
    <div className="tilted-card-inner">{children}</div>
  </div>
}
