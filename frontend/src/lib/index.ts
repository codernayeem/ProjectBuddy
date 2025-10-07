// Export all API services
export { authService, userService } from './auth'
export { connectionService } from './connections'
export { projectService } from './projects'
export { teamService } from './teams'
export { postService } from './posts'
export { notificationService } from './notifications'
export { messageService } from './messages'
export { 
  analyticsService, 
  recommendationService, 
  searchService, 
  fileService 
} from './misc'

// Export utilities
export * from './utils'

// Export API instance
export { default as api } from './api'

// Re-export types for convenience
export type * from '@/types/types'