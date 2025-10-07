import { Notification, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, CreateNotificationData } from '../types';

export class NotificationRepository {
  async create(data: CreateNotificationData): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async createMany(notifications: CreateNotificationData[]): Promise<void> {
    await prisma.notification.createMany({
      data: notifications,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.NotificationUpdateInput): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    });
  }

  async getUserNotifications(
    userId: string,
    params: PaginationParams,
    filters?: {
      isRead?: boolean;
      category?: string;
      priority?: string;
      type?: any;
    }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.priority && { priority: filters.priority }),
      ...(filters?.type && { type: filters.type }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async deleteUserNotifications(userId: string, olderThanDays?: number): Promise<void> {
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(olderThanDays && {
        createdAt: {
          lt: new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000),
        },
      }),
    };

    await prisma.notification.deleteMany({ where });
  }

  async getNotificationsByType(
    userId: string,
    type: any,
    params: PaginationParams
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where = {
      userId,
      type,
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  async getNotificationsByCategory(
    userId: string,
    category: string,
    params: PaginationParams
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where = {
      userId,
      category,
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  // Team-related notification helpers
  async createTeamNotification(
    teamId: string,
    type: any,
    title: string,
    message: string,
    data?: any,
    excludeUserId?: string
  ): Promise<void> {
    // Get all team members except the excluded user
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        teamId,
        ...(excludeUserId && { userId: { not: excludeUserId } }),
        isActive: true,
      },
      select: { userId: true },
    });

    const notifications: CreateNotificationData[] = teamMembers.map(member => ({
      type,
      title,
      message,
      userId: member.userId,
      data,
      category: 'team',
    }));

    if (notifications.length > 0) {
      await this.createMany(notifications);
    }
  }

  async createConnectionNotification(
    receiverId: string,
    senderId: string,
    type: any,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    await this.create({
      type,
      title,
      message,
      userId: receiverId,
      data: {
        ...data,
        senderId,
      },
      category: 'social',
    });
  }

  async createPostNotification(
    postId: string,
    authorId: string,
    type: any,
    title: string,
    message: string,
    targetUserIds: string[],
    data?: any
  ): Promise<void> {
    const notifications: CreateNotificationData[] = targetUserIds
      .filter(userId => userId !== authorId) // Don't notify the author
      .map(userId => ({
        type,
        title,
        message,
        userId,
        data: {
          ...data,
          postId,
          authorId,
        },
        category: 'social',
      }));

    if (notifications.length > 0) {
      await this.createMany(notifications);
    }
  }

  async createSystemNotification(
    userIds: string[],
    title: string,
    message: string,
    data?: any,
    priority: string = 'normal'
  ): Promise<void> {
    const notifications: CreateNotificationData[] = userIds.map(userId => ({
      type: 'SYSTEM_ANNOUNCEMENT',
      title,
      message,
      userId,
      data,
      category: 'system',
      priority,
    }));

    if (notifications.length > 0) {
      await this.createMany(notifications);
    }
  }

  // Cleanup old notifications
  async cleanupOldNotifications(olderThanDays: number = 30): Promise<void> {
    await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000),
        },
        isRead: true,
      },
    });
  }
}