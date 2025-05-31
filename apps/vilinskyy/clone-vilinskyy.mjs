import { chromium } from '@playwright/test';
import fs from 'fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://vilinskyy.com', { waitUntil: 'networkidle' });

// Extract the hero section specifically
const heroData = await page.evaluate(() => {
  // Find the hero section (usually the first major content area)
  const firstSection = document.querySelector('main > *') || document.querySelector('body > *');
  
  // Get the exact HTML
  const heroHTML = firstSection ? firstSection.outerHTML : 'NOT FOUND';
  
  // Get computed styles for key elements
  const styles = {};
  
  // Get h1 styles
  const h1 = document.querySelector('h1');
  if (h1) {
    const h1Styles = window.getComputedStyle(h1);
    styles.h1 = {
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
  
  // Get paragraph styles
  const paragraphs = document.querySelectorAll('p');
  styles.paragraphs = [];
  
  paragraphs.forEach((p, i) => {
    if (i > 3) return; // Just first few paragraphs
    const pStyles = window.getComputedStyle(p);
    const pData = {
      text: p.textContent,
      fontSize: pStyles.fontSize,
      fontFamily: pStyles.fontFamily,
      fontWeight: pStyles.fontWeight,
      color: pStyles.color,
      lineHeight: pStyles.lineHeight,
      letterSpacing: pStyles.letterSpacing,
      marginBottom: pStyles.marginBottom,
    };
    
    // Check for special elements inside (links, spans with backgrounds)
    const specialElements = p.querySelectorAll('a, span');
    pData.specialElements = [];
    
    specialElements.forEach(el => {
      const elStyles = window.getComputedStyle(el);
      if (elStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' || el.tagName === 'A') {
        pData.specialElements.push({
          tag: el.tagName.toLowerCase(),
          text: el.textContent,
          color: elStyles.color,
          backgroundColor: elStyles.backgroundColor,
          padding: elStyles.padding,
          borderRadius: elStyles.borderRadius,
          textDecoration: elStyles.textDecoration,
        });
      }
    });
    
    styles.paragraphs.push(pData);
  });
  
  // Get CSS variables
  const root = document.documentElement;
  const rootStyles = window.getComputedStyle(root);
  const cssVars = {};
  
  for (let i = 0; i < rootStyles.length; i++) {
    const name = rootStyles[i];
    if (name.startsWith('--')) {
      cssVars[name] = rootStyles.getPropertyValue(name);
    }
  }
  
  // Get all style tags
  const styleTags = Array.from(document.querySelectorAll('style')).map(s => s.textContent);
  
  return {
    heroHTML,
    styles,
    cssVars,
    styleTags,
  };
});

// Save the data
await fs.writeFile('vilinskyy-hero-html.html', heroData.heroHTML);
await fs.writeFile('vilinskyy-styles.json', JSON.stringify(heroData, null, 2));

// Print key findings
console.log('=== VILINSKYY HERO STYLES ===\n');

if (heroData.styles.h1) {
  console.log('H1 HEADING:');
  console.log(`Text: "${heroData.styles.h1.text}"`);
  console.log(`Font: ${heroData.styles.h1.fontSize} ${heroData.styles.h1.fontWeight}`);
  console.log(`Font Family: ${heroData.styles.h1.fontFamily}`);
  console.log(`Color: ${heroData.styles.h1.color}`);
  console.log('---\n');
}

heroData.styles.paragraphs.forEach((p, i) => {
  console.log(`PARAGRAPH ${i + 1}:`);
  console.log(`Text: "${p.text.substring(0, 80)}..."`);
  console.log(`Font: ${p.fontSize} ${p.fontWeight}`);
  console.log(`Font Family: ${p.fontFamily}`);
  console.log(`Color: ${p.color}`);
  
  if (p.specialElements.length > 0) {
    console.log('Special elements:');
    p.specialElements.forEach(el => {
      console.log(`  - <${el.tag}> "${el.text}"`);
      console.log(`    Background: ${el.backgroundColor}`);
      console.log(`    Color: ${el.color}`);
    });
  }
  console.log('---\n');
});

// Show CSS variables if any
if (Object.keys(heroData.cssVars).length > 0) {
  console.log('CSS VARIABLES:');
  Object.entries(heroData.cssVars).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
}

await browser.close();