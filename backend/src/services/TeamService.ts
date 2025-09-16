import { PrismaClient, Team, TeamMember, TeamInvitation, TeamVisibility, TeamType, TeamMemberRole, InvitationStatus } from '@prisma/client';

export interface CreateTeamData {
  name: string;
  description: string;
  visibility?: TeamVisibility;
  type?: TeamType;
  skills?: string[];
  tags?: string[];
  location?: string;
  maxMembers?: number;
  isRecruiting?: boolean;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  visibility?: TeamVisibility;
  type?: TeamType;
  skills?: string[];
  tags?: string[];
  location?: string;
  maxMembers?: number;
  isRecruiting?: boolean;
  avatar?: string;
  banner?: string;
}

export interface TeamFilters {
  page: number;
  limit: number;
  search?: string;
  type?: TeamType;
  skills?: string[];
  location?: string;
  isRecruiting?: boolean;
}

export interface InvitationData {
  inviteeId?: string;
  email?: string;
  message?: string;
}

export class TeamService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTeam(ownerId: string, data: CreateTeamData): Promise<Team> {
    const team = await this.prisma.team.create({
      data: {
        ...data,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: TeamMemberRole.OWNER
          }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    });

    return team;
  }

  async getTeams(filters: TeamFilters) {
    const { page, limit, search, type, skills, location, isRecruiting } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      visibility: {
        in: [TeamVisibility.PUBLIC, TeamVisibility.INVITE_ONLY]
      }
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    if (type) {
      where.type = type;
    }

    if (skills && skills.length > 0) {
      where.skills = {
        hasMany: skills
      };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (typeof isRecruiting === 'boolean') {
      where.isRecruiting = isRecruiting;
    }

    const [teams, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          _count: {
            select: {
              members: true,
              projects: true
            }
          }
        }
      }),
      this.prisma.team.count({ where })
    ]);

    return {
      teams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getTeamById(teamId: string) {
    return await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
                skills: true,
                position: true
              }
            }
          },
          orderBy: { joinedAt: 'asc' }
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            tags: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            members: true,
            projects: true,
            posts: true
          }
        }
      }
    });
  }

  async updateTeam(teamId: string, userId: string, data: UpdateTeamData): Promise<Team> {
    // Check if user is owner or admin
    const membership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!membership || (membership.role !== TeamMemberRole.OWNER && membership.role !== TeamMemberRole.ADMIN)) {
      throw new Error('You do not have permission to update this team');
    }

    return await this.prisma.team.update({
      where: { id: teamId },
      data,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    });
  }

  async deleteTeam(teamId: string, userId: string): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new Error('Only the team owner can delete the team');
    }

    await this.prisma.team.delete({
      where: { id: teamId }
    });
  }

  async joinTeam(teamId: string, userId: string): Promise<TeamMember> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.visibility === TeamVisibility.PRIVATE) {
      throw new Error('This team is private and requires an invitation');
    }

    if (!team.isRecruiting) {
      throw new Error('This team is not currently recruiting new members');
    }

    if (team.maxMembers && team._count.members >= team.maxMembers) {
      throw new Error('Team has reached maximum member capacity');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (existingMember) {
      throw new Error('You are already a member of this team');
    }

    return await this.prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role: TeamMemberRole.MEMBER
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async leaveTeam(teamId: string, userId: string): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId }
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId === userId) {
      throw new Error('Team owner cannot leave the team. Transfer ownership or delete the team instead.');
    }

    const membership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });

    if (!membership) {
      throw new Error('You are not a member of this team');
    }

    await this.prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });
  }

  async getTeamMembers(teamId: string) {
    return await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            skills: true,
            position: true,
            company: true
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'asc' }
      ]
    });
  }

  async updateMemberRole(teamId: string, memberId: string, role: TeamMemberRole, requesterId: string): Promise<TeamMember> {
    // Check if requester has permission
    const requesterMembership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: requesterId
        }
      }
    });

    if (!requesterMembership || (requesterMembership.role !== TeamMemberRole.OWNER && requesterMembership.role !== TeamMemberRole.ADMIN)) {
      throw new Error('You do not have permission to change member roles');
    }

    // Cannot change owner role or promote to owner
    if (role === TeamMemberRole.OWNER || requesterMembership.role === TeamMemberRole.OWNER) {
      throw new Error('Owner role cannot be changed');
    }

    return await this.prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
  }

  async removeMember(teamId: string, memberId: string, requesterId: string): Promise<void> {
    // Check if requester has permission
    const requesterMembership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: requesterId
        }
      }
    });

    if (!requesterMembership || (requesterMembership.role !== TeamMemberRole.OWNER && requesterMembership.role !== TeamMemberRole.ADMIN)) {
      throw new Error('You do not have permission to remove members');
    }

    const memberToRemove = await this.prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { team: true }
    });

    if (!memberToRemove) {
      throw new Error('Member not found');
    }

    if (memberToRemove.team.ownerId === memberToRemove.userId) {
      throw new Error('Cannot remove team owner');
    }

    await this.prisma.teamMember.delete({
      where: { id: memberId }
    });
  }

  async sendInvitation(teamId: string, inviterId: string, data: InvitationData): Promise<TeamInvitation> {
    // Check if inviter has permission
    const inviterMembership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: inviterId
        }
      }
    });

    if (!inviterMembership || (inviterMembership.role !== TeamMemberRole.OWNER && inviterMembership.role !== TeamMemberRole.ADMIN)) {
      throw new Error('You do not have permission to send invitations');
    }

    // Set expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return await this.prisma.teamInvitation.create({
      data: {
        teamId,
        inviterId,
        inviteeId: data.inviteeId,
        email: data.email,
        message: data.message,
        expiresAt
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        inviter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        invitee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
  }

  async respondToInvitation(invitationId: string, userId: string, status: InvitationStatus): Promise<TeamInvitation> {
    const invitation = await this.prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: { team: true }
    });

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.inviteeId !== userId) {
      throw new Error('You can only respond to your own invitations');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error('This invitation has already been responded to');
    }

    if (invitation.expiresAt < new Date()) {
      throw new Error('This invitation has expired');
    }

    const updatedInvitation = await this.prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status },
      include: {
        team: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // If accepted, add user to team
    if (status === InvitationStatus.ACCEPTED) {
      await this.prisma.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId,
          role: TeamMemberRole.MEMBER
        }
      });
    }

    return updatedInvitation;
  }

  async getUserTeams(userId: string) {
    return await this.prisma.teamMember.findMany({
      where: { userId },
      include: {
        team: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            },
            _count: {
              select: {
                members: true,
                projects: true
              }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });
  }

  async getRecommendedTeams(userId: string) {
    // Get user's skills and interests
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        skills: true,
        teamMemberships: {
          select: { teamId: true }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userTeamIds = user.teamMemberships.map(m => m.teamId);

    // Find teams with matching skills that user is not already in
    return await this.prisma.team.findMany({
      where: {
        AND: [
          { id: { notIn: userTeamIds } },
          { visibility: { in: [TeamVisibility.PUBLIC, TeamVisibility.INVITE_ONLY] } },
          { isRecruiting: true },
          user.skills.length > 0 ? {
            skills: {
              hasSome: user.skills
            }
          } : {}
        ]
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      },
      take: 10,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserInvitations(userId: string, status?: string) {
    const where: any = {
      inviteeId: userId,
      expiresAt: {
        gt: new Date()
      }
    };

    if (status) {
      where.status = status;
    } else {
      where.status = InvitationStatus.PENDING;
    }

    return await this.prisma.teamInvitation.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            description: true,
            avatar: true
          }
        },
        inviter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}