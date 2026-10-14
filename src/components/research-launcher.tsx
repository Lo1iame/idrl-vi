import { useState, type FormEvent } from 'react'
import { ArrowUp, FileText, Check, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Brand } from './brand'
import type { Translate } from '../lib/types'

export function ResearchLauncher({ t }: { t: Translate }) {
  const [draft, setDraft] = useState('')
  function open(event: FormEvent) {
    event.preventDefault()
    if (!draft.trim()) return
    try { sessionStorage.setItem('idrl-draft', draft.trim()) } catch { /* Navigation still works without storage. */ }
    location.hash = 'assistant'
  }
  return <div className="research-launcher" data-has-draft={!!draft.trim()}>
    <div className="launcher-header"><Brand /><span>{t('研究助手', 'Research assistant')}</span><span className="muted">{t('本地模拟', 'Local simulation')}</span></div>
    <div className="launcher-body"><div className="welcome-icon"><Sparkles size={28} /></div><h3>{t('从一个好问题开始。', 'Start with a good question.')}</h3><p>{t('连接实验记录，梳理证据与下一步。', 'Connect experiment records, evidence, and next steps.')}</p>
      <form className="composer" onSubmit={open}><label className="sr-only" htmlFor="website-question">{t('准备研究问题', 'Prepare a research question')}</label><textarea id="website-question" placeholder={t('提出一个研究问题…', 'Ask a research question…')} value={draft} onChange={e => setDraft(e.target.value)} maxLength={1000} rows={2} /><div className="composer-bottom"><span>{t('带着问题打开研究助手', 'Open the assistant with your question')}</span><Button type="submit" size="icon" aria-label={t('打开助手并填写问题', 'Open assistant with question')} disabled={!draft.trim()}><ArrowUp size={19} /></Button></div></form>
      <div className="suggestions"><button onClick={() => setDraft(t('比较最近的示例实验结果', 'Compare the recent sample experiments'))}><FileText size={16} />{t('比较示例实验', 'Compare experiments')}</button><button onClick={() => setDraft(t('整理示例实验的下一步检查项', 'List next checks for the sample experiments'))}><Check size={16} />{t('整理下一步检查项', 'List next checks')}</button></div>
      <p className="launcher-readiness" aria-live="polite">{draft.trim() ? t('问题已准备，点击箭头继续。','Question ready. Select the arrow to continue.') : t('选择示例问题，或写下自己的问题。','Choose an example or write your own question.')}</p>
    </div>
  </div>
}
