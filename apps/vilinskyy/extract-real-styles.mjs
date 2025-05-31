import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' });

// Extract styles and content
const data = await page.evaluate(() => {
  const results = {
    elements: []
  };
  
  // Find the main content area
  const mainContent = document.querySelector('main') || document.querySelector('body');
  
  // Get all text elements in order
  const textElements = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
  
  textElements.forEach((el, index) => {
    const computed = window.getComputedStyle(el);
    const parentTagName = el.parentElement?.tagName.toLowerCase();
    
    const elementData = {
      index,
      tagName: el.tagName.toLowerCase(),
      text: el.textContent.trim(),
      parentTag: parentTagName,
      styles: {
        fontSize: computed.fontSize,
        fontFamily: computed.fontFamily,
        fontWeight: computed.fontWeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        padding: computed.padding,
        margin: computed.margin,
        display: computed.display,
        textDecoration: computed.textDecoration,
        borderRadius: computed.borderRadius,
      },
      // Check if element has visible background
      hasBackground: computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                     computed.backgroundColor !== 'transparent' &&
                     computed.backgroundColor !== 'rgb(255, 255, 255)'
    };
    
    // Only include elements with actual text content
    if (elementData.text.length > 0) {
      results.elements.push(elementData);
    }
  });
  
  // Get body styles for overall page styling
  const bodyStyles = window.getComputedStyle(document.body);
  results.bodyStyles = {
    fontFamily: bodyStyles.fontFamily,
    fontSize: bodyStyles.fontSize,
    color: bodyStyles.color,
    backgroundColor: bodyStyles.backgroundColor,
  };
  
  return results;
});

// Print results
console.log('=== VILINSKYY.COM STYLES ===\n');

// Find Alexander Vilinskyy heading
const heading = data.elements.find(el => el.text.includes('Alexander Vilinskyy'));
if (heading) {
  console.log('MAIN HEADING:');
  console.log(`Text: "${heading.text}"`);
  console.log(`Tag: ${heading.tagName}`);
  console.log(`Font Size: ${heading.styles.fontSize}`);
  console.log(`Font Family: ${heading.styles.fontFamily}`);
  console.log(`Font Weight: ${heading.styles.fontWeight}`);
  console.log(`Color: ${heading.styles.color}`);
  console.log('---\n');
}

// Find description paragraphs
const descriptions = data.elements.filter(el => 
  el.tagName === 'p' && 
  (el.text.includes('Digital designer') || el.text.includes('Bootstrapped'))
);

descriptions.forEach((desc, i) => {
  console.log(`PARAGRAPH ${i + 1}:`);
  console.log(`Text: "${desc.text.substring(0, 100)}..."`);
  console.log(`Font Size: ${desc.styles.fontSize}`);
  console.log(`Font Family: ${desc.styles.fontFamily}`);
  console.log(`Font Weight: ${desc.styles.fontWeight}`);
  console.log(`Color: ${desc.styles.color}`);
  console.log('---\n');
});

// Find elements with red backgrounds
const redElements = data.elements.filter(el => el.hasBackground);
console.log('ELEMENTS WITH BACKGROUNDS:');
redElements.forEach(el => {
  console.log(`Text: "${el.text}"`);
  console.log(`Background: ${el.styles.backgroundColor}`);
  console.log(`Padding: ${el.styles.padding}`);
  console.log(`Border Radius: ${el.styles.borderRadius}`);
  console.log('---\n');
});

await browser.close();