import type { Page } from '@playwright/test'

import { freezeTime } from './freezeTime'
import { gotoAndStabilize } from './gotoAndStabilize'

export async function clearDatabase(page: Page): Promise<void> {
  // Замораживаем время перед очисткой БД (если еще не заморожено)
  await freezeTime(page)
  
  // Очищаем базу данных перед каждым тестом
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    // Очистка IndexedDB - удаляем все возможные базы данных, связанные с приложением
    return new Promise<void>((resolve) => {
      const dbNames = ['count-log', 'jeep-sqlite', 'sqlite']
      let completed = 0

      const checkComplete = () => {
        completed++
        if (completed === dbNames.length) {
          resolve()
        }
      }

      dbNames.forEach((dbName) => {
        try {
          const deleteRequest = indexedDB.deleteDatabase(dbName)
          deleteRequest.onsuccess = checkComplete
          deleteRequest.onerror = checkComplete
          deleteRequest.onblocked = checkComplete
        } catch {
          checkComplete()
        }
      })
    })
  })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await gotoAndStabilize(page, '/')
}
