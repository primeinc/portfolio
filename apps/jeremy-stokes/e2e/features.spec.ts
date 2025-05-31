import { test, expect } from '@playwright/test'

const baseURL = 'http://localhost:5174'

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL)
})

test('hero section renders', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Jeremy Stokes')
})

test('project cards render and are interactive', async ({ page, context }) => {
  const cards = page.locator('.projectCard')
  await expect(cards).toHaveCount(3)

  const first = cards.nth(0)
  const initialTransform = await first.evaluate(
    (el) => getComputedStyle(el).transform
  )
  await first.hover()
  const hoveredTransform = await first.evaluate(
    (el) => getComputedStyle(el).transform
  )
  expect(hoveredTransform).not.toBe(initialTransform)

  const cookbookCard = cards.filter({ hasText: 'Portfolio Cookbook' })
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    cookbookCard.click(),
  ])
  await newPage.waitForLoadState()
  expect(newPage.url()).toContain('jeremystokes.gumroad.com')
  await newPage.close()
})

test('about me section appears on scroll', async ({ page }) => {
  const about = page.locator('#about')
  await about.scrollIntoViewIfNeeded()
  await expect(about).toBeVisible()
})

test('contact cta has mail link', async ({ page }) => {
  const link = page.locator('a[href^="mailto:"]')
  await expect(link).toBeVisible()
})

test('grid responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 640 })
  const columns = await page
    .locator('.grid')
    .evaluate(
      (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length
    )
  expect(columns).toBe(1)
})
