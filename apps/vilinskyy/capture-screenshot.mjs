import { chromium } from 'playwright'

async function captureScreenshot() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  await page.goto('http://localhost:5174')
  await page.waitForLoadState('networkidle')
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'screenshot-current-hero.png',
    fullPage: true 
  })
  
  // Take just hero section - using CSS module class
  const heroSection = await page.locator('section').first()
  if (await heroSection.count() > 0) {
    await heroSection.screenshot({ 
      path: 'screenshot-hero-section.png' 
    })
  }
  
  await browser.close()
  console.log('Screenshots captured!')
}

captureScreenshot().catch(console.error)