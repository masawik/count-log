import { test, expect, type Page } from '@playwright/test'

import routes from '@/routes'

import { gotoAndStabilize } from '../utils/gotoAndStabilize'
import { resolvePathByRoute } from '../utils/resolvePathByRoute'

test.describe('all routes screenshots', () => {
  routes.forEach((route) => {
    const path = resolvePathByRoute(route)

    test(`route path ${path}`, async ({ page }) => {
      expect(path).toBeTruthy()
      await gotoAndStabilize(page, path as string)
      await expect(page).toHaveScreenshot({ fullPage: true })
    })
  })
})

test.describe('Edit page emoji picker dialog', () => {
  const openDialog = async (page: Page) => {
    await gotoAndStabilize(page, '/edit-counter')

    await page.getByRole('button', { name: 'Edit icon' }).click()

    return await page.getByRole('dialog', { name: 'Create emoji icon' })
  }

  test('Colors tab', async ({ page }) => {
    const dialog = await openDialog(page)

    await expect(dialog).toHaveScreenshot()
  })

  test('Emojis tab', async ({ page }) => {
    const dialog = await openDialog(page)
    await page.getByRole('tab', { name: 'Select emoji' }).click()

    await expect(dialog).toHaveScreenshot('whole-dialog.png')

    const searchInput = page.getByRole('searchbox', { name: 'Search' })
    searchInput.focus()

    await expect(searchInput).toHaveScreenshot('focused-search-input.png')
  })
})

test('form inputs', async ({ page }) => {
  gotoAndStabilize(page, '/edit-counter')

  const addStepButton = page.getByRole('button', { name: 'Add button' })

  await addStepButton.click()
  await addStepButton.click()
  await addStepButton.click()
  await addStepButton.click()

  const buttonsContainer = page.locator(
    `[data-test-id="step-buttons-container"]`,
  )
  const inputs = buttonsContainer.locator('input')

  const count = await inputs.count()
  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i)
    await input.fill('')
  }

  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page).toHaveScreenshot({ fullPage: true })
})
