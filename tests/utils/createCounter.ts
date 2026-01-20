import { expect, type Page } from '@playwright/test'

import { gotoAndStabilize } from './gotoAndStabilize'

export async function createCounter(
  page: Page,
  options: { name: string; initialValue: string },
): Promise<string> {
  // Переходим на страницу создания счетчика
  await page.locator('a[href="/create-counter"]').click()
  await page.waitForURL(/\/create-counter/, { timeout: 5000 })
  await gotoAndStabilize(page, '/create-counter')

  // Вводим название счетчика
  const nameInput = page.getByLabel('name')
  await nameInput.fill(options.name)

  // Ждем подбора эмоджи (может быть задержка)
  await page.waitForTimeout(600) // Задержка для подбора эмоджи (delay = 500ms)

  // Заполняем начальное значение
  await page.getByLabel('Initial value').fill(options.initialValue)

  // Ждем, пока кнопка станет активной (если она была disabled)
  const createButton = page.getByRole('button', { name: 'create' })
  await expect(createButton).toBeEnabled()
  await createButton.click()

  // Ждем перехода на страницу счетчика (может быть задержка из-за сохранения в БД)
  // ID может быть хешем
  await expect(page).toHaveURL(/\/counter\/([\da-f]+)/, { timeout: 10000 })

  // Извлекаем counterId из URL
  const url = page.url()
  const match = url.match(/\/counter\/([\da-f]+)/)
  if (!match || !match[1]) {
    throw new Error(`Failed to extract counter ID from URL: ${url}`)
  }

  return match[1]
}
