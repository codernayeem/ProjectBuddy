import { prisma } from '../config/database';

export class TeamRoleRepository {
  // Get all custom roles for a team
  async getTeamRoles(teamId: string) {
    return prisma.teamCustomRole.findMany({
      where: { teamId },
      include: {
        members: {
          include: {
            teamMember: {
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
            },
          },
        },
      },
      orderBy: [{ isAdmin: 'desc' }, { createdAt: 'asc' }],
    });
  }

  // Get a specific role
  async getRoleById(roleId: string) {
    return prisma.teamCustomRole.findUnique({
      where: { id: roleId },
      include: {
        team: true,
        members: {
          include: {
            teamMember: {
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
            },
          },
        },
      },
    });
  }

  // Create a custom role
  async createRole(data: {
    teamId: string;
    name: string;
    description?: string;
    color?: string;
    isAdmin?: boolean;
  }) {
    return prisma.teamCustomRole.create({
      data,
    });
  }

  // Update a role
  async updateRole(roleId: string, data: {
    name?: string;
    description?: string;
    color?: string;
    isAdmin?: boolean;
  }) {
    return prisma.teamCustomRole.update({
      where: { id: roleId },
      data,
    });
  }

  // Delete a role
  async deleteRole(roleId: string) {
    return prisma.teamCustomRole.delete({
      where: { id: roleId },
    });
  }

  // Assign role to member
  async assignRoleToMember(teamMemberId: string, customRoleId: string) {
    return prisma.teamMemberCustomRole.create({
      data: {
        teamMemberId,
        customRoleId,
      },
    });
  }

  // Remove role from member
  async removeRoleFromMember(teamMemberId: string, customRoleId: string) {
    return prisma.teamMemberCustomRole.deleteMany({
      where: {
        teamMemberId,
        customRoleId,
      },
    });
  }

  // Get member's roles
  async getMemberRoles(teamMemberId: string) {
    return prisma.teamMemberCustomRole.findMany({
      where: { teamMemberId },
      include: {
        customRole: true,
      },
    });
  }
}
