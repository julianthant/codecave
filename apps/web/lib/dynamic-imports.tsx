import dynamic from "next/dynamic";
import { PageLoading, LoadingSkeleton } from "@/components/ui/loading-spinner";

/**
 * Dynamic imports with optimized loading states
 * These components are lazy-loaded for better performance
 */

// Heavy page components that should be loaded lazily
export const LazyCollaboration = dynamic(
  () => import("@/app/collaboration/_components/Collaboration"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyNetwork = dynamic(
  () => import("@/app/network/_components/Network"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyProjects = dynamic(
  () => import("@/app/projects/_components/Projects"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyProfile = dynamic(
  () => import("@/app/profile/_components/Profile"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyTrending = dynamic(
  () => import("@/app/trending/_components/Trending"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyQA = dynamic(
  () => import("@/app/qa/_components/QA"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyGroups = dynamic(
  () => import("@/app/groups/_components/Groups"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyPricing = dynamic(
  () => import("@/app/pricing/_components/Pricing"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

export const LazyPremium = dynamic(
  () => import("@/app/premium/_components/Premium"),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

// Placeholder components for heavy features (future implementation)
const CodeEditorPlaceholder = () => (
  <div className="flex justify-center items-center bg-gray-100 w-full h-64">
    <span className="text-gray-500">Code Editor (Coming Soon)</span>
  </div>
);

const ChartPlaceholder = () => (
  <div className="flex justify-center items-center bg-gray-100 w-full h-48">
    <span className="text-gray-500">Chart Component (Coming Soon)</span>
  </div>
);

const Viewer3DPlaceholder = () => (
  <div className="flex justify-center items-center bg-gray-100 w-full h-64">
    <span className="text-gray-500">3D Viewer (Coming Soon)</span>
  </div>
);

// Lazy loaded heavy components with loading states
export const LazyCodeEditor = dynamic(
  () => Promise.resolve({ default: CodeEditorPlaceholder }),
  {
    loading: () => <LoadingSkeleton className="w-full h-64" />,
    ssr: false,
  }
);

export const LazyChart = dynamic(
  () => Promise.resolve({ default: ChartPlaceholder }),
  {
    loading: () => <LoadingSkeleton className="w-full h-48" />,
    ssr: false,
  }
);

export const Lazy3DViewer = dynamic(
  () => Promise.resolve({ default: Viewer3DPlaceholder }),
  {
    loading: () => <PageLoading />,
    ssr: false,
  }
);

/**
 * Utility function to create lazy components with custom loading states
 */
export function createLazyComponent<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  loadingComponent?: React.ReactNode,
  enableSSR = true
) {
  return dynamic(importFn, {
    loading: () => <>{loadingComponent || <PageLoading />}</>,
    ssr: enableSSR,
  });
}

/**
 * Preload a component for better UX (call on hover, focus, etc.)
 */
export function preloadComponent(
  importFn: () => Promise<{
    default: React.ComponentType<Record<string, unknown>>;
  }>
) {
  // Trigger the import to preload the component
  importFn().catch(() => {
    // Silently handle preload errors
  });
}
