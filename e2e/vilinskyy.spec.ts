import { test, expect } from '@playwright/test'

const base = '/'

test.describe('Vilinskyy Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(base)
  })

  test('hero video is visible', async ({ page }) => {
    const iframe = page.locator('iframe[title="Intro Video"]')
    await expect(iframe).toBeVisible()
  })

  test('project sections expand', async ({ page }) => {
    const button = page.locator('button:has-text("Read More")').first()
    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('.detailContainer')).toBeVisible()
  })

  test('testimonial slider cycles to next', async ({ page }) => {
    const initial = await page.locator('.slide').textContent()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.locator('.slide')).not.toHaveText(initial!)
  })

  test('newsletter form accepts email', async ({ page }) => {
    await page.fill('input[type="email"]', 'test@example.com')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Thank you for subscribing!')).toBeVisible()
  })

  test('gallery opens overlay', async ({ page }) => {
    await page.click('text=Visuals')
    await page.click('img[alt="visual 0"]')
    await expect(page.locator('.overlay img')).toBeVisible()
  })

  test('networking page shows price', async ({ page }) => {
    await page.click('text=Networking 2024')
    await expect(page.locator('text=$199')).toBeVisible()
  })

  test('loom roast form submits', async ({ page }) => {
    await page.click('text=Loom Roast')
    await page.fill('input[placeholder="Project URL"]', 'http://example.com')
    await page.click('button:has-text("Submit")')
    await expect(page.locator('text=Submitted!')).toBeVisible()
  })

  test('multi column layout has 2 columns on desktop', async ({ page }) => {
    const columns = await page
      .locator('.multiColumn')
      .evaluate((el) => getComputedStyle(el).columnCount)
    expect(Number(columns)).toBe(2)
  })

  test('social links render', async ({ page }) => {
    const links = page.locator('ul li a')
    await expect(links.nth(0)).toHaveAttribute('href', 'https://twitter.com')
  })
})
