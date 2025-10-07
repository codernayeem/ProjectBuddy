import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { 
  UserType, 
  ConnectionStatus, 
  TeamVisibility, 
  TeamType, 
  TeamMemberStatus,
  InvitationStatus, 
  JoinRequestStatus,
  ProjectStatus, 
  ProjectCategory,
  MilestoneStatus, 
  PostType, 
  ReactionType,
  ConversationType,
  MessageType,
  NotificationType,
  RecommendationType
} from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface JwtTokenPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface SearchParams {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

// User related types
export interface CreateUserData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  userType?: UserType;
  country?: string;
  city?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  country?: string;
  city?: string;
  address?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  company?: string;
  position?: string;
  userType?: UserType;
  skills?: string[];
  interests?: string[];
  timezone?: string;
}

// Team related types
export interface CreateTeamData {
  name: string;
  description: string;
  shortDescription?: string;
  visibility?: TeamVisibility;
  type?: TeamType;
  skills?: string[];
  tags?: string[];
  country?: string;
  city?: string;
  maxMembers?: number;
  website?: string;
  social?: any;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  shortDescription?: string;
  visibility?: TeamVisibility;
  type?: TeamType;
  avatar?: string;
  banner?: string;
  skills?: string[];
  tags?: string[];
  country?: string;
  city?: string;
  isRecruiting?: boolean;
  allowJoinRequests?: boolean;
  maxMembers?: number;
  website?: string;
  social?: any;
}

export interface CreateTeamProjectData {
  title: string;
  description: string;
  shortDescription?: string;
  category?: ProjectCategory;
  startDate?: Date;
  endDate?: Date;
  estimatedDuration?: string;
  requiredSkills?: string[];
  tags?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  images?: string[];
}

export interface CreateTeamMilestoneData {
  title: string;
  description?: string;
  dueDate?: Date;
  projectId?: string;
}

export interface CreateTeamAchievementData {
  title: string;
  description: string;
  milestoneId?: string;
  isShared?: boolean;
}

export interface CreateCustomRoleData {
  name: string;
  description?: string;
  color?: string;
}

// Post related types
export interface CreatePostData {
  content: string;
  type?: PostType;
  teamId?: string;
  media?: string[];
  tags?: string[];
  mentions?: string[];
  hashtags?: string[];
  visibility?: string;
}

export interface UpdatePostData {
  content?: string;
  media?: string[];
  tags?: string[];
  hashtags?: string[];
  visibility?: string;
}

// Connection related types
export interface CreateConnectionData {
  receiverId: string;
  message?: string;
}

// Notification related types
export interface CreateNotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  actionUrl?: string;
  data?: any;
  priority?: string;
  category?: string;
}

// Message related types
export interface CreateMessageData {
  content: string;
  type?: MessageType;
  receiverId?: string;
  conversationId: string;
  replyToId?: string;
  attachments?: string[];
  metadata?: any;
}

// Filter and query types
export interface TeamFilters {
  visibility?: TeamVisibility;
  type?: TeamType;
  skills?: string[];
  country?: string;
  city?: string;
  isRecruiting?: boolean;
}

export interface PostFilters {
  type?: PostType;
  authorId?: string;
  teamId?: string;
  hashtags?: string[];
  visibility?: string;
}

export interface UserFilters {
  userType?: UserType;
  skills?: string[];
  country?: string;
  city?: string;
  isActive?: boolean;
}