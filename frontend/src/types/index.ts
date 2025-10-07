// Enums from backend
export const UserType = {
  UNDERGRADUATE: 'UNDERGRADUATE',
  GRADUATE: 'GRADUATE',
  FREELANCER: 'FREELANCER',
  PROFESSIONAL: 'PROFESSIONAL',
  STARTUP_FOUNDER: 'STARTUP_FOUNDER',
  ENTREPRENEUR: 'ENTREPRENEUR'
} as const

export type UserType = typeof UserType[keyof typeof UserType]

export const ConnectionStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  BLOCKED: 'BLOCKED'
} as const

export type ConnectionStatus = typeof ConnectionStatus[keyof typeof ConnectionStatus]

export const ProjectStatus = {
  PLANNING: 'PLANNING',
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus]

export const ProjectCategory = {
  WEB_DEVELOPMENT: 'WEB_DEVELOPMENT',
  MOBILE_DEVELOPMENT: 'MOBILE_DEVELOPMENT',
  GAME_DEVELOPMENT: 'GAME_DEVELOPMENT',
  AI_ML: 'AI_ML',
  DATA_SCIENCE: 'DATA_SCIENCE',
  BLOCKCHAIN: 'BLOCKCHAIN',
  IOT: 'IOT',
  CYBERSECURITY: 'CYBERSECURITY',
  UI_UX_DESIGN: 'UI_UX_DESIGN',
  MARKETING: 'MARKETING',
  BUSINESS: 'BUSINESS',
  RESEARCH: 'RESEARCH',
  OPEN_SOURCE: 'OPEN_SOURCE',
  EDUCATIONAL: 'EDUCATIONAL',
  OTHER: 'OTHER'
} as const

export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory]

export const TeamMemberStatus = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  MEMBER: 'MEMBER'
} as const

export type TeamMemberStatus = typeof TeamMemberStatus[keyof typeof TeamMemberStatus]

export const TeamVisibility = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
} as const

export type TeamVisibility = typeof TeamVisibility[keyof typeof TeamVisibility]

export const TeamType = {
  SKILL_BASED: 'SKILL_BASED',
  STARTUP: 'STARTUP',
  FREELANCE: 'FREELANCE',
  OPEN_SOURCE: 'OPEN_SOURCE',
  HACKATHON: 'HACKATHON',
  STUDY_GROUP: 'STUDY_GROUP',
  NETWORKING: 'NETWORKING',
  MENTORSHIP: 'MENTORSHIP',
  BUSINESS: 'BUSINESS',
  OTHER: 'OTHER'
} as const

export type TeamType = typeof TeamType[keyof typeof TeamType]

export const JoinRequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED'
} as const

export type JoinRequestStatus = typeof JoinRequestStatus[keyof typeof JoinRequestStatus]

export const PostType = {
  GENERAL: 'GENERAL',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  ACHIEVEMENT: 'ACHIEVEMENT',
  MILESTONE_COMPLETED: 'MILESTONE_COMPLETED',
  NEW_MEMBER: 'NEW_MEMBER',
  RECRUITMENT: 'RECRUITMENT',
  PROJECT_SHOWCASE: 'PROJECT_SHOWCASE',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  SKILL_SHARE: 'SKILL_SHARE',
  RESOURCE_SHARE: 'RESOURCE_SHARE',
  QUESTION: 'QUESTION',
  POLL: 'POLL',
  EVENT: 'EVENT',
  CELEBRATION: 'CELEBRATION'
} as const

export type PostType = typeof PostType[keyof typeof PostType]

export const ReactionType = {
  LIKE: 'LIKE',
  LOVE: 'LOVE',
  CELEBRATE: 'CELEBRATE',
  SUPPORT: 'SUPPORT',
  INSIGHTFUL: 'INSIGHTFUL',
  FUNNY: 'FUNNY',
  AMAZING: 'AMAZING'
} as const

export type ReactionType = typeof ReactionType[keyof typeof ReactionType]

