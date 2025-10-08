import api from './api'
import {
  Post,
  CreatePostData,
  UpdatePostData,
  Comment,
  Reaction,
  CommentReaction,
  Share,
  Bookmark,
  ApiResponse,
  SearchFilters,
  PostType,
  ReactionType,
} from '@/types/types'

export const postService = {
  // Get posts with filtering
  getPosts: async (filters: SearchFilters): Promise<ApiResponse<Post[]>> => {
    const params = new URLSearchParams()
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const response = await api.get(`/posts?${params}`)
    return response.data
  },

  // Get user feed
  getFeed: async (page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get trending posts
  getTrendingPosts: async (page = 1, limit = 10, timeframe = '24h'): Promise<ApiResponse<Post[]>> => {
    const response = await api.get(`/posts/trending?page=${page}&limit=${limit}&timeframe=${timeframe}`)
    return response.data
  },

  // Get post by ID
  getPostById: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },

  // Create post
  createPost: async (data: CreatePostData): Promise<ApiResponse<Post>> => {
    const response = await api.post('/posts', data)
    return response.data
  },

  // Update post
  updatePost: async (id: string, data: UpdatePostData): Promise<ApiResponse<Post>> => {
    const response = await api.put(`/posts/${id}`, data)
    return response.data
  },

  // Delete post
  deletePost: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/posts/${id}`)
    return response.data
  },

  // Upload media for post
  uploadMedia: async (files: File[]): Promise<ApiResponse<{ urls: string[] }>> => {
    const formData = new FormData()
    files.forEach(file => formData.append('media', file))
    
    const response = await api.post('/posts/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // React to post
  reactToPost: async (id: string, type: ReactionType): Promise<ApiResponse<Reaction>> => {
    const response = await api.post(`/posts/${id}/react`, { type })
    return response.data
  },

  // Remove reaction
  removeReaction: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/posts/${id}/react`)
    return response.data
  },

  // Get post reactions
  getPostReactions: async (id: string, type?: ReactionType): Promise<ApiResponse<Reaction[]>> => {
    const params = type ? `?type=${type}` : ''
    const response = await api.get(`/posts/${id}/reactions${params}`)
    return response.data
  },

  // Share post
  sharePost: async (id: string, comment?: string): Promise<ApiResponse<Share>> => {
    const response = await api.post(`/posts/${id}/share`, { comment })
    return response.data
  },

  // Bookmark post
  bookmarkPost: async (id: string): Promise<ApiResponse<Bookmark>> => {
    const response = await api.post(`/posts/${id}/bookmark`)
    return response.data
  },

  // Remove bookmark
  removeBookmark: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/posts/${id}/bookmark`)
    return response.data
  },

  // Get user bookmarks
  getBookmarks: async (page = 1, limit = 10): Promise<ApiResponse<Bookmark[]>> => {
    const response = await api.get(`/posts/bookmarks?page=${page}&limit=${limit}`)
    return response.data
  },

  // Comments
  getComments: async (postId: string, page = 1, limit = 10): Promise<ApiResponse<Comment[]>> => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`)
    return response.data
  },

  addComment: async (postId: string, content: string, parentId?: string): Promise<ApiResponse<Comment>> => {
    const response = await api.post(`/posts/${postId}/comments`, { content, parentId })
    return response.data
  },

  updateComment: async (commentId: string, content: string): Promise<ApiResponse<Comment>> => {
    const response = await api.put(`/comments/${commentId}`, { content })
    return response.data
  },

  deleteComment: async (commentId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  },

  // Comment reactions
  reactToComment: async (commentId: string, type: ReactionType): Promise<ApiResponse<CommentReaction>> => {
    const response = await api.post(`/comments/${commentId}/react`, { type })
    return response.data
  },

  removeCommentReaction: async (commentId: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/comments/${commentId}/react`)
    return response.data
  },

  // Search posts
  searchPosts: async (filters: SearchFilters): Promise<ApiResponse<Post[]>> => {
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
    
    const response = await api.get(`/posts/search?${params}`)
    return response.data
  },

  // Get user posts
  getUserPosts: async (userId: string, page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
    const response = await api.get(`/posts/user/${userId}/?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get project posts
  getProjectPosts: async (projectId: string, page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
    const response = await api.get(`/projects/${projectId}/posts?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get team posts
  getTeamPosts: async (teamId: string, page = 1, limit = 10): Promise<ApiResponse<Post[]>> => {
    const response = await api.get(`/teams/${teamId}/posts?page=${page}&limit=${limit}`)
    return response.data
  },

  // Report post
  reportPost: async (postId: string, reason: string, details?: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/posts/${postId}/report`, { reason, details })
    return response.data
  },

  // Get post analytics
  getPostAnalytics: async (postId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/posts/${postId}/analytics`)
    return response.data
  },
}