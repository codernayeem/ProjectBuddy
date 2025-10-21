import { NotificationRepository } from '../repositories/NotificationRepository';
import { PaginationParams } from '../types';
import { Notification } from '@prisma/client';

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async getUserNotifications(
    userId: string,
    params: PaginationParams & { 
      category?: string;
      isRead?: boolean;
    }
  ): Promise<{ data: Notification[]; pagination: any }> {
    const filters: any = {};
    
    if (params.category) {
      filters.category = params.category;
    }
    
    if (params.isRead !== undefined) {
      filters.isRead = params.isRead;
    }

    const result = await this.notificationRepository.getUserNotifications(
      userId,
      {
        page: params.page,
        limit: params.limit,
        skip: params.skip,
      },
      filters
    );

    return {
      data: result.notifications,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.getUnreadCount(userId);
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You can only mark your own notifications as read');
    }

    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new Error('You can only delete your own notifications');
    }

    await this.notificationRepository.delete(notificationId);
  }

  async deleteAllUserNotifications(userId: string): Promise<void> {
    await this.notificationRepository.deleteUserNotifications(userId);
  }
}
