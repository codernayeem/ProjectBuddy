import api from './api'
import {
  Team,
  CreateTeamData,
  UpdateTeamData,
  TeamMember,
  TeamRole,
  TeamInvitation,
  ApiResponse,
  SearchFilters,
  TeamMemberRole,
  TeamType,
  TeamVisibility,
  InvitationStatus,
} from '@/types'

export const teamService = {
  // Get teams with filtering
  getTeams: async (filters: SearchFilters): Promise<ApiResponse<Team[]>> => {
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

    const response = await api.get(`/teams?${params}`)
    return response.data
  },

  // Get user's teams
  getUserTeams: async (page = 1, limit = 10): Promise<ApiResponse<Team[]>> => {
    const response = await api.get(`/teams/my-teams?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get team by ID
  getTeamById: async (id: string): Promise<ApiResponse<Team>> => {
    const response = await api.get(`/teams/${id}`)
    return response.data
  },

  // Create team
  createTeam: async (data: CreateTeamData): Promise<ApiResponse<Team>> => {
    const response = await api.post('/teams', data)
    return response.data
  },

  // Update team
  updateTeam: async (id: string, data: UpdateTeamData): Promise<ApiResponse<Team>> => {
    const response = await api.put(`/teams/${id}`, data)
    return response.data
  },

  // Delete team
  deleteTeam: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/${id}`)
    return response.data
  },

  // Join team
  joinTeam: async (id: string): Promise<ApiResponse<TeamMember>> => {
    const response = await api.post(`/teams/${id}/join`)
    return response.data
  },

  // Leave team
  leaveTeam: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/teams/${id}/leave`)
    return response.data
  },

  // Upload team avatar
  uploadAvatar: async (teamId: string, file: File): Promise<ApiResponse<Team>> => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post(`/teams/${teamId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Upload team banner
  uploadBanner: async (teamId: string, file: File): Promise<ApiResponse<Team>> => {
    const formData = new FormData()
    formData.append('banner', file)
    
    const response = await api.post(`/teams/${teamId}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Team Members
  getTeamMembers: async (teamId: string): Promise<ApiResponse<TeamMember[]>> => {
    const response = await api.get(`/teams/${teamId}/members`)
    return response.data
  },

  updateMemberRole: async (teamId: string, userId: string, role: TeamMemberRole): Promise<ApiResponse<void>> => {
    const response = await api.put(`/teams/${teamId}/members/${userId}/role`, { role })
    return response.data
  },

  removeMember: async (teamId: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`)
    return response.data
  },

  // Team Roles
  createRole: async (teamId: string, data: Omit<TeamRole, 'id' | 'teamId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<TeamRole>> => {
    const response = await api.post(`/teams/${teamId}/roles`, data)
    return response.data
  },

  updateRole: async (teamId: string, roleId: string, data: Partial<Omit<TeamRole, 'id' | 'teamId' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<TeamRole>> => {
    const response = await api.put(`/teams/${teamId}/roles/${roleId}`, data)
    return response.data
  },

  deleteRole: async (teamId: string, roleId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/${teamId}/roles/${roleId}`)
    return response.data
  },

  // Team Invitations
  inviteToTeam: async (teamId: string, data: {
    inviteeId?: string
    email?: string
    roleId?: string
    message?: string
  }): Promise<ApiResponse<TeamInvitation>> => {
    const response = await api.post(`/teams/${teamId}/invite`, data)
    return response.data
  },

  respondToInvitation: async (invitationId: string, action: 'accept' | 'decline'): Promise<ApiResponse<void>> => {
    const response = await api.post(`/teams/invitations/${invitationId}/${action}`)
    return response.data
  },

  cancelInvitation: async (invitationId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/invitations/${invitationId}`)
    return response.data
  },

  getUserInvitations: async (status?: InvitationStatus): Promise<ApiResponse<TeamInvitation[]>> => {
    const params = status ? `?status=${status}` : ''
    const response = await api.get(`/teams/invitations${params}`)
    return response.data
  },

  getTeamInvitations: async (teamId: string, status?: InvitationStatus): Promise<ApiResponse<TeamInvitation[]>> => {
    const params = status ? `?status=${status}` : ''
    const response = await api.get(`/teams/${teamId}/invitations${params}`)
    return response.data
  },

  // Team Recommendations
  getRecommendations: async (page = 1, limit = 10): Promise<ApiResponse<Team[]>> => {
    const response = await api.get(`/teams/recommendations?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get trending teams
  getTrendingTeams: async (page = 1, limit = 10): Promise<ApiResponse<Team[]>> => {
    const response = await api.get(`/teams/trending?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get featured teams
  getFeaturedTeams: async (page = 1, limit = 10): Promise<ApiResponse<Team[]>> => {
    const response = await api.get(`/teams/featured?page=${page}&limit=${limit}`)
    return response.data
  },

  // Search teams
  searchTeams: async (filters: SearchFilters): Promise<ApiResponse<Team[]>> => {
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
    
    const response = await api.get(`/teams/search?${params}`)
    return response.data
  },

  // Get team analytics
  getAnalytics: async (teamId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/teams/${teamId}/analytics`)
    return response.data
  },
}