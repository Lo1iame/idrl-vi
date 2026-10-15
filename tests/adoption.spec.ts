import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('standalone adoption page retains forms, theme-aware logos and accessible controls',async({page})=>{
  await page.goto('/examples/adoption/')
  await expect(page.getByRole('heading',{name:'项目',exact:true})).toBeVisible()
  await page.getByLabel('名称',{exact:true}).fill('动态中文验证：龘')
  await page.getByRole('button',{name:'预览',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('动态中文验证：龘')
  for(const theme of ['light','dark']) {
    if(theme==='dark') await page.getByRole('button',{name:'深色',exact:true}).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme',theme)
    await expect(page.locator(`.brand-theme-${theme}`)).toBeVisible()
    const aliases=await page.evaluate(()=>{
      const root=getComputedStyle(document.documentElement)
      const scoped=document.createElement('div');scoped.dataset.theme='light';document.body.append(scoped)
      const local=getComputedStyle(scoped)
      const result={card:root.getPropertyValue('--card').trim(),surface:root.getPropertyValue('--surface').trim(),chart:root.getPropertyValue('--chart-2').trim(),series:root.getPropertyValue('--chart2').trim(),localCard:local.getPropertyValue('--card').trim(),localSurface:local.getPropertyValue('--surface').trim()}
      scoped.remove();return result
    })
    expect(aliases.card).toBe(aliases.surface)
    expect(aliases.chart).toBe(aliases.series)
    expect(aliases.localCard).toBe(aliases.localSurface)
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    expect(result.violations).toEqual([])
    await page.screenshot({path:`output/ui/adoption-${theme}-desktop.png`,fullPage:true})
  }
})

test('standalone adoption navigation handles desktop rail and mobile drawer',async({page})=>{
  await page.goto('/examples/adoption/')
  await page.getByRole('button',{name:'折叠侧边栏',exact:true}).click()
  await expect(page.locator('.shell-layout')).toHaveAttribute('data-sidebar','rail')
  await page.setViewportSize({width:390,height:844})
  await page.getByRole('button',{name:'打开导航',exact:true}).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button',{name:'打开导航',exact:true})).toBeFocused()
  for(const width of [320,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900})
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
  }
})
