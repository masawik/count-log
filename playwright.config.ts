import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
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
      name: 'mobile-small',
      use: { viewport: { width: 375, height: 812 } },
    },
    {
      name: 'mobile-medium',
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: 'mobile-large',
      use: { viewport: { width: 430, height: 932 } },
    },
  ],


  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_E2E: '1',
    },
  },
})
