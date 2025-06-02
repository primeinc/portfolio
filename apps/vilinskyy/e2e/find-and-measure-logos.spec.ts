import { test } from '@playwright/test'
import { writeFileSync } from 'fs'

test.describe('Find and Measure Logo Grid', () => {
  test('should find logo grid and measure spacing', async ({ page }) => {
    // Navigate to the real Vilinskyy site
    await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' })

    // Wait for page to fully load
    await page.waitForTimeout(3000)

    // Take a full page screenshot
    await page.screenshot({
      path: './screenshot-full-page-logos.png',
      fullPage: true,
    })

    // Explore the page structure to find logo sections
    const pageStructure = await page.evaluate(() => {
      const sections: any[] = []

      // Get all sections
      document.querySelectorAll('section').forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        const text = section.textContent?.slice(0, 200) || ''
        const images = section.querySelectorAll('img')
        const hasLogos =
          text.toLowerCase().includes('companies') ||
          text.toLowerCase().includes('seen on') ||
          text.toLowerCase().includes('worked with') ||
          text.toLowerCase().includes('clients') ||
          (images.length >= 6 && images.length <= 15)

        sections.push({
          index,
          top: rect.top + window.scrollY,
          height: rect.height,
          text: text.replace(/\s+/g, ' ').trim(),
          imageCount: images.length,
          hasLogos,
          className: section.className,
        })
      })

      return sections
    })

    console.log('\n=== PAGE SECTIONS ===')
    pageStructure.forEach((section) => {
      console.log(
        `Section ${section.index}: ${section.hasLogos ? '✓ LOGOS' : '✗'} - ${section.imageCount} images - Top: ${section.top}px`
      )
      console.log(`  Text preview: "${section.text.slice(0, 80)}..."`)
      console.log(`  Class: ${section.className}`)
    })

    // Find the most likely logo section
    const logoSection =
      pageStructure.find((s) => s.hasLogos) ||
      pageStructure.find((s) => s.imageCount >= 6)

    if (logoSection) {
      // Scroll to the logo section
      await page.evaluate(
        (top) => window.scrollTo(0, top - 100),
        logoSection.top
      )
      await page.waitForTimeout(1000)

      // Take screenshot of the section
      await page.screenshot({
        path: '/home/will/local_dev/portfolio/apps/vilinskyy/screenshot-logo-section.png',
        clip: {
          x: 0,
          y: logoSection.top - 100,
          width: 1280,
          height: Math.min(logoSection.height + 200, 800),
        },
      })

      // Get detailed measurements of this section
      const measurements = await page.evaluate((sectionIndex) => {
        const section = document.querySelectorAll('section')[sectionIndex]
        if (!section) return { error: 'Section not found' }

        // Find container with images
        let logoContainer = section.querySelector('div:has(img)')
        if (
          !logoContainer ||
          logoContainer.querySelectorAll('img').length < 4
        ) {
          // Try finding nested containers
          const divs = section.querySelectorAll('div')
          for (const div of divs) {
            if (div.querySelectorAll('img').length >= 4) {
              logoContainer = div
              break
            }
          }
        }

        if (!logoContainer) return { error: 'Logo container not found' }

        const containerRect = logoContainer.getBoundingClientRect()
        const containerStyles = window.getComputedStyle(logoContainer)

        // Get all images
        const images = Array.from(logoContainer.querySelectorAll('img'))
        const imageMeasurements = images.map((img, index) => {
          const rect = img.getBoundingClientRect()
          const styles = window.getComputedStyle(img)
          return {
            index,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            src: img.src.split('/').pop() || 'unknown',
            maxWidth: styles.maxWidth,
            display: styles.display,
          }
        })

        // Calculate gaps between adjacent images
        const gaps: { horizontal: number[]; vertical: number[] } = {
          horizontal: [],
          vertical: [],
        }

        // Group images by row
        const rows: number[][] = []
        let currentRow: number[] = []
        let currentTop = images[0]?.getBoundingClientRect().top || 0

        images.forEach((img, index) => {
          const rect = img.getBoundingClientRect()
          if (Math.abs(rect.top - currentTop) > 10) {
            if (currentRow.length > 0) rows.push(currentRow)
            currentRow = [index]
            currentTop = rect.top
          } else {
            currentRow.push(index)
          }
        })
        if (currentRow.length > 0) rows.push(currentRow)

        // Calculate horizontal gaps within rows
        rows.forEach((row) => {
          for (let i = 1; i < row.length; i++) {
            const prevImg = images[row[i - 1]].getBoundingClientRect()
            const currImg = images[row[i]].getBoundingClientRect()
            const gap = currImg.left - (prevImg.left + prevImg.width)
            if (gap > 0) gaps.horizontal.push(gap)
          }
        })

        // Calculate vertical gaps between rows
        for (let i = 1; i < rows.length; i++) {
          const prevRowImg = images[rows[i - 1][0]].getBoundingClientRect()
          const currRowImg = images[rows[i][0]].getBoundingClientRect()
          const gap = currRowImg.top - (prevRowImg.top + prevRowImg.height)
          if (gap > 0) gaps.vertical.push(gap)
        }

        return {
          container: {
            width: containerRect.width,
            height: containerRect.height,
            display: containerStyles.display,
            gridTemplateColumns: containerStyles.gridTemplateColumns,
            gap: containerStyles.gap,
            columnGap: containerStyles.columnGap,
            rowGap: containerStyles.rowGap,
            padding: containerStyles.padding,
            justifyContent: containerStyles.justifyContent,
            alignItems: containerStyles.alignItems,
            flexWrap: containerStyles.flexWrap,
          },
          images: imageMeasurements,
          layout: {
            rows: rows.length,
            imagesPerRow: rows.map((r) => r.length),
            totalImages: images.length,
          },
          gaps: {
            horizontal: gaps.horizontal,
            vertical: gaps.vertical,
            avgHorizontal:
              gaps.horizontal.length > 0
                ? Math.round(
                    gaps.horizontal.reduce((a, b) => a + b, 0) /
                      gaps.horizontal.length
                  )
                : 0,
            avgVertical:
              gaps.vertical.length > 0
                ? Math.round(
                    gaps.vertical.reduce((a, b) => a + b, 0) /
                      gaps.vertical.length
                  )
                : 0,
          },
        }
      }, logoSection.index)

      // Save measurements
      writeFileSync(
        '/home/will/local_dev/portfolio/apps/vilinskyy/spacing-measurements.json',
        JSON.stringify(
          {
            logoSection: {
              index: logoSection.index,
              position: { top: logoSection.top, height: logoSection.height },
            },
            measurements,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      )

      console.log('\n=== LOGO GRID MEASUREMENTS ===')
      if (!measurements.error) {
        console.log(
          `Container: ${measurements.container.width}x${measurements.container.height}`
        )
        console.log(`Display: ${measurements.container.display}`)
        console.log(`CSS Gap: ${measurements.container.gap}`)
        console.log(
          `Grid Template: ${measurements.container.gridTemplateColumns}`
        )
        console.log(`\nLayout:`)
        console.log(`- Rows: ${measurements.layout.rows}`)
        console.log(
          `- Images per row: ${measurements.layout.imagesPerRow.join(', ')}`
        )
        console.log(`- Total images: ${measurements.layout.totalImages}`)
        console.log(`\nCalculated Gaps:`)
        console.log(
          `- Horizontal: ${measurements.gaps.avgHorizontal}px (samples: ${measurements.gaps.horizontal.length})`
        )
        console.log(
          `- Vertical: ${measurements.gaps.avgVertical}px (samples: ${measurements.gaps.vertical.length})`
        )
      } else {
        console.log('Error:', measurements.error)
      }
    } else {
      console.log('\n❌ No logo section found')
    }
  })
})
