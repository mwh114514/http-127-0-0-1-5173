import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './card-nav.css'

export default function CardNav({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef(null)
  const cardsRef = useRef([])
  const timelineRef = useRef(null)
  const items = [
    { label: '关于我', number: '01', target: 'about', text: '个人履历 / 经历与方向' },
    { label: '精选作品', number: '02', target: 'projects', text: '插画练习 / 精选作品' },
    { label: '联系我', number: '03', target: 'contact', text: '合作咨询 / 联系方式' }
  ]

  useLayoutEffect(() => {
    const nav = navRef.current
    const cards = cardsRef.current.filter(Boolean)
    gsap.set(nav, { height: 62, overflow: 'hidden' })
    gsap.set(cards, { y: 26, opacity: 0 })
    timelineRef.current = gsap.timeline({ paused: true })
      .to(nav, { height: 244, duration: .45, ease: 'power3.out' })
      .to(cards, { y: 0, opacity: 1, duration: .38, stagger: .06, ease: 'power3.out' }, '-=.18')
    return () => timelineRef.current?.kill()
  }, [])

  const toggle = () => { const tl = timelineRef.current; if (!tl) return; setIsOpen(value => { value ? tl.reverse() : tl.play(0); return !value }) }
  const navigate = target => { onNavigate(target); timelineRef.current?.reverse(); setIsOpen(false) }
  return <div className="card-nav-container"><nav ref={navRef} className={isOpen ? 'card-nav card-nav--open' : 'card-nav'}>
    <div className="card-nav-top"><button className="card-nav-wordmark" onClick={() => navigate('top')}>MOWENHAO<span>®</span></button><div className="card-nav-desktop-links"><button onClick={() => navigate('about')}>关于我</button><button onClick={() => navigate('projects')}>精选作品</button><button onClick={() => navigate('contact')}>联系我</button></div><button className="card-nav-toggle" onClick={toggle} aria-expanded={isOpen} aria-label="展开导航"><i></i><i></i><em>{isOpen ? '关闭' : '菜单'}</em></button></div>
    <div className="card-nav-content">{items.map((item, index) => <button className="card-nav-item" onClick={() => navigate(item.target)} ref={el => cardsRef.current[index] = el} key={item.target}><span>{item.number}</span><strong>{item.label}</strong><small>{item.text}</small><b>↗</b></button>)}</div>
  </nav></div>
}
