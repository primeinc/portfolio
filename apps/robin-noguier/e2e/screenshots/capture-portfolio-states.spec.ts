import { test, expect } from '@playwright/test'

// Define viewport sizes
const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
}

// Helper function to wait for animations to complete
async function waitForAnimations(page) {
  await page.waitForTimeout(1000) // Wait for transitions
  await page.waitForLoadState('networkidle')
}

// Helper function to scroll to position
async function scrollToPosition(page, position: number) {
  await page.evaluate((pos) => {
    window.scrollTo({ top: pos, behavior: 'instant' })
  }, position)
  await waitForAnimations(page)
}

test.describe('Portfolio Screenshot Capture', () => {
  // Test for each viewport size
  for (const [device, viewport] of Object.entries(viewports)) {
    test(`Capture all states - ${device}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize(viewport)

      // Navigate to the page
      await page.goto('/')
      await waitForAnimations(page)

      // 1. Initial hero state with "R. Brasseur" header and full "Rylee Brasseur" hero text
      await page.screenshot({
        path: `screenshots/${device}-01-initial-hero-state.png`,
        fullPage: false,
      })

      // 2. Mid-scroll state showing hero text fading out
      await scrollToPosition(page, 300)
      await page.screenshot({
        path: `screenshots/${device}-02-hero-text-fading.png`,
        fullPage: false,
      })

      // 3. First project preview appearing
      await scrollToPosition(page, 600)
      await page.screenshot({
        path: `screenshots/${device}-03-first-project-preview.png`,
        fullPage: false,
      })

      // 4. Multiple project previews visible
      await scrollToPosition(page, 1200)
      await page.screenshot({
        path: `screenshots/${device}-04-multiple-projects.png`,
        fullPage: false,
      })

      // 5. Navigation bar expanded state (if applicable)
      // Scroll back to top to ensure navigation is visible
      await scrollToPosition(page, 0)

      // Try to hover over navigation to expand it
      const navElement = await page.locator('nav').first()
      if (await navElement.isVisible()) {
        await navElement.hover()
        await page.waitForTimeout(500) // Wait for hover animation
        await page.screenshot({
          path: `screenshots/${device}-05-navigation-expanded.png`,
          fullPage: false,
        })
      }

      // 6. Modal open state
      // Try to click on the first project to open modal
      try {
        await scrollToPosition(page, 600)

        // Look for project images with different possible selectors
        const projectSelectors = [
          '[class*="imageWrapper"]',
          '[class*="project"]',
          'img[alt*="project"]',
          '[data-testid*="project"]',
          '.project-item',
          'figure',
        ]

        let clicked = false
        for (const selector of projectSelectors) {
          const element = await page.locator(selector).first()
          if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
            await element.click()
            clicked = true
            break
          }
        }

        if (clicked) {
          await waitForAnimations(page)

          // Wait for modal with various possible selectors
          const modalSelectors = [
            '[class*="modal"]',
            '[class*="Modal"]',
            '[role="dialog"]',
            '[data-testid="modal"]',
            '.modal-overlay',
          ]

          for (const selector of modalSelectors) {
            const modal = await page.locator(selector)
            if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
              await page.screenshot({
                path: `screenshots/${device}-06-modal-open.png`,
                fullPage: false,
              })
              break
            }
          }
        }
      } catch (error) {
        console.log(`Could not capture modal for ${device}: ${error.message}`)
      }

      // Additional: Full page screenshot
      await page.screenshot({
        path: `screenshots/${device}-07-full-page.png`,
        fullPage: true,
      })
    })
  }

  // Special test for scroll behavior documentation
  test('Document scroll behavior', async ({ page }) => {
    await page.setViewportSize(viewports.desktop)
    await page.goto('/')
    await waitForAnimations(page)

    // Capture progressive scroll states
    const scrollPositions = [0, 200, 400, 600, 800, 1000, 1200, 1400]

    for (let i = 0; i < scrollPositions.length; i++) {
      await scrollToPosition(page, scrollPositions[i])
      await page.screenshot({
        path: `screenshots/scroll-sequence-${String(i).padStart(2, '0')}-${scrollPositions[i]}px.png`,
        fullPage: false,
      })
    }
  })

  // Test for hover states and interactions
  test('Capture interaction states', async ({ page }) => {
    await page.setViewportSize(viewports.desktop)
    await page.goto('/')
    await waitForAnimations(page)

    // Scroll to projects section
    await scrollToPosition(page, 800)

    // Try to hover over project
    try {
      const projectSelectors = [
        '[class*="imageWrapper"]',
        '[class*="project"]',
        'img[alt*="project"]',
        'figure',
      ]

      for (const selector of projectSelectors) {
        const project = await page.locator(selector).first()
        if (await project.isVisible({ timeout: 1000 }).catch(() => false)) {
          await project.hover()
          await page.waitForTimeout(500)

          await page.screenshot({
            path: `screenshots/interaction-project-hover.png`,
            fullPage: false,
          })
          break
        }
      }
    } catch (error) {
      console.log(`Could not capture hover state: ${error.message}`)
    }

    // Capture custom cursor if visible
    try {
      const cursor = await page
        .locator('[class*="cursor"]:not([class*="cursorDot"])')
        .first()
      if (await cursor.isVisible()) {
        // Move mouse to center of viewport
        await page.mouse.move(
          viewports.desktop.width / 2,
          viewports.desktop.height / 2
        )
        await page.screenshot({
          path: `screenshots/interaction-custom-cursor.png`,
          fullPage: false,
        })
      }
    } catch (error) {
      console.log(`Could not capture cursor state: ${error.message}`)
    }
  })
})
