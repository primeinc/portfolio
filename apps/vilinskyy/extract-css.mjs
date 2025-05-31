import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://vilinskyy.com');

// Wait for content to load
await page.waitForLoadState('networkidle');

// Extract all the CSS we need
const styles = await page.evaluate(() => {
  const results = {};
  
  // Get main heading
  const h1 = document.querySelector('h1');
  if (h1) {
    const h1Styles = window.getComputedStyle(h1);
    results.h1 = {
      text: h1.textContent,
      fontSize: h1Styles.fontSize,
      fontFamily: h1Styles.fontFamily,
      fontWeight: h1Styles.fontWeight,
      color: h1Styles.color,
      lineHeight: h1Styles.lineHeight,
      letterSpacing: h1Styles.letterSpacing,
      marginBottom: h1Styles.marginBottom,
    };
  }
  
  // Get paragraphs after h1
  const paragraphs = document.querySelectorAll('h1 ~ p');
  results.paragraphs = [];
  
  paragraphs.forEach((p, i) => {
    const pStyles = window.getComputedStyle(p);
    results.paragraphs.push({
      text: p.textContent,
      fontSize: pStyles.fontSize,
      fontFamily: pStyles.fontFamily,
      fontWeight: pStyles.fontWeight,
      color: pStyles.color,
      lineHeight: pStyles.lineHeight,
      letterSpacing: pStyles.letterSpacing,
      marginBottom: pStyles.marginBottom,
    });
    
    // Check for links and spans inside
    const links = p.querySelectorAll('a');
    const spans = p.querySelectorAll('span');
    
    if (links.length > 0) {
      results[`p${i}_links`] = Array.from(links).map(link => {
        const linkStyles = window.getComputedStyle(link);
        return {
          text: link.textContent,
          color: linkStyles.color,
          backgroundColor: linkStyles.backgroundColor,
          padding: linkStyles.padding,
          borderRadius: linkStyles.borderRadius,
          textDecoration: linkStyles.textDecoration,
          fontWeight: linkStyles.fontWeight,
        };
      });
    }
    
    if (spans.length > 0) {
      results[`p${i}_spans`] = Array.from(spans).map(span => {
        const spanStyles = window.getComputedStyle(span);
        return {
          text: span.textContent,
          color: spanStyles.color,
          backgroundColor: spanStyles.backgroundColor,
          padding: spanStyles.padding,
          borderRadius: spanStyles.borderRadius,
          fontWeight: spanStyles.fontWeight,
        };
      });
    }
  });
  
  // Get the HTML structure
  const main = document.querySelector('main');
  if (main) {
    results.htmlStructure = main.innerHTML.substring(0, 2000); // First 2000 chars
  }
  
  return results;
});

console.log(JSON.stringify(styles, null, 2));

await browser.close();