import { test, expect } from '@playwright/test'

import { clearDatabase } from '../utils/clearDatabase'
import { gotoAndStabilize } from '../utils/gotoAndStabilize'

test.describe('Navigation and data loading', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page)
  })

  test('should load and display all counters when accessing main page by direct URL', async ({
    page,
  }) => {
    // Создаем несколько счетчиков
    const counters = [
      { name: 'Books Counter', initialValue: '5' },
      { name: 'Coffee Counter', initialValue: '10' },
      { name: 'Steps Counter', initialValue: '0' },
    ]

    for (const counter of counters) {
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill(counter.name)
      await page.getByLabel('Initial value').fill(counter.initialValue)
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })
      await gotoAndStabilize(page, page.url())

      // Возвращаемся на главную страницу
      const header = page.locator('header')
      const backButton = header.getByRole('link').first()
      await backButton.click()
      await gotoAndStabilize(page, '/')
    }

    // Теперь перезагружаем страницу по прямому URL
    await page.reload({ waitUntil: 'domcontentloaded' })
    await gotoAndStabilize(page, '/')

    // Проверяем, что все счетчики отображаются
    for (const counter of counters) {
      const counterItem = page.locator('.panel').filter({ hasText: counter.name })
      await expect(counterItem).toBeVisible({ timeout: 5000 })
      await expect(counterItem.getByText(counter.initialValue)).toBeVisible()
    }
  })

  test('should load and display counter data when accessing counter page by direct URL', async ({
    page,
  }) => {
    // Создаем счетчик
    await page.locator('a[href="/create-counter"]').click()
    await gotoAndStabilize(page, '/create-counter')

    const counterName = 'Test Counter Direct URL'
    const initialValue = '42'

    await page.getByLabel('name').fill(counterName)
    await page.getByLabel('Initial value').fill(initialValue)
    await page.getByRole('button', { name: 'create' }).click()

    // Ждем перехода на страницу счетчика и получаем URL
    await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })
    const counterUrl = page.url()
    await gotoAndStabilize(page, counterUrl)

    // Проверяем, что данные счетчика отображаются
    await expect(page.getByRole('heading', { name: counterName })).toBeVisible()
    await expect(page.locator('.panel').getByText(initialValue)).toBeVisible()

    // Теперь перезагружаем страницу по прямому URL
    await page.reload({ waitUntil: 'domcontentloaded' })
    await gotoAndStabilize(page, counterUrl)

    // Проверяем, что данные счетчика все еще отображаются после прямой загрузки
    await expect(page.getByRole('heading', { name: counterName })).toBeVisible({
      timeout: 5000,
    })
    await expect(page.locator('.panel').getByText(initialValue)).toBeVisible()
  })

  test('should display 404 page when accessing non-existent counter by direct URL', async ({
    page,
  }) => {
    // Используем несуществующий ID счетчика
    const nonExistentCounterId = '00000000000000000000000000000000'
    const nonExistentUrl = `/counter/${nonExistentCounterId}`

    // Переходим на страницу несуществующего счетчика по прямому URL
    await page.goto(nonExistentUrl, { waitUntil: 'domcontentloaded' })

    // Ждем редиректа на страницу 404 (может быть задержка из-за попытки загрузки счетчика)
    await expect(page).toHaveURL('/404', { timeout: 10000 })
    await gotoAndStabilize(page, '/404')

    // Проверяем, что отображается страница 404
    await expect(page.getByText('nothing to see here')).toBeVisible({
      timeout: 5000,
    })
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible()
  })

  test('should load all counters when navigating back to main page after direct counter page load', async ({
    page,
  }) => {
    // Создаем несколько счетчиков
    const counters = [
      { name: 'First Counter', initialValue: '1' },
      { name: 'Second Counter', initialValue: '2' },
      { name: 'Third Counter', initialValue: '3' },
    ]

    const counterUrls: string[] = []

    for (const counter of counters) {
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill(counter.name)
      await page.getByLabel('Initial value').fill(counter.initialValue)
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })
      const counterUrl = page.url()
      counterUrls.push(counterUrl)
      await gotoAndStabilize(page, counterUrl)

      // Возвращаемся на главную страницу
      const header = page.locator('header')
      const backButton = header.getByRole('link').first()
      await backButton.click()
      await gotoAndStabilize(page, '/')
    }

    // Теперь загружаем страницу одного из счетчиков по прямому URL
    const firstCounterUrl = counterUrls[0]
    await gotoAndStabilize(page, firstCounterUrl)

    // Проверяем, что данные счетчика отображаются
    await expect(
      page.getByRole('heading', { name: counters[0].name }),
    ).toBeVisible({ timeout: 5000 })

    // Возвращаемся назад на главную страницу
    const header = page.locator('header')
    const backButton = header.getByRole('link').first()
    await backButton.click()
    await gotoAndStabilize(page, '/')

    // Проверяем, что все счетчики подгружены и отображаются
    for (const counter of counters) {
      const counterItem = page.locator('.panel').filter({ hasText: counter.name })
      await expect(counterItem).toBeVisible({ timeout: 5000 })
    }
  })
})
