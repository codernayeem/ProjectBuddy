import { TeamJoinRequest, JoinRequestStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams } from '../types';

export class TeamJoinRequestRepository {
  /**
   * Create a new join request
   */
  async createRequest(
    data: Prisma.TeamJoinRequestUncheckedCreateInput
  ): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.create({
      data,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
            visibility: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });
  }

  /**
   * Get join requests for a team
   */
  async getTeamRequests(
    teamId: string,
    status?: JoinRequestStatus,
    params?: PaginationParams
  ) {
    const where: Prisma.TeamJoinRequestWhereInput = {
      teamId,
      ...(status && { status }),
    };

    const [requests, total] = await Promise.all([
      prisma.teamJoinRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        ...(params && {
          skip: params.skip,
          take: params.limit,
        }),
      }),
      prisma.teamJoinRequest.count({ where }),
    ]);

    return {
      requests,
      total,
      page: params?.page || 1,
      limit: params?.limit || 20,
      pages: params ? Math.ceil(total / params.limit) : 1,
    };
  }

  /**
   * Get join requests by a user
   */
  async getUserRequests(
    userId: string,
    status?: JoinRequestStatus,
    params?: PaginationParams
  ) {
    const where: Prisma.TeamJoinRequestWhereInput = {
      userId,
      ...(status && { status }),
    };

    const [requests, total] = await Promise.all([
      prisma.teamJoinRequest.findMany({
        where,
        include: {
          team: {
            select: {
              id: true,
              name: true,
              avatar: true,
              description: true,
              visibility: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        ...(params && {
          skip: params.skip,
          take: params.limit,
        }),
      }),
      prisma.teamJoinRequest.count({ where }),
    ]);

    return {
      requests,
      total,
      page: params?.page || 1,
      limit: params?.limit || 20,
      pages: params ? Math.ceil(total / params.limit) : 1,
    };
  }

  /**
   * Get a specific join request by ID
   */
  async getRequestById(requestId: string): Promise<TeamJoinRequest | null> {
    return prisma.teamJoinRequest.findUnique({
      where: { id: requestId },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
            visibility: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });
  }

  /**
   * Update join request status
   */
  async updateRequest(
    requestId: string,
    status: JoinRequestStatus
  ): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.update({
      where: { id: requestId },
      data: { 
        status,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
            visibility: true,
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

  /**
   * Delete a join request
   */
  async deleteRequest(requestId: string): Promise<TeamJoinRequest> {
    return prisma.teamJoinRequest.delete({
      where: { id: requestId },
    });
  }

  /**
   * Check if a join request already exists
   */
  async checkRequestExists(
    teamId: string,
    userId: string
  ): Promise<TeamJoinRequest | null> {
    return prisma.teamJoinRequest.findFirst({
      where: {
        teamId,
        userId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Get pending requests count for a team
   */
  async getPendingCount(teamId: string): Promise<number> {
    return prisma.teamJoinRequest.count({
      where: {
        teamId,
        status: 'PENDING',
      },
    });
  }
}
