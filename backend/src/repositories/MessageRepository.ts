import { prisma } from '../config/database';
import { Message, Conversation, ConversationParticipant, MessageType, ConversationType } from '@prisma/client';
import { PaginationParams } from '../types';

export class MessageRepository {
  // ===== CONVERSATIONS =====
  
  async getConversationsByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<{ conversations: any[]; total: number }> {
    const where = {
      participants: {
        some: {
          userId,
          isActive: true,
        },
      },
      isArchived: false,
    };

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  isActive: true,
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              type: true,
              senderId: true,
              createdAt: true,
              readBy: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { lastMessageAt: 'desc' },
      }),
      prisma.conversation.count({ where }),
    ]);

    return { conversations, total };
  }

  async getConversationById(conversationId: string): Promise<any | null> {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async getDirectConversation(userId1: string, userId2: string): Promise<any | null> {
    return prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT_MESSAGE,
        AND: [
          {
            participants: {
              some: { userId: userId1 },
            },
          },
          {
            participants: {
              some: { userId: userId2 },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async getTeamConversation(teamId: string): Promise<any | null> {
    return prisma.conversation.findFirst({
      where: {
        type: ConversationType.TEAM_CHAT,
        teamId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async createConversation(data: {
    type: ConversationType;
    participantIds: string[];
    createdBy: string;
    title?: string;
    description?: string;
    avatar?: string;
    teamId?: string;
  }): Promise<Conversation> {
    return prisma.conversation.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        avatar: data.avatar,
        isGroup: data.participantIds.length > 2,
        teamId: data.teamId,
        createdBy: data.createdBy,
        participants: {
          create: data.participantIds.map((userId) => ({
            userId,
            role: userId === data.createdBy ? 'admin' : 'member',
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async updateConversation(
    conversationId: string,
    data: {
      title?: string;
      description?: string;
      avatar?: string;
    }
  ): Promise<Conversation> {
    return prisma.conversation.update({
      where: { id: conversationId },
      data,
    });
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await prisma.conversation.delete({
      where: { id: conversationId },
    });
  }

  // ===== PARTICIPANTS =====

  async addParticipant(conversationId: string, userId: string, role: string): Promise<ConversationParticipant> {
    return prisma.conversationParticipant.create({
      data: {
        conversationId,
        userId,
        role,
      },
    });
  }

  async removeParticipant(conversationId: string, userId: string): Promise<void> {
    await prisma.conversationParticipant.delete({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });
  }

  async updateParticipantRole(conversationId: string, userId: string, role: string): Promise<void> {
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: { role },
    });
  }

  async muteConversation(conversationId: string, userId: string): Promise<void> {
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: { isMuted: true },
    });
  }

  async unmuteConversation(conversationId: string, userId: string): Promise<void> {
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: { isMuted: false },
    });
  }

  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });
    return !!participant;
  }

  // ===== MESSAGES =====

  async getMessagesByConversationId(
    conversationId: string,
    params: PaginationParams
  ): Promise<{ messages: any[]; total: number }> {
    const where = {
      conversationId,
      isDeleted: false,
    };

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
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
          reactions: {
            include: {
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
          },
          replyTo: {
            select: {
              id: true,
              content: true,
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({ where }),
    ]);

    return { messages: messages.reverse(), total };
  }

  async createMessage(data: {
    content: string;
    type: MessageType;
    senderId: string;
    receiverId?: string;
    conversationId: string;
    replyToId?: string;
    attachments?: string[];
    metadata?: any;
  }): Promise<Message> {
    // Update conversation's lastMessageAt
    await prisma.conversation.update({
      where: { id: data.conversationId },
      data: { lastMessageAt: new Date() },
    });

    return prisma.message.create({
      data: {
        content: data.content,
        type: data.type,
        senderId: data.senderId,
        receiverId: data.receiverId,
        conversationId: data.conversationId,
        replyToId: data.replyToId,
        attachments: data.attachments || [],
        metadata: data.metadata,
      },
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
        reactions: true,
      },
    });
  }

  async updateMessage(messageId: string, content: string): Promise<Message> {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    await prisma.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async markMessagesAsRead(conversationId: string, userId: string, messageId?: string): Promise<void> {
    const where: any = {
      conversationId,
      senderId: { not: userId },
      NOT: {
        readBy: { has: userId },
      },
    };

    if (messageId) {
      where.id = messageId;
    }

    await prisma.message.updateMany({
      where,
      data: {
        readBy: {
          push: userId,
        },
      },
    });

    // Update participant's lastReadAt
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    });
  }

  // ===== MESSAGE REACTIONS =====

  async addReaction(messageId: string, userId: string, emoji: string): Promise<any> {
    return prisma.messageReaction.create({
      data: {
        messageId,
        userId,
        emoji,
      },
      include: {
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

  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    await prisma.messageReaction.delete({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });
  }

  // ===== SEARCH & UTILITY =====

  async searchMessages(query: string, userId: string, conversationId?: string): Promise<Message[]> {
    const where: any = {
      content: {
        contains: query,
        mode: 'insensitive',
      },
      isDeleted: false,
      conversation: {
        participants: {
          some: {
            userId,
          },
        },
      },
    };

    if (conversationId) {
      where.conversationId = conversationId;
    }

    return prisma.message.findMany({
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
        conversation: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
            isActive: true,
          },
        },
      },
      include: {
        messages: {
          where: {
            senderId: { not: userId },
            NOT: {
              readBy: {
                has: userId,
              },
            },
          },
        },
      },
    });

    return conversations.reduce((count, conv) => count + conv.messages.length, 0);
  }
}
