import { useContext, type MouseEvent } from 'react'
import { AppToolsContext } from '../components/app-shell'
import { ResearchLauncher } from '../components/research-launcher'
import { AnimatedContent } from '../components/react-bits/animated-content'
import { BrandLogoMotion } from '../components/brand-logo-motion'
import { HeroGrid } from '../components/hero-grid'
import { TiltedVisual } from '../components/react-bits/tilted-visual'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Brand } from '../components/brand'
import { Button } from '../components/ui/button'
import type { Translate } from '../lib/types'
import researchForm from '../../assets/brand/images/research-form.webp'

function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}

export function Website({ t }: { t: Translate }) {
  const tools = useContext(AppToolsContext)
  return <div className="website">
    <header className="web-header">
      <a href="#website" aria-label="IDRL"><Brand /></a>
      <nav aria-label={t('官网导航', 'Website navigation')}>
        <a href="#research" onClick={e => jump(e, 'research')}>{t('研究方向', 'Research')}</a>
        <a href="#approach" onClick={e => jump(e, 'approach')}>{t('我们的方式', 'Our approach')}</a>
        <Button variant="secondary" asChild><a href="#workspace">{t('探索工作台', 'Explore workspace')}<ArrowUpRight size={16} /></a></Button>
      </nav>{tools}
    </header>

    <section className="identity-hero">
      <HeroGrid />
      <BrandLogoMotion label={t('重播 IDRL 标志动画', 'Replay IDRL logo animation')} hint={t('点击标志重播', 'Click to replay')} />
      <AnimatedContent className="identity-copy" distance={18}>
        <p className="identity-name">Intelligent Design and Robust Learning</p>
        <h1><span>{t('智能设计', 'Intelligent design.')}</span><span className="identity-second">{t('与鲁棒学习', 'Robust learning.')}</span></h1>
        <p className="identity-description">{t('以设计探索可能，以学习构建可靠。', 'Explore through design. Build reliability through learning.')}</p>
        <div className="identity-actions">
          <Button asChild><a href="#assistant">{t('体验研究助手', 'Try the research assistant')}<ArrowUpRight size={17} /></a></Button>
          <a className="quiet-link" href="#workspace">{t('查看实验示例', 'Explore experiments')}<ArrowRight size={17} /></a>
        </div>
      </AnimatedContent>
      <AnimatedContent className="hero-sculpture" distance={72} duration={1.1} delay={.15} initialOpacity={.35} aria-hidden="true"><TiltedVisual><img src={researchForm} alt="" width="1536" height="1024" /></TiltedVisual></AnimatedContent>
    </section>

    <div className="brand-values">
      {[
        ['严谨','Rigor','让证据清楚可见','Make evidence visible'],
        ['探索','Exploration','连接方法与创造','Connect methods and creation'],
        ['开放','Openness','在协作中前进','Move forward together'],
      ].map(([zh,en,copyZh,copyEn],index) => <AnimatedContent className="value-statement" key={en} distance={48} duration={.85} delay={index * .15}>
        <span className="value-index" aria-hidden="true">0{index+1}</span>
        <div><span className="value-english" lang="en">{en}</span><p>{t(zh,en)}<span>{t(copyZh,copyEn)}</span></p></div>
      </AnimatedContent>)}
    </div>

    <section id="research" className="research-section">
      <AnimatedContent className="research-intro" distance={48} duration={.9}><h2>{t('在交叉处，', 'At the intersection,')}<br />{t('寻找新问题。', 'find new questions.')}</h2><p>{t('从问题到方法，从方法到工具。', 'From questions to methods. From methods to tools.')}</p></AnimatedContent>
      <AnimatedContent className="research-macro" distance={72} duration={1.1} initialOpacity={.35}><figure className="motion-figure"><img src={researchForm} alt={t('蓝色几何平面的交汇细节','Detail of interlocking blue geometric planes')} loading="lazy" width="1536" height="1024" /></figure></AnimatedContent>
      <div className="research-directions">
        {[
          { zh: '智能设计', en: 'Intelligent design', copy: t('从问题定义到方案探索，建立可理解、可迭代的设计过程。', 'Define problems and explore possibilities through understandable, iterative design.') },
          { zh: '鲁棒学习', en: 'Robust learning', copy: t('关注变化与不确定性，用明确的实验记录理解方法的表现。', 'Understand methods under change and uncertainty through clear experiment records.') },
          { zh: '研究工具', en: 'Research tools', copy: t('把方法转化为可交互的工具，连接研究、验证与协作。', 'Turn methods into interactive tools that connect research, evaluation, and collaboration.') },
        ].map((r, index) => <AnimatedContent key={r.en} distance={56} duration={.8} delay={index * .12}><article className="research-direction"><div><h3>{t(r.zh, r.en)}</h3><span lang="en">{r.en}</span></div><p>{r.copy}</p></article></AnimatedContent>)}
        <p className="concept-note">{t('研究方向为设计示例，正式发布前需替换为团队确认的内容。', 'Illustrative research directions. Replace with verified team content before publication.')}</p>
      </div>
    </section>

    <section id="approach" className="research-tools-section">
      <AnimatedContent className="research-tools-copy" distance={48} duration={.9}><div><h2>{t('让想法，成为可探索的工具。', 'Make ideas tangible.')}</h2><p>{t('同一套视觉语言，连接研究表达、实验记录与 AI 协作。', 'One visual language for research, experiments, and AI collaboration.')}</p></div><a className="tools-link" href="#workspace">{t('打开工作台示例', 'Open workspace example')}<ArrowUpRight size={20} /></a></AnimatedContent>
      <ol className="research-flow" aria-label={t('研究助手示例流程','Research assistant example flow')}>
        {[
          ['提出问题','Ask a question','明确想比较和理解的内容','Define what to compare and understand'],
          ['连接记录','Connect records','使用已有的本地示例记录','Use the existing local sample records'],
          ['检查证据','Inspect evidence','查看来源，确认操作与结果','Review sources, actions, and results'],
        ].map(([zh,en,copyZh,copyEn],index)=><li key={en}><AnimatedContent distance={32} duration={.7} delay={index*.12}><span className="flow-index" aria-hidden="true">0{index+1}</span><h3>{t(zh,en)}</h3><p>{t(copyZh,copyEn)}</p></AnimatedContent></li>)}
      </ol>
      <AnimatedContent className="launcher-motion" distance={56} duration={1}><ResearchLauncher t={t}/></AnimatedContent>

    </section>

    <section className="website-closing"><AnimatedContent className="closing-copy" distance={48} duration={.9}><h2>{t('继续探索。','Keep exploring.')}</h2><p>{t('从研究想法，到可用工具。','From research ideas to useful tools.')}</p></AnimatedContent><AnimatedContent className="closing-action" distance={32} delay={.12}><a className="tools-link" href="#workspace">{t('打开工作台','Open workspace')}<ArrowUpRight size={28}/></a></AnimatedContent></section>
    <footer className="identity-footer"><div><Brand /><p>智能设计与鲁棒学习<br/><span lang="en">Intelligent Design and Robust Learning</span></p></div><div><span>{t('本地品牌界面示例', 'Local brand interface concept')}</span><a href="#components">{t('探索设计组件', 'Explore design components')}<ArrowUpRight size={15} /></a></div></footer>
  </div>
}
