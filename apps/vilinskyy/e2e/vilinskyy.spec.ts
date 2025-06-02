import { test, expect } from '@playwright/test'

test.describe('Vilinskyy Portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test.describe('Navigation', () => {
    test('should navigate between pages', async ({ page }) => {
      // Check home page
      await expect(page.locator('h1')).toContainText('Rylee Brasseur')

      // Navigate to Visuals
      await page.click('nav a:has-text("Visuals")')
      await expect(page.locator('h1')).toContainText('Visual Work')
      await expect(page.url()).toContain('/visuals')

      // Navigate to Networking
      await page.click('nav a:has-text("Networking 2024")')
      await expect(page.locator('h1')).toContainText('Networking 2024')
      await expect(page.url()).toContain('/networking-2024')

      // Navigate to Loom Roast
      await page.click('nav a:has-text("Loom Roast")')
      await expect(page.locator('h1')).toContainText('Loom Roast')
      await expect(page.url()).toContain('/loom-roast')

      // Navigate back home
      await page.click('nav a:has-text("Home")')
      await expect(page.locator('h1')).toContainText('Rylee Brasseur')
      await expect(page.url()).toBe('/')
    })

    test('should highlight active navigation item', async ({ page }) => {
      const activeClass = 'active'

      // Check home is active
      await expect(page.locator(`nav a[href="/"]`)).toHaveClass(
        new RegExp(activeClass)
      )

      // Navigate to Visuals and check it's active
      await page.click('nav a:has-text("Visuals")')
      await expect(page.locator(`nav a[href="/visuals"]`)).toHaveClass(
        new RegExp(activeClass)
      )
      await expect(page.locator(`nav a[href="/"]`)).not.toHaveClass(
        new RegExp(activeClass)
      )
    })
  })

  test.describe('Hero Section', () => {
    test('should display hero content', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Rylee Brasseur')
      await expect(page.locator('text=International Relations')).toBeVisible()
      await expect(page.locator('text=James Madison College')).toBeVisible()

      // Check achievement stats
      const statItems = page.locator('[class*="statItem"]')
      await expect(statItems).toHaveCount(4) // 3 records, 82 seconds, 45 people, $2,000
    })

    test('should have video placeholder', async ({ page }) => {
      const videoContainer = page.locator('.videoContainer')
      await expect(videoContainer).toBeVisible()
      await expect(page.locator('text=57 sec')).toBeVisible()
    })

    test('should have newsletter form in hero', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first()
      const subscribeButton = page
        .locator('button:has-text("Subscribe")')
        .first()

      await expect(emailInput).toBeVisible()
      await expect(subscribeButton).toBeVisible()
    })
  })

  test.describe('Project Listings', () => {
    test('should display project sections', async ({ page }) => {
      await expect(page.locator('h2:has-text("Projects & Work")')).toBeVisible()

      // Check for key projects
      await expect(page.locator('text=Decipad')).toBeVisible()
      await expect(page.locator('text=Grammarly')).toBeVisible()
      await expect(page.locator('text=Spark')).toBeVisible()
    })

    test('should expand project details on click', async ({ page }) => {
      const firstProject = page.locator('button:has-text("Read More")').first()
      await firstProject.click()

      // Check expanded content
      await expect(
        page.locator('button:has-text("Read Less")').first()
      ).toBeVisible()
      await expect(page.locator('text=Key achievements')).toBeVisible()

      // Collapse
      await page.locator('button:has-text("Read Less")').first().click()
      await expect(
        page.locator('button:has-text("Read More")').first()
      ).toBeVisible()
    })

    test('should have proper ARIA attributes for expandable sections', async ({
      page,
    }) => {
      const readMoreButton = page
        .locator('button:has-text("Read More")')
        .first()

      // Check initial state
      await expect(readMoreButton).toHaveAttribute('aria-expanded', 'false')

      // Expand
      await readMoreButton.click()
      await expect(
        page.locator('button:has-text("Read Less")').first()
      ).toHaveAttribute('aria-expanded', 'true')
    })
  })

  test.describe('Testimonial Slider', () => {
    test('should display testimonials', async ({ page }) => {
      await expect(page.locator('h2:has-text("What People Say")')).toBeVisible()
      await expect(page.locator('blockquote')).toBeVisible()
      await expect(page.locator('cite')).toBeVisible()
    })

    test('should navigate testimonials', async ({ page }) => {
      const nextButton = page.locator('button[aria-label="Next testimonial"]')
      const prevButton = page.locator(
        'button[aria-label="Previous testimonial"]'
      )

      // Get initial testimonial text
      const initialQuote = await page.locator('blockquote').textContent()

      // Click next
      await nextButton.click()
      await page.waitForTimeout(400) // Wait for animation

      const nextQuote = await page.locator('blockquote').textContent()
      expect(nextQuote).not.toBe(initialQuote)

      // Click previous
      await prevButton.click()
      await page.waitForTimeout(400)

      const prevQuote = await page.locator('blockquote').textContent()
      expect(prevQuote).toBe(initialQuote)
    })

    test('should navigate via dots', async ({ page }) => {
      const dots = page.locator('button[aria-label^="Go to testimonial"]')
      await expect(dots).toHaveCount(5)

      // Click third dot
      await dots.nth(2).click()
      await page.waitForTimeout(400)

      // Check active state
      await expect(dots.nth(2)).toHaveClass(/dotActive/)
    })
  })

  test.describe('Newsletter Form', () => {
    test('should validate email input', async ({ page }) => {
      const newsletterSection = page
        .locator('h2:has-text("Stay in the Loop")')
        .locator('..')
      const emailInput = newsletterSection.locator('input[type="email"]')
      const submitButton = newsletterSection.locator(
        'button:has-text("Subscribe")'
      )

      // Try submitting empty
      await submitButton.click()

      // Try invalid email
      await emailInput.fill('invalid-email')
      await submitButton.click()
      await expect(
        page.locator('text=Please enter a valid email')
      ).toBeVisible()

      // Valid email
      await emailInput.fill('test@example.com')
      await submitButton.click()
      await expect(page.locator('text=Thanks for subscribing')).toBeVisible()
      await expect(submitButton).toContainText('✓ Subscribed')
    })
  })

  test.describe('Multi-column Layouts', () => {
    test('should display productivity stack', async ({ page }) => {
      await expect(
        page.locator('h2:has-text("My Productivity Stack")')
      ).toBeVisible()
      await expect(page.locator('h3:has-text("Tools & Systems")')).toBeVisible()
      await expect(page.locator('h3:has-text("Daily Habits")')).toBeVisible()
    })

    test('should display achievements', async ({ page }) => {
      await expect(
        page.locator('h2:has-text("Notable Achievements")')
      ).toBeVisible()
      await expect(
        page.locator('h3:has-text("Design Leadership")')
      ).toBeVisible()
      await expect(
        page.locator('h3:has-text("Entrepreneurship")')
      ).toBeVisible()
      await expect(page.locator('h3:has-text("Recognition")')).toBeVisible()
    })
  })

  test.describe('Visuals Page', () => {
    test('should display gallery', async ({ page }) => {
      await page.goto('/visuals')
      await expect(page.locator('h1:has-text("Visual Work")')).toBeVisible()

      // Check filter buttons
      const filterButtons = page.locator(
        'button:has-text("All"), button:has-text("Product Design")'
      )
      await expect(filterButtons.first()).toBeVisible()

      // Check gallery items
      const galleryItems = page.locator('.galleryItem')
      await expect(galleryItems).toHaveCount(9)
    })

    test('should filter gallery by category', async ({ page }) => {
      await page.goto('/visuals')

      // Click Product Design filter
      await page.click('button:has-text("Product Design")')

      // Check filtered items
      const galleryItems = page.locator('.galleryItem')
      const count = await galleryItems.count()
      expect(count).toBeLessThan(9)

      // Check all items have correct category
      for (let i = 0; i < count; i++) {
        await expect(
          galleryItems.nth(i).locator('.itemCategory')
        ).toContainText('Product Design')
      }
    })

    test('should open lightbox on item click', async ({ page }) => {
      await page.goto('/visuals')

      // Click first gallery item
      await page.locator('.galleryItem').first().click()

      // Check lightbox
      await expect(page.locator('.lightbox')).toBeVisible()
      await expect(page.locator('.lightboxTitle')).toBeVisible()

      // Close lightbox
      await page.click('button[aria-label="Close"]')
      await expect(page.locator('.lightbox')).not.toBeVisible()
    })
  })

  test.describe('Networking Course Page', () => {
    test('should display course information', async ({ page }) => {
      await page.goto('/networking-2024')

      await expect(page.locator('h1:has-text("Networking 2024")')).toBeVisible()
      await expect(page.locator('text=$297')).toBeVisible()
      await expect(page.locator('button:has-text("Enroll Now")')).toBeVisible()

      // Check sections
      await expect(
        page.locator('h2:has-text("What You\'ll Learn")')
      ).toBeVisible()
      await expect(
        page.locator('h2:has-text("Course Curriculum")')
      ).toBeVisible()
      await expect(page.locator('h2:has-text("Your Instructor")')).toBeVisible()
    })

    test('should have working FAQ accordion', async ({ page }) => {
      await page.goto('/networking-2024')

      const firstFaq = page.locator('details').first()
      const summary = firstFaq.locator('summary')

      // Initially closed
      await expect(firstFaq).not.toHaveAttribute('open')

      // Open
      await summary.click()
      await expect(firstFaq).toHaveAttribute('open')

      // Close
      await summary.click()
      await expect(firstFaq).not.toHaveAttribute('open')
    })
  })

  test.describe('Loom Roast Page', () => {
    test('should display service information', async ({ page }) => {
      await page.goto('/loom-roast')

      await expect(page.locator('h1:has-text("Loom Roast")')).toBeVisible()
      await expect(page.locator('h2:has-text("How It Works")')).toBeVisible()
      await expect(page.locator('.step')).toHaveCount(3)
    })

    test('should validate submission form', async ({ page }) => {
      await page.goto('/loom-roast')

      const emailInput = page.locator('input#email')
      const urlInput = page.locator('input#projectUrl')
      const submitButton = page.locator('button:has-text("Submit for Roast")')

      // Try submitting empty
      await submitButton.click()
      await expect(
        page.locator('text=Please fill in all required fields')
      ).toBeVisible()

      // Fill valid data
      await emailInput.fill('test@example.com')
      await urlInput.fill('https://example.com')
      await submitButton.click()

      // Check success
      await expect(
        page.locator('text=Your project has been submitted')
      ).toBeVisible()
      await expect(submitButton).toContainText('✓ Submitted')
    })
  })

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Check navigation is still accessible
      await expect(page.locator('nav')).toBeVisible()

      // Check hero adapts
      await expect(page.locator('h1')).toBeVisible()

      // Check project cards stack
      const projectSections = page.locator('.expandableSection')
      await expect(projectSections.first()).toBeVisible()

      // Navigate to other pages
      await page.click('nav a:has-text("Visuals")')
      await expect(page.locator('h1:has-text("Visual Work")')).toBeVisible()
    })

    test('should handle tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })

      // Check layout adapts
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('nav')).toBeVisible()

      // Check gallery on visuals page
      await page.goto('/visuals')
      const galleryItems = page.locator('.galleryItem')
      await expect(galleryItems.first()).toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper focus management', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab')

      // First tab should go to first nav link
      const activeElement = await page.evaluate(
        () => document.activeElement?.tagName
      )
      expect(activeElement).toBe('A')
    })

    test('should have proper ARIA labels', async ({ page }) => {
      // Check social links have labels
      const socialLinks = page.locator('a[aria-label]')
      const count = await socialLinks.count()

      for (let i = 0; i < count; i++) {
        const label = await socialLinks.nth(i).getAttribute('aria-label')
        expect(label).toBeTruthy()
      }
    })

    test('should support keyboard navigation for expandable sections', async ({
      page,
    }) => {
      const firstButton = page.locator('button:has-text("Read More")').first()

      // Focus and activate with keyboard
      await firstButton.focus()
      await page.keyboard.press('Enter')

      await expect(
        page.locator('button:has-text("Read Less")').first()
      ).toBeVisible()

      // Space should also work
      await page.keyboard.press('Space')
      await expect(
        page.locator('button:has-text("Read More")').first()
      ).toBeVisible()
    })
  })
})
