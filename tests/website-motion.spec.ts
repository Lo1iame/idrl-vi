import { test, expect } from '@playwright/test'

test('website entry preserves readable content and responds to reduced motion', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#website')
  const hero = page.locator('.identity-copy')
  await expect(hero).toHaveAttribute('data-motion-state', 'visible')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('智能设计与鲁棒学习')
  const directions = page.locator('.research-directions [data-motion="animated-content"]').first()
  await expect(directions).toHaveAttribute('data-motion-state', 'pending')
  await expect(directions).toHaveCSS('opacity', '1')
  await directions.scrollIntoViewIfNeeded()
  await expect(directions).toHaveAttribute('data-motion-state', 'visible')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const animated = page.locator('[data-motion="animated-content"]')
  for (const item of await animated.all()) {
    await expect(item).toHaveAttribute('data-motion-state', 'visible')
    await expect(item).toHaveCSS('transform', 'none')
    await expect(item).toHaveCSS('opacity', '1')
  }
  await expect(page.getByRole('button', { name: '重播 IDRL 标志动画' })).toHaveAttribute('data-logo-state', 'ready')
  await page.getByRole('link', { name: '体验研究助手', exact: true }).click()
  await expect(page).toHaveURL(/#assistant$/)
  expect(errors).toEqual([])
})

test('logo assembles, replays by keyboard and respects reduced motion with pointer tilt', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#website')
  const logo = page.getByRole('button', { name: '重播 IDRL 标志动画' })
  await expect(logo).toHaveAttribute('data-logo-state', 'ready')
  await expect(logo.locator('.brand-theme-light .brand-logo-piece')).toHaveCount(6)
  await logo.focus()
  await page.keyboard.press('Enter')
  await expect(logo).toHaveAttribute('data-logo-state', 'assembling')
  const visual = page.locator('.tilted-visual')
  await visual.hover({ position: { x: 100, y: 100 } })
  await expect(visual).toHaveAttribute('data-tilt', 'active')
  await expect(page.locator('.tilted-visual-inner')).not.toHaveCSS('transform', 'none')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(logo).toHaveAttribute('data-logo-state', 'ready')
  await logo.click()
  await expect(logo).toHaveAttribute('data-logo-state', 'ready')
  for (const part of await logo.locator('.brand-logo-piece').all()) {
    await expect(part).toHaveCSS('transform', 'none')
    await expect(part).toHaveCSS('opacity', '1')
  }
  await expect(visual).toHaveAttribute('data-tilt', 'idle')
  await expect(page.locator('.tilted-visual-inner')).toHaveCSS('transform', 'none')
})

test('reduced-motion mobile website shows every section without waiting for scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#website')
  for (const item of await page.locator('[data-motion="animated-content"]').all()) {
    await expect(item).toHaveAttribute('data-motion-state', 'visible')
    await expect(item).toHaveCSS('transform', 'none')
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('hero grid follows a fine pointer, pulses on replay and stops for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/#website')
  const logo = page.getByRole('button', { name: '重播 IDRL 标志动画' })
  await expect(logo).toHaveAttribute('data-logo-state', 'ready')
  await page.locator('.identity-hero').hover({ position: { x: 250, y: 170 } })
  const grid = page.locator('.hero-grid-response')
  await expect(grid).toHaveAttribute('data-grid-state', 'tracking')
  await expect(page.locator('.hero-grid-spotlight')).toHaveCSS('opacity', '1')
  await logo.click()
  await expect.poll(() => page.locator('.hero-grid-pulse').evaluate(el => el.getAnimations().length)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(grid).toHaveAttribute('data-grid-state', 'idle')
  await expect(grid).toHaveCSS('display', 'none')
  expect(await page.locator('.hero-grid-pulse').evaluate(el => el.getAnimations().length)).toBe(0)
})

test('lower website flow stays usable when keyboard focus interrupts entry', async ({ page }) => {
  await page.goto('/#website')
  await expect(page.getByRole('list', { name: '研究助手示例流程' }).getByRole('listitem')).toHaveCount(3)
  const question = page.getByRole('textbox', { name: '准备研究问题' })
  await question.focus()
  await expect(page.locator('.launcher-motion')).toHaveAttribute('data-motion-state', 'visible')
  await question.fill('检查鲁棒学习的示例证据')
  await expect(page.getByText('问题已准备，点击箭头继续。', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '打开助手并填写问题' }).click()
  await expect(page).toHaveURL(/#assistant$/)
  await expect(page.getByRole('textbox', { name: '输入研究问题', exact: true })).toHaveValue('检查鲁棒学习的示例证据')
})
