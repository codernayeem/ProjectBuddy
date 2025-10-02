import api from './api'
import {
  Project,
  CreateProjectData,
  UpdateProjectData,
  ProjectMember,
  ProjectGoal,
  ProjectRole,
  Milestone,
  Achievement,
  ApiResponse,
  PaginatedResponse,
  SearchFilters,
  ProjectMemberRole,
  ProjectStatus,
  ProjectCategory,
} from '@/types'

export const projectService = {
  // Create new project
  createProject: async (data: CreateProjectData): Promise<ApiResponse<Project>> => {
    const response = await api.post('/projects', data)
    return response.data
  },

  // Get project by ID
  getProjectById: async (projectId: string): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/projects/${projectId}`)
    return response.data
  },

  // Update project
  updateProject: async (projectId: string, data: UpdateProjectData): Promise<ApiResponse<Project>> => {
    const response = await api.put(`/projects/${projectId}`, data)
    return response.data
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${projectId}`)
    return response.data
  },

  // Get user's projects
  getUserProjects: async (page = 1, limit = 10, status?: ProjectStatus): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    let url = `/projects/my?page=${page}&limit=${limit}`
    if (status) {
      url += `&status=${status}`
    }
    const response = await api.get(url)
    return response.data
  },

  // Search projects
  searchProjects: async (filters: SearchFilters): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, value.toString())
        }
      }
    })
    
    const response = await api.get(`/projects/search?${params}`)
    return response.data
  },

  // Get featured projects
  getFeaturedProjects: async (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const response = await api.get(`/projects/featured?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get trending projects
  getTrendingProjects: async (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const response = await api.get(`/projects/trending?page=${page}&limit=${limit}`)
    return response.data
  },

  // Join project
  joinProject: async (projectId: string): Promise<ApiResponse<ProjectMember>> => {
    const response = await api.post(`/projects/${projectId}/join`)
    return response.data
  },

  // Leave project
  leaveProject: async (projectId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/projects/${projectId}/leave`)
    return response.data
  },

  // Invite user to project
  inviteUser: async (projectId: string, userId: string, role: ProjectMemberRole): Promise<ApiResponse<void>> => {
    const response = await api.post(`/projects/${projectId}/invite`, { userId, role })
    return response.data
  },

  // Get project members
  getProjectMembers: async (projectId: string): Promise<ApiResponse<ProjectMember[]>> => {
    const response = await api.get(`/projects/${projectId}/members`)
    return response.data
  },

  // Update member role
  updateMemberRole: async (projectId: string, userId: string, role: ProjectMemberRole): Promise<ApiResponse<void>> => {
    const response = await api.put(`/projects/${projectId}/members/${userId}/role`, { role })
    return response.data
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`)
    return response.data
  },

  // Upload project images
  uploadImages: async (projectId: string, files: File[]): Promise<ApiResponse<Project>> => {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    
    const response = await api.post(`/projects/${projectId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Project Goals
  createGoal: async (projectId: string, data: { title: string; description?: string; priority?: number }): Promise<ApiResponse<ProjectGoal>> => {
    const response = await api.post(`/projects/${projectId}/goals`, data)
    return response.data
  },

  updateGoal: async (projectId: string, goalId: string, data: { title?: string; description?: string; priority?: number; isCompleted?: boolean }): Promise<ApiResponse<ProjectGoal>> => {
    const response = await api.put(`/projects/${projectId}/goals/${goalId}`, data)
    return response.data
  },

  deleteGoal: async (projectId: string, goalId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${projectId}/goals/${goalId}`)
    return response.data
  },

  // Project Roles
  createRole: async (projectId: string, data: Omit<ProjectRole, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ProjectRole>> => {
    const response = await api.post(`/projects/${projectId}/roles`, data)
    return response.data
  },

  updateRole: async (projectId: string, roleId: string, data: Partial<Omit<ProjectRole, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<ProjectRole>> => {
    const response = await api.put(`/projects/${projectId}/roles/${roleId}`, data)
    return response.data
  },

  deleteRole: async (projectId: string, roleId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${projectId}/roles/${roleId}`)
    return response.data
  },

  // Milestones
  createMilestone: async (projectId: string, data: { title: string; description?: string; dueDate?: string }): Promise<ApiResponse<Milestone>> => {
    const response = await api.post(`/projects/${projectId}/milestones`, data)
    return response.data
  },

  updateMilestone: async (projectId: string, milestoneId: string, data: { title?: string; description?: string; dueDate?: string; status?: string }): Promise<ApiResponse<Milestone>> => {
    const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, data)
    return response.data
  },

  deleteMilestone: async (projectId: string, milestoneId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`)
    return response.data
  },

  // Achievements
  createAchievement: async (milestoneId: string, data: { title: string; description: string; isShared?: boolean }): Promise<ApiResponse<Achievement>> => {
    const response = await api.post(`/milestones/${milestoneId}/achievements`, data)
    return response.data
  },

  updateAchievement: async (achievementId: string, data: { title?: string; description?: string; isShared?: boolean }): Promise<ApiResponse<Achievement>> => {
    const response = await api.put(`/achievements/${achievementId}`, data)
    return response.data
  },

  deleteAchievement: async (achievementId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/achievements/${achievementId}`)
    return response.data
  },

  // Bookmarks
  bookmarkProject: async (projectId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/projects/${projectId}/bookmark`)
    return response.data
  },

  unbookmarkProject: async (projectId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/projects/${projectId}/bookmark`)
    return response.data
  },

  // Get project recommendations
  getRecommendations: async (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Project>>> => {
    const response = await api.get(`/projects/recommendations?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get project analytics
  getAnalytics: async (projectId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/projects/${projectId}/analytics`)
    return response.data
  },
}