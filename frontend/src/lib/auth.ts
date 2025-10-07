import api from './api'
import {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  ApiResponse,
  SearchFilters
} from '@/types/types'

export const authService = {
  // Check email availability
  checkEmail: async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    const response = await api.get(`/auth/check-email?email=${email}`)
    return response.data
  },

  // Check username availability
  checkUsername: async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    const response = await api.get(`/auth/check-username?username=${username}`)
    return response.data
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', credentials)
    return response.data
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Logout user
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ tokens: any }>> => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword })
    return response.data
  },
}

export const userService = {
  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const response = await api.put('/users/profile', data)
    return response.data
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Upload banner
  uploadBanner: async (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData()
    formData.append('banner', file)
    
    const response = await api.post('/users/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  // Search users
  searchUsers: async (filters: SearchFilters): Promise<ApiResponse<User[]>> => {
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
    
    const response = await api.get(`/users/search?${params}`)
    return response.data
  },

  // Get user recommendations
  getUserRecommendations: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users/recommendations?page=${page}&limit=${limit}`)
    return response.data
  },

  // Follow user
  followUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
  },

  // Unfollow user
  unfollowUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/users/${userId}/follow`)
    return response.data
  },

  // Get user followers
  getFollowers: async (userId: string, page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get user following
  getFollowing: async (userId: string, page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`)
    return response.data
  },

  // Delete account
  deleteAccount: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete('/users/account')
    return response.data
  },
}