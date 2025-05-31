import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' });

// Get the first few elements which should be the hero section
const heroData = await page.evaluate(() => {
  const results = [];
  
  // Get first 20 elements to capture the hero
  const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span');
  
  for (let i = 0; i < Math.min(20, elements.length); i++) {
    const el = elements[i];
    const computed = window.getComputedStyle(el);
    
    // Skip if no text
    if (!el.textContent.trim()) continue;
    
    results.push({
      index: i,
      tag: el.tagName.toLowerCase(),
      text: el.textContent.trim(),
      html: el.outerHTML,
      styles: {
        fontSize: computed.fontSize,
        fontFamily: computed.fontFamily,
        fontWeight: computed.fontWeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        borderRadius: computed.borderRadius,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
      },
      parent: {
        tag: el.parentElement?.tagName.toLowerCase(),
        class: el.parentElement?.className
      }
    });
  }
  
  return results;
});

// Display hero section elements
console.log('=== HERO SECTION ELEMENTS ===\n');

heroData.forEach(item => {
  console.log(`[${item.index}] <${item.tag}> in <${item.parent.tag}>`);
  console.log(`Text: "${item.text.substring(0, 80)}${item.text.length > 80 ? '...' : ''}"`);
  console.log(`Font: ${item.styles.fontSize} ${item.styles.fontWeight} ${item.styles.fontFamily}`);
  console.log(`Color: ${item.styles.color}`);
  if (item.styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    console.log(`Background: ${item.styles.backgroundColor}`);
  }
  console.log('---\n');
});

await browser.close();