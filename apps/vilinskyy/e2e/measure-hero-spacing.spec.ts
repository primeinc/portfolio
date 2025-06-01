import { test } from '@playwright/test'
import { writeFileSync } from 'fs'

test.describe('Measure Hero Section Spacing', () => {
  test('should measure hero section and logo grid spacing', async ({ page }) => {
    // Navigate to the real Vilinskyy site
    await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' })
    
    // Wait for page to fully load
    await page.waitForTimeout(3000)
    
    // Take a screenshot for reference
    await page.screenshot({ 
      path: '/home/will/local_dev/portfolio/apps/vilinskyy/screenshot-hero-measurement.png',
      fullPage: false 
    })
    
    // Collect measurements using more specific selectors
    const measurements = await page.evaluate(() => {
      // Helper to get computed styles
      const getComputedStyles = (element: Element) => {
        const styles = window.getComputedStyle(element)
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          gap: styles.gap,
          columnGap: styles.columnGap,
          rowGap: styles.rowGap,
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          fontWeight: styles.fontWeight
        }
      }
      
      // Find the hero section - first section or section with h1
      const heroSection = document.querySelector('section:first-of-type') || 
                         document.querySelector('section:has(h1)') ||
                         document.querySelector('[class*="hero"]')
      
      // Find the main heading
      const mainHeading = document.querySelector('h1')
      const headingRect = mainHeading?.getBoundingClientRect()
      const headingStyles = mainHeading ? getComputedStyles(mainHeading) : null
      
      // Find subtitle (usually paragraph after h1)
      const subtitle = mainHeading?.nextElementSibling?.tagName === 'P' ? 
                      mainHeading.nextElementSibling : 
                      document.querySelector('h1 + p')
      const subtitleRect = subtitle?.getBoundingClientRect()
      const subtitleStyles = subtitle ? getComputedStyles(subtitle) : null
      
      // Find the logo grid more specifically
      // Look for a container with multiple company logos
      let logoGrid = null
      const possibleContainers = document.querySelectorAll('div, section')
      
      for (const container of possibleContainers) {
        const images = container.querySelectorAll('img')
        // Check if this container has company logos (usually 6-12 logos)
        if (images.length >= 6 && images.length <= 12) {
          // Check if images are company logos by size/alt text
          let isLogoGrid = true
          for (const img of images) {
            const rect = img.getBoundingClientRect()
            // Company logos are usually small-medium sized
            if (rect.width > 200 || rect.height > 100) {
              isLogoGrid = false
              break
            }
          }
          if (isLogoGrid) {
            logoGrid = container
            break
          }
        }
      }
      
      // If still not found, try by class name patterns
      if (!logoGrid) {
        logoGrid = document.querySelector('[class*="companies"]') ||
                  document.querySelector('[class*="logos"]') ||
                  document.querySelector('[class*="clients"]') ||
                  document.querySelector('.Companies_companies__KICDO')
      }
      
      const logoGridRect = logoGrid?.getBoundingClientRect()
      const logoGridStyles = logoGrid ? getComputedStyles(logoGrid) : null
      
      // Get individual logo measurements
      const logos = logoGrid ? Array.from(logoGrid.querySelectorAll('img')) : []
      const logoMeasurements = logos.map((logo, index) => {
        const rect = logo.getBoundingClientRect()
        return {
          index,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        }
      })
      
      // Calculate exact spacing between elements
      let heroToLogoSpacing = null
      if (subtitle && logoGrid) {
        const subtitleBottom = subtitle.getBoundingClientRect().bottom
        const logoGridTop = logoGrid.getBoundingClientRect().top
        heroToLogoSpacing = logoGridTop - subtitleBottom
      } else if (mainHeading && logoGrid) {
        const headingBottom = mainHeading.getBoundingClientRect().bottom
        const logoGridTop = logoGrid.getBoundingClientRect().top
        heroToLogoSpacing = logoGridTop - headingBottom
      }
      
      // Calculate gaps between logos
      let horizontalGap = null
      let verticalGap = null
      if (logoMeasurements.length >= 2) {
        // Horizontal gap between first two logos
        horizontalGap = logoMeasurements[1].left - (logoMeasurements[0].left + logoMeasurements[0].width)
      }
      if (logoMeasurements.length >= 4) {
        // Find first logo in second row (assuming grid layout)
        const firstRowY = logoMeasurements[0].top
        const secondRowLogo = logoMeasurements.find(logo => logo.top > firstRowY + 10)
        if (secondRowLogo) {
          const firstRowLogo = logoMeasurements[0]
          verticalGap = secondRowLogo.top - (firstRowLogo.top + firstRowLogo.height)
        }
      }
      
      return {
        hero: {
          section: heroSection ? {
            rect: heroSection.getBoundingClientRect(),
            styles: getComputedStyles(heroSection)
          } : null,
          heading: mainHeading ? {
            text: mainHeading.textContent,
            rect: headingRect,
            styles: headingStyles
          } : null,
          subtitle: subtitle ? {
            text: subtitle.textContent,
            rect: subtitleRect,
            styles: subtitleStyles
          } : null
        },
        logoGrid: {
          found: !!logoGrid,
          rect: logoGridRect,
          styles: logoGridStyles,
          logoCount: logos.length,
          logos: logoMeasurements,
          calculatedGaps: {
            horizontal: horizontalGap,
            vertical: verticalGap
          }
        },
        spacing: {
          heroToLogoGrid: heroToLogoSpacing,
          measurement: heroToLogoSpacing ? `${Math.round(heroToLogoSpacing)}px` : 'not found'
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    })
    
    // Save measurements
    writeFileSync(
      '/home/will/local_dev/portfolio/apps/vilinskyy/spacing-measurements.json',
      JSON.stringify(measurements, null, 2)
    )
    
    console.log('\n=== HERO SECTION MEASUREMENTS ===')
    console.log(`Hero to Logo Grid Spacing: ${measurements.spacing.measurement}`)
    console.log(`Logo Grid Found: ${measurements.logoGrid.found}`)
    console.log(`Number of Logos: ${measurements.logoGrid.logoCount}`)
    console.log(`Horizontal Gap: ${measurements.logoGrid.calculatedGaps.horizontal}px`)
    console.log(`Vertical Gap: ${measurements.logoGrid.calculatedGaps.vertical}px`)
    
    if (measurements.logoGrid.styles) {
      console.log(`\nLogo Grid Styles:`)
      console.log(`- Display: ${measurements.logoGrid.styles.display}`)
      console.log(`- Gap: ${measurements.logoGrid.styles.gap}`)
      console.log(`- Grid Template Columns: ${measurements.logoGrid.styles.gridTemplateColumns}`)
    }
  })
})