export const NotificationType = {
  CONNECTION_REQUEST: 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED: 'CONNECTION_ACCEPTED',
  TEAM_INVITATION: 'TEAM_INVITATION',
  TEAM_JOIN_REQUEST: 'TEAM_JOIN_REQUEST',
  TEAM_JOIN_REQUEST_ACCEPTED: 'TEAM_JOIN_REQUEST_ACCEPTED',
  TEAM_JOIN_REQUEST_DECLINED: 'TEAM_JOIN_REQUEST_DECLINED',
  TEAM_MEMBER_JOINED: 'TEAM_MEMBER_JOINED',
  TEAM_MEMBER_LEFT: 'TEAM_MEMBER_LEFT',
  TEAM_ROLE_ASSIGNED: 'TEAM_ROLE_ASSIGNED',
  TEAM_MILESTONE_COMPLETED: 'TEAM_MILESTONE_COMPLETED',
  TEAM_ACHIEVEMENT_SHARED: 'TEAM_ACHIEVEMENT_SHARED',
  POST_REACTION: 'POST_REACTION',
  POST_COMMENT: 'POST_COMMENT',
  POST_MENTION: 'POST_MENTION',
  POST_SHARED: 'POST_SHARED',
  COMMENT_REPLY: 'COMMENT_REPLY',
  COMMENT_REACTION: 'COMMENT_REACTION',
  MENTION: 'MENTION',
  FOLLOW: 'FOLLOW',
  TEAM_FOLLOW: 'TEAM_FOLLOW',
  TEAM_POST: 'TEAM_POST',
  MILESTONE_DUE: 'MILESTONE_DUE',
  SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT'
} as const

export type NotificationType = typeof NotificationType[keyof typeof NotificationType]

export const MilestoneStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

export type MilestoneStatus = typeof MilestoneStatus[keyof typeof MilestoneStatus]

export const InvitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  EXPIRED: 'EXPIRED'
} as const

export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus]

export const MessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  VOICE: 'VOICE',
  VIDEO: 'VIDEO',
  SYSTEM: 'SYSTEM',
  REACTION: 'REACTION'
} as const

export type MessageType = typeof MessageType[keyof typeof MessageType]

export const ConversationType = {
  DIRECT_MESSAGE: 'DIRECT_MESSAGE',
  GROUP_CHAT: 'GROUP_CHAT',
  TEAM_CHAT: 'TEAM_CHAT'
} as const

export type ConversationType = typeof ConversationType[keyof typeof ConversationType]

export const RecommendationType = {
  USER: 'USER',
  TEAM: 'TEAM',
  POST: 'POST',
  SKILL: 'SKILL',
  HASHTAG: 'HASHTAG'
} as const

export type RecommendationType = typeof RecommendationType[keyof typeof RecommendationType]

// Core Interfaces
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  bio?: string
  avatar?: string
  banner?: string
  country?: string
  city?: string
  address?: string
  website?: string
  linkedin?: string
  github?: string
  portfolio?: string
  company?: string
  position?: string
  userType: UserType
  skills: string[]
  interests: string[]
  isActive: boolean
  timezone?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  username: string
  firstName: string
  lastName: string
  password: string
  bio?: string
  userType?: UserType
  skills?: string[]
  interests?: string[]
}

export interface TeamProject {
  id: string
  title: string
  description: string
  shortDescription?: string
  status: ProjectStatus
  category: ProjectCategory
  startDate?: string
  endDate?: string
  estimatedDuration?: string
  requiredSkills: string[]
  tags: string[]
  repositoryUrl?: string
  liveUrl?: string
  documentationUrl?: string
  images: string[]
  teamId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  team: Team
  milestones?: TeamMilestone[]
}

export interface TeamMilestone {
  id: string
  title: string
  description?: string
  status: MilestoneStatus
  dueDate?: string
  completedAt?: string
  teamId: string
  projectId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  team: Team
  project?: TeamProject
  achievements?: TeamAchievement[]
}

export interface TeamAchievement {
  id: string
  title: string
  description: string
  teamId: string
  milestoneId?: string
  isShared: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  team: Team
  milestone?: TeamMilestone
}

export interface Connection {
  id: string
  senderId: string
  receiverId: string
  status: ConnectionStatus
  message?: string
  createdAt: string
  updatedAt: string
  sender: User
  receiver: User
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  createdAt: string
  follower: User
  following: User
}

