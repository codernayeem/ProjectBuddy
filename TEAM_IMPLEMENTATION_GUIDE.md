# Team Feature Implementation Guide

## Overview
Complete team management system with roles, invitations, projects, milestones, chat, and posts.

## Database Schema - ✅ COMPLETED
- TeamCustomRole: Enhanced with permissions, priority
- ChatRoom: Team chat rooms with privacy settings
- ChatMessage: Messages within chat rooms
- ChatMessageReaction: Reactions to chat messages

## Backend Implementation Plan

### 1. Repositories (Data Layer)
Create the following repository files in `backend/src/repositories/`:

#### TeamRoleRepository.ts ✅ CREATED
- getTeamRoles(teamId)
- createRole(data)
- updateRole(roleId, data)
- deleteRole(roleId)
- assignRoleToMember(teamMemberId, roleId)
- removeRoleFromMember(teamMemberId, roleId)

#### TeamInvitationRepository.ts
- createInvitation(teamId, inviterId, inviteeId/email, message)
- getTeamInvitations(teamId, status)
- getUserInvitations(userId, status)
- updateInvitation(invitationId, status)
- deleteInvitation(invitationId)

#### TeamJoinRequestRepository.ts
- createJoinRequest(teamId, userId, message)
- getTeamJoinRequests(teamId, status)
- updateJoinRequest(requestId, status)
- deleteJoinRequest(requestId)

#### TeamProjectRepository.ts
- createProject(data)
- getTeamProjects(teamId, filters)
- getProjectById(projectId)
- updateProject(projectId, data)
- deleteProject(projectId)
- updateProjectStatus(projectId, status)

#### TeamMilestoneRepository.ts
- createMilestone(data)
- getTeamMilestones(teamId, filters)
- getProjectMilestones(projectId)
- updateMilestone(milestoneId, data)
- deleteMilestone(milestoneId)
- completeMilestone(milestoneId)

#### TeamChatRepository.ts
- createChatRoom(teamId, name, description, isPrivate)
- getChatRooms(teamId)
- getChatRoom(roomId)
- updateChatRoom(roomId, data)
- deleteChatRoom(roomId)
- sendMessage(roomId, senderId, content)
- getMessages(roomId, pagination)
- updateMessage(messageId, content)
- deleteMessage(messageId)
- addReaction(messageId, userId, emoji)
- removeReaction(messageId, userId, emoji)

### 2. Services (Business Logic)
Create the following service files in `backend/src/services/`:

#### TeamRoleService.ts
```typescript
- createRole(teamId, userId, roleData)
  * Verify user is admin
  * Check role name uniqueness
  * Set default permissions if not provided
  
- updateRole(roleId, userId, updates)
  * Verify user has permission
  * Validate permission changes
  
- deleteRole(roleId, userId)
  * Verify user is admin
  * Ensure role is not default
  * Reassign members to default role
  
- assignRole(teamMemberId, roleId, userId)
  * Verify user has permission to assign roles
  * Check role exists in team
  
- removeRole(teamMemberId, roleId, userId)
  * Verify permissions
  * Ensure member keeps at least one role
```

#### TeamInvitationService.ts
```typescript
- inviteUser(teamId, inviterId, inviteeId/email, message)
  * Verify inviter is admin/moderator
  * Check if user already invited/member
  * Create invitation with expiry (7 days)
  * Send notification
  
- acceptInvitation(invitationId, userId)
  * Verify invitation is for user
  * Check not expired
  * Add user to team with default role
  * Update invitation status
  
- declineInvitation(invitationId, userId)
  * Update status to DECLINED
  
- cancelInvitation(invitationId, userId)
  * Verify user is admin
  * Delete invitation
```

#### TeamJoinRequestService.ts
```typescript
- requestToJoin(teamId, userId, message)
  * Check team allows join requests
  * Check user not already member
  * Create request
  * Notify team admins
  
- approveRequest(requestId, approverId)
  * Verify approver is admin
  * Add user to team
  * Update request status
  * Notify requester
  
- rejectRequest(requestId, approverId)
  * Verify approver is admin
  * Update request status
  * Notify requester
```

#### TeamProjectService.ts
```typescript
- createProject(teamId, userId, projectData)
  * Verify user is member
  * Check create project permission
  * Create project with initial milestone
  
- updateProject(projectId, userId, updates)
  * Verify user has permission
  * Track status changes
  * Create notifications for status changes
  
- deleteProject(projectId, userId)
  * Verify user is admin or project creator
  * Cascade delete milestones
```

#### TeamMilestoneService.ts
```typescript
- createMilestone(teamId, projectId, userId, data)
  * Verify user has permission
  * Link to project if provided
  
- completeMilestone(milestoneId, userId)
  * Verify permission
  * Update status
  * Create achievement if significant
  * Notify team
```

