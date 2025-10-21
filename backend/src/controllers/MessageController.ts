import { Response } from 'express';
import { MessageService } from '../services/MessageService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthRequest } from '../types';
import { ConversationType, MessageType } from '@prisma/client';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  // ===== CONVERSATIONS =====

  getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);
      const params = {
        ...pagination,
        skip: (pagination.page - 1) * pagination.limit,
      };

      const result = await this.messageService.getConversations(req.user.id, params);

      res.json(createResponse(true, 'Conversations retrieved successfully', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get conversations';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;

      const conversation = await this.messageService.getConversation(conversationId, req.user.id);

      res.json(createResponse(true, 'Conversation retrieved successfully', conversation));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get conversation';
      res.status(error instanceof Error && error.message.includes('not found') ? 404 : 500)
        .json(createErrorResponse(errorMessage));
    }
  };

  createConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { type, participantIds, title, description, avatar, teamId } = req.body;

      const conversation = await this.messageService.createConversation({
        type: type || ConversationType.DIRECT_MESSAGE,
        participantIds,
        createdBy: req.user.id,
        title,
        description,
        avatar,
        teamId,
      });

      res.status(201).json(createResponse(true, 'Conversation created successfully', conversation));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  updateConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;
      const { title, description, avatar } = req.body;

      const conversation = await this.messageService.updateConversation(
        conversationId,
        req.user.id,
        { title, description, avatar }
      );

      res.json(createResponse(true, 'Conversation updated successfully', conversation));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update conversation';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  deleteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;

      await this.messageService.deleteConversation(conversationId, req.user.id);

      res.json(createResponse(true, 'Conversation deleted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // ===== PARTICIPANTS =====

  addParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;
      const { userId, role } = req.body;

      const participant = await this.messageService.addParticipant(conversationId, req.user.id, userId, role);

      res.json(createResponse(true, 'Participant added successfully', participant));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add participant';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  removeParticipant = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId, userId } = req.params;

      await this.messageService.removeParticipant(conversationId, req.user.id, userId);

      res.json(createResponse(true, 'Participant removed successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove participant';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  leaveConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;

      await this.messageService.leaveConversation(conversationId, req.user.id);

      res.json(createResponse(true, 'Left conversation successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave conversation';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  muteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;

      await this.messageService.muteConversation(conversationId, req.user.id);

      res.json(createResponse(true, 'Conversation muted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mute conversation';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  unmuteConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;

      await this.messageService.unmuteConversation(conversationId, req.user.id);

      res.json(createResponse(true, 'Conversation unmuted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unmute conversation';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // ===== MESSAGES =====

  getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;
      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);
      const params = {
        ...pagination,
        skip: (pagination.page - 1) * pagination.limit,
      };

      const result = await this.messageService.getMessages(conversationId, req.user.id, params);

      res.json(createResponse(true, 'Messages retrieved successfully', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get messages';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;
      const { content, type, replyToId, attachments, metadata } = req.body;

      const message = await this.messageService.sendMessage({
        conversationId,
        content,
        type: type || MessageType.TEXT,
        senderId: req.user.id,
        replyToId,
        attachments,
        metadata,
      });

      res.status(201).json(createResponse(true, 'Message sent successfully', message));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  updateMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { messageId } = req.params;
      const { content } = req.body;

      const message = await this.messageService.updateMessage(messageId, req.user.id, content);

      res.json(createResponse(true, 'Message updated successfully', message));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update message';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { messageId } = req.params;

      await this.messageService.deleteMessage(messageId, req.user.id);

      res.json(createResponse(true, 'Message deleted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { conversationId } = req.params;
      const { messageId } = req.body;

      await this.messageService.markAsRead(conversationId, req.user.id, messageId);

      res.json(createResponse(true, 'Messages marked as read'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark messages as read';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // ===== DIRECT MESSAGES =====

  getDirectConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { userId } = req.params;

      const conversation = await this.messageService.getOrCreateDirectConversation(req.user.id, userId);

      res.json(createResponse(true, 'Direct conversation retrieved successfully', conversation));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get direct conversation';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  sendDirectMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { userId } = req.params;
      const { content, type, attachments } = req.body;

      const message = await this.messageService.sendDirectMessage(req.user.id, userId, {
        content,
        type,
        attachments,
      });

      res.status(201).json(createResponse(true, 'Direct message sent successfully', message));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send direct message';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // ===== TEAM CHAT =====

  getTeamConversation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { teamId } = req.params;

      const conversation = await this.messageService.getOrCreateTeamConversation(req.user.id, teamId);

      res.json(createResponse(true, 'Team conversation retrieved successfully', conversation));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get team conversation';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // ===== REACTIONS =====

  addReaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { messageId } = req.params;
      const { emoji } = req.body;

      const reaction = await this.messageService.addReaction(messageId, req.user.id, emoji);

      res.json(createResponse(true, 'Reaction added successfully', reaction));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add reaction';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  removeReaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { messageId, emoji } = req.params;

      await this.messageService.removeReaction(messageId, req.user.id, emoji);

      res.json(createResponse(true, 'Reaction removed successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove reaction';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // ===== SEARCH & UTILITY =====

  searchMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { query, conversationId } = req.query;

      const messages = await this.messageService.searchMessages(
        query as string,
        req.user.id,
        conversationId as string
      );

      res.json(createResponse(true, 'Messages found', messages));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search messages';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const result = await this.messageService.getUnreadCount(req.user.id);

      res.json(createResponse(true, 'Unread count retrieved successfully', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get unread count';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };
}
