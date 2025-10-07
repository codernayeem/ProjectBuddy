import api from './api'
import {
  Connection,
  ConnectionStats,
  ApiResponse,
  SearchFilters,
  ConnectionStatus,
} from '@/types/types'

export const connectionService = {
  // Send connection request
  sendRequest: async (receiverId: string, message?: string): Promise<ApiResponse<Connection>> => {
    const response = await api.post('/connections/send', { receiverId, message })
    return response.data
  },

  // Respond to connection request
  respondToRequest: async (connectionId: string, action: 'accept' | 'decline'): Promise<ApiResponse<void>> => {
    const response = await api.put(`/connections/${connectionId}/respond`, { action })
    return response.data
  },

  // Get connections
  getConnections: async (page = 1, limit = 10, status?: ConnectionStatus): Promise<ApiResponse<Connection[]>> => {
    let url = `/connections?page=${page}&limit=${limit}`
    if (status) {
      url += `&status=${status}`
    }
    const response = await api.get(url)
    return response.data
  },

  // Get pending requests (received)
  getPendingRequests: async (page = 1, limit = 10): Promise<ApiResponse<Connection[]>> => {
    const response = await api.get(`/connections/pending?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get sent requests
  getSentRequests: async (page = 1, limit = 10): Promise<ApiResponse<Connection[]>> => {
    const response = await api.get(`/connections/sent?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get connection status with specific user
  getConnectionStatus: async (userId: string): Promise<ApiResponse<{ status: ConnectionStatus | null, connectionId?: string }>> => {
    const response = await api.get(`/connections/status/${userId}`)
    return response.data
  },

  // Get connection statistics
  getConnectionStats: async (): Promise<ApiResponse<ConnectionStats>> => {
    const response = await api.get('/connections/stats')
    return response.data
  },

  // Remove connection
  removeConnection: async (connectionId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/connections/${connectionId}`)
    return response.data
  },

  // Block user
  blockUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/connections/block`, { userId })
    return response.data
  },

  // Unblock user
  unblockUser: async (userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/connections/block/${userId}`)
    return response.data
  },

  // Get blocked users
  getBlockedUsers: async (page = 1, limit = 10): Promise<ApiResponse<Connection[]>> => {
    const response = await api.get(`/connections/blocked?page=${page}&limit=${limit}`)
    return response.data
  },

  // Search connections
  searchConnections: async (filters: SearchFilters): Promise<ApiResponse<Connection[]>> => {
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
    
    const response = await api.get(`/connections/search?${params}`)
    return response.data
  },
}