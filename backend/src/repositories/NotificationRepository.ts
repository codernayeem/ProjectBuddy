import { prisma } from '../config/database';
import { PaginationParams } from '../types';
import { Notification, NotificationType } from '@prisma/client';

export class NotificationRepository {
  async create(data: {
    type: NotificationType;
    title: string;
    message: string;
    userId: string;
    isRead?: boolean;
    data?: any;
    actionUrl?: string;
    priority?: string;
    category?: string;
  }): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async getUserNotifications(
    userId: string,
    params: PaginationParams,
    unreadOnly?: boolean
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
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
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return result.count;
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async deleteOld(daysOld: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        isRead: true,
      },
    });

    return result.count;
  }
}