import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isCollapsed: boolean
  isViewingPost: boolean
  setCollapsed: (collapsed: boolean) => void
  setViewingPost: (viewing: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      isViewingPost: false,
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setViewingPost: (viewing) => set({ isViewingPost: viewing }),
    }),
    {
      name: 'sidebar-preferences',
    }
  )
)