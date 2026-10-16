import { useRef, useState } from 'react'
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Expand, FileText, ZoomIn, ZoomOut } from 'lucide-react'
import { AppShell } from '../components/app-shell'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Dialog } from '../components/ui/dialog'
import { idrlAppConfig } from '../lib/app-navigation'
import type { Translate } from '../lib/types'
import cover from '../../output/brand/foundation-1.png'
import identity from '../../output/brand/foundation-2.png'
import color from '../../output/brand/foundation-3.png'
import typography from '../../output/brand/foundation-4.png'
import digital from '../../output/brand/foundation-5.png'
import pdf from '../../output/brand/idrl-foundation-review.pdf?url'
import designGuide from '../../DESIGN.md?url'
import adoptionGuide from '../../docs/design/adoption.md?url'
import './foundation.css'

const boards = [
  {src:cover,zh:'品牌理念',en:'Brand principles',description:['严谨、探索、开放，建立研究表达的共同语言。','Rigor, exploration and openness: a shared language for research.']},
  {src:identity,zh:'标志与组合',en:'Identity and lockups',description:['保留原始几何标志，展示中英名称与深浅底组合。','Original geometry, bilingual names and light/dark background lockups.']},
  {src:color,zh:'品牌颜色',en:'Brand colors',description:['三蓝色识别、中性色表面与深浅主题的初始配色。','Three signature blues, neutral surfaces and the initial theme palette.']},
  {src:typography,zh:'字体与排版',en:'Typography',description:['Inter 与 Noto Sans CJK SC，以字号和留白建立层次。','Inter and Noto Sans CJK SC, with hierarchy through scale and spacing.']},
  {src:digital,zh:'数字视觉基础',en:'Digital foundations',description:['用静态界面样例说明语义变量与数字产品的关系。','Static interface studies connecting semantic tokens and digital products.']},
]

