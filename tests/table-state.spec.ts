import { test, expect } from '@playwright/test'

test('equivalent arrays and cell updates preserve the page while explicit filter changes reset it',async({page})=>{
  await page.goto('/tests/fixtures/table-state.html')
  await page.getByRole('button',{name:'下一页',exact:true}).click()
  await expect(page.getByText('第 2 / 3 页')).toBeVisible()
  await page.getByRole('button',{name:'切换主题'}).click()
  await expect(page.getByText('第 2 / 3 页')).toBeVisible()
  await expect(page.locator('tbody tr').first()).toContainText('row-6')
  await page.getByRole('button',{name:'更新数值'}).click()
  await expect(page.getByText('第 2 / 3 页')).toBeVisible()
  await expect(page.locator('tbody tr').first()).toContainText('106')
  await page.getByLabel('筛选',{exact:true}).selectOption('equivalent')
  await expect(page.getByText('第 1 / 3 页')).toBeVisible()
  await page.getByRole('button',{name:'下一页',exact:true}).click()
  await page.getByLabel('筛选',{exact:true}).selectOption('none')
  await expect(page.getByText('没有记录')).toBeVisible()
  await expect(page.getByText('第 1 / 1 页')).toBeVisible()
  await expect(page.getByRole('button',{name:'下一页',exact:true})).toBeDisabled()
})

for(const action of ['新增记录','删除记录','重排记录']) test(`${action} resets pagination through the table interface`,async({page})=>{
  await page.goto('/tests/fixtures/table-state.html')
  await page.getByRole('button',{name:'下一页',exact:true}).click()
  await expect(page.getByText('第 2 / 3 页')).toBeVisible()
  await page.getByRole('button',{name:action,exact:true}).click()
  await expect(page.getByText('第 1 / 3 页')).toBeVisible()
  await expect(page.locator('tbody tr').first()).toContainText(action==='新增记录'?'row-1':action==='删除记录'?'row-2':'row-12')
})
