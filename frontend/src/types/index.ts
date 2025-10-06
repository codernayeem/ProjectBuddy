// Enums from backend
export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum PreferredRole {
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  FRONTEND_DEVELOPER = 'FRONTEND_DEVELOPER',
  BACKEND_DEVELOPER = 'BACKEND_DEVELOPER',
  FULLSTACK_DEVELOPER = 'FULLSTACK_DEVELOPER',
  MOBILE_DEVELOPER = 'MOBILE_DEVELOPER',
  DEVOPS_ENGINEER = 'DEVOPS_ENGINEER',
  UI_UX_DESIGNER = 'UI_UX_DESIGNER',
  DATA_SCIENTIST = 'DATA_SCIENTIST',
  QA_ENGINEER = 'QA_ENGINEER',
  BUSINESS_ANALYST = 'BUSINESS_ANALYST',
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  MARKETING_SPECIALIST = 'MARKETING_SPECIALIST',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  OTHER = 'OTHER'
}

export enum UserType {
  UNDERGRADUATE = 'UNDERGRADUATE',
  GRADUATE = 'GRADUATE',
  FREELANCER = 'FREELANCER',
  PROFESSIONAL = 'PROFESSIONAL',
  STARTUP_FOUNDER = 'STARTUP_FOUNDER',
  ENTREPRENEUR = 'ENTREPRENEUR'
}

export enum ConnectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  BLOCKED = 'BLOCKED'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  RECRUITING = 'RECRUITING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  AI_ML = 'AI_ML',
  DATA_SCIENCE = 'DATA_SCIENCE',
  BLOCKCHAIN = 'BLOCKCHAIN',
  IOT = 'IOT',
  CYBERSECURITY = 'CYBERSECURITY',
  UI_UX_DESIGN = 'UI_UX_DESIGN',
  MARKETING = 'MARKETING',
  BUSINESS = 'BUSINESS',
  RESEARCH = 'RESEARCH',
  OPEN_SOURCE = 'OPEN_SOURCE',
  STARTUP = 'STARTUP',
  EDUCATIONAL = 'EDUCATIONAL',
  OTHER = 'OTHER'
}

export enum ProjectMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  TEAM_LEAD = 'TEAM_LEAD',
  SENIOR_DEVELOPER = 'SENIOR_DEVELOPER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  TESTER = 'TESTER',
  BUSINESS_ANALYST = 'BUSINESS_ANALYST',
  MARKETING = 'MARKETING',
  CONTRIBUTOR = 'CONTRIBUTOR',
  VIEWER = 'VIEWER'
}

export enum TeamVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  INVITE_ONLY = 'INVITE_ONLY'
}

export enum TeamType {
  PROJECT_BASED = 'PROJECT_BASED',
  SKILL_BASED = 'SKILL_BASED',
  STARTUP = 'STARTUP',
  FREELANCE = 'FREELANCE',
  OPEN_SOURCE = 'OPEN_SOURCE',
  HACKATHON = 'HACKATHON',
  STUDY_GROUP = 'STUDY_GROUP',
  NETWORKING = 'NETWORKING',
  MENTORSHIP = 'MENTORSHIP'
}

export enum TeamMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  LEAD = 'LEAD',
  MEMBER = 'MEMBER',
  CONTRIBUTOR = 'CONTRIBUTOR'
}

export enum PostType {
  GENERAL = 'GENERAL',
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  PROJECT_ANNOUNCEMENT = 'PROJECT_ANNOUNCEMENT',
  ACHIEVEMENT = 'ACHIEVEMENT',
  MILESTONE_COMPLETED = 'MILESTONE_COMPLETED',
  GOAL_COMPLETED = 'GOAL_COMPLETED',
  TEAM_FORMATION = 'TEAM_FORMATION',
  FIND_TEAMMATES = 'FIND_TEAMMATES',
  FIND_TEAM = 'FIND_TEAM',
  FIND_PROJECT = 'FIND_PROJECT',
  PROJECT_SHOWCASE = 'PROJECT_SHOWCASE',
  SKILL_SHARE = 'SKILL_SHARE',
  RESOURCE_SHARE = 'RESOURCE_SHARE',
  QUESTION = 'QUESTION',
  POLL = 'POLL',
  EVENT = 'EVENT',
  CELEBRATION = 'CELEBRATION'
}

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  CELEBRATE = 'CELEBRATE',
  SUPPORT = 'SUPPORT',
  INSIGHTFUL = 'INSIGHTFUL',
  FUNNY = 'FUNNY',
  AMAZING = 'AMAZING'
}

