import Joi from 'joi';

// Auth validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(20).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).max(100).required(),
  bio: Joi.string().max(500).optional(),
  userType: Joi.string().valid('UNDERGRADUATE', 'GRADUATE', 'FREELANCER', 'PROFESSIONAL', 'STARTUP_FOUNDER', 'ENTREPRENEUR').optional(),
  preferredRole: Joi.string().valid('PROJECT_MANAGER', 'TEAM_LEAD', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULLSTACK_DEVELOPER', 'MOBILE_DEVELOPER', 'DEVOPS_ENGINEER', 'UI_UX_DESIGNER', 'DATA_SCIENTIST', 'QA_ENGINEER', 'BUSINESS_ANALYST', 'PRODUCT_MANAGER', 'MARKETING_SPECIALIST', 'CONTENT_CREATOR', 'OTHER').optional(),
  experienceLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT').optional(),
  skills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  interests: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  location: Joi.string().max(100).optional(),
  linkedin: Joi.string().uri().optional(),
  github: Joi.string().uri().optional(),
  portfolio: Joi.string().uri().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// User validation schemas
export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  username: Joi.string().alphanum().min(3).max(20).optional(),
  userType: Joi.string().valid('UNDERGRADUATE', 'GRADUATE', 'FREELANCER', 'PROFESSIONAL', 'STARTUP_FOUNDER', 'ENTREPRENEUR').optional(),
  preferredRole: Joi.string().valid('PROJECT_MANAGER', 'TEAM_LEAD', 'FRONTEND_DEVELOPER', 'BACKEND_DEVELOPER', 'FULLSTACK_DEVELOPER', 'MOBILE_DEVELOPER', 'DEVOPS_ENGINEER', 'UI_UX_DESIGNER', 'DATA_SCIENTIST', 'QA_ENGINEER', 'BUSINESS_ANALYST', 'PRODUCT_MANAGER', 'MARKETING_SPECIALIST', 'CONTENT_CREATOR', 'OTHER').optional(),
  experienceLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT').optional(),
  skills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  interests: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  languages: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  location: Joi.string().max(100).optional(),
  website: Joi.string().uri().optional(),
  linkedin: Joi.string().uri().optional(),
  github: Joi.string().uri().optional(),
  portfolio: Joi.string().uri().optional(),
  company: Joi.string().max(100).optional(),
  position: Joi.string().max(100).optional(),
  isAvailableForProjects: Joi.boolean().optional(),
  timezone: Joi.string().max(50).optional(),
});

export const searchUsersSchema = Joi.object({
  query: Joi.string().min(1).max(100).optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});

// Project validation schemas
export const createProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  shortDescription: Joi.string().max(200).optional(),
  category: Joi.string().valid('WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'GAME_DEVELOPMENT', 'AI_ML', 'DATA_SCIENCE', 'BLOCKCHAIN', 'IOT', 'CYBERSECURITY', 'UI_UX_DESIGN', 'MARKETING', 'BUSINESS', 'RESEARCH', 'OPEN_SOURCE', 'STARTUP', 'EDUCATIONAL', 'OTHER').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref('startDate')).optional(),
  estimatedDuration: Joi.string().max(50).optional(),
  isPublic: Joi.boolean().optional(),
  isRecruiting: Joi.boolean().optional(),
  maxMembers: Joi.number().integer().min(1).max(100).optional(),
  requiredSkills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  repositoryUrl: Joi.string().uri().optional(),
  liveUrl: Joi.string().uri().optional(),
  documentationUrl: Joi.string().uri().optional(),
});

export const updateProjectSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  shortDescription: Joi.string().max(200).optional(),
  status: Joi.string().valid('PLANNING', 'RECRUITING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED').optional(),
  category: Joi.string().valid('WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'GAME_DEVELOPMENT', 'AI_ML', 'DATA_SCIENCE', 'BLOCKCHAIN', 'IOT', 'CYBERSECURITY', 'UI_UX_DESIGN', 'MARKETING', 'BUSINESS', 'RESEARCH', 'OPEN_SOURCE', 'STARTUP', 'EDUCATIONAL', 'OTHER').optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  estimatedDuration: Joi.string().max(50).optional(),
  isPublic: Joi.boolean().optional(),
  isRecruiting: Joi.boolean().optional(),
  maxMembers: Joi.number().integer().min(1).max(100).optional(),
  requiredSkills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  repositoryUrl: Joi.string().uri().optional(),
  liveUrl: Joi.string().uri().optional(),
  documentationUrl: Joi.string().uri().optional(),
});

export const inviteToProjectSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  role: Joi.string().valid('ADMIN', 'TEAM_LEAD', 'SENIOR_DEVELOPER', 'DEVELOPER', 'DESIGNER', 'TESTER', 'BUSINESS_ANALYST', 'MARKETING', 'CONTRIBUTOR', 'VIEWER').optional(),
  title: Joi.string().max(100).optional(),
});

// Project Goal validation schemas
export const createProjectGoalSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  priority: Joi.number().integer().min(1).max(3).optional(),
});

export const updateProjectGoalSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  priority: Joi.number().integer().min(1).max(3).optional(),
  isCompleted: Joi.boolean().optional(),
});

// Project Role validation schemas
export const createProjectRoleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  requiredSkills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  experienceLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT').optional(),
  maxPositions: Joi.number().integer().min(1).max(10).optional(),
});

// Milestone validation schemas
export const createMilestoneSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  dueDate: Joi.date().greater('now').optional(),
});

export const updateMilestoneSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').optional(),
  dueDate: Joi.date().optional(),
});

// Achievement validation schemas
export const createAchievementSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  isShared: Joi.boolean().optional(),
});

