import { useLayoutEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './style.css'
import './hero.css'
import './film.css'
import './final-frame.css'
import './minimal.css'
import './restore-hero.css'
import './restore-final.css'
import './clean-video.css'
import CardNav from './CardNav'
import BounceCards from './BounceCards'
import GalleryWindows from './GalleryWindows'
import TiltedCard from './TiltedCard'
import './project-gallery.css'
import './motion.css'
import './about-profile.css'
import './about-light.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  { num: '01', title: '人物氛围插画', en: 'Character / Illustration', type: 'portrait', desc: '把人物的性格、皮肤质感与光影关系，收束成一张有呼吸感的画面。', tags: ['DIGITAL PAINTING', '2025'] },
  { num: '02', title: '场景与空间叙事', en: 'Environment / Visual', type: 'space', desc: '以色彩分层、透视与水面动态组织空间，让景观先于语言讲述故事。', tags: ['ENVIRONMENT', '2025'] },
  { num: '03', title: '机械少女设定', en: 'Concept / Character', type: 'concept', desc: '从轮廓、服装结构到机械义肢，为角色建立可被看见的世界观。', tags: ['ORIGINAL DESIGN', '2024'] },
]

const capabilities = [
  ['01', '品牌视觉', '从策略解读到视觉落地，为品牌建立清晰、可延展的表达系统。'],
  ['02', 'AI 视觉创作', '将生成式工具纳入创作链路，让概念探索更敏锐，也更具效率。'],
  ['03', '插画与角色', '擅长人物塑造、色彩氛围与材质刻画，关注画面里的情绪密度。'],
  ['04', '视频与动态', '使用剪映完成节奏、字幕与色彩管理，让视觉在时间中延续。'],
]