export enum NotificationType {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED = 'CONNECTION_ACCEPTED',
  PROJECT_INVITATION = 'PROJECT_INVITATION',
  PROJECT_JOIN_REQUEST = 'PROJECT_JOIN_REQUEST',
  PROJECT_UPDATE = 'PROJECT_UPDATE',
  PROJECT_MILESTONE_COMPLETED = 'PROJECT_MILESTONE_COMPLETED',
  PROJECT_GOAL_COMPLETED = 'PROJECT_GOAL_COMPLETED',
  ACHIEVEMENT_SHARED = 'ACHIEVEMENT_SHARED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  POST_REACTION = 'POST_REACTION',
  POST_COMMENT = 'POST_COMMENT',
  POST_MENTION = 'POST_MENTION',
  POST_SHARED = 'POST_SHARED',
  COMMENT_REPLY = 'COMMENT_REPLY',
  COMMENT_REACTION = 'COMMENT_REACTION',
  TEAM_INVITATION = 'TEAM_INVITATION',
  TEAM_JOIN_REQUEST = 'TEAM_JOIN_REQUEST',
  TEAM_JOINED = 'TEAM_JOINED',
  TEAM_LEFT = 'TEAM_LEFT',
  TEAM_ROLE_CHANGED = 'TEAM_ROLE_CHANGED',
  MENTION = 'MENTION',
  FOLLOW = 'FOLLOW',
  MILESTONE_DUE = 'MILESTONE_DUE',
  PROJECT_DEADLINE = 'PROJECT_DEADLINE',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED'
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  VOICE = 'VOICE',
  VIDEO = 'VIDEO',
  SYSTEM = 'SYSTEM',
  REACTION = 'REACTION'
}

export enum ConversationType {
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
  GROUP_CHAT = 'GROUP_CHAT',
  TEAM_CHAT = 'TEAM_CHAT',
  PROJECT_CHAT = 'PROJECT_CHAT'
}

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
  location?: string
  website?: string
  linkedin?: string
  github?: string
  portfolio?: string
  company?: string
  position?: string
  userType: UserType
  preferredRole: PreferredRole
  experienceLevel: ExperienceLevel
  skills: string[]
  interests: string[]
  languages: string[]
  isVerified: boolean
  isActive: boolean
  isAvailableForProjects: boolean
  timezone?: string
  lastLoginAt?: string
  profileViews: number
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
  preferredRole?: PreferredRole
  experienceLevel?: ExperienceLevel
  skills?: string[]
  interests?: string[]
  languages?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  shortDescription?: string
  status: ProjectStatus
  category: ProjectCategory
  startDate?: string
  endDate?: string
  estimatedDuration?: string
  isPublic: boolean
  isRecruiting: boolean
  maxMembers?: number
  currentMembers: number
  requiredSkills: string[]
  tags: string[]
  repositoryUrl?: string
  liveUrl?: string
  documentationUrl?: string
  images: string[]
  ownerId: string
  teamId?: string
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  owner: User
  team?: Team
  members: ProjectMember[]
  goals?: ProjectGoal[]
  milestones?: Milestone[]
  requiredRoles?: ProjectRole[]
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: ProjectMemberRole
  title?: string
  joinedAt: string
  isActive: boolean
  user: User
  project: Project
}

