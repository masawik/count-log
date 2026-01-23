import { expect } from '@playwright/test'

export async function gotoAndStabilize(
  page: import('@playwright/test').Page,
  url: string,
) {
  await page.waitForTimeout(100)

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await expect(page.locator('#root')).toBeVisible({ timeout: 15_000 })

  await page.waitForLoadState('networkidle').catch(() => {})

  await page.evaluate(() => document.fonts?.ready).catch(() => {})
}