#### TeamChatService.ts
```typescript
- createChatRoom(teamId, userId, name, description, isPrivate, allowedRoles)
  * Verify user is admin
  * Create room with settings
  
- sendMessage(roomId, userId, content, type, attachments)
  * Verify user can access room
  * Check role permissions
  * Save message
  * Notify room members
  
- getMessages(roomId, userId, pagination)
  * Verify user can access room
  * Mark messages as read
  * Return with reactions
```

### 3. Controllers (HTTP Layer)
Create controller files in `backend/src/controllers/`:

#### TeamRoleController.ts
```typescript
POST   /teams/:teamId/roles           - Create role
GET    /teams/:teamId/roles           - Get team roles
GET    /teams/:teamId/roles/:roleId   - Get specific role
PUT    /teams/:teamId/roles/:roleId   - Update role
DELETE /teams/:teamId/roles/:roleId   - Delete role
POST   /teams/:teamId/members/:memberId/roles/:roleId - Assign role
DELETE /teams/:teamId/members/:memberId/roles/:roleId - Remove role
```

#### TeamInvitationController.ts
```typescript
POST   /teams/:teamId/invitations      - Invite user
GET    /teams/:teamId/invitations      - Get team invitations
GET    /users/me/invitations           - Get my invitations
POST   /invitations/:id/accept         - Accept invitation
POST   /invitations/:id/decline        - Decline invitation
DELETE /invitations/:id                - Cancel invitation
```

#### TeamJoinRequestController.ts
```typescript
POST   /teams/:teamId/join-requests    - Request to join
GET    /teams/:teamId/join-requests    - Get team requests
POST   /join-requests/:id/approve      - Approve request
POST   /join-requests/:id/reject       - Reject request
DELETE /join-requests/:id              - Cancel request
```

#### TeamProjectController.ts
```typescript
POST   /teams/:teamId/projects                    - Create project
GET    /teams/:teamId/projects                    - Get projects
GET    /teams/:teamId/projects/:projectId         - Get project
PUT    /teams/:teamId/projects/:projectId         - Update project
DELETE /teams/:teamId/projects/:projectId         - Delete project
PATCH  /teams/:teamId/projects/:projectId/status  - Update status
```

#### TeamMilestoneController.ts
```typescript
POST   /teams/:teamId/milestones               - Create milestone
GET    /teams/:teamId/milestones               - Get milestones
GET    /teams/:teamId/projects/:projectId/milestones - Get project milestones
PUT    /milestones/:id                         - Update milestone
POST   /milestones/:id/complete                - Complete milestone
DELETE /milestones/:id                         - Delete milestone
```

#### TeamChatController.ts
```typescript
POST   /teams/:teamId/chat-rooms            - Create room
GET    /teams/:teamId/chat-rooms            - Get rooms
GET    /chat-rooms/:roomId                  - Get room
PUT    /chat-rooms/:roomId                  - Update room
DELETE /chat-rooms/:roomId                  - Delete room
POST   /chat-rooms/:roomId/messages         - Send message
GET    /chat-rooms/:roomId/messages         - Get messages
PUT    /chat-rooms/:roomId/messages/:id     - Update message
DELETE /chat-rooms/:roomId/messages/:id     - Delete message
POST   /chat-rooms/:roomId/messages/:id/reactions - Add reaction
DELETE /chat-rooms/:roomId/messages/:id/reactions/:emoji - Remove reaction
```

### 4. Routes
Update `backend/src/routes/teams.ts` to include all new routes

### 5. Validation Schemas
Add validation schemas in `backend/src/utils/validation.ts`:
- createRoleSchema
- updateRoleSchema
- inviteUserSchema
- joinRequestSchema
- createProjectSchema
- updateProjectSchema
- createMilestoneSchema
- chatMessageSchema

## Frontend Implementation Plan

### 1. API Client
Update `frontend/src/lib/teams.ts` with new functions:

```typescript
// Roles
teamService.getRoles(teamId)
teamService.createRole(teamId, roleData)
teamService.updateRole(teamId, roleId, updates)
teamService.deleteRole(teamId, roleId)
teamService.assignRole(teamId, memberId, roleId)

// Invitations
teamService.inviteUser(teamId, inviteeId, message)
teamService.getInvitations(teamId)
teamService.getMyInvitations()
teamService.acceptInvitation(invitationId)
teamService.declineInvitation(invitationId)

// Join Requests
teamService.requestToJoin(teamId, message)
teamService.getJoinRequests(teamId)
teamService.approveRequest(requestId)
teamService.rejectRequest(requestId)

// Projects
teamService.getProjects(teamId)
teamService.createProject(teamId, projectData)
teamService.updateProject(teamId, projectId, updates)
teamService.deleteProject(teamId, projectId)

// Milestones
teamService.getMilestones(teamId)
teamService.createMilestone(teamId, data)
teamService.completeMilestone(milestoneId)

// Chat
teamService.getChatRooms(teamId)
teamService.createChatRoom(teamId, roomData)
teamService.getMessages(roomId, page)
teamService.sendMessage(roomId, content)
```

