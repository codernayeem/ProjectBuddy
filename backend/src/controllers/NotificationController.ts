import { Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { AuthRequest } from '../types';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // GET /api/notifications
  getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      const isRead = req.query.isRead ? req.query.isRead === 'true' : undefined;

      const result = await this.notificationService.getUserNotifications(userId, {
        page,
        limit,
        skip: (page - 1) * limit,
        category,
        isRead,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // GET /api/notifications/unread-count
  getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const count = await this.notificationService.getUnreadCount(userId);

      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // PUT /api/notifications/:id/read
  markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const notification = await this.notificationService.markAsRead(id, userId);

      res.json(notification);
    } catch (error: any) {
      if (error.message === 'Notification not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'You can only mark your own notifications as read') {
        res.status(403).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  };

  // PUT /api/notifications/mark-all-read
  markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      await this.notificationService.markAllAsRead(userId);

      res.json({ message: 'All notifications marked as read' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // DELETE /api/notifications/:id
  deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      await this.notificationService.deleteNotification(id, userId);

      res.json({ message: 'Notification deleted' });
    } catch (error: any) {
      if (error.message === 'Notification not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'You can only delete your own notifications') {
        res.status(403).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  };

  // DELETE /api/notifications
  deleteAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      await this.notificationService.deleteAllUserNotifications(userId);

      res.json({ message: 'All notifications deleted' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