export interface ProjectGoal {
  id: string
  title: string
  description?: string
  projectId: string
  isCompleted: boolean
  priority: number
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectRole {
  id: string
  projectId: string
  title: string
  description: string
  requiredSkills: string[]
  experienceLevel: ExperienceLevel
  isOpen: boolean
  maxPositions: number
  filledPositions: number
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  description?: string
  status: MilestoneStatus
  dueDate?: string
  completedAt?: string
  projectId: string
  createdAt: string
  updatedAt: string
  achievements?: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  milestoneId: string
  isShared: boolean
  createdAt: string
  updatedAt: string
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
  location?: string
  isRecruiting: boolean
  maxMembers?: number
  currentMembers: number
  requiredSkills: string[]
  website?: string
  social?: Record<string, any>
  ownerId: string
  viewCount: number
  memberCount: number
  createdAt: string
  updatedAt: string
  owner: User
  members: TeamMember[]
  roles?: TeamRole[]
  invitations?: TeamInvitation[]
  projects?: Project[]
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: TeamMemberRole
  title?: string
  joinedAt: string
  team: Team
  user: User
}

export interface TeamRole {
  id: string
  teamId: string
  name: string
  description?: string
  color?: string
  permissions: string[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamInvitation {
  id: string
  teamId: string
  inviterId: string
  inviteeId?: string
  email?: string
  roleId?: string
  message?: string
  status: InvitationStatus
  expiresAt: string
  createdAt: string
  updatedAt: string
  team: Team
  inviter: User
  invitee?: User
}

export interface Post {
  id: string
  content: string
  type: PostType
  authorId: string
  projectId?: string
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
  author: User
  project?: Project
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
  data?: Record<string, any>
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
  metadata?: Record<string, any>
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
  projectId?: string
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
export interface CreateProjectData {
  title: string
  description: string
  shortDescription?: string
  category: ProjectCategory
  startDate?: string
  endDate?: string
  estimatedDuration?: string
  isPublic: boolean
  isRecruiting?: boolean
  maxMembers?: number
  requiredSkills: string[]
  tags: string[]
  repositoryUrl?: string
  liveUrl?: string
  documentationUrl?: string
}

export interface UpdateProjectData {
  title?: string
  description?: string
  shortDescription?: string
  status?: ProjectStatus
  category?: ProjectCategory
  startDate?: string
  endDate?: string
  estimatedDuration?: string
  isPublic?: boolean
  isRecruiting?: boolean
  maxMembers?: number
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
  location?: string
  website?: string
  linkedin?: string
  github?: string
  portfolio?: string
  company?: string
  position?: string
  userType?: UserType
  preferredRole?: PreferredRole
  experienceLevel?: ExperienceLevel
  skills?: string[]
  interests?: string[]
  languages?: string[]
  isAvailableForProjects?: boolean
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
  location?: string
  isRecruiting?: boolean
  maxMembers?: number
  requiredSkills?: string[]
  website?: string
  social?: Record<string, any>
}

export interface UpdateTeamData {
  name?: string
  description?: string
  shortDescription?: string
  visibility?: TeamVisibility
  type?: TeamType
  skills?: string[]
  tags?: string[]
  location?: string
  isRecruiting?: boolean
  maxMembers?: number
  requiredSkills?: string[]
  website?: string
  social?: Record<string, any>
}

export interface CreatePostData {
  content: string
  type?: PostType
  projectId?: string
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
export interface ApiResponse<T = any> {
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
  experienceLevel?: ExperienceLevel
  skills?: string[]
  location?: string
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
  profileViews: number
  postViews: number
  postLikes: number
  postComments: number
  postShares: number
  connectionsGained: number
  followersGained: number
  projectsCreated: number
  projectsJoined: number
  messagesExchanged: number
  createdAt: string
}

export interface ProjectAnalytics {
  id: string
  projectId: string
  date: string
  views: number
  likes: number
  bookmarks: number
  applications: number
  membersJoined: number
  postsCreated: number
  createdAt: string
}

export interface TeamAnalytics {
  id: string
  teamId: string
  date: string
  views: number
  membersJoined: number
  postsCreated: number
  projectsCreated: number
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
  buffer?: Buffer
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number
  activeProjects: number
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
  project?: Project
  team?: Team
}

// Recommendation Types
export interface AIRecommendation {
  id: string
  type: 'USER' | 'PROJECT' | 'TEAM' | 'POST' | 'SKILL' | 'HASHTAG'
  userId: string
  targetId: string
  score: number
  reason: string
  metadata?: Record<string, any>
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
  teamId?: string
  projectId?: string
  isPrivate: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  team?: Team
  project?: Project
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
  postId?: string
  projectId?: string
  createdAt: string
  user: User
  post?: Post
  project?: Project
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

export interface Hashtag {
  id: string
  name: string
  description?: string
  usageCount: number
  trending: boolean
  createdAt: string
  updatedAt: string
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