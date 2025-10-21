import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const notificationController = new NotificationController();

// All notification routes require authentication
router.use(authenticate);

// GET /api/notifications - Get user's notifications
router.get('/', notificationController.getUserNotifications);

// GET /api/notifications/unread-count - Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Mark single notification as read
router.put('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id - Delete single notification
router.delete('/:id', notificationController.deleteNotification);

// DELETE /api/notifications - Delete all notifications
router.delete('/', notificationController.deleteAllNotifications);

export default router;
