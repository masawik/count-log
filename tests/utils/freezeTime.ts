import type { Page } from '@playwright/test'

/**
 * Замораживает время в браузере для стабильности скриншотов
 * @param page - страница Playwright
 * @param fixedTime - фиксированное время в миллисекундах (по умолчанию 2024-01-01 12:00:00 UTC)
 */
export async function freezeTime(
  page: Page,
  fixedTime: number = new Date('2024-01-01T12:00:00Z').getTime(),
): Promise<void> {
  await page.addInitScript((time: number) => {
    // Сохраняем оригинальный Date
    const OriginalDate = window.Date
    const fixedTime = time

    // Переопределяем Date.now()
    const originalNow = OriginalDate.now
    OriginalDate.now = () => fixedTime

    // Переопределяем конструктор Date без аргументов
    const OriginalDateConstructor = OriginalDate
    // @ts-expect-error - переопределяем глобальный Date
    window.Date = function (this: any, ...args: any[]) {
      if (args.length === 0) {
        // Если вызывается без аргументов, возвращаем фиксированное время
        const date = new OriginalDateConstructor(fixedTime)
        // Сохраняем оригинальные методы
        Object.setPrototypeOf(date, OriginalDateConstructor.prototype)
        return date
      }
      // Иначе используем оригинальный конструктор
      return new (OriginalDateConstructor as any)(...args)
    } as any

    // Копируем все статические методы и свойства
    Object.setPrototypeOf(window.Date, OriginalDateConstructor)
    Object.defineProperty(window.Date, 'prototype', {
      value: OriginalDateConstructor.prototype,
      writable: false,
    })
    window.Date.now = () => fixedTime
    window.Date.parse = OriginalDateConstructor.parse
    window.Date.UTC = OriginalDateConstructor.UTC

    // Мокируем performance.now() для стабильности
    const originalPerformanceNow = performance.now
    let performanceStart = fixedTime
    Object.defineProperty(performance, 'now', {
      value: () => {
        // Возвращаем фиксированное время с небольшим смещением для анимаций
        return fixedTime
      },
      writable: false,
      configurable: false,
    })
  }, fixedTime)
}
