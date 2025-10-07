import api from './api'
import {
  Message,
  Conversation,
  ConversationParticipant,
  MessageReaction,
  ApiResponse,
  ConversationType,
  MessageType,
} from '@/types/types'

export const messageService = {
  // Conversations
  getConversations: async (page = 1, limit = 20): Promise<ApiResponse<Conversation[]>> => {
    const response = await api.get(`/conversations?page=${page}&limit=${limit}`)
    return response.data
  },

  getConversation: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.get(`/conversations/${conversationId}`)
    return response.data
  },

  createConversation: async (data: {
    type: ConversationType
    participantIds: string[]
    title?: string
    description?: string
  }): Promise<ApiResponse<Conversation>> => {
    const response = await api.post('/conversations', data)
    return response.data
  },

  updateConversation: async (conversationId: string, data: {
    title?: string
    description?: string
    avatar?: string
  }): Promise<ApiResponse<Conversation>> => {
    const response = await api.put(`/conversations/${conversationId}`, data)
    return response.data
  },

  deleteConversation: async (conversationId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/conversations/${conversationId}`)
    return response.data
  },

  // Conversation participants
  addParticipant: async (conversationId: string, userId: string, role = 'member'): Promise<ApiResponse<ConversationParticipant>> => {
    const response = await api.post(`/conversations/${conversationId}/participants`, { userId, role })
    return response.data
  },

  removeParticipant: async (conversationId: string, userId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/conversations/${conversationId}/participants/${userId}`)
    return response.data
  },

  updateParticipantRole: async (conversationId: string, userId: string, role: string): Promise<ApiResponse<void>> => {
    const response = await api.put(`/conversations/${conversationId}/participants/${userId}/role`, { role })
    return response.data
  },

  leaveConversation: async (conversationId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/conversations/${conversationId}/leave`)
    return response.data
  },

  muteConversation: async (conversationId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/conversations/${conversationId}/mute`)
    return response.data
  },

  unmuteConversation: async (conversationId: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/conversations/${conversationId}/unmute`)
    return response.data
  },

  // Messages
  getMessages: async (conversationId: string, page = 1, limit = 50): Promise<ApiResponse<Message[]>> => {
    const response = await api.get(`/conversations/${conversationId}/messages?page=${page}&limit=${limit}`)
    return response.data
  },

  sendMessage: async (conversationId: string, data: {
    content: string
    type?: MessageType
    replyToId?: string
    attachments?: string[]
    metadata?: Record<string, any>
  }): Promise<ApiResponse<Message>> => {
    const response = await api.post(`/conversations/${conversationId}/messages`, data)
    return response.data
  },

  updateMessage: async (messageId: string, content: string): Promise<ApiResponse<Message>> => {
    const response = await api.put(`/messages/${messageId}`, { content })
    return response.data
  },

  deleteMessage: async (messageId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/messages/${messageId}`)
    return response.data
  },

  // Direct messages
  getDirectConversation: async (userId: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.get(`/messages/direct/${userId}`)
    return response.data
  },

  sendDirectMessage: async (userId: string, data: {
    content: string
    type?: MessageType
    attachments?: string[]
  }): Promise<ApiResponse<Message>> => {
    const response = await api.post(`/messages/direct/${userId}`, data)
    return response.data
  },

  // Message reactions
  addReaction: async (messageId: string, emoji: string): Promise<ApiResponse<MessageReaction>> => {
    const response = await api.post(`/messages/${messageId}/reactions`, { emoji })
    return response.data
  },

  removeReaction: async (messageId: string, emoji: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/messages/${messageId}/reactions/${emoji}`)
    return response.data
  },

  // Message status
  markAsRead: async (conversationId: string, messageId?: string): Promise<ApiResponse<void>> => {
    const endpoint = messageId 
      ? `/conversations/${conversationId}/messages/${messageId}/read`
      : `/conversations/${conversationId}/read`
    const response = await api.post(endpoint)
    return response.data
  },

  // File uploads
  uploadAttachment: async (file: File): Promise<ApiResponse<{ url: string, type: string, size: number }>> => {
    const formData = new FormData()
    formData.append('attachment', file)
    
    const response = await api.post('/messages/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Search messages
  searchMessages: async (query: string, conversationId?: string): Promise<ApiResponse<Message[]>> => {
    const params = new URLSearchParams({ query })
    if (conversationId) {
      params.append('conversationId', conversationId)
    }
    
    const response = await api.get(`/messages/search?${params}`)
    return response.data
  },

  // Get unread message count
  getUnreadCount: async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get('/messages/unread-count')
    return response.data
  },
}