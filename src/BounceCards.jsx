import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './bounce-cards.css'

gsap.registerPlugin(ScrollTrigger)

export default function BounceCards({ images, transformStyles, className = '' }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const viewerImageRef = useRef(null)
  const closeRef = useRef(null)
  const viewerTimeline = useRef(null)
  const closing = useRef(false)
  const [active, setActive] = useState(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const cards = gsap.utils.toArray('.bounce-card')
      const entrance = gsap.fromTo(cards,
        { opacity: 0, y: 120, scale: .82, clipPath: 'inset(18% 0 18% 0)' },
        { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0% 0 0% 0)', duration: 1.15, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: containerRef.current, start: 'top 82%', once: true } }
      )

      const settleRestoredScroll = () => {
        const bounds = containerRef.current?.getBoundingClientRect()
        if (!bounds || window.scrollY < 80 || bounds.top >= window.innerHeight) return
        entrance.scrollTrigger?.kill()
        entrance.kill()
        cards.forEach((card, index) => {
          gsap.killTweensOf(card)
          gsap.set(card, { opacity: 1, clipPath: 'inset(0% 0 0% 0)' })
          card.style.transform = transformStyles[index]
        })
      }

      const refreshTimer = window.setTimeout(settleRestoredScroll, 140)
      window.addEventListener('pageshow', settleRestoredScroll)
      return () => {
        window.clearTimeout(refreshTimer)
        window.removeEventListener('pageshow', settleRestoredScroll)
      }
    }, containerRef)
    return () => context.revert()
  }, [])

  useLayoutEffect(() => {
    if (!active || !viewerRef.current || !viewerImageRef.current) return
    const viewer = viewerRef.current
    const image = viewerImageRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.body.style.overflow = 'hidden'

    const reveal = async () => {
      try { await image.decode() } catch { /* the cached image is still usable */ }
      if (!viewerImageRef.current) return
      const target = image.getBoundingClientRect()
      const source = active.rect
      const sourceX = source.left + source.width / 2 - (target.left + target.width / 2)
      const sourceY = source.top + source.height / 2 - (target.top + target.height / 2)
      const tl = gsap.timeline({ defaults: { overwrite: true } })
      tl.set(viewer, { visibility: 'visible' })
        .fromTo(viewer.querySelector('.artwork-viewer__backdrop'), { opacity: 0 }, { opacity: 1, duration: reduceMotion ? .01 : .5, ease: 'power2.out' }, 0)
        .fromTo(image, { x: sourceX, y: sourceY, scaleX: source.width / target.width, scaleY: source.height / target.height, rotation: (active.index - 2) * 5, borderRadius: 2 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, borderRadius: 0, duration: reduceMotion ? .01 : .92, ease: 'expo.inOut' }, 0)
        .fromTo(viewer.querySelector('.artwork-viewer__meta'), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: reduceMotion ? .01 : .45, ease: 'power3.out' }, reduceMotion ? 0 : .58)
      viewerTimeline.current = tl
      closeRef.current?.focus({ preventScroll: true })
    }
    reveal()

    return () => {
      viewerTimeline.current?.kill()
      document.body.style.overflow = ''
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const onKeyDown = event => {
      if (event.key === 'Escape') closeViewer()
      if (event.key === 'ArrowRight') switchArtwork(1)
      if (event.key === 'ArrowLeft') switchArtwork(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active])

  const setFocus = index => {
    if (active) return
    const cards = containerRef.current?.querySelectorAll('.bounce-card') ?? []
    cards.forEach((card, i) => {
      const base = transformStyles[i]
      gsap.killTweensOf(card)
      gsap.to(card, { transform: i === index ? `${base} scale(1.06)` : `${base} scale(.92)`, opacity: i === index ? 1 : .64, zIndex: i === index ? 10 : i, duration: .36, ease: 'power3.out' })
    })
  }

  const reset = () => {
    if (active) return
    const cards = containerRef.current?.querySelectorAll('.bounce-card') ?? []
    cards.forEach((card, i) => {
      gsap.killTweensOf(card)
      gsap.to(card, { transform: transformStyles[i], opacity: 1, zIndex: i, duration: .45, ease: 'power3.out' })
    })
  }

  const openViewer = (index, card) => {
    reset()
    setActive({ index, src: images[index], rect: card.getBoundingClientRect() })
  }

  const switchArtwork = direction => {
    if (!active || closing.current) return
    const nextIndex = (active.index + direction + images.length) % images.length
    const card = containerRef.current?.querySelectorAll('.bounce-card')[nextIndex]
    setActive({ index: nextIndex, src: images[nextIndex], rect: card?.getBoundingClientRect() ?? active.rect })
  }

  const closeViewer = () => {
    if (!active || closing.current) return
    closing.current = true
    const image = viewerImageRef.current
    const viewer = viewerRef.current
    const card = containerRef.current?.querySelectorAll('.bounce-card')[active.index]
    if (!image || !viewer || !card) {
      closing.current = false
      setActive(null)
      return
    }
    const current = image.getBoundingClientRect()
    const target = card.getBoundingClientRect()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    viewerTimeline.current?.kill()
    gsap.timeline({ onComplete: () => { closing.current = false; setActive(null); card.focus({ preventScroll: true }) } })
      .to(viewer.querySelector('.artwork-viewer__meta'), { opacity: 0, y: 12, duration: reduceMotion ? .01 : .2 }, 0)
      .to(image, { x: target.left + target.width / 2 - (current.left + current.width / 2), y: target.top + target.height / 2 - (current.top + current.height / 2), scaleX: target.width / current.width, scaleY: target.height / current.height, rotation: (active.index - 2) * 5, duration: reduceMotion ? .01 : .72, ease: 'expo.inOut' }, 0)
      .to(viewer.querySelector('.artwork-viewer__backdrop'), { opacity: 0, duration: reduceMotion ? .01 : .5, ease: 'power2.in' }, reduceMotion ? 0 : .2)
  }

  return <>
    <div ref={containerRef} className={`bounce-cards ${className}`} onMouseLeave={reset}>
      {images.map((src, index) => <button className="bounce-card" style={{ transform: transformStyles[index], zIndex: index }} onMouseEnter={() => setFocus(index)} onClick={event => openViewer(index, event.currentTarget)} key={src} aria-label={`放大查看作品 ${index + 1}`}>
        <img src={src} alt={`莫文昊作品 ${index + 1}`} loading="eager" fetchPriority="high" decoding="async" />
        <span>0{index + 1}</span>
      </button>)}
    </div>
    {active && createPortal(<div className="artwork-viewer" ref={viewerRef} role="dialog" aria-modal="true" aria-label={`作品 ${active.index + 1} 原图`}>
      <button className="artwork-viewer__backdrop" onClick={closeViewer} aria-label="关闭作品大图" />
      <div className="artwork-viewer__stage">
        <img ref={viewerImageRef} src={active.src} alt={`莫文昊作品 ${active.index + 1} 原图`} />
        <div className="artwork-viewer__meta"><span>0{active.index + 1} / 0{images.length}</span><small>ORIGINAL ARTWORK</small></div>
      </div>
      <button ref={closeRef} className="artwork-viewer__close" onClick={closeViewer}>CLOSE ×</button>
      <button className="artwork-viewer__nav artwork-viewer__nav--prev" onClick={() => switchArtwork(-1)} aria-label="上一张">←</button>
      <button className="artwork-viewer__nav artwork-viewer__nav--next" onClick={() => switchArtwork(1)} aria-label="下一张">→</button>
    </div>, document.body)}
  </>
}
