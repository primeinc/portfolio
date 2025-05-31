import { chromium } from '@playwright/test';
import fs from 'fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' });

// Get the full page HTML first
const fullHTML = await page.content();
await fs.writeFile('vilinskyy-full-page.html', fullHTML);

// Find the Alexander Vilinskyy heading and extract the hero section
const heroData = await page.evaluate(() => {
  // Find the heading
  const allElements = document.querySelectorAll('*');
  let alexanderHeading = null;
  
  for (const el of allElements) {
    if (el.textContent && el.textContent.trim() === 'Alexander Vilinskyy') {
      alexanderHeading = el;
      break;
    }
  }
  
  if (!alexanderHeading) {
    return { error: 'Could not find Alexander Vilinskyy heading' };
  }
  
  // Get the parent section
  let heroSection = alexanderHeading;
  while (heroSection && heroSection.parentElement) {
    if (heroSection.parentElement.tagName === 'SECTION' || 
        heroSection.parentElement.tagName === 'DIV' && 
        heroSection.parentElement.children.length > 3) {
      heroSection = heroSection.parentElement;
      break;
    }
    heroSection = heroSection.parentElement;
  }
  
  // Extract styles
  const h1Styles = window.getComputedStyle(alexanderHeading);
  const result = {
    heroHTML: heroSection.outerHTML,
    heading: {
      tag: alexanderHeading.tagName.toLowerCase(),
      text: alexanderHeading.textContent,
      styles: {
        fontSize: h1Styles.fontSize,
        fontFamily: h1Styles.fontFamily,
        fontWeight: h1Styles.fontWeight,
        color: h1Styles.color,
        lineHeight: h1Styles.lineHeight,
        letterSpacing: h1Styles.letterSpacing,
        textTransform: h1Styles.textTransform,
      }
    },
    nextElements: []
  };
  
  // Get next siblings (paragraphs after heading)
  let nextEl = alexanderHeading.nextElementSibling;
  let count = 0;
  
  while (nextEl && count < 5) {
    const nextStyles = window.getComputedStyle(nextEl);
    const elementData = {
      tag: nextEl.tagName.toLowerCase(),
      text: nextEl.textContent,
      styles: {
        fontSize: nextStyles.fontSize,
        fontFamily: nextStyles.fontFamily,
        fontWeight: nextStyles.fontWeight,
        color: nextStyles.color,
        lineHeight: nextStyles.lineHeight,
        letterSpacing: nextStyles.letterSpacing,
        marginBottom: nextStyles.marginBottom,
      },
      children: []
    };
    
    // Check for special children (links, spans with styling)
    const specialChildren = nextEl.querySelectorAll('a, span, mark');
    specialChildren.forEach(child => {
      const childStyles = window.getComputedStyle(child);
      elementData.children.push({
        tag: child.tagName.toLowerCase(),
        text: child.textContent,
        styles: {
          color: childStyles.color,
          backgroundColor: childStyles.backgroundColor,
          padding: childStyles.padding,
          borderRadius: childStyles.borderRadius,
          textDecoration: childStyles.textDecoration,
          fontWeight: childStyles.fontWeight,
        }
      });
    });
    
    result.nextElements.push(elementData);
    nextEl = nextEl.nextElementSibling;
    count++;
  }
  
  return result;
});

// Save hero HTML
if (heroData.heroHTML) {
  await fs.writeFile('vilinskyy-hero-section.html', heroData.heroHTML);
}

// Print findings
console.log('=== VILINSKYY HERO SECTION ===\n');

if (heroData.error) {
  console.log('ERROR:', heroData.error);
} else {
  console.log('HEADING:');
  console.log(`Tag: <${heroData.heading.tag}>`);
  console.log(`Text: "${heroData.heading.text}"`);
  console.log(`Font: ${heroData.heading.styles.fontSize} ${heroData.heading.styles.fontWeight} ${heroData.heading.styles.fontFamily}`);
  console.log(`Color: ${heroData.heading.styles.color}`);
  console.log('---\n');
  
  heroData.nextElements.forEach((el, i) => {
    console.log(`ELEMENT ${i + 1} (<${el.tag}>):`);
    console.log(`Text: "${el.text.substring(0, 80)}..."`);
    console.log(`Font: ${el.styles.fontSize} ${el.styles.fontFamily}`);
    console.log(`Color: ${el.styles.color}`);
    
    if (el.children.length > 0) {
      console.log('Special children:');
      el.children.forEach(child => {
        console.log(`  - <${child.tag}> "${child.text}"`);
        if (child.styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          console.log(`    Background: ${child.styles.backgroundColor}`);
          console.log(`    Padding: ${child.styles.padding}`);
        }
      });
    }
    console.log('---\n');
  });
}

await browser.close();