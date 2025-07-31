import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        profile: null,
        isLoading: true,
        isInitialized: false,

        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isLoading = false;
          }),

        setProfile: (profile) =>
          set((state) => {
            state.profile = profile;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        initialize: () =>
          set((state) => {
            state.isInitialized = true;
            state.isLoading = false;
          }),

        reset: () =>
          set((state) => {
            state.user = null;
            state.profile = null;
            state.isLoading = false;
          }),
      })),
      {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);
