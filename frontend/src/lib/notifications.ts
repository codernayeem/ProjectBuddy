import api from './api'
import {
  Notification,
  ApiResponse,
  PaginatedResponse,
  NotificationType,
} from '@/types'

export const notificationService = {
  // Get user notifications
  getNotifications: async (page = 1, limit = 20, unreadOnly = false): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (unreadOnly) {
      params.append('unread', 'true')
    }
    
    const response = await api.get(`/notifications?${params}`)
    return response.data
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.put('/notifications/read-all')
    return response.data
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  },

  // Get notification count
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get('/notifications/unread-count')
    return response.data
  },

  // Get notifications by type
  getNotificationsByType: async (type: NotificationType, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    const response = await api.get(`/notifications/type/${type}?page=${page}&limit=${limit}`)
    return response.data
  },

  // Update notification preferences
  updatePreferences: async (preferences: Record<string, boolean>): Promise<ApiResponse<void>> => {
    const response = await api.put('/notifications/preferences', preferences)
    return response.data
  },

  // Get notification preferences
  getPreferences: async (): Promise<ApiResponse<Record<string, boolean>>> => {
    const response = await api.get('/notifications/preferences')
    return response.data
  },

  // Clear all notifications
  clearAll: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete('/notifications/clear-all')
    return response.data
  },
}