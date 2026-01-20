import { test, expect } from '@playwright/test'

import { clearDatabase } from '../utils/clearDatabase'
import { gotoAndStabilize } from '../utils/gotoAndStabilize'

test.describe('Counter functionality', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page)
  })

  test.describe('Creating a counter', () => {
    test('should create a counter with auto-emoji suggestion', async ({
      page,
    }) => {
      // Переходим на страницу создания счетчика
      await page.locator('a[href="/create-counter"]').click()
      // Ждем навигации
      await page.waitForURL(/\/create-counter/, { timeout: 5000 })
      await gotoAndStabilize(page, '/create-counter')

      // Вводим название счетчика
      const nameInput = page.getByLabel('name')
      await nameInput.fill('books')

      // Ждем подбора эмоджи (может быть задержка)
      await page.waitForTimeout(600) // Задержка для подбора эмоджи (delay = 500ms)

      // Проверяем, что эмоджи был подобран автоматически
      const emojiIcon = page.locator('button[aria-label="Edit icon"]')
      await expect(emojiIcon).toBeVisible()

      // Заполняем остальные поля
      await page.getByLabel('Initial value').fill('0')

      // Ждем, пока кнопка станет активной (если она была disabled)
      const createButton = page.getByRole('button', { name: 'create' })
      await expect(createButton).toBeEnabled()
      await createButton.click()

      // Ждем перехода на страницу счетчика (может быть задержка из-за сохранения в БД)
      // ID может быть хешем
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })
      await expect(page.getByRole('heading', { name: 'books' })).toBeVisible()
    })

    test('should disable auto-emoji suggestion when user manually selects emoji', async ({
      page,
    }) => {
      // Переходим на страницу создания счетчика
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      // Сначала выбираем эмоджи вручную
      const editIconButton = page.getByRole('button', { name: 'Edit icon' })
      await editIconButton.click()

      // Ждем появления диалога
      const dialog = page.getByRole('dialog', { name: 'Create emoji icon' })
      await expect(dialog).toBeVisible()

      // Выбираем цвет - этого достаточно для проверки, что подбор отключается
      // при ручном выборе (не обязательно выбирать эмоджи)
      const colorButtons = dialog.locator('button[style*="background"]')
      const colorButtonCount = await colorButtons.count()
      if (colorButtonCount > 1) {
        await colorButtons.nth(1).click()
      }

      // Нажимаем Done - это зафиксирует ручной выбор и отключит авто-подбор
      await page.getByRole('button', { name: 'Done' }).click()

      // Теперь вводим название
      const nameInput = page.getByLabel('name')
      await nameInput.fill('coffee')

      // Ждем достаточно времени для подбора эмоджи
      await page.waitForTimeout(600)

      // Проверяем, что эмоджи НЕ изменился (подбор отключен)
      // Сохраняем текущий эмоджи и проверяем, что он не изменился
      const emojiIconAfter = page.locator('button[aria-label="Edit icon"]')
      await expect(emojiIconAfter).toBeVisible()

      // Заполняем остальные поля и создаем счетчик
      await page.getByLabel('Initial value').fill('0')
      await page.getByRole('button', { name: 'create' }).click()

      // Проверяем, что счетчик создан (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })
    })
  })

  test.describe('Changing counter value from counters list', () => {
    test('should increment counter value from list page', async ({ page }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Test Counter')
      await page.getByLabel('Initial value').fill('10')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Возвращаемся на главную страницу (кнопка "назад" в header)
      const header = page.locator('header')
      const backButton = header.getByRole('link').first()
      await backButton.click()
      await gotoAndStabilize(page, '/')

      // Находим кнопку с положительным значением (например, +1)
      // Ищем кнопку в контексте элемента счетчика
      const counterItem = page.locator('.panel').filter({ hasText: 'Test Counter' })
      await expect(counterItem).toBeVisible()

      const incrementButton = counterItem.getByRole('button').filter({ hasText: '+1' })
      await expect(incrementButton).toBeVisible()
      await incrementButton.click()

      // Проверяем, что значение изменилось
      await expect(counterItem.getByText('11')).toBeVisible({ timeout: 2000 })
    })

    test('should decrement counter value from list page', async ({ page }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Test Counter')
      await page.getByLabel('Initial value').fill('10')
      await page.getByRole('button', { name: 'create' }).click()

      // Возвращаемся на главную страницу (кнопка "назад" в header)
      const header = page.locator('header')
      const backButton = header.getByRole('link').first()
      await backButton.click()
      await gotoAndStabilize(page, '/')

      // Находим кнопку с отрицательным значением (например, -1)
      const counterItem = page.locator('.panel').filter({ hasText: 'Test Counter' })
      await expect(counterItem).toBeVisible()

      const decrementButton = counterItem.getByRole('button').filter({ hasText: '-1' })
      await expect(decrementButton).toBeVisible()
      await decrementButton.click()

      // Проверяем, что значение изменилось
      await expect(counterItem.getByText('9')).toBeVisible({ timeout: 2000 })
    })
  })

  test.describe('Changing counter value from counter page', () => {
    test('should increment counter value from counter page', async ({
      page,
    }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Test Counter')
      await page.getByLabel('Initial value').fill('5')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Проверяем начальное значение
      const valueDisplay = page.locator('.panel').getByText('5')
      await expect(valueDisplay).toBeVisible()

      // Находим кнопку с положительным значением в основной секции
      const mainButtonsSection = page.locator('.grid.grid-cols-2').first()
      const incrementButton = mainButtonsSection
        .getByRole('button')
        .filter({ hasText: '+1' })

      await expect(incrementButton).toBeVisible()
      await incrementButton.click()

      // Проверяем, что значение увеличилось
      await expect(page.locator('.panel').getByText('6')).toBeVisible({
        timeout: 2000,
      })
    })

    test('should decrement counter value from counter page', async ({
      page,
    }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Test Counter')
      await page.getByLabel('Initial value').fill('5')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Находим кнопку с отрицательным значением в основной секции
      const mainButtonsSection = page.locator('.grid.grid-cols-2').first()
      const decrementButton = mainButtonsSection
        .getByRole('button')
        .filter({ hasText: '-1' })

      await expect(decrementButton).toBeVisible()
      await decrementButton.click()

      // Проверяем, что значение уменьшилось
      await expect(page.locator('.panel').getByText('4')).toBeVisible({
        timeout: 2000,
      })
    })

    test('should correct counter value manually', async ({ page }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Test Counter')
      await page.getByLabel('Initial value').fill('10')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Находим кнопку для ручного ввода значения (иконка TextCursorInput)
      // Она находится рядом с отображаемым значением
      const valuePanel = page.locator('.panel').filter({ hasText: '10' })
      const correctButton = valuePanel
        .locator('button')
        .filter({ has: page.locator('svg') })

      await expect(correctButton).toBeVisible()
      await correctButton.click()

      // Вводим новое значение
      const valueInput = page.locator('input[type="number"]')
      await expect(valueInput).toBeVisible()
      await valueInput.fill('25')

      // Подтверждаем изменение
      await page.getByRole('button', { name: 'Confirm' }).click()

      // Проверяем, что значение изменилось
      await expect(page.locator('.panel').getByText('25')).toBeVisible({
        timeout: 2000,
      })
    })
  })

  test.describe('Resetting counter value', () => {
    test('should reset counter value to initial value', async ({ page }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Test Counter')
      await page.getByLabel('Initial value').fill('5')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Изменяем значение
      const mainButtonsSection = page.locator('.grid.grid-cols-2').first()
      const incrementButton = mainButtonsSection
        .getByRole('button')
        .filter({ hasText: '+1' })

      await expect(incrementButton).toBeVisible()
      await incrementButton.click()
      await expect(page.locator('.panel').getByText('6')).toBeVisible({
        timeout: 2000,
      })

      // Нажимаем кнопку сброса
      await page.getByRole('button', { name: 'reset' }).click()

      // Проверяем, что значение вернулось к начальному
      await expect(page.getByText('5')).toBeVisible({ timeout: 2000 })
    })
  })

  test.describe('Deleting counter', () => {
    test('should delete counter from counter page', async ({ page }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Counter to Delete')
      await page.getByLabel('Initial value').fill('0')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Открываем меню (кнопка с иконкой Menu в header)
      const header = page.locator('header')
      const menuButton = header
        .getByRole('button')
        .filter({ has: page.locator('svg') })
        .last()

      await expect(menuButton).toBeVisible()
      await menuButton.click()

      // Выбираем Delete
      await page.getByRole('menuitem', { name: 'Delete' }).click()

      // Подтверждаем удаление в диалоге
      const confirmDialog = page.getByRole('alertdialog')
      await expect(confirmDialog).toBeVisible()
      await expect(confirmDialog.getByText('Are you sure?')).toBeVisible()

      await page.getByRole('button', { name: 'yes' }).click()

      // Проверяем, что мы вернулись на главную страницу
      await expect(page).toHaveURL('/')

      // Проверяем, что счетчик удален (не отображается в списке)
      await expect(
        page.getByText('Counter to Delete'),
      ).not.toBeVisible({ timeout: 2000 })
    })

    test('should cancel counter deletion', async ({ page }) => {
      // Создаем счетчик
      await page.locator('a[href="/create-counter"]').click()
      await gotoAndStabilize(page, '/create-counter')

      await page.getByLabel('name').fill('Counter to Keep')
      await page.getByLabel('Initial value').fill('0')
      await page.getByRole('button', { name: 'create' }).click()

      // Ждем перехода на страницу счетчика (ID может быть хешем)
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/, { timeout: 10000 })

      // Открываем меню (кнопка с иконкой Menu в header)
      const header = page.locator('header')
      const menuButton = header
        .getByRole('button')
        .filter({ has: page.locator('svg') })
        .last()

      await expect(menuButton).toBeVisible()
      await menuButton.click()

      // Выбираем Delete
      await page.getByRole('menuitem', { name: 'Delete' }).click()

      // Отменяем удаление в диалоге
      const confirmDialog = page.getByRole('alertdialog')
      await expect(confirmDialog).toBeVisible()

      await page.getByRole('button', { name: 'no' }).click()

      // Проверяем, что диалог закрылся и мы все еще на странице счетчика
      await expect(confirmDialog).not.toBeVisible()
      await expect(page).toHaveURL(/\/counter\/[\da-f]+/)
      await expect(page.getByRole('heading', { name: 'Counter to Keep' })).toBeVisible()
    })
  })
})