function App() {
  const [filmFinished, setFilmFinished] = useState(false)
  const videoRef = useRef(null)
  const rootRef = useRef(null)
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const stopAtFinalFrame = event => { if (event.currentTarget.currentTime >= 19) { event.currentTarget.pause(); setFilmFinished(true) } }
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const context = gsap.context(() => {
      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } })
      opening.set(['.hero-copy', '.hero-name', '.hero-bottom', '.card-nav-container'], { opacity: 0 })
        .set('.hero h1', { yPercent: 120, scaleX: .78, transformOrigin: 'left center', clipPath: 'inset(0 0 100% 0)' })
        .set('.hero-video', { scale: 1.16, opacity: .28 })
        .to('.opening-curtain', { scaleY: 0, duration: 1.35, transformOrigin: 'top', ease: 'expo.inOut' })
        .to('.hero-video', { scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' }, '-=1.05')
        .to('.card-nav-container', { opacity: 1, y: 0, duration: .8 }, '-=.95')
        .to('.hero-copy', { opacity: 1, duration: .18 }, '-=.48')
        .to('.hero h1', { yPercent: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'expo.out' }, '-=.12')
        .to('.hero-name', { opacity: 1, x: 0, duration: .95, ease: 'power3.out' }, '-=.72')
        .to('.hero-bottom', { opacity: 1, y: 0, duration: .75 }, '-=.55')

      gsap.utils.toArray('.motion-section').forEach(section => {
        const word = section.querySelector('.motion-word')
        const title = section.querySelector('h2')
        const cards = section.querySelectorAll('.motion-card')
        const images = section.querySelectorAll('.motion-image')
        if (word) gsap.from(word, { yPercent: 115, skewY: 7, opacity: 0, duration: 1.25, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 79%' } })
        if (title) gsap.from(title, { y: 76, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: section, start: 'top 69%' } })
        if (cards.length) gsap.from(cards, { y: 96, opacity: 0, duration: 1.05, stagger: .13, ease: 'power4.out', scrollTrigger: { trigger: section, start: 'top 62%' } })
        const allowParallax = window.matchMedia('(min-width: 901px) and (pointer: fine)').matches
        images.forEach(image => {
          gsap.fromTo(image, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)', duration: 1.25, ease: 'power4.out', scrollTrigger: { trigger: image, start: 'top 82%' } })
          if (allowParallax) gsap.to(image.querySelector('img') || image, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 1.1 } })
        })
      })

      const profile = document.querySelector('.profile-portrait')
      if (profile) {
        const profileTimeline = gsap.timeline({ scrollTrigger: { trigger: profile, start: 'top 82%', once: true } })
        profileTimeline.fromTo(profile, { opacity: 0, scale: .9, rotateY: -7, clipPath: 'inset(10% 10% 10% 10% round 34px)' }, { opacity: 1, scale: 1, rotateY: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.25, ease: 'power4.out' })
          .fromTo(profile.querySelector('.portrait-orb'), { scale: .55, opacity: 0, rotate: -18 }, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'expo.out' }, '-=.75')
          .fromTo(profile.querySelector('.portrait-face'), { y: 55, opacity: 0 }, { y: 0, opacity: 1, duration: .85, ease: 'power3.out' }, '-=.65')
          .fromTo(profile.querySelector('p'), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: 'power3.out' }, '-=.45')
      }
    }, rootRef)
    return () => context.revert()
  }, [])
  return <main ref={rootRef}>
    <section className={filmFinished ? 'hero hero--final' : 'hero'} id="top">
      <div className="opening-curtain" aria-hidden="true" />
      <video ref={videoRef} className="hero-video" autoPlay muted playsInline preload="auto" onTimeUpdate={stopAtFinalFrame} onEnded={() => setFilmFinished(true)}>
        <source src="/media/hero-film.mp4" type="video/mp4" />
      </video>
      <div className="hero-wash" />
      <CardNav onNavigate={go} />
      <div className="hero-name" aria-label="莫文昊"><span>MO WENHAO</span><strong>莫文昊</strong><b>视觉设计档案 · 2026</b></div>
      <div className="hero-copy"><p className="eyebrow">VISUAL DESIGNER · AI CREATOR · BRAND DESIGNER</p><h1>用视觉<br /><em>感知世界</em></h1></div>
      <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><div className="scroll-line"/><span>© 2026 MOWENHAO</span></div>
    </section>

    <section className="about frame motion-section" id="about"><div className="motion-word">PROFILE</div><div className="section-label"><span>01 / PROFILE</span><span>个人履历</span></div><div className="about-grid"><TiltedCard className="profile-tilt" rotateAmplitude={4.5} scaleOnHover={1.012}><div className="portrait profile-portrait"><div className="portrait-orb"></div><div className="portrait-face"><span>M</span></div><p>MO<br/>WEN<br/>HAO</p></div></TiltedCard><TiltedCard className="profile-tilt" rotateAmplitude={3.5} scaleOnHover={1.008}><div className="about-copy motion-card"><h2>我相信优秀的设计，<br />始于<em>敏感的观察。</em></h2><p className="body">莫文昊，插画师 / AI 设计师 / 视频剪辑师。毕业于产品艺术设计专业，拥有品牌视觉与商业项目实习经验。我的工作横跨品牌、插画、动态影像与 AI 视觉实验；在每一次设计中，让理性结构为直觉与情感留出位置。</p><div className="facts"><div><strong>06<small>+</small></strong><span>MONTHS OF<br/>EXPERIENCE</span></div><div><strong>12<small>+</small></strong><span>CREATIVE<br/>PROJECTS</span></div><div><strong>03</strong><span>CORE<br/>DIRECTIONS</span></div></div><a className="outline-link" href="mailto:2281545783@qq.com">下载简历 <i>↓</i></a></div></TiltedCard></div></section>

    <section className="projects frame motion-section" id="projects"><div className="motion-word">SELECTED WORK</div><div className="section-label"><span>02 / SELECTED WORK</span><span>精选项目 · 2024—2026</span></div><div className="project-intro motion-card"><h2>选择一些正在生长的<br/><em>视觉片段。</em></h2><p>五组人物视觉练习，以不同的光、材质与色彩，记录情绪在画面中的流动。</p></div><div className="work-stage"><BounceCards className="portfolio-cards" images={['/media/works/01-aurora.webp','/media/works/02-snow.webp','/media/works/03-profile.webp','/media/works/04-silver.webp','/media/works/05-garden.webp']} transformStyles={['translate(-430px, 28px) rotate(-10deg)','translate(-215px, 0px) rotate(-5deg)','translate(0px, -18px) rotate(0deg)','translate(215px, 0px) rotate(5deg)','translate(430px, 28px) rotate(10deg)']} /><div className="work-caption motion-card"><span>PERSONAL ILLUSTRATION / 2024—2026</span><h3>人物与光影研究</h3><p>将插画作为感知的容器，在人物、材质与想象之间寻找每张画面独有的温度。</p></div></div></section>

    <section className="advantages frame motion-section"><div className="motion-word">EXPERTISE</div><div className="section-label"><span>03 / EXPERTISE</span><span>创作方向</span></div><div className="adv-title motion-card"><h2>技术会迭代，<br/>但<em>感受力</em>始终重要。</h2><p>从场景、角色到影像，选择一个窗口，进入相应的作品系列。</p></div><GalleryWindows /></section>

    <section className="contact motion-section" id="contact"><div className="motion-word">CONTACT</div><div className="contact-glow"></div><div className="contact-inner"><p className="eyebrow motion-card">LET'S MAKE SOMETHING WITH MEANING</p><h2>期待与你<br/><em>共同创作。</em></h2><a href="mailto:2281545783@qq.com" className="mail motion-card">2281545783@qq.com <i>↗</i></a><div className="contact-foot"><div className="motion-card"><span>PHONE</span><a href="tel:15697760186">156 9776 0186</a></div><div className="motion-card"><span>LOCATION</span><p>广西 · 中国</p></div><div className="motion-card"><span>WECHAT</span><p>Mowenhao</p></div><button className="motion-card" onClick={() => go('top')}>BACK TO TOP ↑</button></div></div></section>
  </main>
}
createRoot(document.getElementById('root')).render(<App />)
