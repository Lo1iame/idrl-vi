import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('component specimens validate fields, change tabs and confirm actions',async({page})=>{
 await page.goto('/#components')
 await page.getByRole('button',{name:'保存预览配置'}).click()
 await expect(page.getByLabel('实验名称',{exact:false})).toBeFocused()
 await expect(page.getByText('请输入实验名称。',{exact:true})).toBeVisible()
 await page.getByLabel('实验名称',{exact:false}).fill('鲁棒性比较')
 await page.getByLabel('实验说明',{exact:false}).fill('检查不同随机种子的示例表现')
 await page.getByRole('button',{name:'保存预览配置'}).click()
 await expect(page.getByRole('status')).toContainText('已保存本地预览配置')
 await expect(page.getByText('请输入实验名称。',{exact:true})).toHaveCount(0)
 await page.getByRole('switch',{name:'紧凑表单'}).click()
 await expect(page.getByRole('switch',{name:'紧凑表单'})).toHaveAttribute('aria-checked','true')
 await page.getByRole('button',{name:'主操作',exact:true}).click()
 await page.getByRole('button',{name:'确认操作',exact:true}).click()
 await expect(page.getByRole('status')).toContainText('示例操作已确认')
 await expect(page.getByRole('button',{name:'主操作',exact:true})).toBeFocused()
 await page.getByRole('tab',{name:'组件预览'}).focus();await page.keyboard.press('ArrowRight')
 await expect(page.getByRole('tab',{name:'使用规范'})).toHaveAttribute('aria-selected','true')
 await expect(page.getByRole('heading',{name:'从共享组件开始'})).toBeVisible()
 await page.keyboard.press('Home');await expect(page.getByRole('tab',{name:'组件预览'})).toHaveAttribute('aria-selected','true')
 await expect(page.getByLabel('实验名称',{exact:false})).toHaveValue('鲁棒性比较')
})

test('website product preview carries a question into the assistant',async({page})=>{
 await page.goto('/#website')
 await page.getByLabel('准备研究问题').fill('比较不同方法的表现')
 await page.getByRole('button',{name:'打开助手并填写问题'}).click()
 await expect(page).toHaveURL(/#assistant$/)
 await expect(page.getByLabel('输入研究问题')).toHaveValue('比较不同方法的表现')
 await page.getByText('demo-experiments',{exact:true}).click()
 await expect(page.getByText('EXP-024',{exact:true})).toBeVisible()
})
test('workspace filters, empty state, creation and export reflect actual local state',async({page})=>{
 await page.goto('/#workspace');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();await expect(page.getByRole('table')).toBeVisible()
 await page.getByLabel('搜索实验').fill('does-not-exist');await expect(page.getByText('没有匹配的实验')).toBeVisible()
 await page.getByRole('button',{name:'清除筛选'}).click();await expect(page.getByRole('row')).toHaveCount(6)
 await page.getByLabel('实验状态',{exact:true}).selectOption('failed');await expect(page.getByRole('row')).toHaveCount(2)
 await page.getByRole('button',{name:'新建演示实验'}).click();await page.getByLabel('实验名称',{exact:true}).fill('交互测试实验');await page.getByRole('button',{name:'添加演示记录'}).click()
 await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByRole('row')).toHaveCount(7);await expect(page.getByRole('status')).toContainText('未启动真实计算')
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'导出 JSON'}).click();expect((await download).suggestedFilename()).toBe('idrl-demo-experiments.json')
 await page.getByRole('button',{name:'新建演示实验'}).click();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'新建演示实验'})).toBeFocused()
})
test('AI requires explicit approval, supports failure retry and downloads a report',async({page})=>{
 await page.goto('/#assistant');await page.getByLabel('工具执行结果').selectOption('failure')
 await page.getByRole('button',{name:'比较最近的示例实验结果'}).click();await expect(page.getByRole('button',{name:'确认生成'})).toBeVisible();await expect(page.getByText('摘要已生成',{exact:true})).toHaveCount(0);await page.screenshot({path:'output/ui/assistant-approval-desktop.png',fullPage:true})
 await page.getByRole('button',{name:'确认生成'}).click();await expect(page.getByText('模拟工具执行失败',{exact:true})).toBeVisible()
 await page.getByRole('button',{name:'重新开始'}).click();await page.getByLabel('工具执行结果').selectOption('success')
 await page.getByLabel('输入研究问题').fill('比较实验结果');await page.getByRole('button',{name:'发送问题'}).click();await expect(page.getByRole('button',{name:'确认生成'})).toBeVisible();await page.getByRole('button',{name:'确认生成'}).click();await expect(page.getByText('摘要已生成',{exact:true})).toBeVisible()
 await page.screenshot({path:'output/ui/assistant-completed-desktop.png',fullPage:true});const download=page.waitForEvent('download');await page.getByRole('button',{name:'下载 Markdown 摘要'}).click();expect((await download).suggestedFilename()).toBe('idrl-demo-comparison.md')
})
test('AI cancellation stops the flow without creating a report',async({page})=>{
 await page.goto('/#assistant');await page.getByRole('button',{name:'比较最近的示例实验结果'}).click();await page.getByRole('button',{name:'停止',exact:true}).click()
 await expect(page.getByText('已停止当前流程。未生成报告或修改实验记录。')).toBeVisible();await expect(page.getByRole('button',{name:'确认生成'})).toHaveCount(0)
})
for(const theme of ['light','dark'])for(const view of ['website','workspace','assistant','components']){
 test(`${view} / ${theme}: accessible desktop and mobile layout`,async({page})=>{
  test.setTimeout(60_000) // Axe plus two full-page captures can exceed 30s on this host.
  await page.goto('/#'+view);await page.evaluate(theme=>{document.documentElement.dataset.theme=theme},theme);await page.evaluate(()=>document.fonts.ready)
  const a=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(a.violations,JSON.stringify(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([])
  await page.setViewportSize({width:390,height:844});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  await page.screenshot({path:`output/ui/${view}-${theme}-mobile.png`,fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:`output/ui/${view}-${theme}-desktop.png`,fullPage:true})
 })
}
test('English UI and theme preference persist on reload',async({page})=>{
 await page.goto('/#workspace');await page.getByRole('button',{name:'切换语言'}).click();await expect(page.getByRole('heading',{name:'Make every experiment traceable.'})).toBeVisible();await page.getByRole('button',{name:'Switch to dark theme'}).click();await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.setViewportSize({width:390,height:844});for(const view of ['website','workspace','assistant','components']){await page.goto('/#'+view);await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)}
})
