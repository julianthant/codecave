import { Suspense } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";

/**
 * Enhanced Suspense wrapper with performance optimizations
 */
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

export function LazyWrapper({ 
  children, 
  fallback, 
  minHeight = "200px" 
}: LazyWrapperProps) {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center w-full"
      style={{ minHeight }}
    >
      <LoadingSpinner />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}

/**
 * Intersection Observer based lazy loading for heavy components
 */
interface IntersectionLazyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function IntersectionLazy({
  children,
  fallback
}: IntersectionLazyProps) {
  return (
    <div className="min-h-[200px]">
      <LazyWrapper fallback={fallback}>
        {children}
      </LazyWrapper>
    </div>
  );
}
