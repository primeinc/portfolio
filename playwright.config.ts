import { defineConfig, devices } from '@playwright/test'

const app = process.env.APP || process.env.app || process.env.npm_config_app
const port = app === 'jeremy-stokes' ? 5174 : 5173

export default defineConfig({
  testDir: `apps/${app ?? 'jeremy-stokes'}/e2e`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm --filter=${app ?? 'jeremy-stokes'} dev`,
    port,
    reuseExistingServer: !process.env.CI,
  },
})
