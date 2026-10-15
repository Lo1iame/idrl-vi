import { idrlAppConfig } from '../lib/app-navigation'
import { AppShell, type AppShellConfig } from '../components/app-shell'
import { releases, type LocalizedText, type Release } from '../lib/releases'
import type { Translate } from '../lib/types'

export function Changelog({t,entries=releases,repositoryUrl='https://github.com/zweien/idrl-vi',config}:{t:Translate;entries?:Release[];repositoryUrl?:string;config?:AppShellConfig}) {
  const local=(text:LocalizedText)=>t(text.zh,text.en)
  const categories={added:t('新增','Added'),improved:t('改进','Improved'),fixed:t('修复','Fixed')}
  return <AppShell t={t} active="changelog" config={config??idrlAppConfig(t)}><div className="changelog-page">
    <header className="changelog-heading"><h1>{t('更新日志','Changelog')}</h1><p>{t('记录 IDRL 视觉规范、品牌资产与设计组件的已发布变更。这里不包含各业务应用的产品动态。','Published changes to IDRL guidelines, assets, and components. Product updates for downstream applications are maintained separately.')}</p></header>
    {entries.length===0&&<p className="muted">{t('暂无更新记录。','No updates yet.')}</p>}
    <ol className="release-list">{entries.map(release=><li className="release" key={release.version}>
      <div className="release-meta"><h2>v{release.version}</h2><time dateTime={release.date}>{release.date}</time>{release.commit&&repositoryUrl&&<a href={`${repositoryUrl.replace(/\/$/,'')}/commit/${release.commit}`} target="_blank" rel="noreferrer">{t('查看提交','View commit')} ↗</a>}</div>
      <article className="release-content"><h3>{local(release.title)}</h3>{release.changes.map((change,index)=><div key={index} className="release-change"><span className="release-type">{categories[change.type]}</span><p>{local(change.text)}</p></div>)}</article>
    </li>)}</ol>
  </div></AppShell>
}
