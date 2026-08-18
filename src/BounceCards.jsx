import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './bounce-cards.css'

gsap.registerPlugin(ScrollTrigger)

export default function BounceCards({ images, transformStyles, className = '' }) {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray('.bounce-card')
      gsap.fromTo(cards,
        { opacity: 0, y: 120, scale: .82, clipPath: 'inset(18% 0 18% 0)' },
        { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)', duration: 1.15, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: containerRef.current, start: 'top 82%', once: true } }
      )
    }, containerRef)
    return () => context.revert()
  }, [])

  const setFocus = index => {
    const cards = containerRef.current?.querySelectorAll('.bounce-card') ?? []
    cards.forEach((card, i) => {
      const base = transformStyles[i]
      gsap.killTweensOf(card)
      gsap.to(card, {
        transform: i === index ? `${base} scale(1.06)` : `${base} scale(.92)`,
        opacity: i === index ? 1 : 0.64, zIndex: i === index ? 10 : i,
        duration: 0.36, ease: 'power3.out'
      })
    })
  }

  const reset = () => {
    const cards = containerRef.current?.querySelectorAll('.bounce-card') ?? []
    cards.forEach((card, i) => {
      gsap.killTweensOf(card)
      gsap.to(card, { transform: transformStyles[i], opacity: 1, zIndex: i, duration: 0.45, ease: 'power3.out' })
    })
  }

  return <div ref={containerRef} className={`bounce-cards ${className}`} onMouseLeave={reset}>
    {images.map((src, index) => <button className="bounce-card" style={{ transform: transformStyles[index], zIndex: index }} onMouseEnter={() => setFocus(index)} key={src} aria-label={`查看作品 ${index + 1}`}>
      <img src={src} alt={`莫文昊作品 ${index + 1}`} loading="lazy" decoding="async" />
      <span>0{index + 1}</span>
    </button>)}
  </div>
}
