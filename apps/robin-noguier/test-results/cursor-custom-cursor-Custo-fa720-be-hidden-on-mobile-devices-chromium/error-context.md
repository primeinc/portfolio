# Test info

- Name: Custom Cursor >> should be hidden on mobile devices
- Location: /mnt/c/Users/WillPeters/dev/portfolio/apps/robin-noguier/e2e/cursor/custom-cursor.spec.ts:118:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveCSS(expected)

Locator: locator('[class*="cursor"]:not([class*="cursorDot"])')
Expected string: "none"
Received string: "block"
Call log:
  - expect.toHaveCSS with timeout 5000ms
  - waiting for locator('[class*="cursor"]:not([class*="cursorDot"])')
    8 × locator resolved to <div aria-hidden="true" class="_cursor_g0521_1  "></div>
      - unexpected value "block"

    at /mnt/c/Users/WillPeters/dev/portfolio/apps/robin-noguier/e2e/cursor/custom-cursor.spec.ts:130:26
```

# Page snapshot

```yaml
- banner:
  - heading "R. Brasseur" [level=1]
  - text: International Relations
- main:
  - heading "Rylee Brasseur" [level=1]
  - paragraph: International Relations Student
  - paragraph: Michigan State University | James Madison College
  - text: Scroll to explore 01
  - heading "UN Security Council Reform" [level=2]
  - paragraph: Policy Analysis
  - paragraph: Comprehensive analysis of proposed reforms to the UN Security Council structure and voting mechanisms
  - text: "02"
  - heading "Climate Diplomacy in the Pacific" [level=2]
  - paragraph: Research Paper
  - paragraph: Examining multilateral climate negotiations and small island developing states advocacy
  - text: "03"
  - heading "NATO-EU Relations Study" [level=2]
  - paragraph: Strategic Analysis
  - paragraph: Analysis of transatlantic security cooperation and defense integration challenges
  - text: "04"
  - heading "Model UN Leadership" [level=2]
  - paragraph: Leadership Experience
  - paragraph: Head Delegate representing Germany in Security Council simulation on nuclear non-proliferation
  - text: "05"
  - heading "Refugee Policy Research" [level=2]
  - paragraph: Field Research
  - paragraph: Field study on refugee integration policies in European Union member states
  - navigation:
    - button "01 UN Security Council Reform"
    - button "02 Climate Diplomacy in the Pacific"
    - button "03 NATO-EU Relations Study"
    - button "04 Model UN Leadership"
    - button "05 Refugee Policy Research"
    - button "Theme options":
      - img
      - text: Theme
    - button "Switch to Dark theme": Dark
    - button "Switch to Cyber theme": Cyber
    - button "Switch to Ocean theme": Ocean
    - button "Switch to Sunset theme": Sunset
    - button "Switch to Mono theme": Mono
    - button "Switch to Forest theme": Forest
