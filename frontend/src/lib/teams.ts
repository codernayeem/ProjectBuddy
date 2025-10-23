import api from './api'
import {
  Team,
  CreateTeamData,
  UpdateTeamData,
  TeamMember,
  TeamCustomRole,
  TeamInvitation,
  ApiResponse,
  SearchFilters,
  InvitationStatus,
} from '@/types/types'

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

  // Join team (direct join for public teams without approval)
  joinTeam: async (id: string): Promise<ApiResponse<TeamMember>> => {
    const response = await api.post(`/teams/${id}/join`)
    return response.data
  },

  // Request to join team (requires admin approval)
  requestToJoinTeam: async (id: string, message?: string): Promise<ApiResponse<any>> => {
    const response = await api.post(`/teams/${id}/join-request`, { message })
    return response.data
  },

  // Check if user has a pending join request
  getUserJoinRequestStatus: async (teamId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/teams/${teamId}/join-request/status`)
    return response.data
  },

  // Get team join requests (for admins)
  getTeamJoinRequests: async (teamId: string, status?: string): Promise<ApiResponse<any[]>> => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/teams/${teamId}/join-requests${params}`)
    return response.data
  },

  // Respond to join request (for admins)
  respondToJoinRequest: async (_teamId: string, requestId: string, action: 'accept' | 'reject'): Promise<ApiResponse<void>> => {
    const response = await api.post(`/join-requests/${requestId}/${action}`)
    return response.data
  },

  // Get user's join requests
  getUserJoinRequests: async (status?: string): Promise<ApiResponse<any[]>> => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/teams/my-join-requests${params}`)
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

  updateMemberRole: async (teamId: string, userId: string, isAdmin: boolean): Promise<ApiResponse<void>> => {
    const response = await api.put(`/teams/${teamId}/members/${userId}/role`, { isAdmin })
    return response.data
  },

  removeMember: async (teamId: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`)
    return response.data
  },

  // Team Roles
  getTeamRoles: async (teamId: string): Promise<ApiResponse<TeamCustomRole[]>> => {
    const response = await api.get(`/teams/${teamId}/roles`)
    return response.data
  },

  createRole: async (teamId: string, data: Omit<TeamCustomRole, 'id' | 'teamId' | 'createdAt' | 'updatedAt' | 'team' | 'members'>): Promise<ApiResponse<TeamCustomRole>> => {
    const response = await api.post(`/teams/${teamId}/roles`, data)
    return response.data
  },

  updateRole: async (teamId: string, roleId: string, data: Partial<Omit<TeamCustomRole, 'id' | 'teamId' | 'createdAt' | 'updatedAt' | 'team' | 'members'>>): Promise<ApiResponse<TeamCustomRole>> => {
    const response = await api.put(`/teams/${teamId}/roles/${roleId}`, data)
    return response.data
  },

  deleteRole: async (teamId: string, roleId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/${teamId}/roles/${roleId}`)
    return response.data
  },

  // Member role assignment
  getMemberRoles: async (teamId: string, memberId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/teams/${teamId}/members/${memberId}/roles`)
    return response.data
  },

  assignRoleToMember: async (teamId: string, memberId: string, roleId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/teams/${teamId}/members/${memberId}/roles/${roleId}`)
    return response.data
  },

  removeRoleFromMember: async (teamId: string, memberId: string, roleId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/teams/${teamId}/members/${memberId}/roles/${roleId}`)
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