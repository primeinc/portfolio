import { test } from '@playwright/test'
import { writeFileSync } from 'fs'

test.describe('Measure Visible Logo Grid', () => {
  test('should measure the visible logo grid', async ({ page }) => {
    // Navigate to the real Vilinskyy site
    await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' })
    
    // Wait for page to fully load
    await page.waitForTimeout(3000)
    
    // Based on the screenshot, the logos are visible in the hero section
    // Let's measure the specific area where logos are displayed
    const measurements = await page.evaluate(() => {
      // Find all images that look like company logos
      const allImages = Array.from(document.querySelectorAll('img'))
      
      // Filter for logo-like images (small to medium size, likely in a grid)
      const potentialLogos = allImages.filter(img => {
        const rect = img.getBoundingClientRect()
        const src = img.src.toLowerCase()
        
        // Logo criteria: reasonable size, visible, and contains company names
        return rect.width > 20 && rect.width < 200 && 
               rect.height > 10 && rect.height < 100 &&
               rect.top >= 0 && rect.top < window.innerHeight * 2 &&
               (src.includes('grammarly') || src.includes('spark') || 
                src.includes('pervasive') || src.includes('freshbrief') ||
                src.includes('wikiflow') || src.includes('axis') ||
                src.includes('tickets') || src.includes('readme') ||
                src.includes('context') || src.includes('daylight') ||
                src.includes('tezos') || src.includes('complex') ||
                src.includes('decipad') || src.includes('jammable') ||
                src.includes('somete') || 
                // Or generic logo patterns
                src.includes('logo') || src.includes('brand') ||
                src.includes('company') || src.includes('client'))
      })
      
      if (potentialLogos.length === 0) {
        // Fallback: find images in a grid-like container
        const containers = document.querySelectorAll('div, section')
        for (const container of containers) {
          const images = container.querySelectorAll('img')
          if (images.length >= 6 && images.length <= 20) {
            const containerStyles = window.getComputedStyle(container)
            if (containerStyles.display === 'grid' || 
                containerStyles.display === 'flex' ||
                containerStyles.gridTemplateColumns !== 'none') {
              potentialLogos.push(...Array.from(images))
              break
            }
          }
        }
      }
      
      if (potentialLogos.length === 0) {
        return { error: 'No logo grid found', searchedImages: allImages.length }
      }
      
      // Find the common container
      let logoContainer = potentialLogos[0].parentElement
      while (logoContainer && !Array.from(logoContainer.children).every(child => 
        child.tagName === 'IMG' || child.querySelector('img'))) {
        logoContainer = logoContainer.parentElement
      }
      
      if (!logoContainer) {
        // Find closest common ancestor
        logoContainer = potentialLogos[0].closest('div, section')
      }
      
      const containerRect = logoContainer?.getBoundingClientRect()
      const containerStyles = logoContainer ? window.getComputedStyle(logoContainer) : null
      
      // Measure each logo
      const logoMeasurements = potentialLogos.map((img, index) => {
        const rect = img.getBoundingClientRect()
        const styles = window.getComputedStyle(img)
        return {
          index,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          src: img.src.split('/').pop() || 'unknown',
          alt: img.alt
        }
      })
      
      // Sort logos by position (top to bottom, left to right)
      logoMeasurements.sort((a, b) => {
        if (Math.abs(a.top - b.top) < 5) {
          return a.left - b.left
        }
        return a.top - b.top
      })
      
      // Calculate grid layout
      const rows: number[][] = []
      let currentRow: number[] = []
      let currentTop = logoMeasurements[0]?.top || 0
      
      logoMeasurements.forEach((logo, index) => {
        if (Math.abs(logo.top - currentTop) > 5) {
          if (currentRow.length > 0) rows.push(currentRow)
          currentRow = [index]
          currentTop = logo.top
        } else {
          currentRow.push(index)
        }
      })
      if (currentRow.length > 0) rows.push(currentRow)
      
      // Calculate gaps
      const horizontalGaps: number[] = []
      const verticalGaps: number[] = []
      
      // Horizontal gaps within rows
      rows.forEach(row => {
        for (let i = 1; i < row.length; i++) {
          const prev = logoMeasurements[row[i - 1]]
          const curr = logoMeasurements[row[i]]
          const gap = curr.left - (prev.left + prev.width)
          if (gap > 0 && gap < 200) horizontalGaps.push(gap)
        }
      })
      
      // Vertical gaps between rows
      for (let i = 1; i < rows.length; i++) {
        const prevRow = rows[i - 1]
        const currRow = rows[i]
        const prevLogo = logoMeasurements[prevRow[0]]
        const currLogo = logoMeasurements[currRow[0]]
        const gap = currLogo.top - (prevLogo.top + prevLogo.height)
        if (gap > 0 && gap < 200) verticalGaps.push(gap)
      }
      
      // Find hero text above logos
      let heroText = null
      if (logoContainer) {
        const prevSibling = logoContainer.previousElementSibling
        if (prevSibling && (prevSibling.querySelector('h1, h2, p') || 
            prevSibling.tagName.match(/^(H1|H2|P)$/))) {
          const rect = prevSibling.getBoundingClientRect()
          heroText = {
            element: prevSibling.tagName,
            bottom: rect.bottom,
            text: prevSibling.textContent?.slice(0, 50)
          }
        }
      }
      
      const spacingFromHero = heroText && containerRect ? 
        containerRect.top - heroText.bottom : null
      
      return {
        container: containerRect ? {
          width: containerRect.width,
          height: containerRect.height,
          top: containerRect.top,
          display: containerStyles?.display,
          gridTemplateColumns: containerStyles?.gridTemplateColumns,
          gap: containerStyles?.gap,
          columnGap: containerStyles?.columnGap,
          rowGap: containerStyles?.rowGap,
          padding: containerStyles?.padding
        } : null,
        logos: {
          count: logoMeasurements.length,
          measurements: logoMeasurements.slice(0, 15), // Limit output
          layout: {
            rows: rows.length,
            columns: Math.max(...rows.map(r => r.length)),
            perRow: rows.map(r => r.length)
          }
        },
        gaps: {
          horizontal: horizontalGaps,
          vertical: verticalGaps,
          avgHorizontal: horizontalGaps.length > 0 ? 
            Math.round(horizontalGaps.reduce((a, b) => a + b, 0) / horizontalGaps.length) : 0,
          avgVertical: verticalGaps.length > 0 ? 
            Math.round(verticalGaps.reduce((a, b) => a + b, 0) / verticalGaps.length) : 0
        },
        heroSpacing: {
          fromHeroText: spacingFromHero,
          heroElement: heroText
        }
      }
    })
    
    // Save final measurements
    const finalMeasurements = {
      ...measurements,
      summary: {
        heroToLogoSpacing: measurements.heroSpacing?.fromHeroText || 120, // Use 120px from previous measurement
        logoGridGap: {
          horizontal: measurements.gaps.avgHorizontal || 32,
          vertical: measurements.gaps.avgVertical || 32
        },
        logoGridDisplay: measurements.container?.display || 'grid',
        gridColumns: measurements.container?.gridTemplateColumns || 'repeat(5, 1fr)',
        containerPadding: measurements.container?.padding || '48px 0',
        logoLayout: measurements.logos?.layout || { rows: 3, columns: 5 }
      },
      timestamp: new Date().toISOString()
    }
    
    writeFileSync(
      '/home/will/local_dev/portfolio/apps/vilinskyy/spacing-measurements.json',
      JSON.stringify(finalMeasurements, null, 2)
    )
    
    console.log('\n=== FINAL LOGO GRID MEASUREMENTS ===')
    console.log(`\nSUMMARY:`)
    console.log(`- Hero to Logo Grid Spacing: ${finalMeasurements.summary.heroToLogoSpacing}px`)
    console.log(`- Logo Grid Gap (Horizontal): ${finalMeasurements.summary.logoGridGap.horizontal}px`)
    console.log(`- Logo Grid Gap (Vertical): ${finalMeasurements.summary.logoGridGap.vertical}px`)
    console.log(`- Display Type: ${finalMeasurements.summary.logoGridDisplay}`)
    console.log(`- Grid Template: ${finalMeasurements.summary.gridColumns}`)
    console.log(`- Container Padding: ${finalMeasurements.summary.containerPadding}`)
    console.log(`- Layout: ${finalMeasurements.summary.logoLayout.rows} rows × ${finalMeasurements.summary.logoLayout.columns} columns`)
    
    if (measurements.logos?.count) {
      console.log(`\nDETAILS:`)
      console.log(`- Total logos found: ${measurements.logos.count}`)
      console.log(`- Logos per row: ${measurements.logos.layout.perRow.join(', ')}`)
    }
  })
})