```

# Test source

```ts
   30 |       '[class*="cursor"]:not([class*="cursorDot"])'
   31 |     )
   32 |
   33 |     // Move mouse to center
   34 |     await page.mouse.move(500, 300)
   35 |     await page.waitForTimeout(200)
   36 |
   37 |     // Get cursor position
   38 |     const transform1 = await cursor.evaluate(
   39 |       (el) => window.getComputedStyle(el).transform
   40 |     )
   41 |
   42 |     // Move mouse to different position
   43 |     await page.mouse.move(700, 400)
   44 |     await page.waitForTimeout(200)
   45 |
   46 |     const transform2 = await cursor.evaluate(
   47 |       (el) => window.getComputedStyle(el).transform
   48 |     )
   49 |
   50 |     // Transforms should be different
   51 |     expect(transform1).not.toBe(transform2)
   52 |   })
   53 |
   54 |   test('should change state on hover over interactive elements', async ({
   55 |     page,
   56 |   }) => {
   57 |     // Wait for cursor to be ready
   58 |     const cursor = await page.locator(
   59 |       '[class*="cursor"]:not([class*="cursorDot"])'
   60 |     )
   61 |     await expect(cursor).toBeAttached()
   62 |
   63 |     // Wait for project buttons to be visible
   64 |     await page.waitForTimeout(2000) // Give time for animations
   65 |     const projectButton = await page.locator('[class*="projectButton"]').first()
   66 |     await expect(projectButton).toBeVisible()
   67 |
   68 |     // Move mouse to a neutral position first
   69 |     await page.mouse.move(50, 50)
   70 |     await page.waitForTimeout(100)
   71 |
   72 |     // Initial state - should not have hovering class
   73 |     const initialClasses = await cursor.getAttribute('class')
   74 |     expect(initialClasses).toMatch(/cursor/)
   75 |     expect(initialClasses).not.toMatch(/hovering/)
   76 |
   77 |     // Hover over project button
   78 |     await projectButton.hover()
   79 |     await page.waitForTimeout(100)
   80 |
   81 |     // Should have hovering class (CSS module class contains 'hovering')
   82 |     const hoverClasses = await cursor.getAttribute('class')
   83 |     expect(hoverClasses).toMatch(/hovering/)
   84 |
   85 |     // Move away
   86 |     await page.mouse.move(50, 50)
   87 |     await page.waitForTimeout(100)
   88 |
   89 |     // Should not have hovering class
   90 |     const afterClasses = await cursor.getAttribute('class')
   91 |     expect(afterClasses).not.toMatch(/hovering/)
   92 |   })
   93 |
   94 |   test('should respond to click events', async ({ page }) => {
   95 |     const cursor = await page.locator(
   96 |       '[class*="cursor"]:not([class*="cursorDot"])'
   97 |     )
   98 |
   99 |     // Initial state
  100 |     const initialClasses = await cursor.getAttribute('class')
  101 |     expect(initialClasses).not.toMatch(/clicking/)
  102 |
  103 |     // Mouse down
  104 |     await page.mouse.down()
  105 |     await page.waitForTimeout(100)
  106 |
  107 |     const clickingClasses = await cursor.getAttribute('class')
  108 |     expect(clickingClasses).toMatch(/clicking/)
  109 |
  110 |     // Mouse up
  111 |     await page.mouse.up()
  112 |     await page.waitForTimeout(100)
  113 |
  114 |     const releasedClasses = await cursor.getAttribute('class')
  115 |     expect(releasedClasses).not.toMatch(/clicking/)
  116 |   })
  117 |
  118 |   test('should be hidden on mobile devices', async ({ page }) => {
  119 |     // Set mobile viewport
  120 |     await page.setViewportSize({ width: 375, height: 667 })
  121 |     await page.reload()
  122 |     await page.waitForLoadState('networkidle')
  123 |
  124 |     const cursor = await page.locator(
  125 |       '[class*="cursor"]:not([class*="cursorDot"])'
  126 |     )
  127 |     const cursorDot = await page.locator('[class*="cursorDot"]')
  128 |
  129 |     // Should be hidden via CSS
> 130 |     await expect(cursor).toHaveCSS('display', 'none')
      |                          ^ Error: Timed out 5000ms waiting for expect(locator).toHaveCSS(expected)
  131 |     await expect(cursorDot).toHaveCSS('display', 'none')
  132 |   })
  133 |
  134 |   test('should respect reduced motion preference', async ({
  135 |     page,
  136 |     context,
  137 |   }) => {
  138 |     // Create new context with reduced motion
  139 |     const newContext = await context.browser()?.newContext({
  140 |       reducedMotion: 'reduce',
  141 |     })
  142 |     if (!newContext) return
  143 |
  144 |     const newPage = await newContext.newPage()
  145 |     await newPage.goto('/')
  146 |
  147 |     // Custom cursor should not be rendered
  148 |     const cursor = await newPage.locator('[class*="cursor"]')
  149 |     await expect(cursor).toHaveCount(0)
  150 |
  151 |     await newContext.close()
  152 |   })
  153 |
  154 |   test('should handle hovering over non-element targets', async ({
  155 |     page,
  156 |     browserName,
  157 |   }) => {
  158 |     // Wait for page to be fully loaded
  159 |     await page.waitForLoadState('networkidle')
  160 |
  161 |     const cursor = await page.locator(
  162 |       '[class*="cursor"]:not([class*="cursorDot"])'
  163 |     )
  164 |
  165 |     // Set up error monitoring BEFORE any interactions
  166 |     const errors: string[] = []
  167 |     page.on('pageerror', (error) => {
  168 |       errors.push(error.message)
  169 |     })
  170 |
  171 |     // Add test elements
  172 |     await page.evaluate(() => {
  173 |       // Add a text node directly to body
  174 |       const textNode = document.createTextNode(' Some text content ')
  175 |       document.body.appendChild(textNode)
  176 |
  177 |       // Add an SVG element
  178 |       const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  179 |       svg.setAttribute('width', '100')
  180 |       svg.setAttribute('height', '100')
  181 |       svg.style.position = 'fixed'
  182 |       svg.style.top = '200px'
  183 |       svg.style.left = '200px'
  184 |       document.body.appendChild(svg)
  185 |     })
  186 |
  187 |     // WebKit needs more time
  188 |     if (browserName === 'webkit') {
  189 |       await page.waitForTimeout(500)
  190 |     }
  191 |
  192 |     try {
  193 |       // Move mouse over document body (might trigger on text nodes)
  194 |       await page.mouse.move(50, 50, { steps: 5 })
  195 |       await page.waitForTimeout(100)
  196 |
  197 |       // Hover over various areas with slower movements for WebKit
  198 |       await page.mouse.move(100, 100, { steps: 5 }) // Might hit text node
  199 |       await page.waitForTimeout(100)
  200 |
  201 |       await page.mouse.move(250, 250, { steps: 5 }) // Over SVG
  202 |       await page.waitForTimeout(100)
  203 |
  204 |       await page.mouse.move(10, 10, { steps: 5 }) // Document edge
  205 |       await page.waitForTimeout(200)
  206 |     } catch (error) {
  207 |       // If WebKit fails on mouse.move, check if it's the known page closed error
  208 |       if (browserName === 'webkit' && error.message.includes('Page closed')) {
  209 |         console.warn(
  210 |           'WebKit page closed during mouse movement - known WSL issue'
  211 |         )
  212 |         // Still check for the actual error we care about
  213 |         const typeErrors = errors.filter((e) =>
  214 |           e.includes('matches is not a function')
  215 |         )
  216 |         expect(typeErrors).toHaveLength(0)
  217 |         return
  218 |       }
  219 |       throw error
  220 |     }
  221 |
  222 |     // Check no errors occurred
  223 |     const typeErrors = errors.filter((e) =>
  224 |       e.includes('matches is not a function')
  225 |     )
  226 |     expect(typeErrors).toHaveLength(0)
  227 |   })
  228 | })
  229 |
```