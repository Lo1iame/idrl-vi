import { useContext, type MouseEvent } from 'react'
import { AppToolsContext } from '../components/app-shell'
import { ResearchLauncher } from '../components/research-launcher'
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
      <div className="identity-copy">
        <p className="identity-name">Intelligent Design and Robust Learning</p>
        <h1><span>{t('智能设计', 'Intelligent design.')}</span><span className="identity-second">{t('与鲁棒学习', 'Robust learning.')}</span></h1>
        <p className="identity-description">{t('以设计探索可能，以学习构建可靠。', 'Explore through design. Build reliability through learning.')}</p>
        <div className="identity-actions">
          <Button asChild><a href="#assistant">{t('体验研究助手', 'Try the research assistant')}<ArrowUpRight size={17} /></a></Button>
          <a className="quiet-link" href="#workspace">{t('查看实验示例', 'Explore experiments')}<ArrowRight size={17} /></a>
        </div>
      </div>
      <div className="hero-sculpture" aria-hidden="true"><img src={researchForm} alt="" width="1536" height="1024" /></div>
    </section>

    <div className="brand-values">
      <p>{t('严谨', 'Rigor')}<span>{t('让证据清楚可见', 'Make evidence visible')}</span></p>
      <p>{t('探索', 'Exploration')}<span>{t('连接方法与创造', 'Connect methods and creation')}</span></p>
      <p>{t('开放', 'Openness')}<span>{t('在协作中前进', 'Move forward together')}</span></p>
    </div>

    <section id="research" className="research-section">
      <div className="research-intro"><h2>{t('在交叉处，', 'At the intersection,')}<br />{t('寻找新问题。', 'find new questions.')}</h2><p>{t('从问题到方法，从方法到工具。', 'From questions to methods. From methods to tools.')}</p></div>
      <figure className="research-macro"><img src={researchForm} alt={t('蓝色几何平面的交汇细节','Detail of interlocking blue geometric planes')} loading="lazy" width="1536" height="1024" /></figure>
      <div className="research-directions">
        {[
          { zh: '智能设计', en: 'Intelligent design', copy: t('从问题定义到方案探索，建立可理解、可迭代的设计过程。', 'Define problems and explore possibilities through understandable, iterative design.') },
          { zh: '鲁棒学习', en: 'Robust learning', copy: t('关注变化与不确定性，用明确的实验记录理解方法的表现。', 'Understand methods under change and uncertainty through clear experiment records.') },
          { zh: '研究工具', en: 'Research tools', copy: t('把方法转化为可交互的工具，连接研究、验证与协作。', 'Turn methods into interactive tools that connect research, evaluation, and collaboration.') },
        ].map(r => <article className="research-direction" key={r.en}><div><h3>{t(r.zh, r.en)}</h3><span lang="en">{r.en}</span></div><p>{r.copy}</p></article>)}
        <p className="concept-note">{t('研究方向为设计示例，正式发布前需替换为团队确认的内容。', 'Illustrative research directions. Replace with verified team content before publication.')}</p>
      </div>
    </section>

    <section id="approach" className="research-tools-section">
      <div className="research-tools-copy"><div><h2>{t('让想法，成为可探索的工具。', 'Make ideas tangible.')}</h2><p>{t('同一套视觉语言，连接研究表达、实验记录与 AI 协作。', 'One visual language for research, experiments, and AI collaboration.')}</p></div><a className="tools-link" href="#workspace">{t('打开工作台示例', 'Open workspace example')}<ArrowUpRight size={20} /></a></div>
      <ResearchLauncher t={t}/>

    </section>

    <section className="website-closing"><div><h2>{t('继续探索。','Keep exploring.')}</h2><p>{t('从研究想法，到可用工具。','From research ideas to useful tools.')}</p></div><a className="tools-link" href="#workspace">{t('打开工作台','Open workspace')}<ArrowUpRight size={28}/></a></section>
    <footer className="identity-footer"><div><Brand /><p>智能设计与鲁棒学习<br/><span lang="en">Intelligent Design and Robust Learning</span></p></div><div><span>{t('本地品牌界面示例', 'Local brand interface concept')}</span><a href="#components">{t('探索设计组件', 'Explore design components')}<ArrowUpRight size={15} /></a></div></footer>
  </div>
}
