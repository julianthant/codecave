import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Project } from '@/db/schema'

// Project API response types
interface ProjectsResponse {
  projects: Project[]
}

interface ProjectResponse {
  project: Project
}

interface CreateProjectData {
  name: string
  description?: string
  technologies?: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  isPrivate?: boolean
  language?: string
  stars?: number
  forks?: number
}

interface UpdateProjectData {
  id: string
  updates: Partial<CreateProjectData>
}

// Query keys for consistent caching
export const projectKeys = {
  all: ['projects'] as const,
  user: (userId: string) => ['projects', 'user', userId] as const,
  detail: (id: string) => ['projects', id] as const,
}

// API functions
async function fetchUserProjects(includePrivate: boolean = true): Promise<Project[]> {
  const response = await fetch(`/api/projects?includePrivate=${includePrivate}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data: ProjectsResponse = await response.json()
  return data.projects
}

async function fetchProject(id: string): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Project not found')
    }
    throw new Error('Failed to fetch project')
  }

  const data: ProjectResponse = await response.json()
  return data.project
}

async function createProject(projectData: CreateProjectData): Promise<Project> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create project')
  }

  const data: ProjectResponse = await response.json()
  return data.project
}

async function updateProject({ id, updates }: UpdateProjectData): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update project')
  }

  const data: ProjectResponse = await response.json()
  return data.project
}

async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete project')
  }
}

// Hooks
export function useProjects(includePrivate: boolean = true) {
  return useQuery({
    queryKey: projectKeys.user(includePrivate ? 'all' : 'public'),
    queryFn: () => fetchUserProjects(includePrivate),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if unauthorized
      if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => fetchProject(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry 404 errors
      if (error.message === 'Project not found') {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({
        queryKey: projectKeys.all
      })
      
      // Optimistically add to cache
      queryClient.setQueryData(
        projectKeys.user('all'),
        (old: Project[] | undefined) => old ? [newProject, ...old] : [newProject]
      )
      
      // Cache the individual project
      queryClient.setQueryData(
        projectKeys.detail(newProject.id),
        newProject
      )
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProject,
    onSuccess: (updatedProject, { id }) => {
      // Update individual project cache
      queryClient.setQueryData(
        projectKeys.detail(id),
        updatedProject
      )
      
      // Update projects list cache
      queryClient.setQueryData(
        projectKeys.user('all'),
        (old: Project[] | undefined) => {
          if (!old) return old
          return old.map(project => 
            project.id === id ? updatedProject : project
          )
        }
      )
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: projectKeys.all
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, deletedId) => {
      // Remove from projects list cache
      queryClient.setQueryData(
        projectKeys.user('all'),
        (old: Project[] | undefined) => {
          if (!old) return old
          return old.filter(project => project.id !== deletedId)
        }
      )
      
      // Remove individual project cache
      queryClient.removeQueries({
        queryKey: projectKeys.detail(deletedId)
      })
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: projectKeys.all
      })
    },
  })
}