import { test, expect } from '@playwright/test'

const baseURL = 'http://localhost:5173'

test('renders heading', async ({ page }) => {
  await page.goto(baseURL)
  await expect(page.locator('h1')).toHaveText('Portfolio Monorepo')
})
