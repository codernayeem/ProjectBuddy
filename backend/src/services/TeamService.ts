import { TeamRepository } from '../repositories/TeamRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { 
  CreateTeamData, 
  UpdateTeamData, 
  CreateTeamProjectData,
  CreateTeamMilestoneData,
  CreateTeamAchievementData,
  CreateCustomRoleData,
  PaginationParams,
  SearchParams,
  TeamFilters 
} from '../types';
import { Team, TeamMember, TeamInvitation, TeamJoinRequest, TeamProject, TeamMilestone, TeamAchievement, TeamCustomRole } from '@prisma/client';

export class TeamService {
  private teamRepository: TeamRepository;
  private notificationRepository: NotificationRepository;

  constructor() {
    this.teamRepository = new TeamRepository();
    this.notificationRepository = new NotificationRepository();
  }

  // Team CRUD operations
  async createTeam(ownerId: string, data: CreateTeamData): Promise<Team> {
    const team = await this.teamRepository.create({
      ...data,
      owner: { connect: { id: ownerId } },
      members: {
        create: {
          user: { connect: { id: ownerId } },
          status: 'ADMIN',
        },
      },
    });

    return team;
  }

  async getTeams(
    params: SearchParams & PaginationParams & { filters?: TeamFilters },
    userId?: string
  ): Promise<{ teams: Team[]; total: number; pagination: any }> {
    const result = await this.teamRepository.search(params, userId);
    
    return {
      teams: result.teams,
      total: result.total,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  async getTeamById(teamId: string, userId?: string): Promise<Team | null> {
    const team = await this.teamRepository.findById(teamId);
    
    if (!team) return null;
    
    // Check if user has access to private team
    if (team.visibility === 'PRIVATE' && userId) {
      const isMember = await this.teamRepository.isMember(teamId, userId);
      if (!isMember) {
        throw new Error('You do not have access to this private team');
      }
    }
    
    return team;
  }

  async updateTeam(teamId: string, userId: string, data: UpdateTeamData): Promise<Team> {
    const canManage = await this.teamRepository.canManageTeam(teamId, userId);
    
    if (!canManage) {
      throw new Error('You do not have permission to update this team');
    }

    return this.teamRepository.update(teamId, data);
  }

  async deleteTeam(teamId: string, userId: string): Promise<void> {
    const isOwner = await this.teamRepository.isOwner(teamId, userId);
    
    if (!isOwner) {
      throw new Error('Only the team owner can delete the team');
    }

    await this.teamRepository.delete(teamId);
  }

  // Team Member Management
  async joinTeam(teamId: string, userId: string): Promise<TeamMember> {
    const team = await this.teamRepository.findById(teamId, false);
    
    if (!team) {
      throw new Error('Team not found');
    }

    if (team.visibility === 'PRIVATE') {
      throw new Error('This team is private. You need an invitation to join.');
    }

    if (!team.allowJoinRequests) {
      throw new Error('This team is not accepting join requests');
    }

    if (!team.isRecruiting) {
      throw new Error('This team is not currently recruiting new members');
    }

    if (team.maxMembers && team.memberCount >= team.maxMembers) {
      throw new Error('Team has reached maximum member capacity');
    }

    const isMember = await this.teamRepository.isMember(teamId, userId);
    if (isMember) {
      throw new Error('You are already a member of this team');
    }

    const member = await this.teamRepository.addMember(teamId, userId, 'MEMBER');

    // Create notification for team admins/moderators
    await this.notificationRepository.createTeamNotification(
      teamId,
      'TEAM_MEMBER_JOINED',
      'New Team Member',
      `A new member has joined your team`,
      { teamId, userId },
      userId
    );

    return member;
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    const isOwner = await this.teamRepository.isOwner(teamId, userId);
    
    if (isOwner) {
      throw new Error('Team owner cannot leave the team. Transfer ownership or delete the team instead.');
    }

    const isMember = await this.teamRepository.isMember(teamId, userId);
    if (!isMember) {
      throw new Error('You are not a member of this team');
    }

    await this.teamRepository.removeMember(teamId, userId);

    // Create notification for team admins/moderators
    await this.notificationRepository.createTeamNotification(
      teamId,
      'TEAM_MEMBER_LEFT',
      'Member Left Team',
      'A team member has left the team',
      { teamId, userId },
      userId
    );
  }

  async updateMemberStatus(teamId: string, memberId: string, status: any, requesterId: string): Promise<TeamMember> {
    const canManage = await this.teamRepository.canManageTeam(teamId, requesterId);
    
    if (!canManage) {
      throw new Error('You do not have permission to change member roles');
    }

    return this.teamRepository.updateMemberStatus(teamId, memberId, status);
  }

  async removeMember(teamId: string, memberId: string, requesterId: string): Promise<void> {
    const canManage = await this.teamRepository.canManageTeam(teamId, requesterId);
    
    if (!canManage) {
      throw new Error('You do not have permission to remove members');
    }

    const isOwner = await this.teamRepository.isOwner(teamId, memberId);
    if (isOwner) {
      throw new Error('Cannot remove team owner');
    }

    await this.teamRepository.removeMember(teamId, memberId);
  }

  // Custom Roles Management
  async createCustomRole(teamId: string, userId: string, data: CreateCustomRoleData): Promise<TeamCustomRole> {
    const canManage = await this.teamRepository.canManageTeam(teamId, userId);
    
    if (!canManage) {
      throw new Error('You do not have permission to create custom roles');
    }

    return this.teamRepository.createCustomRole(teamId, {
      team: { connect: { id: teamId } },
      ...data,
    });
  }

  async updateCustomRole(roleId: string, userId: string, data: Partial<CreateCustomRoleData>): Promise<TeamCustomRole> {
    // Implementation would check if user can manage the team that owns this role
    return this.teamRepository.updateCustomRole(roleId, data);
  }

  async deleteCustomRole(roleId: string, userId: string): Promise<void> {
    // Implementation would check permissions
    await this.teamRepository.deleteCustomRole(roleId);
  }

  async assignCustomRole(teamMemberId: string, customRoleId: string, userId: string): Promise<void> {
    // Implementation would check permissions
    await this.teamRepository.assignCustomRole(teamMemberId, customRoleId);
  }

  // Team Invitations
  async sendInvitation(
    teamId: string, 
    inviterId: string, 
    data: { inviteeId?: string; email?: string; message?: string }
  ): Promise<TeamInvitation> {
    const canManage = await this.teamRepository.canManageTeam(teamId, inviterId);
    
    if (!canManage) {
      throw new Error('You do not have permission to send invitations');
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await this.teamRepository.createInvitation({
      team: { connect: { id: teamId } },
      inviter: { connect: { id: inviterId } },
      ...(data.inviteeId && { invitee: { connect: { id: data.inviteeId } } }),
      email: data.email,
      message: data.message,
      expiresAt,
    });

    // Create notification for invitee
    if (data.inviteeId) {
      await this.notificationRepository.createConnectionNotification(
        data.inviteeId,
        inviterId,
        'TEAM_INVITATION',
        'Team Invitation',
        `You have been invited to join a team`,
        { teamId, invitationId: invitation.id }
      );
    }

    return invitation;
  }

  async respondToInvitation(invitationId: string, userId: string, accept: boolean): Promise<void> {
    const invitation = await this.teamRepository.getTeamInvitations(invitationId);
    
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const status = accept ? 'ACCEPTED' : 'DECLINED';
    await this.teamRepository.updateInvitationStatus(invitationId, status);

    if (accept) {
      await this.teamRepository.addMember(invitation[0].teamId, userId, 'MEMBER');
      
      // Notify team admins
      await this.notificationRepository.createTeamNotification(
        invitation[0].teamId,
        'TEAM_MEMBER_JOINED',
        'New Team Member',
        'A new member has accepted an invitation and joined the team',
        { teamId: invitation[0].teamId, userId },
        userId
      );
    }
  }

  // Team Join Requests
  async createJoinRequest(teamId: string, userId: string, message?: string): Promise<TeamJoinRequest> {
    const team = await this.teamRepository.findById(teamId, false);
    
    if (!team) {
      throw new Error('Team not found');
    }

    if (!team.allowJoinRequests) {
      throw new Error('This team is not accepting join requests');
    }

    const isMember = await this.teamRepository.isMember(teamId, userId);
    if (isMember) {
      throw new Error('You are already a member of this team');
    }

    const joinRequest = await this.teamRepository.createJoinRequest({
      team: { connect: { id: teamId } },
      user: { connect: { id: userId } },
      message,
    });

    // Notify team admins/moderators
    await this.notificationRepository.createTeamNotification(
      teamId,
      'TEAM_JOIN_REQUEST',
      'New Join Request',
      'Someone wants to join your team',
      { teamId, userId, requestId: joinRequest.id },
      userId
    );

    return joinRequest;
  }

  async respondToJoinRequest(requestId: string, userId: string, accept: boolean): Promise<void> {
    const requests = await this.teamRepository.getTeamJoinRequests(requestId);
    
    if (!requests || requests.length === 0) {
      throw new Error('Join request not found');
    }

    const request = requests[0];
    const canManage = await this.teamRepository.canManageTeam(request.teamId, userId);
    
    if (!canManage) {
      throw new Error('You do not have permission to respond to join requests');
    }

    const status = accept ? 'ACCEPTED' : 'DECLINED';
    await this.teamRepository.updateJoinRequestStatus(requestId, status);

    if (accept) {
      await this.teamRepository.addMember(request.teamId, request.userId, 'MEMBER');
    }

    // Notify the requester
    await this.notificationRepository.create({
      type: accept ? 'TEAM_JOIN_REQUEST_ACCEPTED' : 'TEAM_JOIN_REQUEST_DECLINED',
      title: accept ? 'Join Request Accepted' : 'Join Request Declined',
      message: accept 
        ? 'Your request to join the team has been accepted'
        : 'Your request to join the team has been declined',
      userId: request.userId,
      data: { teamId: request.teamId, requestId },
      category: 'team',
    });
  }

  // Team Following
  async followTeam(userId: string, teamId: string): Promise<void> {
    const team = await this.teamRepository.findById(teamId, false);
    
    if (!team) {
      throw new Error('Team not found');
    }

    if (team.visibility === 'PRIVATE') {
      throw new Error('Cannot follow private teams');
    }

    const isFollowing = await this.teamRepository.isFollowing(userId, teamId);
    if (isFollowing) {
      throw new Error('You are already following this team');
    }

    await this.teamRepository.followTeam(userId, teamId);
  }

  async unfollowTeam(userId: string, teamId: string): Promise<void> {
    const isFollowing = await this.teamRepository.isFollowing(userId, teamId);
    if (!isFollowing) {
      throw new Error('You are not following this team');
    }

    await this.teamRepository.unfollowTeam(userId, teamId);
  }

  // Team Projects
  async createProject(teamId: string, userId: string, data: CreateTeamProjectData): Promise<TeamProject> {
    const isMember = await this.teamRepository.isMember(teamId, userId);
    if (!isMember) {
      throw new Error('You must be a team member to create projects');
    }

    return this.teamRepository.createProject({
      ...data,
      team: { connect: { id: teamId } },
      createdBy: userId,
    });
  }

  async updateProject(projectId: string, userId: string, data: Partial<CreateTeamProjectData>): Promise<TeamProject> {
    return this.teamRepository.updateProject(projectId, data);
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    await this.teamRepository.deleteProject(projectId);
  }

  // Team Milestones
  async createMilestone(teamId: string, userId: string, data: CreateTeamMilestoneData): Promise<TeamMilestone> {
    const isMember = await this.teamRepository.isMember(teamId, userId);
    if (!isMember) {
      throw new Error('You must be a team member to create milestones');
    }

    return this.teamRepository.createMilestone({
      ...data,
      team: { connect: { id: teamId } },
      ...(data.projectId && { project: { connect: { id: data.projectId } } }),
      createdBy: userId,
    });
  }

  async completeMilestone(milestoneId: string, userId: string): Promise<TeamMilestone> {
    const milestone = await this.teamRepository.updateMilestone(milestoneId, {
      status: 'COMPLETED',
      completedAt: new Date(),
    });

    // Create notification for team members
    await this.notificationRepository.createTeamNotification(
      milestone.teamId,
      'TEAM_MILESTONE_COMPLETED',
      'Milestone Completed',
      `A team milestone has been completed: ${milestone.title}`,
      { milestoneId, teamId: milestone.teamId },
      userId
    );

    return milestone;
  }

  // Team Achievements
  async createAchievement(teamId: string, userId: string, data: CreateTeamAchievementData): Promise<TeamAchievement> {
    const isMember = await this.teamRepository.isMember(teamId, userId);
    if (!isMember) {
      throw new Error('You must be a team member to create achievements');
    }

    const achievement = await this.teamRepository.createAchievement({
      ...data,
      team: { connect: { id: teamId } },
      ...(data.milestoneId && { milestone: { connect: { id: data.milestoneId } } }),
      createdBy: userId,
    });

    if (data.isShared) {
      // Create notification for team members about shared achievement
      await this.notificationRepository.createTeamNotification(
        teamId,
        'TEAM_ACHIEVEMENT_SHARED',
        'Achievement Shared',
        `A team achievement has been shared: ${achievement.title}`,
        { achievementId: achievement.id, teamId },
        userId
      );
    }

    return achievement;
  }

  // Helper methods
  async getUserTeams(userId: string, params: PaginationParams): Promise<{ teams: Team[]; total: number }> {
    return this.teamRepository.getUserTeams(userId, params);
  }

  async getFollowedTeams(userId: string, params: PaginationParams): Promise<{ teams: Team[]; total: number }> {
    return this.teamRepository.getFollowedTeams(userId, params);
  }

  async getTeamProjects(teamId: string): Promise<TeamProject[]> {
    return this.teamRepository.getTeamProjects(teamId);
  }

  async getTeamMilestones(teamId: string): Promise<TeamMilestone[]> {
    return this.teamRepository.getTeamMilestones(teamId);
  }

  async getTeamAchievements(teamId: string): Promise<TeamAchievement[]> {
    return this.teamRepository.getTeamAchievements(teamId);
  }

  async getTeamInvitations(teamId: string, status?: any): Promise<TeamInvitation[]> {
    return this.teamRepository.getTeamInvitations(teamId, status);
  }

  async getUserInvitations(userId: string, status?: any): Promise<TeamInvitation[]> {
    return this.teamRepository.getUserInvitations(userId, status);
  }

  async getTeamJoinRequests(teamId: string, status?: any): Promise<TeamJoinRequest[]> {
    return this.teamRepository.getTeamJoinRequests(teamId, status);
  }
}