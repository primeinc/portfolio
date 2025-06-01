import { test } from '@playwright/test'
import { writeFileSync } from 'fs'

test.describe('Measure Real Site Spacing', () => {
  test('should measure exact spacing and dimensions', async ({ page }) => {
    // Navigate to the real Vilinskyy site
    await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' })
    
    // Wait for page to fully load
    await page.waitForTimeout(2000)
    
    // Collect all measurements
    const measurements = await page.evaluate(() => {
      const getElementMetrics = (selector: string) => {
        const element = document.querySelector(selector)
        if (!element) return null
        
        const rect = element.getBoundingClientRect()
        const styles = window.getComputedStyle(element)
        
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          paddingTop: styles.paddingTop,
          paddingRight: styles.paddingRight,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          marginTop: styles.marginTop,
          marginRight: styles.marginRight,
          marginBottom: styles.marginBottom,
          marginLeft: styles.marginLeft,
          gap: styles.gap || 'none'
        }
      }
      
      // Hero section measurements
      const heroSection = document.querySelector('section') || document.querySelector('[class*="hero"]')
      const heroMetrics = heroSection ? getElementMetrics('section') : null
      
      // Find hero text (main heading)
      const heroHeading = document.querySelector('h1') || document.querySelector('[class*="title"]')
      const heroHeadingMetrics = heroHeading ? {
        ...getElementMetrics('h1'),
        fontSize: window.getComputedStyle(heroHeading).fontSize,
        lineHeight: window.getComputedStyle(heroHeading).lineHeight,
        fontWeight: window.getComputedStyle(heroHeading).fontWeight
      } : null
      
      // Find subtitle/description
      const heroSubtitle = document.querySelector('h1 + p') || document.querySelector('[class*="subtitle"]')
      const heroSubtitleMetrics = heroSubtitle ? {
        ...getElementMetrics('h1 + p'),
        fontSize: window.getComputedStyle(heroSubtitle).fontSize,
        lineHeight: window.getComputedStyle(heroSubtitle).lineHeight
      } : null
      
      // Find logo grid - look for various possible selectors
      const logoGridSelectors = [
        '.Companies_companies__KICDO',
        '[class*="companies"]',
        '[class*="logos"]',
        '[class*="grid"]:has(img)',
        'div:has(> img[alt*="logo"])',
        'section:nth-of-type(2) > div',
        '.grid',
        '[style*="grid"]'
      ]
      
      let logoGrid = null
      let logoGridMetrics = null
      
      for (const selector of logoGridSelectors) {
        const element = document.querySelector(selector)
        if (element && element.querySelectorAll('img').length > 3) {
          logoGrid = element
          break
        }
      }
      
      if (logoGrid) {
        const rect = logoGrid.getBoundingClientRect()
        const styles = window.getComputedStyle(logoGrid)
        
        logoGridMetrics = {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          paddingTop: styles.paddingTop,
          paddingRight: styles.paddingRight,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          gap: styles.gap,
          gridGap: styles.gridGap,
          columnGap: styles.columnGap,
          rowGap: styles.rowGap,
          display: styles.display,
          gridTemplateColumns: styles.gridTemplateColumns,
          gridTemplateRows: styles.gridTemplateRows
        }
      }
      
      // Logo dimensions within grid
      const logos = logoGrid ? Array.from(logoGrid.querySelectorAll('img')) : []
      const logoMetrics = logos.map(logo => {
        const rect = logo.getBoundingClientRect()
        const styles = window.getComputedStyle(logo)
        return {
          width: rect.width,
          height: rect.height,
          naturalWidth: (logo as HTMLImageElement).naturalWidth,
          naturalHeight: (logo as HTMLImageElement).naturalHeight,
          alt: logo.getAttribute('alt'),
          objectFit: styles.objectFit
        }
      })
      
      // Calculate spacing between hero text and logo grid
      let spacingBetweenHeroAndLogos = null
      if (heroSubtitle && logoGrid) {
        const heroBottom = heroSubtitle.getBoundingClientRect().bottom
        const logoTop = logoGrid.getBoundingClientRect().top
        spacingBetweenHeroAndLogos = logoTop - heroBottom
      }
      
      // Get container/wrapper measurements
      const mainContainer = document.querySelector('main') || document.querySelector('[class*="container"]')
      const containerMetrics = mainContainer ? getElementMetrics('main') : null
      
      // Get all section spacings
      const sections = Array.from(document.querySelectorAll('section'))
      const sectionSpacings = sections.map((section, index) => {
        const rect = section.getBoundingClientRect()
        const styles = window.getComputedStyle(section)
        const nextSection = sections[index + 1]
        
        return {
          index,
          height: rect.height,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          spacingToNext: nextSection ? 
            nextSection.getBoundingClientRect().top - rect.bottom : null
        }
      })
      
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        hero: {
          section: heroMetrics,
          heading: heroHeadingMetrics,
          subtitle: heroSubtitleMetrics,
          spacingToLogoGrid: spacingBetweenHeroAndLogos
        },
        logoGrid: {
          container: logoGridMetrics,
          logos: logoMetrics,
          logoCount: logos.length
        },
        container: containerMetrics,
        sections: sectionSpacings,
        timestamp: new Date().toISOString()
      }
    })
    
    // Save measurements to file
    writeFileSync(
      '/home/will/local_dev/portfolio/apps/vilinskyy/spacing-measurements.json',
      JSON.stringify(measurements, null, 2)
    )
    
    console.log('Measurements saved to spacing-measurements.json')
    console.log('Key measurements:')
    console.log(`- Hero to logo grid spacing: ${measurements.hero.spacingToLogoGrid}px`)
    console.log(`- Logo grid gap: ${measurements.logoGrid.container?.gap || 'not found'}`)
    console.log(`- Logo grid dimensions: ${measurements.logoGrid.container?.width}x${measurements.logoGrid.container?.height}`)
  })

  test('should measure specific grid and layout properties', async ({ page }) => {
    await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
    
    const detailedMeasurements = await page.evaluate(() => {
      // More specific grid measurements
      const findLogoGrid = () => {
        // Try to find by checking for grid display with images
        const allElements = document.querySelectorAll('*')
        for (const el of allElements) {
          const styles = window.getComputedStyle(el)
          const hasImages = el.querySelectorAll('img').length > 3
          const isGrid = styles.display === 'grid' || styles.display === 'flex'
          
          if (hasImages && isGrid) {
            return el
          }
        }
        return null
      }
      
      const logoGrid = findLogoGrid()
      
      if (!logoGrid) {
        return { error: 'Logo grid not found' }
      }
      
      const gridStyles = window.getComputedStyle(logoGrid)
      const gridRect = logoGrid.getBoundingClientRect()
      
      // Get parent section
      const parentSection = logoGrid.closest('section')
      const sectionStyles = parentSection ? window.getComputedStyle(parentSection) : null
      
      // Get exact positions of first and last logos
      const logos = Array.from(logoGrid.querySelectorAll('img'))
      const firstLogo = logos[0]
      const lastLogo = logos[logos.length - 1]
      
      const measurements = {
        grid: {
          display: gridStyles.display,
          gridTemplateColumns: gridStyles.gridTemplateColumns,
          gridTemplateRows: gridStyles.gridTemplateRows,
          gap: gridStyles.gap,
          columnGap: gridStyles.columnGap,
          rowGap: gridStyles.rowGap,
          justifyContent: gridStyles.justifyContent,
          alignItems: gridStyles.alignItems,
          width: gridRect.width,
          height: gridRect.height,
          padding: {
            top: gridStyles.paddingTop,
            right: gridStyles.paddingRight,
            bottom: gridStyles.paddingBottom,
            left: gridStyles.paddingLeft
          }
        },
        section: sectionStyles ? {
          padding: {
            top: sectionStyles.paddingTop,
            right: sectionStyles.paddingRight,
            bottom: sectionStyles.paddingBottom,
            left: sectionStyles.paddingLeft
          },
          margin: {
            top: sectionStyles.marginTop,
            bottom: sectionStyles.marginBottom
          }
        } : null,
        logos: {
          count: logos.length,
          firstPosition: firstLogo ? firstLogo.getBoundingClientRect() : null,
          lastPosition: lastLogo ? lastLogo.getBoundingClientRect() : null,
          sizes: logos.map(logo => ({
            width: logo.getBoundingClientRect().width,
            height: logo.getBoundingClientRect().height
          }))
        },
        calculatedGaps: logos.length > 1 ? {
          horizontal: logos[1] ? 
            logos[1].getBoundingClientRect().left - logos[0].getBoundingClientRect().right : 0,
          vertical: logos[3] && logos[0] ? 
            logos[3].getBoundingClientRect().top - logos[0].getBoundingClientRect().bottom : 0
        } : null
      }
      
      return measurements
    })
    
    // Save detailed measurements to a separate file
    writeFileSync(
      '/home/will/local_dev/portfolio/apps/vilinskyy/spacing-measurements-detailed.json',
      JSON.stringify(detailedMeasurements, null, 2)
    )
    
    console.log('Detailed grid measurements added')
  })
})