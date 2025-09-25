# Web Menu URL Support - Implementation Plan

## User Experience
1. **Input Options**: Camera capture OR URL input
2. **URL Processing**: Parse web menus from QR codes/links
3. **Category Navigation**: Handle paginated/tabbed menus
4. **Fallback**: Screenshot capture for complex sites

## Technical Approach

### Option 1: Browser Automation (Puppeteer)
```typescript
// /api/parse-url
export async function POST(req: NextRequest) {
  const { url, preferredLanguage } = await req.json();

  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate and wait for content
  await page.goto(url);
  await page.waitForSelector('[data-menu-item]', { timeout: 10000 });

  // Extract categories
  const categories = await page.$$eval('.category-tab', els =>
    els.map(el => ({ name: el.textContent, url: el.href }))
  );

  // Navigate through each category
  for (const category of categories) {
    await page.click(`[data-category="${category.name}"]`);
    await page.waitForTimeout(2000);

    // Extract items from this category
    const items = await page.$$eval('.menu-item', els =>
      els.map(el => ({
        name: el.querySelector('.item-name')?.textContent,
        description: el.querySelector('.item-description')?.textContent,
        price: el.querySelector('.item-price')?.textContent,
        image: el.querySelector('img')?.src
      }))
    );

    // Add to menu structure
  }

  await browser.close();
}
```

### Option 2: Screenshot + OCR Hybrid
```typescript
// Take screenshots of each category page
const screenshots = [];
for (const category of categories) {
  await page.click(category.selector);
  await page.waitForTimeout(2000);

  const screenshot = await page.screenshot({ fullPage: true });
  screenshots.push({
    category: category.name,
    image: screenshot
  });
}

// Process screenshots with existing Claude pipeline
const menuSections = [];
for (const screenshot of screenshots) {
  const section = await parseImageWithClaude(screenshot.image, preferredLanguage);
  section.id = screenshot.category;
  menuSections.push(section);
}
```

## Implementation Priority

### Phase 1: Basic URL Input
- Add URL input field to camera interface
- Simple GET request + HTML parsing for basic menus
- Fallback to screenshot if JavaScript-heavy

### Phase 2: Advanced Web Parsing
- Puppeteer integration for dynamic content
- Category pagination handling
- Structured data extraction

### Phase 3: QR Code Detection
- Scan QR codes from camera
- Auto-detect menu URLs
- Seamless URL → menu parsing

## Challenges & Solutions

1. **Dynamic Content**: Use Puppeteer with proper wait strategies
2. **Rate Limiting**: Implement caching and request throttling
3. **CORS Issues**: Use server-side parsing only
4. **Complex Sites**: Fallback to screenshot + OCR
5. **Category Pagination**: Iterate through all tabs/pages

## Benefits
- ✅ Support modern digital menus
- ✅ Better data extraction from structured sources
- ✅ Handle multi-category restaurants
- ✅ No image quality issues
- ✅ Direct integration with restaurant systems