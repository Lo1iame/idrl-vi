import { FlaskConical, PanelsTopLeft, Sparkles, History, Palette } from 'lucide-react'
import { Brand } from '../components/brand'
import { Badge } from '../components/ui/badge'
import type { Translate } from './types'
import type { AppShellConfig } from './app-shell-config'
export type { AppNavItem, AppShellConfig } from './app-shell-config'
export function idrlAppConfig(t: Translate): AppShellConfig {
  return {
    id:'idrl-vi',name:'IDRL Research',description:t('团队空间 · 演示','Team space · Demo'),logo:<Brand/>,compactLogo:<Brand compact/>,homeHref:'#website',
    groups:[
      {id:'workspace',label:t('工作空间','Workspace'),items:[
        {id:'workspace',label:t('实验工作台','Experiments'),href:'#workspace',icon:FlaskConical},
        {id:'assistant',label:t('研究助手','Research assistant'),href:'#assistant',icon:Sparkles},
      ]},
      {id:'system',label:t('设计系统','Design system'),items:[
        {id:'foundation',label:t('品牌基础','Brand foundation'),href:'#foundation',icon:Palette},
        {id:'components',label:t('设计组件','Design components'),href:'#components',icon:PanelsTopLeft},
        {id:'changelog',label:t('更新日志','Changelog'),href:'#changelog',icon:History},
      ]},
    ],
    status:<Badge tone="info">{t('示例空间','Demo space')}</Badge>,
    footer:<><span className="mini-status"/>{t('本地演示环境','Local demo environment')}<p>{t('数据为示例，无外部服务连接。','Sample data. No external services.')}</p></>,
  }
}
