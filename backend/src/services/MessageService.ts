import { MessageRepository } from '../repositories/MessageRepository';
import { ConversationType, MessageType } from '@prisma/client';
import { PaginationParams } from '../types';

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  // ===== CONVERSATIONS =====

  async getConversations(userId: string, params: PaginationParams) {
    return this.messageRepository.getConversationsByUserId(userId, params);
  }

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.messageRepository.getConversationById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    return conversation;
  }

  async getOrCreateDirectConversation(userId1: string, userId2: string) {
    // Check if direct conversation already exists
    let conversation = await this.messageRepository.getDirectConversation(userId1, userId2);

    if (!conversation) {
      // Create new direct conversation
      conversation = await this.messageRepository.createConversation({
        type: ConversationType.DIRECT_MESSAGE,
        participantIds: [userId1, userId2],
        createdBy: userId1,
      });
    }

    return conversation;
  }

  async createConversation(data: {
    type: ConversationType;
    participantIds: string[];
    createdBy: string;
    title?: string;
    description?: string;
    avatar?: string;
    teamId?: string;
  }) {
    // Validate participants
    if (!data.participantIds || data.participantIds.length < 2) {
      throw new Error('At least 2 participants are required');
    }

    // For direct messages, only allow 2 participants
    if (data.type === ConversationType.DIRECT_MESSAGE && data.participantIds.length > 2) {
      throw new Error('Direct message can only have 2 participants');
    }

    return this.messageRepository.createConversation(data);
  }

  async updateConversation(
    conversationId: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      avatar?: string;
    }
  ) {
    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    return this.messageRepository.updateConversation(conversationId, data);
  }

  async deleteConversation(conversationId: string, userId: string) {
    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    await this.messageRepository.deleteConversation(conversationId);
  }

  // ===== PARTICIPANTS =====

  async addParticipant(conversationId: string, userId: string, newUserId: string, role = 'member') {
    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    return this.messageRepository.addParticipant(conversationId, newUserId, role);
  }

  async removeParticipant(conversationId: string, userId: string, removeUserId: string) {
    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    await this.messageRepository.removeParticipant(conversationId, removeUserId);
  }

  async leaveConversation(conversationId: string, userId: string) {
    await this.messageRepository.removeParticipant(conversationId, userId);
  }

  async muteConversation(conversationId: string, userId: string) {
    await this.messageRepository.muteConversation(conversationId, userId);
  }

  async unmuteConversation(conversationId: string, userId: string) {
    await this.messageRepository.unmuteConversation(conversationId, userId);
  }

  // ===== MESSAGES =====

  async getMessages(conversationId: string, userId: string, params: PaginationParams) {
    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    return this.messageRepository.getMessagesByConversationId(conversationId, params);
  }

  async sendMessage(data: {
    conversationId: string;
    content: string;
    type?: MessageType;
    senderId: string;
    receiverId?: string;
    replyToId?: string;
    attachments?: string[];
    metadata?: any;
  }) {
    // Check if user is a participant
    const isParticipant = await this.messageRepository.isParticipant(data.conversationId, data.senderId);
    if (!isParticipant) {
      throw new Error('You are not a participant in this conversation');
    }

    return this.messageRepository.createMessage({
      content: data.content,
      type: data.type || MessageType.TEXT,
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversationId: data.conversationId,
      replyToId: data.replyToId,
      attachments: data.attachments,
      metadata: data.metadata,
    });
  }

  async sendDirectMessage(senderId: string, receiverId: string, data: {
    content: string;
    type?: MessageType;
    attachments?: string[];
  }) {
    // Get or create direct conversation
    const conversation = await this.getOrCreateDirectConversation(senderId, receiverId);

    // Send message
    return this.messageRepository.createMessage({
      content: data.content,
      type: data.type || MessageType.TEXT,
      senderId,
      receiverId,
      conversationId: conversation.id,
      attachments: data.attachments,
    });
  }

  async updateMessage(messageId: string, userId: string, content: string) {
    // TODO: Add check to verify user owns the message
    return this.messageRepository.updateMessage(messageId, content);
  }

  async deleteMessage(messageId: string, userId: string) {
    // TODO: Add check to verify user owns the message
    await this.messageRepository.deleteMessage(messageId);
  }

  async markAsRead(conversationId: string, userId: string, messageId?: string) {
    await this.messageRepository.markMessagesAsRead(conversationId, userId, messageId);
  }

  // ===== REACTIONS =====

  async addReaction(messageId: string, userId: string, emoji: string) {
    return this.messageRepository.addReaction(messageId, userId, emoji);
  }

  async removeReaction(messageId: string, userId: string, emoji: string) {
    await this.messageRepository.removeReaction(messageId, userId, emoji);
  }

  // ===== SEARCH & UTILITY =====

  async searchMessages(query: string, userId: string, conversationId?: string) {
    return this.messageRepository.searchMessages(query, userId, conversationId);
  }

  async getUnreadCount(userId: string) {
    const count = await this.messageRepository.getUnreadCount(userId);
    return { count };
  }
}
