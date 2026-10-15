import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUpRight, Check, Copy, Plus, RotateCcw, CheckCircle2, Info } from 'lucide-react'
import { AppShell } from '../components/app-shell'
import { DataSpecimen } from '../components/data-specimen'
import { FrameworkSpecimen } from '../components/framework-specimen'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Checkbox, Switch } from '../components/ui/choice'
import { FormField, Input, Select, Textarea } from '../components/ui/field'
import { Dialog } from '../components/ui/dialog'
import type { Translate } from '../lib/types'
import designGuideUrl from '../../DESIGN.md?url'

export function Components({ t }: { t: Translate }) {
  const [tab, setTab] = useState<'preview' | 'guide'>('preview')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('all')
  const [validated, setValidated] = useState(false)
  const [notice, setNotice] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [compact, setCompact] = useState(false)
  const [includeSeed, setIncludeSeed] = useState(true)
  const [showMethod, setShowMethod] = useState(false)
  const invalidName = validated && !name.trim()
  const invalidDescription = validated && !description.trim()

  function reset() {
    setName(''); setDescription(''); setStatus('all'); setValidated(false); setIncludeSeed(true); setShowMethod(false)
    setNotice(t('表单已重置。', 'Form reset.'))
  }
  function submit(event: FormEvent) {
    event.preventDefault(); setValidated(true); setNotice('')
    if (!name.trim() || !description.trim()) {
      document.getElementById(!name.trim() ? 'example-name' : 'example-description')?.focus()
      return
    }
    setNotice(t(`已保存本地预览配置：${name.trim()}。`, `Local preview settings saved: ${name.trim()}.`))
  }
  async function copy(value: string) {
    try { await navigator.clipboard.writeText(value); setNotice(t(`已复制 ${value}`, `Copied ${value}`)) }
    catch { setNotice(t(`无法自动复制，请手动选择：${value}`, `Copy unavailable. Select manually: ${value}`)) }
  }
  function changeTab(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 'preview' : event.key === 'End' ? 'guide' : tab === 'preview' ? 'guide' : 'preview'
    setTab(next); document.getElementById(`tab-${next}`)?.focus()
  }

  return <AppShell active="components" t={t}>
    <div className="library-page">
      <header className="library-heading"><div><h1>{t('基础组件', 'UI foundations')}</h1><p className="muted">{t('统一研究工具的交互语言。', 'A shared interaction language for research tools.')}</p></div><Badge tone="info">{t('交互预览', 'Interactive preview')}</Badge></header>
      <div className="library-tabs" role="tablist" aria-label={t('组件文档', 'Component documentation')}>
        {(['preview', 'guide'] as const).map(value => <button key={value} role="tab" id={`tab-${value}`} aria-selected={tab === value} aria-controls={`panel-${value}`} tabIndex={tab === value ? 0 : -1} onClick={() => setTab(value)} onKeyDown={changeTab}>{value === 'preview' ? t('组件预览', 'Preview') : t('使用规范', 'Usage')}</button>)}
      </div>
      <div className="library-notice" role="status" aria-label={t('组件反馈', 'Component feedback')}>{notice && <><CheckCircle2 size={16} /><span>{notice}</span></>}</div>
      {tab === 'preview' ? <div id="panel-preview" role="tabpanel" aria-labelledby="tab-preview" tabIndex={0} className="library-grid">
        <div className="library-main">
          <FrameworkSpecimen t={t}/>
          <DataSpecimen t={t}/>
          <section className="specimen"><h2>{t('按钮与操作层级', 'Buttons & hierarchy')}</h2><p className="muted">{t('主操作打开确认弹窗，次要操作恢复表单初始状态。', 'The primary action opens a dialog; the secondary action resets the form.')}</p>
            <div className="specimen-stage"><div className="component-row"><Button id="component-primary-action" onClick={() => setDialogOpen(true)}>{t('主操作', 'Primary')}</Button><Button variant="secondary" onClick={reset}>{t('次要操作', 'Secondary')}</Button><Button variant="ghost" onClick={() => { setTab('guide'); requestAnimationFrame(() => document.getElementById('tab-guide')?.focus()) }}>{t('文字操作', 'Ghost')}</Button><Button disabled>{t('不可用', 'Disabled')}</Button></div>
              <div className="component-row specimen-secondary"><Button variant="secondary" className="focus-example" onClick={() => setNotice(t('使用 Tab 移动焦点，Enter 或空格执行操作。', 'Use Tab to move focus; Enter or Space to activate.'))}>{t('键盘焦点', 'Keyboard focus')}</Button><Button variant="secondary" size="icon" aria-label={t('打开新增示例', 'Open add example')} onClick={() => setDialogOpen(true)}><Plus size={20} /></Button><span className="muted">{t('图标操作', 'Icon action')}</span></div>
            </div>
          </section>
          <section className="specimen" aria-label={t('表单组件示例', 'Form component example')}><div className="specimen-title"><h2>{t('输入与反馈', 'Input & feedback')}</h2><Switch checked={compact} onCheckedChange={setCompact} label={t('紧凑表单', 'Compact form')}/></div><p className="muted">{t('试着保存空表单，查看错误提示与焦点定位。', 'Save an empty form to explore validation and focus management.')}</p>
            <form noValidate onSubmit={submit} className={`specimen-form ${compact ? 'is-compact' : ''}`}>
              <div className="form-columns">
                <FormField id="example-name" label={t('实验名称', 'Experiment name')} required error={invalidName ? t('请输入实验名称。', 'Enter an experiment name.') : undefined}>
                  {field => <Input {...field} maxLength={80} value={name} onChange={e => setName(e.target.value)} placeholder={t('输入实验名称', 'Enter an experiment name')}/>}
                </FormField>
                <FormField id="example-status" label={t('实验状态', 'Experiment status')}>
                  {field => <Select {...field} value={status} onChange={e => setStatus(e.target.value)}><option value="all">{t('全部状态', 'All statuses')}</option><option value="completed">{t('已完成', 'Completed')}</option><option value="running">{t('运行中', 'Running')}</option><option value="failed">{t('失败', 'Failed')}</option></Select>}
                </FormField>
              </div>
              <FormField id="example-description" label={t('实验说明', 'Experiment description')} required
                description={t(`必填。仅用于当前页面的本地交互预览。${description.length} / 160 字符`, `Required. Local page preview only. ${description.length} / 160 characters`)}
                error={invalidDescription ? t('请输入实验说明。', 'Enter an experiment description.') : undefined}>
                {field => <Textarea {...field} rows={3} maxLength={160} value={description} onChange={e => setDescription(e.target.value)} placeholder={t('简要描述这次实验', 'Briefly describe this experiment')}/>}
              </FormField>
              <fieldset className="form-preferences"><legend>{t('摘要选项', 'Summary options')}</legend>
                <Checkbox label={t('包含随机种子', 'Include random seed')} description={t('在下方摘要中显示示例随机种子。', 'Show the demo random seed in the summary below.')} checked={includeSeed} onChange={event => setIncludeSeed(event.target.checked)}/>
                <Switch label={t('附带方法说明', 'Include method notes')} description={t('在下方摘要中显示方法说明。', 'Show method notes in the summary below.')} checked={showMethod} onCheckedChange={setShowMethod}/>
                <Checkbox label={t('团队同步', 'Team sync')} description={t('演示环境未连接团队服务。', 'No team service connected in this demo.')} disabled/>
              </fieldset>
              <div className="form-summary" role="region" aria-label={t('配置摘要预览', 'Configuration summary preview')}>
                <h3>{t('配置摘要预览', 'Configuration summary preview')}</h3>
                <p>{name.trim() || t('未命名实验', 'Untitled experiment')}</p>
                {description.trim() && <p className="muted">{description}</p>}
                {includeSeed && <p>{t('示例随机种子：42', 'Demo random seed: 42')}</p>}
                {showMethod && <p>{t('方法说明：比较不同设置下的鲁棒表现。', 'Method notes: compare robustness across settings.')}</p>}
              </div>
              <div className="form-actions"><Button variant="ghost" onClick={reset}><RotateCcw size={15} />{t('重置', 'Reset')}</Button><Button type="submit">{t('保存预览配置', 'Save preview settings')}</Button></div>
            </form>
          </section>
        </div>
        <aside className="library-aside">
          <section className="specimen"><h2>{t('品牌颜色', 'Brand colors')}</h2><p className="muted">{t('点击复制色值，界面开发优先使用语义变量。', 'Copy a value. Prefer semantic tokens in application code.')}</p><div className="color-list">{[{ name: 'IDRL Navy', value: '#203663', css: 'var(--brand-navy)' }, { name: 'IDRL Blue', value: '#236db9', css: 'var(--brand-blue)' }, { name: 'IDRL Cyan', value: '#56c0e5', css: 'var(--brand-cyan)' }].map(color => <button key={color.name} className="color-swatch" onClick={() => copy(color.value)} aria-label={t(`复制 ${color.name} ${color.value}`, `Copy ${color.name} ${color.value}`)}><span className="color-chip" style={{ background: color.css }} /><span><strong>{color.name}</strong><span>{color.value}</span></span><Copy size={14} /></button>)}</div></section>
          <section className="specimen"><h2>{t('状态与语义', 'States & semantics')}</h2><p className="muted">{t('颜色与文字共同表达状态。', 'Color and text communicate state together.')}</p><div className="status-specimens"><Badge tone="success"><Check size={13} />{t('已完成', 'Completed')}</Badge><Badge tone="info">{t('运行中', 'Running')}</Badge><Badge tone="warning">{t('等待确认', 'Awaiting confirmation')}</Badge><Badge tone="danger">{t('失败', 'Failed')}</Badge><Badge>{t('已取消', 'Cancelled')}</Badge></div></section>
        </aside>
      </div> : <section className="usage-guide" id="panel-guide" role="tabpanel" aria-labelledby="tab-guide" tabIndex={0}><h2>{t('从共享组件开始', 'Start with shared components')}</h2><p>{t('按钮、输入框、状态与弹窗共用语义颜色、焦点和主题规则。', 'Buttons, inputs, badges, and dialogs share semantic colors, focus behavior, and theme rules.')}</p><pre><code>{`import { Button } from '@/components/ui/button'\nimport { Input } from '@/components/ui/field'\n\n<label htmlFor="name">实验名称</label>\n<Input id="name" required />\n<Button type="submit">保存</Button>`}</code></pre><div className="usage-rules"><article><h3>{t('操作层级', 'Action hierarchy')}</h3><p>{t('主操作使用品牌蓝；取消与返回使用次要样式。提交期间禁用重复操作。', 'Use primary blue for the main action and secondary styles for cancel or back. Prevent duplicate submissions.')}</p></article><article><h3>{t('表单与键盘', 'Forms & keyboard')}</h3><p>{t('每个字段都有标签。提交后显示具体错误，并将焦点移到第一个无效字段。', 'Label every field. After submission, show specific errors and focus the first invalid field.')}</p></article><article><h3>{t('主题与状态', 'Themes & states')}</h3><p>{t('使用语义变量；状态包含可读文字。支持深浅主题与减少动态效果偏好。', 'Use semantic tokens and readable status text. Support both themes and reduced motion.')}</p></article></div><a className="quiet-link" href={designGuideUrl} target="_blank" rel="noreferrer">{t('阅读 DESIGN.md', 'Read DESIGN.md')}<ArrowUpRight size={16} /></a></section>}
      <footer className="library-footer"><span><Info size={16} />{t('本地交互预览，完整组件库持续完善。', 'Local interactive preview. The full library is still evolving.')}</span><div><a href="#workspace">{t('查看工作台示例', 'Explore workspace')}<ArrowUpRight size={15} /></a><a href="#assistant">{t('查看 AI 交互示例', 'Explore AI interactions')}<ArrowUpRight size={15} /></a></div></footer>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} returnFocusId="component-primary-action" title={t('确认示例操作', 'Confirm example action')} description={t('此操作仅更新当前组件页的预览提示。', 'This action updates the preview notice on this page.')}><div className="form-actions dialog-actions"><Button variant="secondary" onClick={() => setDialogOpen(false)}>{t('取消', 'Cancel')}</Button><Button onClick={() => { setDialogOpen(false); setNotice(t('示例操作已确认。', 'Example action confirmed.')) }}>{t('确认操作', 'Confirm action')}</Button></div></Dialog>
    </div>
  </AppShell>
}
