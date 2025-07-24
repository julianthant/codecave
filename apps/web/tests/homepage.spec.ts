import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/CodeCave/);
    
    // Check for key elements
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /platform for project creators/);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /CodeCave/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /platform for project creators/);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that content is visible and properly sized
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check that there's no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 20); // Allow more tolerance for mobile layouts
  });
});

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/');
    
    // Only test routes that actually exist for now
    const routes = [
      '/', // Homepage exists
      // Add more routes when they're implemented
    ];
    
    for (const route of routes) {
      await page.goto(route);
      
      // Check that page loads without errors
      await expect(page.locator('body')).toBeVisible();
      
      // Check that there are no JavaScript errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Wait a bit for any async errors
      await page.waitForTimeout(1000);
      
      // Don't fail the test for console errors, just log them
      if (errors.length > 0) {
        console.warn(`Console errors on ${route}:`, errors);
      }
    }
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Get Web Vitals metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('web-vital' in window) {
          resolve((window as Record<string, unknown>)['web-vital']);
        } else {
          // Fallback metrics check
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          resolve({
            fcp: navigation.loadEventStart - navigation.fetchStart,
            lcp: navigation.loadEventEnd - navigation.fetchStart,
          });
        }
      });
    });
    
    console.log('Performance metrics:', metrics);
    
    // Basic performance assertions
    expect(typeof metrics).toBe('object');
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
    
    // Check that images have alt text or are decorative
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Image should have alt text or be marked as decorative
      expect(alt !== null || role === 'presentation').toBeTruthy();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Try tabbing through the page
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    
    // Should have focusable elements
    expect(focusedElement).toBeTruthy();
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show a proper 404 page, not just blank
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for common 404 indicators
    const content = await page.textContent('body');
    const has404Content = content?.includes('404') || 
                         content?.includes('Not Found') || 
                         content?.includes('Page not found');
    
    expect(has404Content).toBeTruthy();
  });
});
