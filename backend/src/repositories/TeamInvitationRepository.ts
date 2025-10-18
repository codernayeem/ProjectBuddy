import { prisma } from '../config/database';
import { InvitationStatus } from '@prisma/client';
import { PaginationParams } from '../types';

export class TeamInvitationRepository {
  // Create invitation
  async createInvitation(data: {
    teamId: string;
    inviterId: string;
    inviteeId?: string;
    email?: string;
    message?: string;
    expiresAt: Date;
  }) {
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

  // Get team invitations
  async getTeamInvitations(
    teamId: string,
    status?: InvitationStatus,
    params?: PaginationParams
  ) {
    const where: any = { teamId };
    if (status) where.status = status;

    const [invitations, total] = await Promise.all([
      prisma.teamInvitation.findMany({
        where,
        include: {
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
        skip: params?.skip || 0,
        take: params?.limit || 20,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.teamInvitation.count({ where }),
    ]);

    return { invitations, total };
  }

  // Get user invitations
  async getUserInvitations(
    userId: string,
    status?: InvitationStatus,
    params?: PaginationParams
  ) {
    const where: any = { inviteeId: userId };
    if (status) where.status = status;

    const [invitations, total] = await Promise.all([
      prisma.teamInvitation.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              description: true,
              avatar: true,
              type: true,
              memberCount: true,
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
        skip: params?.skip || 0,
        take: params?.limit || 20,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.teamInvitation.count({ where }),
    ]);

    return { invitations, total };
  }

  // Get invitation by ID
  async getInvitationById(invitationId: string) {
    return prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: {
        team: true,
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

  // Update invitation status
  async updateInvitation(invitationId: string, status: InvitationStatus) {
    return prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status },
    });
  }

  // Delete invitation
  async deleteInvitation(invitationId: string) {
    return prisma.teamInvitation.delete({
      where: { id: invitationId },
    });
  }

  // Check if invitation exists
  async checkInvitationExists(teamId: string, inviteeId?: string, email?: string) {
    const where: any = {
      teamId,
      status: InvitationStatus.PENDING,
    };

    if (inviteeId) where.inviteeId = inviteeId;
    if (email) where.email = email;

    return prisma.teamInvitation.findFirst({ where });
  }
}
