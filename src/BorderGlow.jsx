import { useRef, useCallback, useEffect } from 'react'
import './BorderGlow.css'

const positions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%']
const colorMap = [0, 1, 2, 0, 1, 2, 1]

export default function BorderGlow({ children, className = '', edgeSensitivity = 30, glowColor = '12 85 64', backgroundColor = '#f7f6f2', borderRadius = 0, glowRadius = 30, glowIntensity = .75, coneSpread = 24, animated = true, colors = ['#f27352', '#8bc9c2', '#d7ed8c'], fillOpacity = .22 }) {
  const cardRef = useRef(null)
  const move = useCallback(event => {
    const card = cardRef.current; if (!card) return
    const rect = card.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top, cx = rect.width / 2, cy = rect.height / 2, dx = x - cx, dy = y - cy
    const kx = dx ? cx / Math.abs(dx) : Infinity, ky = dy ? cy / Math.abs(dy) : Infinity
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90; if (angle < 0) angle += 360
    card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3)); card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
  }, [])
  useEffect(() => {
    const card = cardRef.current; if (!animated || !card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    card.classList.add('sweep-active'); let start, frame
    const tick = now => { start ??= now; const progress = Math.min((now - start) / 2300, 1), wave = Math.sin(progress * Math.PI) * 100; card.style.setProperty('--edge-proximity', wave); card.style.setProperty('--cursor-angle', `${105 + progress * 360}deg`); if (progress < 1) frame = requestAnimationFrame(tick); else card.classList.remove('sweep-active') }
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame)
  }, [animated])
  const vars = { '--card-bg': backgroundColor, '--edge-sensitivity': edgeSensitivity, '--border-radius': `${borderRadius}px`, '--glow-padding': `${glowRadius}px`, '--cone-spread': coneSpread, '--fill-opacity': fillOpacity }
  const [h, s, l] = glowColor.split(/\s+/).map(Number); [100, 60, 50, 40, 30, 20, 10].forEach((opacity, i) => { vars[`--glow-color${i ? `-${opacity}` : ''}`] = `hsl(${h}deg ${s}% ${l}% / ${Math.min(opacity * glowIntensity, 100)}%)` })
  positions.forEach((position, i) => { vars[`--gradient-${i + 1}`] = `radial-gradient(at ${position}, ${colors[Math.min(colorMap[i], colors.length - 1)]} 0, transparent 50%)` })
  return <div ref={cardRef} onPointerMove={move} className={`border-glow-card ${className}`} style={vars}><span className="edge-light"/><div className="border-glow-inner">{children}</div></div>
}
