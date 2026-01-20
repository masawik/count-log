import { expect, type Page } from '@playwright/test'

/**
 * Проверяет, что на странице нет error-boundary.
 * Если error-boundary присутствует, тест падает с ошибкой.
 */
export async function assertNoErrorBoundary(page: Page): Promise<void> {
  const errorBoundary = page.locator('[data-test-id="error-boundary"]')
  const isVisible = await errorBoundary.isVisible().catch(() => false)

  if (isVisible) {
    // Получаем текст ошибки для более информативного сообщения
    const errorMessage = await errorBoundary
      .locator('h1')
      .textContent()
      .catch(() => 'Unknown error')
    const errorDetails = await errorBoundary
      .locator('p')
      .textContent()
      .catch(() => '')

    throw new Error(
      `Error boundary detected on page: ${page.url()}\n` +
        `Error: ${errorMessage}\n` +
        (errorDetails ? `Details: ${errorDetails}\n` : '') +
        'Screenshot test aborted.',
    )
  }

  // Дополнительная проверка через expect для более явного сообщения об ошибке
  await expect(errorBoundary).not.toBeVisible({
    timeout: 1000,
  })
}