export interface Team {
  id: string
  name: string
  description: string
  shortDescription?: string
  visibility: TeamVisibility
  type: TeamType
  avatar?: string
  banner?: string
  skills: string[]
  tags: string[]
  country?: string
  city?: string
  isRecruiting: boolean
  allowJoinRequests: boolean
  maxMembers?: number
  website?: string
  social?: Record<string, unknown>
  ownerId: string
  memberCount: number
  followerCount: number
  createdAt: string
  updatedAt: string
  owner: User
  members: TeamMember[]
  customRoles?: TeamCustomRole[]
  invitations?: TeamInvitation[]
  joinRequests?: TeamJoinRequest[]
  projects?: TeamProject[]
  milestones?: TeamMilestone[]
  achievements?: TeamAchievement[]
  followers?: TeamFollow[]
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  status: TeamMemberStatus
  title?: string
  isActive: boolean
  joinedAt: string
  team: Team
  user: User
  customRoles?: TeamMemberCustomRole[]
}

export interface TeamCustomRole {
  id: string
  teamId: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
  team: Team
  members: TeamMemberCustomRole[]
}

export interface TeamMemberCustomRole {
  id: string
  teamMemberId: string
  customRoleId: string
  teamMember: TeamMember
  customRole: TeamCustomRole
}

export interface TeamInvitation {
  id: string
  teamId: string
  inviterId: string
  inviteeId?: string
  email?: string
  message?: string
  status: InvitationStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
  team: Team
  inviter: User
  invitee?: User
}

export interface TeamJoinRequest {
  id: string
  teamId: string
  userId: string
  message?: string
  status: JoinRequestStatus
  createdAt: string
  updatedAt: string
  team: Team
  user: User
}

export interface TeamFollow {
  id: string
  userId: string
  teamId: string
  createdAt: string
  user: User
  team: Team
}

export interface Post {
  id: string
  content: string
  type: PostType
  authorId?: string
  teamId?: string
  media: string[]
  tags: string[]
  mentions: string[]
  hashtags: string[]
  isEdited: boolean
  editedAt?: string
  visibility: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  viewsCount: number
  createdAt: string
  updatedAt: string
  author?: User
  team?: Team
  comments?: Comment[]
  reactions?: Reaction[]
}

export interface Comment {
  id: string
  content: string
  authorId: string
  postId: string
  parentId?: string
  isEdited: boolean
  editedAt?: string
  likesCount: number
  repliesCount: number
  createdAt: string
  updatedAt: string
  author: User
  post: Post
  parent?: Comment
  replies?: Comment[]
  reactions?: CommentReaction[]
}

export interface Reaction {
  id: string
  type: ReactionType
  userId: string
  postId: string
  createdAt: string
  user: User
  post: Post
}

export interface CommentReaction {
  id: string
  type: ReactionType
  userId: string
  commentId: string
  createdAt: string
  user: User
  comment: Comment
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  userId: string
  isRead: boolean
  actionUrl?: string
  data?: Record<string, unknown>
  priority: string
  category: string
  createdAt: string
  readAt?: string
  user: User
}

export interface Message {
  id: string
  content: string
  type: MessageType
  senderId: string
  receiverId?: string
  conversationId: string
  replyToId?: string
  attachments: string[]
  metadata?: Record<string, unknown>
  isEdited: boolean
  editedAt?: string
  isDeleted: boolean
  deletedAt?: string
  readBy: string[]
  createdAt: string
  updatedAt: string
  sender: User
  receiver?: User
  conversation: Conversation
  replyTo?: Message
  replies?: Message[]
  reactions?: MessageReaction[]
}

export interface Conversation {
  id: string
  type: ConversationType
  title?: string
  description?: string
  avatar?: string
  isGroup: boolean
  teamId?: string
  createdBy: string
  lastMessageAt?: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
  messages: Message[]
}

export interface ConversationParticipant {
  id: string
  conversationId: string
  userId: string
  role: string
  joinedAt: string
  lastReadAt?: string
  isActive: boolean
  isMuted: boolean
  conversation: Conversation
  user: User
}

export interface MessageReaction {
  id: string
  messageId: string
  userId: string
  emoji: string
  createdAt: string
  message: Message
  user: User
}

// Request/Response Types
export interface CreateTeamProjectData {
  title: string
  description: string
  shortDescription?: string
  category: ProjectCategory
  startDate?: string
  endDate?: string
  estimatedDuration?: string
  requiredSkills: string[]
  tags: string[]
  repositoryUrl?: string
  liveUrl?: string
  documentationUrl?: string
}

