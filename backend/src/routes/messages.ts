import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { sendMessageSchema, createConversationSchema } from '../utils/validation';

const router = Router();
const messageController = new MessageController();

// All routes require authentication
router.use(authenticate);

// ===== CONVERSATIONS =====
router.get('/conversations', messageController.getConversations);
router.post('/conversations', validate(createConversationSchema), messageController.createConversation);
router.get('/conversations/:conversationId', messageController.getConversation);
router.put('/conversations/:conversationId', messageController.updateConversation);
router.delete('/conversations/:conversationId', messageController.deleteConversation);

// Conversation participants
router.post('/conversations/:conversationId/participants', messageController.addParticipant);
router.delete('/conversations/:conversationId/participants/:userId', messageController.removeParticipant);
router.post('/conversations/:conversationId/leave', messageController.leaveConversation);
router.post('/conversations/:conversationId/mute', messageController.muteConversation);
router.post('/conversations/:conversationId/unmute', messageController.unmuteConversation);

// ===== MESSAGES =====
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/conversations/:conversationId/messages', validate(sendMessageSchema), messageController.sendMessage);
router.post('/conversations/:conversationId/read', messageController.markAsRead);

router.put('/messages/:messageId', messageController.updateMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);

// Message reactions
router.post('/messages/:messageId/reactions', messageController.addReaction);
router.delete('/messages/:messageId/reactions/:emoji', messageController.removeReaction);

// ===== DIRECT MESSAGES =====
router.get('/direct/:userId', messageController.getDirectConversation);
router.post('/direct/:userId', validate(sendMessageSchema), messageController.sendDirectMessage);

// ===== SEARCH & UTILITY =====
router.get('/search', messageController.searchMessages);
router.get('/unread-count', messageController.getUnreadCount);

export default router;
