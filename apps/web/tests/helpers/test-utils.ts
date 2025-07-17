import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for CodeCave.tech E2E tests
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for the page to be fully loaded including all network requests
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * Simulate user authentication (for future implementation)
   */
  async loginUser(email: string, password: string): Promise<void> {
    // This will be implemented when auth is ready
    // await this.page.goto('/login');
    // await this.page.fill('[data-testid="email"]', email);
    // await this.page.fill('[data-testid="password"]', password);
    // await this.page.click('[data-testid="login-button"]');
    // await this.waitForPageLoad();
    throw new Error('Authentication not implemented yet');
  }

  /**
   * Check if element is visible and within viewport
   */
  async isElementVisibleInViewport(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    const boundingBox = await element.boundingBox();
    const viewportSize = this.page.viewportSize();
    
    if (!boundingBox || !viewportSize) return false;
    
    return (
      boundingBox.x >= 0 &&
      boundingBox.y >= 0 &&
      boundingBox.x + boundingBox.width <= viewportSize.width &&
      boundingBox.y + boundingBox.height <= viewportSize.height
    );
  }

  /**
   * Test responsive breakpoints
   */
  async testResponsiveBreakpoints(testFn: () => Promise<void>): Promise<void> {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ];

    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({ 
        width: breakpoint.width, 
        height: breakpoint.height 
      });
      
      await testFn();
    }
  }

  /**
   * Verify page performance metrics are within acceptable limits
   */
  async checkPerformanceMetrics(): Promise<void> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      };
    });

    // Assert reasonable load times (adjust thresholds as needed)
    expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
  }
}

/**
 * Test data factory for consistent test data
 */
export const TestData = {
  users: {
    testUser: {
      email: 'test@codecave.tech',
      password: 'testpassword123',
      name: 'Test User',
    },
    adminUser: {
      email: 'admin@codecave.tech',
      password: 'adminpassword123',
      name: 'Admin User',
    },
  },
  
  codeSnippets: {
    javascript: {
      title: 'Hello World Function',
      description: 'A simple hello world function in JavaScript',
      code: `function helloWorld() {\n  console.log('Hello, World!');\n}`,
      language: 'javascript',
      tags: ['hello-world', 'function', 'javascript'],
    },
    python: {
      title: 'Fibonacci Sequence',
      description: 'Generate Fibonacci sequence in Python',
      code: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)`,
      language: 'python',
      tags: ['fibonacci', 'recursion', 'python'],
    },
  },
};

/**
 * Custom Playwright matchers for CodeCave-specific assertions
 */
export const customMatchers = {
  /**
   * Check if a code snippet is properly syntax highlighted
   */
  async toHaveSyntaxHighlighting(locator: any) {
    const element = await locator.elementHandle();
    const hasHighlighting = await element?.evaluate((el: Element) => {
      const highlightedElements = el.querySelectorAll('.token, .hljs-keyword, .keyword');
      return highlightedElements.length > 0;
    });
    
    return {
      pass: !!hasHighlighting,
      message: () => `Expected element to have syntax highlighting`,
    };
  },
}; 