import api from './api'
import {
  Notification,
  ApiResponse,
} from '@/types/types'

export const notificationService = {
  // Get user notifications
  getNotifications: async (
    page = 1, 
    limit = 20, 
    filters?: { category?: string; isRead?: boolean }
  ): Promise<ApiResponse<Notification[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters?.category) {
      params.append('category', filters.category);
    }
    
    if (filters?.isRead !== undefined) {
      params.append('isRead', filters.isRead.toString());
    }
    
    const response = await api.get(`/notifications?${params}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Get notification count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Clear all notifications
  clearAll: async (): Promise<ApiResponse<void>> => {
    const response = await api.delete('/notifications');
    return response.data;
  },
}