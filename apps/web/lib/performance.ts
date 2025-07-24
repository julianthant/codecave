/**
 * Performance optimization utilities
 */

import { unstable_cache as cache } from "next/cache";

/**
 * Cache wrapper for expensive operations
 */
export function createCachedFunction<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: string[],
  revalidate?: number
) {
  return cache(fn, keyParts, {
    revalidate: revalidate || 3600, // 1 hour default
    tags: keyParts,
  });
}

/**
 * Debounce function for search and other user inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Intersection Observer hook for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === "undefined") return null;

  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  });
}

/**
 * Resource hints for better loading performance
 */
export function preloadResource(href: string, as: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

export function prefetchResource(href: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check connection quality for adaptive loading
 */
export function getConnectionType() {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return "unknown";
  }

  const connection = (navigator as { connection?: { effectiveType?: string } })
    .connection;
  return connection?.effectiveType || "unknown";
}

/**
 * Memory and performance monitoring
 */
export function getPerformanceMetrics() {
  if (typeof performance === "undefined") return null;

  return {
    memory: (performance as { memory?: Record<string, unknown> }).memory,
    navigation: performance.getEntriesByType("navigation")[0],
    paint: performance.getEntriesByType("paint"),
  };
}

/**
 * Bundle size optimization - remove in production
 */
export function logBundleSize() {
  if (process.env.NODE_ENV === "development") {
    console.log("Bundle analysis available at: http://localhost:8888");
  }
}
