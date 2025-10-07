import { 
  Team, 
  TeamMember, 
  TeamCustomRole, 
  TeamInvitation, 
  TeamJoinRequest, 
  TeamProject, 
  TeamMilestone, 
  TeamAchievement,
  TeamFollow,
  Prisma 
} from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, SearchParams, TeamFilters } from '../types';

export class TeamRepository {
  // Team CRUD operations
  async create(data: Prisma.TeamCreateInput): Promise<Team> {
    return prisma.team.create({ 
      data,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findById(id: string, includeMembers = true): Promise<Team | null> {
    return prisma.team.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        members: includeMembers ? {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            customRoles: {
              include: {
                customRole: true,
              },
            },
          },
        } : false,
        customRoles: true,
        _count: {
          select: {
            members: true,
            followers: true,
            projects: true,
            posts: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.TeamUpdateInput): Promise<Team> {
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Team> {
    return prisma.team.delete({
      where: { id },
    });
  }

  async search(
    params: SearchParams & PaginationParams & { filters?: TeamFilters },
    userId?: string
  ): Promise<{ teams: Team[]; total: number }> {
    const where: Prisma.TeamWhereInput = {
      AND: [
        params.query
          ? {
              OR: [
                { name: { contains: params.query, mode: 'insensitive' } },
                { description: { contains: params.query, mode: 'insensitive' } },
                { tags: { hasSome: [params.query] } },
                { skills: { hasSome: [params.query] } },
              ],
            }
          : {},
        params.filters?.visibility ? { visibility: params.filters.visibility } : {},
        params.filters?.type ? { type: params.filters.type } : {},
        params.filters?.country ? { country: params.filters.country } : {},
        params.filters?.city ? { city: params.filters.city } : {},
        params.filters?.isRecruiting !== undefined ? { isRecruiting: params.filters.isRecruiting } : {},
        params.filters?.skills ? { skills: { hasSome: params.filters.skills } } : {},
        // Only show public teams or teams user is a member of
        userId
          ? {
              OR: [
                { visibility: 'PUBLIC' },
                { members: { some: { userId } } },
              ],
            }
          : { visibility: 'PUBLIC' },
      ],
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              followers: true,
              projects: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    return { teams, total };
  }

  async getUserTeams(
    userId: string,
    params: PaginationParams
  ): Promise<{ teams: Team[]; total: number }> {
    const where: Prisma.TeamWhereInput = {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          members: {
            where: { userId },
            select: { status: true },
          },
          _count: {
            select: {
              members: true,
              followers: true,
              projects: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    return { teams, total };
  }

  // Team Member Management
  async addMember(teamId: string, userId: string, status = 'MEMBER' as const): Promise<TeamMember> {
    return prisma.teamMember.create({
      data: {
        teamId,
        userId,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async removeMember(teamId: string, userId: string): Promise<TeamMember> {
    return prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });
  }

  async updateMemberStatus(teamId: string, userId: string, status: any): Promise<TeamMember> {
    return prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: { status },
    });
  }

  async getMemberStatus(teamId: string, userId: string): Promise<string | null> {
    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      select: { status: true },
    });

    return member?.status || null;
  }

  async isMember(teamId: string, userId: string): Promise<boolean> {
    const count = await prisma.teamMember.count({
      where: {
        teamId,
        userId,
        isActive: true,
      },
    });

    return count > 0;
  }

  async isOwner(teamId: string, userId: string): Promise<boolean> {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });

    return team?.ownerId === userId;
  }

  async canManageTeam(teamId: string, userId: string): Promise<boolean> {
    if (await this.isOwner(teamId, userId)) return true;

    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      select: { status: true },
    });

    return member?.status === 'ADMIN' || member?.status === 'MODERATOR';
  }

  // Custom Roles Management
  async createCustomRole(teamId: string, data: Prisma.TeamCustomRoleCreateInput): Promise<TeamCustomRole> {
    return prisma.teamCustomRole.create({
      data: {
        ...data,
        team: { connect: { id: teamId } },
      },
    });
  }

  async updateCustomRole(roleId: string, data: Prisma.TeamCustomRoleUpdateInput): Promise<TeamCustomRole> {
    return prisma.teamCustomRole.update({
      where: { id: roleId },
      data,
    });
  }

  async deleteCustomRole(roleId: string): Promise<TeamCustomRole> {
    return prisma.teamCustomRole.delete({
      where: { id: roleId },
    });
  }

  async assignCustomRole(teamMemberId: string, customRoleId: string): Promise<void> {
    await prisma.teamMemberCustomRole.create({
      data: {
        teamMemberId,
        customRoleId,
      },
    });
  }

  async removeCustomRole(teamMemberId: string, customRoleId: string): Promise<void> {
    await prisma.teamMemberCustomRole.delete({
      where: {
        teamMemberId_customRoleId: {
          teamMemberId,
          customRoleId,
        },
      },
    });
  }

  // Team Invitations
  async createInvitation(data: Prisma.TeamInvitationCreateInput): Promise<TeamInvitation> {
    return prisma.teamInvitation.create({
      data,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        inviter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        invitee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateInvitationStatus(invitationId: string, status: any): Promise<TeamInvitation> {
    return prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status },
    });
  }

  async getTeamInvitations(teamId: string, status?: any): Promise<TeamInvitation[]> {
    return prisma.teamInvitation.findMany({
      where: {
        teamId,
        ...(status && { status }),
      },
      include: {
        invitee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        inviter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserInvitations(userId: string, status?: any): Promise<TeamInvitation[]> {
    return prisma.teamInvitation.findMany({
      where: {
        inviteeId: userId,
        ...(status && { status }),
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
            description: true,
          },
        },
        inviter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Team Join Requests
  async createJoinRequest(data: Prisma.TeamJoinRequestCreateInput): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.create({
      data,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateJoinRequestStatus(requestId: string, status: any): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  async getTeamJoinRequests(teamId: string, status?: any): Promise<TeamJoinRequest[]> {
    return prisma.teamJoinRequest.findMany({
      where: {
        teamId,
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            skills: true,
            bio: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Team Following
  async followTeam(userId: string, teamId: string): Promise<TeamFollow> {
    return prisma.teamFollow.create({
      data: {
        userId,
        teamId,
      },
    });
  }

  async unfollowTeam(userId: string, teamId: string): Promise<TeamFollow> {
    return prisma.teamFollow.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });
  }

  async isFollowing(userId: string, teamId: string): Promise<boolean> {
    const count = await prisma.teamFollow.count({
      where: {
        userId,
        teamId,
      },
    });

    return count > 0;
  }

  async getFollowedTeams(userId: string, params: PaginationParams): Promise<{ teams: Team[]; total: number }> {
    const where = {
      followers: {
        some: {
          userId,
        },
      },
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              followers: true,
              projects: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.team.count({ where }),
    ]);

    return { teams, total };
  }

  // Team Projects
  async createProject(data: Prisma.TeamProjectCreateInput): Promise<TeamProject> {
    return prisma.teamProject.create({
      data,
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateProject(projectId: string, data: Prisma.TeamProjectUpdateInput): Promise<TeamProject> {
    return prisma.teamProject.update({
      where: { id: projectId },
      data,
    });
  }

  async deleteProject(projectId: string): Promise<TeamProject> {
    return prisma.teamProject.delete({
      where: { id: projectId },
    });
  }

  async getTeamProjects(teamId: string): Promise<TeamProject[]> {
    return prisma.teamProject.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Team Milestones
  async createMilestone(data: Prisma.TeamMilestoneCreateInput): Promise<TeamMilestone> {
    return prisma.teamMilestone.create({
      data,
      include: {
        project: true,
      },
    });
  }

  async updateMilestone(milestoneId: string, data: Prisma.TeamMilestoneUpdateInput): Promise<TeamMilestone> {
    return prisma.teamMilestone.update({
      where: { id: milestoneId },
      data,
    });
  }

  async getTeamMilestones(teamId: string): Promise<TeamMilestone[]> {
    return prisma.teamMilestone.findMany({
      where: { teamId },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Team Achievements
  async createAchievement(data: Prisma.TeamAchievementCreateInput): Promise<TeamAchievement> {
    return prisma.teamAchievement.create({
      data,
      include: {
        milestone: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getTeamAchievements(teamId: string): Promise<TeamAchievement[]> {
    return prisma.teamAchievement.findMany({
      where: { teamId },
      include: {
        milestone: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}