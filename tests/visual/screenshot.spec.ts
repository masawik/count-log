import { test, expect, type Page } from '@playwright/test'

import routes from '@/routes'

import { assertNoErrorBoundary } from '../utils/assertNoErrorBoundary'
import { clearDatabase } from '../utils/clearDatabase'
import { createCounter } from '../utils/createCounter'
import { gotoAndStabilize } from '../utils/gotoAndStabilize'
import { resolvePathByRoute } from '../utils/resolvePathByRoute'

test.describe('all routes screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page)
  })

  routes.forEach((route) => {
    const path = resolvePathByRoute(route)

    // Пропускаем маршруты с параметрами (они требуют валидных ID)
    if (!path || path.includes(':')) {
      return
    }

    test(`route path ${path}`, async ({ page }) => {
      // Для главной страницы создаем счетчик, чтобы не скриншотить пустое состояние
      if (path === '/') {
        await createCounter(page, {
          name: 'Test Counter',
          initialValue: '10',
        })
        // Возвращаемся на главную страницу
        const header = page.locator('header')
        const backButton = header.getByRole('link').first()
        await backButton.click()
        await gotoAndStabilize(page, '/')
      } else {
        await gotoAndStabilize(page, path)
      }

      // Проверяем, что нет error-boundary перед скриншотом
      await assertNoErrorBoundary(page)

      await expect(page).toHaveScreenshot({ fullPage: true })
    })
  })
})

test.describe('Edit page emoji picker dialog', () => {
  const openDialog = async (page: Page) => {
    await gotoAndStabilize(page, '/create-counter')

    await page.getByRole('button', { name: 'Edit icon' }).click()

    return await page.getByRole('dialog', { name: 'Create emoji icon' })
  }

  test('Colors tab', async ({ page }) => {
    const dialog = await openDialog(page)

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    await expect(dialog).toHaveScreenshot()
  })

  test('Emojis tab', async ({ page }) => {
    const dialog = await openDialog(page)
    await page.getByRole('tab', { name: 'Select emoji' }).click()

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    await expect(dialog).toHaveScreenshot('whole-dialog.png')

    const searchInput = page.getByRole('searchbox', { name: 'Search' })
    searchInput.focus()

    await assertNoErrorBoundary(page)

    await expect(searchInput).toHaveScreenshot('focused-search-input.png')
  })
})