export function Foundation({t}:{t:Translate}) {
  const [selected,setSelected]=useState<number|null>(null)
  const [showPdf,setShowPdf]=useState(false)
  const [zoomed,setZoomed]=useState(false)
  const trigger=useRef<HTMLElement|null>(null)
  const board=boards[selected??0]
  return <AppShell config={idrlAppConfig(t)} active="foundation" t={t}>
    <div className="foundation-page">
      <header className="foundation-heading">
        <div><Badge tone="info">{t('视觉基础审核稿 v0.1','Visual foundation review v0.1')}</Badge>
          <h1>{t('品牌基础','Brand foundation')}</h1>
          <p>{t('从标志到数字界面，回看 IDRL 视觉语言的起点。','From the symbol to digital interfaces, revisit the origins of IDRL’s visual language.')}</p>
        </div>
        <div className="foundation-actions">
          <Button asChild><a href={pdf} target="_blank" rel="noreferrer"><FileText size={16}/>{t('打开 PDF','Open PDF')}<ArrowUpRight size={15}/></a></Button>
          <Button variant="secondary" asChild><a href={pdf} download="idrl-foundation-review.pdf"><ArrowDownToLine size={16}/>{t('下载 PDF','Download PDF')}</a></Button>
        </div>
      </header>

      <aside className="foundation-history" aria-label={t('审核稿版本说明','Review version note')}>
        <strong>{t('历史审核材料 · 五页原稿','Historical review · five original boards')}</strong>
        <p>{t('保留 v0.1 原始内容与阶段说明。图稿中的日期、检查数量及后续计划代表当时状态；现行规则与组件能力以当前规范为准。','The v0.1 content and milestone notes are preserved. Dates, check counts and future plans reflect that revision; use the current guides for today’s rules and capabilities.')}</p>
        <p className="foundation-original-language">{t('原稿为中文，保留原始配色，不随界面主题反色。','Original boards are in Chinese and retain their original colors in both interface themes.')}</p>
        <nav aria-label={t('现行设计资料','Current design resources')}>
          <a href={designGuide} target="_blank" rel="noreferrer">DESIGN.md <ArrowUpRight size={14}/></a>
          <a href="#components">{t('当前设计组件','Current components')}<ArrowRight size={14}/></a>
          <a href={adoptionGuide} target="_blank" rel="noreferrer">{t('应用接入指南','Application adoption guide')}<ArrowUpRight size={14}/></a>
        </nav>
      </aside>

      <ol className="foundation-gallery" aria-label={t('五页品牌审核稿','Five brand review boards')}>
        {boards.map((item,index)=><li key={item.en}>
          <figure>
            <button className="foundation-thumbnail" aria-label={t(`放大查看：${item.zh}`,`Enlarge: ${item.en}`)} onClick={event=>{trigger.current=event.currentTarget;setZoomed(false);setSelected(index)}}>
              <img src={item.src} alt="" width="2880" height="1920" loading={index===0?'eager':'lazy'}/>
              <span className="foundation-enlarge"><Expand size={16}/>{t('放大查看','Enlarge')}</span>
            </button>
            <figcaption><span className="foundation-page-number">{String(index+1).padStart(2,'0')} / 05</span><h2>{t(item.zh,item.en)}</h2><p>{t(item.description[0],item.description[1])}</p></figcaption>
          </figure>
        </li>)}
      </ol>

      <section className="foundation-pdf" aria-labelledby="foundation-pdf-heading">
        <div><h2 id="foundation-pdf-heading">{t('完整审核稿','Complete review')}</h2><p>{t('以 PDF 连续阅读五页原稿；移动设备也可直接打开或下载。','Read all five original boards in PDF, or open and download the file on mobile.')}</p></div>
        <Button variant="secondary" aria-expanded={showPdf} aria-controls="foundation-pdf-reader" onClick={()=>setShowPdf(value=>!value)}>{showPdf?t('收起页内预览','Hide inline preview'):t('展开页内预览','Show inline preview')}</Button>
        <div id="foundation-pdf-reader" hidden={!showPdf}>
          {showPdf&&<object data={pdf} type="application/pdf" aria-label={t('视觉基础审核稿 PDF','Visual foundation review PDF')}><p>{t('浏览器不支持页内 PDF，请使用上方打开或下载入口。','Inline PDF is unavailable. Use the open or download links above.')}</p></object>}
        </div>
      </section>
    </div>

    <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}} returnFocusRef={trigger}
      className="foundation-dialog" title={`${String((selected??0)+1).padStart(2,'0')} / 05 · ${t(board.zh,board.en)}`}
      description={t('视觉基础审核稿 v0.1 · 原始中文图稿。按 Esc 关闭。','Visual foundation review v0.1 · original Chinese board. Press Escape to close.')}>
      <div className="foundation-zoom-tools"><Button variant="ghost" size="sm" aria-pressed={zoomed} onClick={()=>setZoomed(value=>!value)}>{zoomed?<ZoomOut size={16}/>:<ZoomIn size={16}/>} {zoomed?t('适合窗口','Fit to window'):t('放大细节','Zoom into details')}</Button><span>{zoomed?t('滚动查看细节；键盘聚焦图像区域后用方向键移动。','Scroll to inspect details; focus the image region and use arrow keys.'):t('可进一步放大，查看原稿文字。','Zoom further to read the original board.')}</span></div>
      <div className={`foundation-image-viewport${zoomed?' is-zoomed':''}`} tabIndex={zoomed?0:undefined} role="region" aria-label={t('原稿图像区域','Original board image region')} key={`${selected}-${zoomed}`}>
        <img className="foundation-full-image" src={board.src} alt={t(`${board.zh}审核原稿`,`${board.en} original review board`)}/>
      </div>
      <div className="foundation-preview-controls">
        <Button variant="secondary" disabled={selected===0} onClick={()=>{setZoomed(false);setSelected(value=>value===null?0:Math.max(0,value-1))}}><ArrowLeft size={16}/>{t('上一页','Previous')}</Button>
        <span role="status">{t(board.description[0],board.description[1])}</span>
        <Button variant="secondary" disabled={selected===boards.length-1} onClick={()=>{setZoomed(false);setSelected(value=>value===null?0:Math.min(boards.length-1,value+1))}}>{t('下一页','Next')}<ArrowRight size={16}/></Button>
      </div>
    </Dialog>
  </AppShell>
}
