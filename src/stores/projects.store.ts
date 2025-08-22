import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Project } from '@/db/schema'

interface ProjectState {
  // Current projects data
  projects: Project[]
  currentProject: Project | null
  
  // UI state
  isLoading: boolean
  error: string | null
  isProjectModalOpen: boolean
  editingProject: Project | null
  
  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, project: Project) => void
  removeProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Modal actions
  openProjectModal: (project?: Project) => void
  closeProjectModal: () => void
  
  // Reset state
  resetState: () => void
}

export const useProjectsStore = create<ProjectState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        projects: [],
        currentProject: null,
        isLoading: false,
        error: null,
        isProjectModalOpen: false,
        editingProject: null,
        
        // Actions
        setProjects: (projects) => set((state) => {
          state.projects = projects
          state.error = null
        }),
        
        addProject: (project) => set((state) => {
          state.projects.unshift(project) // Add to beginning
          state.error = null
        }),
        
        updateProject: (id, updatedProject) => set((state) => {
          const index = state.projects.findIndex(p => p.id === id)
          if (index !== -1) {
            state.projects[index] = updatedProject
          }
          
          // Update current project if it's the one being updated
          if (state.currentProject?.id === id) {
            state.currentProject = updatedProject
          }
          
          state.error = null
        }),
        
        removeProject: (id) => set((state) => {
          state.projects = state.projects.filter(p => p.id !== id)
          
          // Clear current project if it's the one being removed
          if (state.currentProject?.id === id) {
            state.currentProject = null
          }
          
          state.error = null
        }),
        
        setCurrentProject: (project) => set((state) => {
          state.currentProject = project
        }),
        
        setLoading: (loading) => set((state) => {
          state.isLoading = loading
        }),
        
        setError: (error) => set((state) => {
          state.error = error
          state.isLoading = false
        }),
        
        // Modal actions
        openProjectModal: (project) => set((state) => {
          state.isProjectModalOpen = true
          state.editingProject = project || null
        }),
        
        closeProjectModal: () => set((state) => {
          state.isProjectModalOpen = false
          state.editingProject = null
        }),
        
        // Reset state
        resetState: () => set((state) => {
          state.projects = []
          state.currentProject = null
          state.isLoading = false
          state.error = null
          state.isProjectModalOpen = false
          state.editingProject = null
        }),
      })),
      {
        name: 'projects-storage',
        partialize: (state) => ({ 
          projects: state.projects,
          currentProject: state.currentProject
        }),
      }
    ),
    { name: 'projects-store' }
  )
)