import api from './api'
import {
  ApiResponse,
  PaginatedResponse,
  SearchFilters,
  DashboardStats,
  ActivityItem,
  UserAnalytics,
  ProjectAnalytics,
  TeamAnalytics,
  AIRecommendation,
  Hashtag,
  TrendingTopic,
} from '@/types'

export const analyticsService = {
  // Dashboard
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/analytics/dashboard')
    return response.data
  },

  getRecentActivity: async (page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<ActivityItem>>> => {
    const response = await api.get(`/analytics/activity?page=${page}&limit=${limit}`)
    return response.data
  },

  // User Analytics
  getUserAnalytics: async (userId?: string, dateRange?: { start: string, end: string }): Promise<ApiResponse<UserAnalytics[]>> => {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (dateRange) {
      params.append('start', dateRange.start)
      params.append('end', dateRange.end)
    }
    
    const response = await api.get(`/analytics/user?${params}`)
    return response.data
  },

  // Project Analytics
  getProjectAnalytics: async (projectId: string, dateRange?: { start: string, end: string }): Promise<ApiResponse<ProjectAnalytics[]>> => {
    const params = new URLSearchParams()
    if (dateRange) {
      params.append('start', dateRange.start)
      params.append('end', dateRange.end)
    }
    
    const response = await api.get(`/analytics/project/${projectId}?${params}`)
    return response.data
  },

  // Team Analytics
  getTeamAnalytics: async (teamId: string, dateRange?: { start: string, end: string }): Promise<ApiResponse<TeamAnalytics[]>> => {
    const params = new URLSearchParams()
    if (dateRange) {
      params.append('start', dateRange.start)
      params.append('end', dateRange.end)
    }
    
    const response = await api.get(`/analytics/team/${teamId}?${params}`)
    return response.data
  },
}

export const recommendationService = {
  // AI Recommendations
  getRecommendations: async (type?: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<AIRecommendation>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (type) params.append('type', type)
    
    const response = await api.get(`/recommendations?${params}`)
    return response.data
  },

  dismissRecommendation: async (recommendationId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/recommendations/${recommendationId}/dismiss`)
    return response.data
  },

  clickRecommendation: async (recommendationId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/recommendations/${recommendationId}/click`)
    return response.data
  },
}

export const searchService = {
  // Global search
  globalSearch: async (filters: SearchFilters): Promise<ApiResponse<{
    users: any[]
    projects: any[]
    teams: any[]
    posts: any[]
    hashtags: any[]
  }>> => {
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
    
    const response = await api.get(`/search?${params}`)
    return response.data
  },

  // Search suggestions
  getSearchSuggestions: async (query: string, type?: string): Promise<ApiResponse<string[]>> => {
    const params = new URLSearchParams({ query })
    if (type) params.append('type', type)
    
    const response = await api.get(`/search/suggestions?${params}`)
    return response.data
  },

  // Trending
  getTrendingHashtags: async (limit = 10): Promise<ApiResponse<Hashtag[]>> => {
    const response = await api.get(`/search/trending/hashtags?limit=${limit}`)
    return response.data
  },

  getTrendingTopics: async (limit = 10): Promise<ApiResponse<TrendingTopic[]>> => {
    const response = await api.get(`/search/trending/topics?limit=${limit}`)
    return response.data
  },

  // Search history
  getSearchHistory: async (limit = 20): Promise<ApiResponse<string[]>> => {
    const response = await api.get(`/search/history?limit=${limit}`)
    return response.data
  },

  clearSearchHistory: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete('/search/history')
    return response.data
  },
}

export const fileService = {
  // Upload files
  uploadFile: async (file: File, type: 'avatar' | 'banner' | 'media' | 'document'): Promise<ApiResponse<{ url: string, type: string, size: number }>> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Upload multiple files
  uploadFiles: async (files: File[], type: 'media' | 'documents'): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('type', type)
    
    const response = await api.post('/files/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete file
  deleteFile: async (url: string): Promise<ApiResponse<void>> => {
    const response = await api.delete('/files/delete', { data: { url } })
    return response.data
  },
}