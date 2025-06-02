# Accurate Website Cloning Using Playwright DOM Inspection

## Objective

Clone the Vilinskyy portfolio site (https://www.vilinskyy.com/) with exact DOM structure and visual fidelity. Critical requirement: verify assumptions through automated DOM inspection, not manual observation or AI-based content extraction.

## Step-by-Step Process

### 1. Initial Setup and Screenshot Capture

```bash
# Install Playwright in the project
cd /home/will/local_dev/portfolio/apps/vilinskyy
npm install playwright

# Capture screenshots of both sites for comparison
npx playwright screenshot https://www.vilinskyy.com screenshot-real-site.png --wait-for-timeout 2000
npx playwright screenshot http://localhost:5174 screenshot-current-state.png --wait-for-timeout 2000
```

### 2. DOM Structure Extraction

Create a Playwright script to extract complete DOM structure with all class names, IDs, and hierarchy:

```javascript
// extract-hero-structure.mjs
import { chromium } from 'playwright'
import fs from 'fs'

const extractDOMStructure = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://www.vilinskyy.com')

  const structure = await page.evaluate(() => {
    const extractNode = (node) => ({
      tag: node.tagName,
      id: node.id,
      className: node.className,
      text: node.textContent?.trim().substring(0, 50),
      attributes: Array.from(node.attributes).map((attr) => ({
        name: attr.name,
        value: attr.value,
      })),
      children: Array.from(node.children).map(extractNode),
    })

    return extractNode(document.querySelector('.main_aboutme'))
  })

  fs.writeFileSync(
    'real-site-dom-structure.json',
    JSON.stringify(structure, null, 2)
  )
  await browser.close()
}
```

### 3. First Element Verification

Create a script to identify and highlight the first visible element on the page:

```javascript
// inspect-first-element.mjs
const firstElementInfo = await page.evaluate(() => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT
        if (['SCRIPT', 'STYLE'].includes(node.parentElement.tagName))
          return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    }
  )

  let node
  while ((node = walker.nextNode())) {
    const parent = node.parentElement
    const rect = parent.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0 && rect.top >= 0) {
      // Build complete DOM path
      let path = []
      let current = parent
      while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase()
        if (current.id) selector += '#' + current.id
        if (current.className)
          selector += '.' + current.className.split(' ').join('.')
        path.unshift(selector)
        current = current.parentElement
      }

      return {
        text: parent.textContent.trim(),
        tagName: parent.tagName,
        className: parent.className,
        domPath: path.join(' > '),
        outerHTML: parent.outerHTML,
      }
    }
  }
})
```

### 4. Visual Verification with Effects

Add visual effects to confirm element identification:

```javascript
// Make first element shimmer and explode for visual confirmation
await page.evaluate((element) => {
  element.style.animation = 'shimmer 2s linear infinite'
  element.style.background =
    'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
  element.style.backgroundClip = 'text'
  element.style.webkitTextFillColor = 'transparent'

  setTimeout(() => {
    element.style.animation = 'explode 1s ease-out forwards'
  }, 2000)
}, firstElement)
```

### 5. Key Findings from DOM Inspection

**Real Site Structure:**

```
div.two_columns
  └── div.main_aboutme.slide-from-bottom
      ├── div.header
      │   ├── h1.h3 "Alexander Vilinskyy"  ← FIRST VISIBLE ELEMENT
      │   └── div.horizontal_flex
      │       └── div.body_text.small_text (description with links)
      ├── div.logos-block
      │   └── div.logos_grid-2 (6 logo links)
      ├── div.logos_grid (5 logo links)
      └── div.loom-holder
          └── div.loom_video_emb.w-embed.w-iframe
              └── iframe.loom_video_emb
```

**Critical Discoveries:**

1. First visible text: "Alexander Vilinskyy" (NOT "Video Intro")
2. "Video Intro" appears later in the DOM as: `h1.h3.loom-title > a.paragraphlink`
3. Two-column layout wrapper exists at root level
4. Two separate logo grids before video embed
5. Loom video uses iframe embed, not custom player

### 6. Implementation Requirements

1. **Exact DOM Replication**: Match tag names, class names, and hierarchy precisely
2. **CSS Class Preservation**: Use real site's class names (h3, main_aboutme, logos_grid-2, etc.)
3. **Content Order**: Alexander Vilinskyy → Description → Logo Grids → Loom Video
4. **Asset URLs**: Use CDN URLs from real site for logos
5. **Responsive Structure**: Maintain grid layouts that adapt to screen size

### 7. Validation Process

After implementation, verify accuracy by:

1. Taking screenshots at multiple scroll positions
2. Comparing DOM structure using Playwright's element selectors
3. Checking first visible element matches expected text
4. Ensuring all interactive elements (links, video) function correctly

## Key Lesson

Never trust visual appearance or AI-extracted content alone. Always use automated DOM inspection tools to verify exact structure, element order, and class names when cloning websites. The DOM is the source of truth, not what appears visually prominent.

## Common Pitfalls to Avoid

1. **Assuming Visual Order = DOM Order**: Elements may be visually repositioned with CSS
2. **Trusting AI Content Extraction**: Tools like WebFetch may miss structural details
3. **Ignoring Wrapper Elements**: Parent containers affect layout and styling
4. **Missing Class Combinations**: Elements often have multiple classes that work together
5. **Overlooking Hidden Elements**: Some elements may be present but not immediately visible

## Recommended Workflow

1. **Inspect First**: Always start with DOM inspection, not visual analysis
2. **Extract Structure**: Get complete DOM tree with all attributes
3. **Verify Visually**: Use screenshots to confirm your understanding
4. **Test Interactively**: Use visual effects to confirm element selection
5. **Compare Results**: Take screenshots of both sites at same viewport sizes
6. **Iterate Based on Data**: Let DOM inspection drive your implementation
