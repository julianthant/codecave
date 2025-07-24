import dynamic from "next/dynamic";
import { LazyWrapper } from "@/components/LazyWrapper";
import { PageLoading, LoadingSkeleton } from "@/components/ui/loading-spinner";

/**
 * Dynamic imports with optimized loading states
 */

// Heavy components that should be loaded lazily
export const LazyCollaboration = dynamic(
  () => import("@/app/collaboration/_components/Collaboration"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyNetwork = dynamic(
  () => import("@/app/network/_components/Network"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyProjects = dynamic(
  () => import("@/app/projects/_components/Projects"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyProfile = dynamic(
  () => import("@/app/profile/_components/Profile"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyTrending = dynamic(
  () => import("@/app/trending/_components/Trending"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyQA = dynamic(
  () => import("@/app/qa/_components/QA"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyGroups = dynamic(
  () => import("@/app/groups/_components/Groups"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyPricing = dynamic(
  () => import("@/app/pricing/_components/Pricing"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

export const LazyPremium = dynamic(
  () => import("@/app/premium/_components/Premium"),
  {
    loading: () => {
      return <PageLoading />;
    },
    ssr: false,
  }
);

// Code editor components (heavy) - placeholder for future implementation
export const LazyCodeEditor = dynamic(
  () => Promise.resolve({ default: () => <div>Code Editor Placeholder</div> }),
  {
    loading: () => {
      return <LoadingSkeleton className="w-full h-64" />;
    },
    ssr: false,
  }
);

// Chart components (heavy) - placeholder for future implementation
export const LazyChart = dynamic(
  () => Promise.resolve({ default: () => <div>Chart Placeholder</div> }),
  {
    loading: () => {
      return <LoadingSkeleton className="w-full h-48" />;
    },
    ssr: false,
  }
);

// 3D components (very heavy) - placeholder for future implementation
export const Lazy3DViewer = dynamic(
  () => Promise.resolve({ default: () => <div>3D Viewer Placeholder</div> }),
  {
    loading: () => {
      return (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">Loading 3D viewer...</span>
        </div>
      );
    },
    ssr: false,
  }
);

/**
 * Utility function to create lazy components with custom loading states
 */
export function createLazyComponent<T = any>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingComponent?: React.ReactNode,
  enableSSR = true
) {
  return dynamic(importFn, {
    loading: () => {
      return (
        <LazyWrapper fallback={loadingComponent}>
          <></>
        </LazyWrapper>
      );
    },
    ssr: enableSSR,
  });
}

/**
 * Preload a component for better UX
 */
export function preloadComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>
) {
  // Preload on hover or other user intent
  importFn();
}