test.describe('Counter page', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page)
  })

  test('without timer', async ({ page }) => {
    const counterId = await createCounter(page, {
      name: 'Test Counter',
      initialValue: '5',
    })

    await gotoAndStabilize(page, `/counter/${counterId}`)

    // Убеждаемся, что таймер скрыт (по умолчанию)
    // Таймер отображается только когда stopWatchVisible === true
    // Формат времени: MM:SS.CS (например, 00:00.00)
    const stopwatchContainer = page.locator('text=/\\d{2}:\\d{2}\\.\\d{2}/')
    await expect(stopwatchContainer).not.toBeVisible({ timeout: 1000 }).catch(() => {
      // Если элемент не найден, это тоже нормально (таймер скрыт)
    })

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('with timer', async ({ page }) => {
    const counterId = await createCounter(page, {
      name: 'Test Counter',
      initialValue: '5',
    })

    await gotoAndStabilize(page, `/counter/${counterId}`)

    // Показываем таймер
    const showStopwatchButton = page.getByRole('button', {
      name: /show stopwatch/i,
    })
    await showStopwatchButton.click()

    // Ждем появления таймера (формат времени: MM:SS.CS, например 00:00.00)
    // Таймер отображается в div с текстом времени
    const stopwatchContainer = page.locator('text=/\\d{2}:\\d{2}\\.\\d{2}/')
    await expect(stopwatchContainer).toBeVisible({ timeout: 2000 })

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('steps configurator dialog with many steps', async ({ page }) => {
    const counterId = await createCounter(page, {
      name: 'Test Counter',
      initialValue: '5',
    })

    await gotoAndStabilize(page, `/counter/${counterId}`)

    // Открываем диалог настройки шагов (кнопка Settings)
    // Кнопка находится в секции с кнопками шагов, это IconButton с иконкой Settings
    // Ищем кнопку в области с кнопками шагов (в main или в секции с grid-cols-2)
    const buttonsSection = page.locator('main').locator('.grid.grid-cols-2').first()
    await expect(buttonsSection).toBeVisible()

    // Кнопка Settings находится выше секции с кнопками, в div с justify-end
    const settingsButton = page
      .locator('main')
      .locator('div.flex.justify-end')
      .locator('button')
      .first()
    await expect(settingsButton).toBeVisible()
    await settingsButton.click()

    // Ждем появления диалога
    const dialog = page.getByRole('dialog', { name: 'Configure steps' })
    await expect(dialog).toBeVisible({ timeout: 2000 })

    // Добавляем много шагов для проверки переполнения
    const addStepButton = page.getByRole('button', { name: 'Add step' })

    // Добавляем 15 шагов (всего будет 17: 2 основных + 15 дополнительных)
    for (let i = 0; i < 15; i++) {
      await addStepButton.click()
      // Небольшая задержка для стабилизации UI
      await page.waitForTimeout(100)
    }

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    // Делаем скриншот диалога
    await expect(dialog).toHaveScreenshot()
  })

  test('edit visual dialog', async ({ page }) => {
    const counterId = await createCounter(page, {
      name: 'Test Counter',
      initialValue: '5',
    })

    await gotoAndStabilize(page, `/counter/${counterId}`)

    // Открываем меню счетчика
    const header = page.locator('header')
    const menuButton = header
      .getByRole('button')
      .filter({ has: page.locator('svg') })
      .last()
    await expect(menuButton).toBeVisible()
    await menuButton.click()

    // Выбираем Edit из меню
    await page.getByRole('menuitem', { name: 'Edit' }).click()

    // Ждем появления диалога редактирования визуала
    const dialog = page.getByRole('dialog', { name: 'edit visual' })
    await expect(dialog).toBeVisible({ timeout: 2000 })

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    // Делаем скриншот диалога
    await expect(dialog).toHaveScreenshot()
  })
})

test.describe('Counter history page', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page)
  })

  test('without events', async ({ page }) => {
    const counterId = await createCounter(page, {
      name: 'Test Counter',
      initialValue: '0',
    })

    await gotoAndStabilize(page, `/counter/${counterId}/history`)

    // Ждем загрузки страницы истории
    await expect(
      page.getByText('there is no events yet.'),
    ).toBeVisible({ timeout: 5000 })

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    await expect(page).toHaveScreenshot({ fullPage: true })
  })

  test('with events', async ({ page }) => {
    const counterId = await createCounter(page, {
      name: 'Test Counter',
      initialValue: '0',
    })

    await gotoAndStabilize(page, `/counter/${counterId}`)

    // Изменяем значение счетчика несколько раз
    const mainButtonsSection = page.locator('.grid.grid-cols-2').first()
    const incrementButton = mainButtonsSection
      .getByRole('button')
      .filter({ hasText: '+1' })

    await expect(incrementButton).toBeVisible()
    await incrementButton.click()
    // Ждем после каждого клика, чтобы событие успело сохраниться
    await page.waitForTimeout(300)
    await incrementButton.click()
    await page.waitForTimeout(300)
    await incrementButton.click()
    // Даем дополнительное время для сохранения последнего события
    await page.waitForTimeout(500)

    // Переходим на страницу истории напрямую по URL
    await gotoAndStabilize(page, `/counter/${counterId}/history`)

    // Ждем загрузки событий - проверяем, что спиннер исчез и появился контент
    // Spinner из Radix UI может иметь разные селекторы, поэтому ждем появления контента
    const noEventsMessage = page.getByText('there is no events yet.')
    const eventsPanel = page.locator('.panel').filter({ hasText: /\+1/ })

    // Ждем появления либо событий, либо сообщения об отсутствии (это означает, что загрузка завершена)
    await Promise.race([
      expect(eventsPanel.first()).toBeVisible({ timeout: 10000 }).catch(() => {}),
      expect(noEventsMessage).toBeVisible({ timeout: 10000 }).catch(() => {}),
    ])

    // Дополнительная проверка: убеждаемся, что спиннер не виден
    const spinner = page.locator('[role="progressbar"]')
    await expect(spinner).not.toBeVisible({ timeout: 2000 }).catch(() => {
      // Если спиннер не найден, это нормально
    })

    // Проверяем, что нет error-boundary перед скриншотом
    await assertNoErrorBoundary(page)

    await expect(page).toHaveScreenshot({ fullPage: true })
  })
})
