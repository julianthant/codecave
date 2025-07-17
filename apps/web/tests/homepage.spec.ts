import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Next.js/);
    
    // Check for the Next.js logo or main content
    await expect(page.locator('main')).toBeVisible();
  });

  test('should display main navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that main content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Check that the page adapts to mobile
    await expect(page.locator('main')).toBeVisible();
    
    // Verify the layout isn't broken
    const main = page.locator('main');
    const boundingBox = await main.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });
}); 