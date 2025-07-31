import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type FeedAlgorithm =
  | "algorithm"
  | "following"
  | "trending"
  | "latest"
  | "showcase"
  | "collaborations";

export interface FeedFilters {
  languages: string[];
  tags: string[];
  postTypes: (
    | "article"
    | "snippet"
    | "showcase"
    | "discussion"
    | "collaboration"
  )[];
  timeRange?: "24h" | "7d" | "30d" | "all";
}

interface FeedState {
  algorithm: FeedAlgorithm;
  filters: FeedFilters;
  searchQuery: string;

  // Actions
  setAlgorithm: (algorithm: FeedAlgorithm) => void;
  setFilters: (filters: Partial<FeedFilters>) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const defaultFilters: FeedFilters = {
  languages: [],
  tags: [],
  postTypes: [],
  timeRange: "all",
};

export const useFeedStore = create<FeedState>()(
  devtools(
    (set) => ({
      algorithm: "algorithm",
      filters: defaultFilters,
      searchQuery: "",

      setAlgorithm: (algorithm) => set({ algorithm }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: "feed-store",
    }
  )
);
