import { defineConfig, devices } from '@playwright/test'


export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/visual/__screenshots__/{testFileName}/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3333',
    trace: 'on-first-retry',

    viewport: { width: 390, height: 844 }, // базовый “эталонный” размер
    isMobile: true,
    hasTouch: true,
    screenshot: 'only-on-failure',
  },

  expect: {
    toHaveScreenshot: {
      threshold: 0,
      maxDiffPixelRatio: 0,
    },
  },

  projects: [
    {
      name: 'e2e-desktop',
      testMatch: /.*e2e.*.spec.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
      },
    },

    {
      testMatch: /.*visual.*.spec.ts/,
      name: 'mobile-small',
      use: { viewport: { width: 375, height: 812 } },
    },
    {
      testMatch: /.*visual.*.spec.ts/,
      name: 'mobile-medium',
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      testMatch: /.*visual.*.spec.ts/,
      name: 'mobile-large',
      use: { viewport: { width: 430, height: 932 } },
    },
  ],

  webServer: {
    command: 'pnpm dev --port 3333',
    url: 'http://localhost:3333/',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_E2E: '1',
    },
  },
})
