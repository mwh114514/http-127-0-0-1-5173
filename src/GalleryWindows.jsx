import { useState } from 'react'
import './gallery-windows.css'
import './gallery-covers.css'
import './gallery-viewer.css'
import AccordionGallery from './AccordionGallery'

const windows = [
  { id: 'scene', no: '01', title: '场景原画设计', en: 'ENVIRONMENT ART', description: '空间、氛围与叙事构图的场景视觉探索。', count: '05 WORKS', cover: '/media/scenes/cover-gate.webp' },
  { id: 'character', no: '02', title: '角色视觉设计', en: 'CHARACTER ART', description: '人物性格、材质与服装结构研究。', count: '05 WORKS', cover: '/media/characters/01-sand.webp' },
  { id: 'product', no: '03', title: '邕城双生记', en: 'PRODUCT DESIGN', description: '从南宁地域文化出发，完成角色设定、视觉延展与衍生产品落地。', count: '09 WORKS', cover: '/media/products/cover-yongcheng.webp' },
  { id: 'motion', no: '04', title: '影像与剪辑', en: 'MOTION EDITING', description: '节奏、字幕与情绪导向的短片剪辑。', count: '01 FILM', cover: '/media/motion/motion-cover.webp' }
]

const sceneImages = ['/media/scenes/01-valley.webp','/media/scenes/02-bridge.webp','/media/scenes/03-mountain.webp','/media/scenes/04-trees.webp','/media/scenes/05-water.webp']
const characterImages = ['/media/characters/01-sand.webp','/media/characters/02-starlight.webp','/media/characters/03-samurai.webp','/media/characters/04-sketch.webp','/media/characters/05-blue.webp']
const productImages = [
  '/media/products/01-male-character.webp',
  '/media/products/02-female-character.webp',
  '/media/products/03-badge-mockup.webp',
  '/media/products/04-keychain-mockup.webp',
  '/media/products/05-standees.webp',
  '/media/products/06-postcards.webp',
  '/media/products/07-badges.webp',
  '/media/products/08-landmark-keychains.webp',
  '/media/products/09-keychain-lineup.webp'
]

const galleries = {
  scene: { images: sceneImages, label: 'SCENE STUDY' },
  character: { images: characterImages, label: 'CHARACTER STUDY' },
  product: { images: productImages, label: 'YONGCHENG IP DESIGN' },
  motion: { video: '/media/motion/motion-work.mp4', poster: '/media/motion/motion-cover.webp' }
}

export default function GalleryWindows() {
  const [active, setActive] = useState(null)
  const [zoomed, setZoomed] = useState(null)
  const current = windows.find(item => item.id === active)
  const gallery = galleries[active]

  return <>
    <AccordionGallery items={windows} defaultIndex={0} expandRatio={.48} height={430} gap={0} tilt={4} onSelect={setActive} />
    {active && <div className="gallery-overlay" role="dialog" aria-modal="true" aria-label={current.title} onClick={() => { setActive(null); setZoomed(null) }}>
      <div className="gallery-dialog" onClick={event => event.stopPropagation()}>
        <button className="gallery-close" onClick={() => { setActive(null); setZoomed(null) }}>CLOSE ×</button>
        <div className="gallery-dialog-head"><span>{current.no} / {current.en}</span><h3>{current.title}</h3><p>{current.description}</p></div>
        {gallery?.video
          ? <div className="motion-player"><video controls playsInline preload="metadata" poster={gallery.poster}><source src={gallery.video} type="video/mp4" />你的浏览器暂不支持视频播放。</video><p>MOTION WORK / 01</p></div>
          : gallery
          ? <div className="scene-grid">{gallery.images.map((src, i) => <figure key={src} role="button" tabIndex="0" onClick={() => setZoomed(src)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setZoomed(src) }}><img src={src} alt={`${current.title} ${i + 1}`} loading="lazy" decoding="async" /><figcaption>{gallery.label} / 0{i + 1}<span>点击放大 ↗</span></figcaption></figure>)}</div>
          : <div className="empty-gallery"><span>{current.count}</span><p>该系列正在整理中，敬请期待。</p></div>}
      </div>
      {zoomed && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="作品大图" onClick={event => { event.stopPropagation(); setZoomed(null) }}><button aria-label="关闭大图" onClick={() => setZoomed(null)}>CLOSE ×</button><img src={zoomed} alt="作品大图" /></div>}
    </div>}
  </>
}