export interface UpdateTeamProjectData {
  title?: string
  description?: string
  shortDescription?: string
  status?: ProjectStatus
  category?: ProjectCategory
  startDate?: string
  endDate?: string
  estimatedDuration?: string
  requiredSkills?: string[]
  tags?: string[]
  repositoryUrl?: string
  liveUrl?: string
  documentationUrl?: string
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  bio?: string
  username?: string
  country?: string
  city?: string
  address?: string
  website?: string
  linkedin?: string
  github?: string
  portfolio?: string
  company?: string
  position?: string
  userType?: UserType
  skills?: string[]
  interests?: string[]
  timezone?: string
}

export interface CreateTeamData {
  name: string
  description: string
  shortDescription?: string
  visibility: TeamVisibility
  type: TeamType
  skills?: string[]
  tags?: string[]
  country?: string
  city?: string
  isRecruiting?: boolean
  allowJoinRequests?: boolean
  maxMembers?: number
  website?: string
  social?: Record<string, unknown>
}

export interface UpdateTeamData {
  name?: string
  description?: string
  shortDescription?: string
  visibility?: TeamVisibility
  type?: TeamType
  skills?: string[]
  tags?: string[]
  country?: string
  city?: string
  isRecruiting?: boolean
  allowJoinRequests?: boolean
  maxMembers?: number
  website?: string
  social?: Record<string, unknown>
}

export interface CreatePostData {
  content: string
  type?: PostType
  teamId?: string
  media?: string[]
  tags?: string[]
  mentions?: string[]
  hashtags?: string[]
  visibility?: string
}

export interface UpdatePostData {
  content?: string
  type?: PostType
  media?: string[]
  tags?: string[]
  mentions?: string[]
  hashtags?: string[]
  visibility?: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ConnectionStats {
  totalConnections: number
  pendingRequests: number
  sentRequests: number
}

export interface SearchFilters {
  query?: string
  page?: number
  limit?: number
  status?: string
  tags?: string[]
  category?: string
  userType?: UserType
  skills?: string[]
  country?: string
  city?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export interface SearchParams {
  query?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Analytics Types
export interface UserAnalytics {
  id: string
  userId: string
  date: string
  postViews: number
  postLikes: number
  postComments: number
  postShares: number
  connectionsGained: number
  followersGained: number
  teamsJoined: number
  teamsFollowed: number
  messagesExchanged: number
  createdAt: string
}

export interface PostAnalytics {
  id: string
  postId: string
  date: string
  views: number
  likes: number
  comments: number
  shares: number
  bookmarks: number
  clicks: number
  engagementRate: number
  createdAt: string
}

export interface TeamAnalytics {
  id: string
  teamId: string
  date: string
  views: number
  membersJoined: number
  followersGained: number
  postsCreated: number
  projectsCreated: number
  milestonesCompleted: number
  achievementsShared: number
  messagesExchanged: number
  createdAt: string
}

// File Upload Types
export interface FileUpload {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  destination?: string
  filename?: string
  path?: string
}

// Dashboard Types
export interface DashboardStats {
  totalTeamProjects: number
  activeTeamProjects: number
  totalConnections: number
  totalTeams: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: string
  message: string
  createdAt: string
  user?: User
  teamProject?: TeamProject
  team?: Team
}

// Recommendation Types
export interface AIRecommendation {
  id: string
  type: RecommendationType
  userId: string
  targetId: string
  score: number
  reason: string
  metadata?: Record<string, unknown>
  isActive: boolean
  isClicked: boolean
  isDismissed: boolean
  createdAt: string
  expiresAt?: string
}

// Chat/Message related additional types
export interface ChatRoom {
  id: string
  name: string
  description?: string
  teamId: string
  isPrivate: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  team: Team
}

// Additional utility types
export interface Share {
  id: string
  userId: string
  postId: string
  comment?: string
  createdAt: string
  user: User
  post: Post
}

export interface Bookmark {
  id: string
  userId: string
  postId: string
  createdAt: string
  user: User
  post: Post
}

export interface Mention {
  id: string
  mentionerId: string
  mentionedId: string
  postId: string
  commentId?: string
  content?: string
  isRead: boolean
  createdAt: string
  mentioner: User
  post: Post
}

export interface TrendingTopic {
  id: string
  hashtag: string
  postCount: number
  engagement: number
  trendScore: number
  category?: string
  date: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}