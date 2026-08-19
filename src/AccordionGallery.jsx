import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import './AccordionGallery.css'

export default function AccordionGallery({ items, defaultIndex = 0, expandRatio = .52, duration = .7, ease = 'power3.out', parallax = .5, tilt = 5, gap = 0, height = 430, onSelect }) {
  const rootRef = useRef(null), panels = useRef([]), media = useRef([]), labels = useRef([]), timeline = useRef(null), firstRun = useRef(true), mediaSize = useRef(320)
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), items.length - 1))
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const applyLayout = useCallback(animate => {
    const ratio = Math.min(Math.max(expandRatio, .2), .9), grow = items.length > 1 ? (ratio * (items.length - 1)) / (1 - ratio) : 1
    timeline.current?.kill(); const tl = gsap.timeline()
    panels.current.forEach((panel, index) => {
      if (!panel) return
      const selected = index === active, rotation = selected ? 0 : index < active ? tilt : -tilt, dur = animate && !reduced ? duration : 0
      tl.to(panel, { flexGrow: selected ? grow : 1, rotateY: rotation, duration: dur, ease }, 0)
      const drift = Math.max(-1.5, Math.min(1.5, active - index)) * parallax * mediaSize.current * .06
      tl.to(media.current[index], { xPercent: -50, yPercent: -50, x: selected ? 0 : drift, '--ag-gray': selected ? 0 : .72, '--ag-dim': selected ? 0 : .28, duration: dur, ease }, 0)
      tl.to(labels.current[index], { opacity: selected ? 1 : 0, x: selected ? 0 : -14, duration: dur * .7, ease }, 0)
    }); timeline.current = tl
  }, [active, duration, ease, expandRatio, items.length, parallax, reduced, tilt])
  useEffect(() => {
    const root = rootRef.current; if (!root) return
    const measure = () => { const usable = Math.max(root.getBoundingClientRect().width - gap * (items.length - 1), 120); mediaSize.current = Math.max(180, usable * Math.min(Math.max(expandRatio, .2), .9) * 1.18); root.style.setProperty('--ag-media-size', `${mediaSize.current}px`); applyLayout(!firstRun.current) }
    measure(); const observer = new ResizeObserver(measure); observer.observe(root); return () => observer.disconnect()
  }, [applyLayout, expandRatio, gap, items.length])
  useEffect(() => { applyLayout(!firstRun.current); firstRun.current = false }, [applyLayout])
  useEffect(() => () => timeline.current?.kill(), [])
  return <div ref={rootRef} className="accordion-gallery" style={{ '--ag-gap': `${gap}px`, height }} role="list" aria-label="作品分类">
    {items.map((item, index) => <button key={item.id} ref={node => { panels.current[index] = node }} className={`ag-panel${index === active ? ' ag-panel--active' : ''}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => index === active ? onSelect(item.id) : setActive(index)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); setActive((index + 1) % items.length) } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); setActive((index - 1 + items.length) % items.length) } }} role="listitem" aria-current={index === active ? 'true' : undefined} aria-label={`打开${item.title}`}>
      <span className="ag-panel__frame"><span className="ag-panel__media" ref={node => { media.current[index] = node }}><img src={item.cover} alt={item.title} draggable="false" loading="eager" fetchPriority="high" decoding="async" /></span><span className="ag-panel__overlay" /></span><span className="ag-panel__number">{item.no}</span><span className="ag-panel__arrow">↗</span><span className="ag-panel__label" ref={node => { labels.current[index] = node }}><small>{item.en}</small><strong>{item.title}</strong><em>{item.count}</em></span>
    </button>)}
  </div>
}
