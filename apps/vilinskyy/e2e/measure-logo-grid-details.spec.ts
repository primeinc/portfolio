import { test } from '@playwright/test'
import { writeFileSync } from 'fs'

test.describe('Measure Logo Grid Details', () => {
  test('should measure logo grid in detail', async ({ page }) => {
    // Navigate to the real Vilinskyy site
    await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' })

    // Wait for all images to load
    await page.waitForTimeout(5000)

    // Scroll to ensure hero section is in view
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(1000)

    // Take a screenshot of just the hero section
    const heroSection = await page.$('section:first-of-type')
    if (heroSection) {
      await heroSection.screenshot({
        path: '../screenshot-hero-section-detail.png',
      })
    }

    // Get detailed measurements
    const measurements = await page.evaluate(() => {
      // Find the Companies section by class name
      const companiesSection =
        document.querySelector('.Companies_companies__KICDO') ||
        document.querySelector('[class*="Companies"]') ||
        document.querySelector('[class*="companies"]')

      if (!companiesSection) {
        // Try alternative method - find section with "As seen on" text
        const sections = document.querySelectorAll('section')
        for (const section of sections) {
          if (
            section.textContent?.includes('As seen on') ||
            section.textContent?.includes('Companies')
          ) {
            const logoContainer = section.querySelector('div:has(img)')
            if (logoContainer) {
              return measureLogoGrid(logoContainer)
            }
          }
        }
        return { error: 'Companies section not found' }
      }

      function measureLogoGrid(container: Element) {
        const containerRect = container.getBoundingClientRect()
        const containerStyles = window.getComputedStyle(container)

        // Get the wrapper div if it exists
        const wrapper = container.querySelector('div') || container
        const wrapperStyles = window.getComputedStyle(wrapper)
        const wrapperRect = wrapper.getBoundingClientRect()

        // Get all images
        const images = Array.from(wrapper.querySelectorAll('img'))

        // Measure each image and its container
        const imageMeasurements = images.map((img, index) => {
          const imgRect = img.getBoundingClientRect()
          const imgStyles = window.getComputedStyle(img)
          const parent = img.parentElement
          const parentRect = parent?.getBoundingClientRect()
          const parentStyles = parent ? window.getComputedStyle(parent) : null

          return {
            index,
            image: {
              width: imgRect.width,
              height: imgRect.height,
              top: imgRect.top,
              left: imgRect.left,
              naturalWidth: (img as HTMLImageElement).naturalWidth,
              naturalHeight: (img as HTMLImageElement).naturalHeight,
              src: img.src.split('/').pop(),
              objectFit: imgStyles.objectFit,
              maxWidth: imgStyles.maxWidth,
              maxHeight: imgStyles.maxHeight,
            },
            parent: parent
              ? {
                  width: parentRect?.width,
                  height: parentRect?.height,
                  display: parentStyles?.display,
                  padding: parentStyles?.padding,
                }
              : null,
          }
        })

        // Calculate actual gaps
        const horizontalGaps: number[] = []
        const verticalGaps: number[] = []

        // Find horizontal gaps
        for (let i = 1; i < images.length; i++) {
          const prevImg = images[i - 1].getBoundingClientRect()
          const currImg = images[i].getBoundingClientRect()

          // If images are on the same row (similar top position)
          if (Math.abs(prevImg.top - currImg.top) < 5) {
            const gap = currImg.left - (prevImg.left + prevImg.width)
            if (gap > 0) horizontalGaps.push(gap)
          }
        }

        // Find vertical gaps by checking different rows
        const rows: number[][] = []
        let currentRow: number[] = []
        let currentTop = images[0]?.getBoundingClientRect().top || 0

        images.forEach((img, index) => {
          const imgTop = img.getBoundingClientRect().top
          if (Math.abs(imgTop - currentTop) > 5) {
            // New row
            if (currentRow.length > 0) rows.push(currentRow)
            currentRow = [index]
            currentTop = imgTop
          } else {
            currentRow.push(index)
          }
        })
        if (currentRow.length > 0) rows.push(currentRow)

        // Calculate vertical gaps between rows
        for (let i = 1; i < rows.length; i++) {
          const prevRowIndex = rows[i - 1][0]
          const currRowIndex = rows[i][0]
          const prevImg = images[prevRowIndex].getBoundingClientRect()
          const currImg = images[currRowIndex].getBoundingClientRect()
          const gap = currImg.top - (prevImg.top + prevImg.height)
          if (gap > 0) verticalGaps.push(gap)
        }

        return {
          container: {
            width: containerRect.width,
            height: containerRect.height,
            display: containerStyles.display,
            gap: containerStyles.gap,
            gridGap: containerStyles.gridGap,
            columnGap: containerStyles.columnGap,
            rowGap: containerStyles.rowGap,
            gridTemplateColumns: containerStyles.gridTemplateColumns,
            padding: containerStyles.padding,
            justifyContent: containerStyles.justifyContent,
            alignItems: containerStyles.alignItems,
          },
          wrapper: {
            width: wrapperRect.width,
            height: wrapperRect.height,
            display: wrapperStyles.display,
            gap: wrapperStyles.gap,
            gridGap: wrapperStyles.gridGap,
            padding: wrapperStyles.padding,
            gridTemplateColumns: wrapperStyles.gridTemplateColumns,
          },
          images: imageMeasurements,
          calculatedGaps: {
            horizontal: horizontalGaps,
            vertical: verticalGaps,
            avgHorizontal:
              horizontalGaps.length > 0
                ? Math.round(
                    horizontalGaps.reduce((a, b) => a + b, 0) /
                      horizontalGaps.length
                  )
                : 0,
            avgVertical:
              verticalGaps.length > 0
                ? Math.round(
                    verticalGaps.reduce((a, b) => a + b, 0) /
                      verticalGaps.length
                  )
                : 0,
          },
          rows: rows.map((row) => ({
            count: row.length,
            indices: row,
          })),
        }
      }

      return measureLogoGrid(companiesSection)
    })

    // Save measurements
    writeFileSync(
      '../logo-grid-measurements.json',
      JSON.stringify(measurements, null, 2)
    )

    console.log('\n=== LOGO GRID DETAILED MEASUREMENTS ===')
    if (!measurements.error) {
      console.log(
        `Container: ${measurements.container.width}x${measurements.container.height}`
      )
      console.log(`Display: ${measurements.container.display}`)
      console.log(
        `Grid Template Columns: ${measurements.container.gridTemplateColumns}`
      )
      console.log(`Gap (CSS): ${measurements.container.gap}`)
      console.log(`\nCalculated Gaps:`)
      console.log(
        `- Average Horizontal: ${measurements.calculatedGaps.avgHorizontal}px`
      )
      console.log(
        `- Average Vertical: ${measurements.calculatedGaps.avgVertical}px`
      )
      console.log(`\nGrid Layout:`)
      measurements.rows.forEach((row, index) => {
        console.log(`- Row ${index + 1}: ${row.count} logos`)
      })
    } else {
      console.log('Error:', measurements.error)
    }
  })
})
