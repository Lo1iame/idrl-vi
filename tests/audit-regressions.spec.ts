import { test, expect } from '@playwright/test'

test('sorting a table inside a form never submits that form', async ({ page }) => {
  await page.goto('/#components')
  await page.locator('.data-specimen .data-table').evaluate(table => {
    const form = document.createElement('form')
    form.setAttribute('aria-label', 'Table host form')
    table.before(form)
    form.append(table)
    form.dataset.submits = '0'
    form.addEventListener('submit', event => {
      event.preventDefault()
      form.dataset.submits = String(Number(form.dataset.submits) + 1)
    })
  })
  const form = page.getByRole('form', { name: 'Table host form' })
  const sort = form.getByRole('button', { name: '得分', exact: true })
  await sort.click()
  await expect(form.getByRole('columnheader', { name: '得分' })).toHaveAttribute('aria-sort', 'ascending')
  await sort.focus()
  await page.keyboard.press('Enter')
  await expect(form.getByRole('columnheader', { name: '得分' })).toHaveAttribute('aria-sort', 'descending')
  await expect(form).toHaveAttribute('data-submits', '0')
})

test('both experiment detail entry points regain focus after closing', async ({ page }) => {
  await page.goto('/#workspace')
  const icon = page.getByRole('button', { name: '查看 EXP-024 详情', exact: true })
  await icon.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(icon).toBeFocused()
  const name = page.getByRole('button', { name: 'Robust representation / baseline', exact: true })
  await name.click()
  await page.getByRole('dialog').getByRole('button', { name: '关闭弹窗', exact: true }).click()
  await expect(name).toBeFocused()
})

for (const lang of ['zh', 'en']) test(`website reflows at 320px in ${lang}`, async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.addInitScript(value => localStorage.setItem('idrl-lang', value), lang)
  await page.goto('/#website')
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const values = page.locator('.brand-values')
  await values.scrollIntoViewIfNeeded()
  for (const statement of await values.locator('.value-statement').all()) {
    await expect(statement).toBeVisible()
    expect(await statement.evaluate(element => element.getBoundingClientRect().right <= innerWidth)).toBe(true)
  }
  await values.screenshot({ path: `output/ui/website-${lang}-320.png` })
})