// Post validation schemas
export const createPostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  type: Joi.string().valid('GENERAL', 'PROJECT_UPDATE', 'PROJECT_ANNOUNCEMENT', 'ACHIEVEMENT', 'MILESTONE_COMPLETED', 'GOAL_COMPLETED', 'TEAM_FORMATION', 'FIND_TEAMMATES', 'FIND_TEAM', 'FIND_PROJECT', 'PROJECT_SHOWCASE', 'SKILL_SHARE', 'RESOURCE_SHARE', 'QUESTION', 'POLL', 'EVENT', 'CELEBRATION').optional(),
  projectId: Joi.string().uuid().optional(),
  teamId: Joi.string().uuid().optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  hashtags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  mentions: Joi.array().items(Joi.string().uuid()).max(20).optional(),
  visibility: Joi.string().valid('public', 'connections', 'team', 'project').optional(),
});

export const updatePostSchema = Joi.object({
  content: Joi.string().min(1).max(5000).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  hashtags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  mentions: Joi.array().items(Joi.string().uuid()).max(20).optional(),
  visibility: Joi.string().valid('public', 'connections', 'team', 'project').optional(),
});

// Comment validation schemas
export const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
  parentId: Joi.string().uuid().optional(),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
});

// Reaction validation schemas
export const createReactionSchema = Joi.object({
  type: Joi.string().valid('LIKE', 'LOVE', 'CELEBRATE', 'SUPPORT', 'INSIGHTFUL', 'FUNNY', 'AMAZING').required(),
});

// Share validation schema
export const sharePostSchema = Joi.object({
  comment: Joi.string().max(500).optional(),
});

// Message validation schemas
export const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(5000).required(),
  type: Joi.string().valid('TEXT', 'IMAGE', 'FILE', 'VOICE', 'VIDEO').optional(),
  receiverId: Joi.string().uuid().optional(),
  conversationId: Joi.string().uuid().optional(),
  replyToId: Joi.string().uuid().optional(),
});

export const createConversationSchema = Joi.object({
  type: Joi.string().valid('DIRECT_MESSAGE', 'GROUP_CHAT', 'TEAM_CHAT', 'PROJECT_CHAT').optional(),
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(500).optional(),
  participantIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  teamId: Joi.string().uuid().optional(),
  projectId: Joi.string().uuid().optional(),
});

// Connection validation schemas
export const connectionRequestSchema = Joi.object({
  receiverId: Joi.string().uuid().required(),
  message: Joi.string().max(300).optional(),
});

// Follow validation schemas
export const followUserSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

// Pagination schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});

// Search validation schemas
export const searchSchema = Joi.object({
  query: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('users', 'projects', 'teams', 'posts', 'hashtags').optional(),
  filters: Joi.object({
    skills: Joi.array().items(Joi.string().max(50)).optional(),
    experienceLevel: Joi.string().valid('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT').optional(),
    location: Joi.string().max(100).optional(),
    userType: Joi.string().valid('UNDERGRADUATE', 'GRADUATE', 'FREELANCER', 'PROFESSIONAL', 'STARTUP_FOUNDER', 'ENTREPRENEUR').optional(),
    category: Joi.string().valid('WEB_DEVELOPMENT', 'MOBILE_DEVELOPMENT', 'GAME_DEVELOPMENT', 'AI_ML', 'DATA_SCIENCE', 'BLOCKCHAIN', 'IOT', 'CYBERSECURITY', 'UI_UX_DESIGN', 'MARKETING', 'BUSINESS', 'RESEARCH', 'OPEN_SOURCE', 'STARTUP', 'EDUCATIONAL', 'OTHER').optional(),
    isRecruiting: Joi.boolean().optional(),
  }).optional(),
}).concat(paginationSchema);

// Team validation schemas  
export const createTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(2000).required(),
  shortDescription: Joi.string().max(200).optional(),
  type: Joi.string().valid('PROJECT_BASED', 'SKILL_BASED', 'STARTUP', 'FREELANCE', 'OPEN_SOURCE', 'HACKATHON', 'STUDY_GROUP', 'NETWORKING', 'MENTORSHIP').optional(),
  visibility: Joi.string().valid('PUBLIC', 'PRIVATE', 'INVITE_ONLY').optional(),
  skills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  requiredSkills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  location: Joi.string().max(100).optional(),
  website: Joi.string().uri().optional(),
  maxMembers: Joi.number().integer().min(1).max(500).optional(),
  isRecruiting: Joi.boolean().optional(),
});

export const updateTeamSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  shortDescription: Joi.string().max(200).optional(),
  type: Joi.string().valid('PROJECT_BASED', 'SKILL_BASED', 'STARTUP', 'FREELANCE', 'OPEN_SOURCE', 'HACKATHON', 'STUDY_GROUP', 'NETWORKING', 'MENTORSHIP').optional(),
  visibility: Joi.string().valid('PUBLIC', 'PRIVATE', 'INVITE_ONLY').optional(),
  skills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  requiredSkills: Joi.array().items(Joi.string().max(50)).max(20).optional(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  location: Joi.string().max(100).optional(),
  website: Joi.string().uri().optional(),
  maxMembers: Joi.number().integer().min(1).max(500).optional(),
  isRecruiting: Joi.boolean().optional(),
});

export const inviteToTeamSchema = Joi.object({
  userId: Joi.string().uuid().optional(),
  email: Joi.string().email().optional(),
  message: Joi.string().max(500).optional(),
}).xor('userId', 'email');

export const connectionResponseSchema = Joi.object({
  action: Joi.string().valid('accept', 'decline', 'block').required(),
});

// Connection pagination schema with status filter
export const connectionPaginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  status: Joi.string().valid('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED').optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional(),
});