### 2. Frontend Pages/Components

#### Team Settings Page (`frontend/src/pages/dashboard/team-settings.tsx`)
Tabs:
1. General - Team info, visibility
2. Members - Member list with roles
3. Roles - Create/edit custom roles
4. Invitations - Pending invitations
5. Join Requests - Pending requests (if public)

#### Team Detail Page Enhancement
Add tabs:
1. Overview - Current
2. Projects - New
3. Chat - New
4. Posts - New

#### Projects Page (`frontend/src/pages/dashboard/team-projects.tsx`)
- Project list with filters
- Project cards with status, progress
- Create project modal
- Project detail view with milestones

#### Team Chat Page (`frontend/src/pages/dashboard/team-chat.tsx`)
Similar to messages.tsx but with:
- Room list sidebar
- Room messages
- Create room modal
- Room settings

#### Components
- `RoleManager.tsx` - Role CRUD interface
- `MemberList.tsx` - Members with role badges
- `InvitationCard.tsx` - Invitation display
- `ProjectCard.tsx` - Project summary
- `MilestoneTracker.tsx` - Progress visualization
- `ChatRoom.tsx` - Chat interface
- `TeamPost.tsx` - Team-specific post

### 3. Types
Update `frontend/src/types/types.ts`:
```typescript
interface TeamCustomRole {
  id: string;
  name: string;
  description?: string;
  color?: string;
  permissions: TeamPermissions;
  priority: number;
}

interface TeamPermissions {
  canManageMembers: boolean;
  canManageRoles: boolean;
  canCreateProjects: boolean;
  canManagePosts: boolean;
  canManageChat: boolean;
  canDeleteTeam: boolean;
}

interface TeamInvitation {
  id: string;
  teamId: string;
  inviter: User;
  invitee?: User;
  email?: string;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
}

interface TeamProject {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  startDate?: string;
  endDate?: string;
  milestones: TeamMilestone[];
  teamId: string;
}

interface TeamMilestone {
  id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  dueDate?: string;
  completedAt?: string;
  projectId?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  isPrivate: boolean;
  lastMessageAt?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender?: User;
  chatRoomId: string;
  createdAt: string;
  readBy: string[];
}
```

## Implementation Priority

### Phase 1 (High Priority)
1. ✅ Update schema
2. Team Roles Management
   - Backend: Repository → Service → Controller → Routes
   - Frontend: API client → Settings page → Role manager UI
3. Team Invitations & Join Requests
   - Backend: Repository → Service → Controller → Routes
   - Frontend: API client → Invitation UI → Request UI

### Phase 2 (Medium Priority)
4. Team Projects & Milestones
   - Backend: Repository → Service → Controller → Routes
   - Frontend: API client → Projects page → Milestone tracker
5. Team Posts
   - Update existing Post model to filter by teamId
   - Add team feed UI

### Phase 3 (Nice to Have)
6. Team Chat
   - Backend: Repository → Service → Controller → Routes
   - Frontend: API client → Chat page → Room UI
7. Enhanced permissions system
8. Team analytics

## Key Features to Implement

### Role Permissions
```typescript
const DEFAULT_PERMISSIONS = {
  ADMIN: {
    canManageMembers: true,
    canManageRoles: true,
    canCreateProjects: true,
    canManagePosts: true,
    canManageChat: true,
    canDeleteTeam: true,
  },
  MODERATOR: {
    canManageMembers: true,
    canManageRoles: false,
    canCreateProjects: true,
    canManagePosts: true,
    canManageChat: true,
    canDeleteTeam: false,
  },
  MEMBER: {
    canManageMembers: false,
    canManageRoles: false,
    canCreateProjects: false,
    canManagePosts: false,
    canManageChat: false,
    canDeleteTeam: false,
  },
};
```

### Notification Types
- TEAM_INVITATION
- TEAM_JOIN_REQUEST
- TEAM_JOIN_REQUEST_ACCEPTED
- TEAM_ROLE_ASSIGNED
- TEAM_MILESTONE_COMPLETED
- TEAM_PROJECT_UPDATE
- TEAM_POST

## Testing Checklist
- [ ] Create team role
- [ ] Assign role to member
- [ ] Invite user to team
- [ ] Accept/decline invitation
- [ ] Request to join public team
- [ ] Approve/reject join request
- [ ] Create project
- [ ] Create milestone
- [ ] Complete milestone
- [ ] Create chat room
- [ ] Send chat message
- [ ] Create team post
- [ ] Permission checks

## Next Steps
1. Complete TeamRoleRepository (fix Prisma generation issue)
2. Create TeamInvitationRepository
3. Create services for both
4. Create controllers and routes
5. Test backend APIs
6. Build frontend UI components
7. Integrate and test end-to-end

This implementation will provide a complete team management system!
