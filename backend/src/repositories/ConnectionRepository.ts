import { Connection, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams } from '../types';

export class ConnectionRepository {
  async create(senderId: string, receiverId: string): Promise<Connection> {
    return prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
    });
  }

  async findById(id: string): Promise<Connection | null> {
    return prisma.connection.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
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

  async findByUsers(senderId: string, receiverId: string): Promise<Connection | null> {
    return prisma.connection.findUnique({
      where: {
        senderId_receiverId: {
          senderId,
          receiverId,
        },
      },
    });
  }

  async updateStatus(id: string, status: 'ACCEPTED' | 'DECLINED' | 'BLOCKED'): Promise<Connection> {
    return prisma.connection.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<Connection> {
    return prisma.connection.delete({
      where: { id },
    });
  }

  async getUserConnections(
    userId: string,
    params: PaginationParams,
    status?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED'
  ): Promise<{ connections: Connection[]; total: number }> {
    const where = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
      ...(status && { status }),
    };

    const [connections, total] = await Promise.all([
      prisma.connection.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.connection.count({ where }),
    ]);

    return { connections, total };
  }

  async getPendingRequests(
    userId: string,
    params: PaginationParams
  ): Promise<{ connections: Connection[]; total: number }> {
    const where = {
      receiverId: userId,
      status: 'PENDING' as const,
    };

    const [connections, total] = await Promise.all([
      prisma.connection.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.connection.count({ where }),
    ]);

    return { connections, total };
  }

  async areConnected(userId1: string, userId2: string): Promise<boolean> {
    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2, status: 'ACCEPTED' },
          { senderId: userId2, receiverId: userId1, status: 'ACCEPTED' },
        ],
      },
    });

    return !!connection;
  }

  async getConnectionStatus(userId1: string, userId2: string): Promise<string | null> {
    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      select: { status: true },
    });

    return connection?.status || null;
  }

  async countConnections(userId: string): Promise<number> {
    return prisma.connection.count({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' },
        ],
      },
    });
  }
}