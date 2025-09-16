import { Connection } from '@prisma/client';
import { ConnectionRepository } from '../repositories/ConnectionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PaginationParams } from '../types';

export class ConnectionService {
  private connectionRepository: ConnectionRepository;
  private userRepository: UserRepository;

  constructor() {
    this.connectionRepository = new ConnectionRepository();
    this.userRepository = new UserRepository();
  }

  async sendConnectionRequest(senderId: string, receiverId: string): Promise<Connection> {
    // Check if users exist
    const [sender, receiver] = await Promise.all([
      this.userRepository.findById(senderId),
      this.userRepository.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    if (senderId === receiverId) {
      throw new Error('Cannot send connection request to yourself');
    }

    // Check if connection already exists
    const existingConnection = await this.connectionRepository.findByUsers(senderId, receiverId);
    if (existingConnection) {
      throw new Error('Connection request already exists');
    }

    // Check reverse connection
    const reverseConnection = await this.connectionRepository.findByUsers(receiverId, senderId);
    if (reverseConnection) {
      throw new Error('Connection already exists or pending');
    }

    return this.connectionRepository.create(senderId, receiverId);
  }

  async respondToConnectionRequest(
    connectionId: string,
    userId: string,
    action: 'accept' | 'decline' | 'block'
  ): Promise<Connection> {
    const connection = await this.connectionRepository.findById(connectionId);
    
    if (!connection) {
      throw new Error('Connection request not found');
    }

    // Only receiver can respond
    if (connection.receiverId !== userId) {
      throw new Error('You can only respond to requests sent to you');
    }

    // Can only respond to pending requests
    if (connection.status !== 'PENDING') {
      throw new Error('Connection request is not pending');
    }

    const statusMap = {
      accept: 'ACCEPTED' as const,
      decline: 'DECLINED' as const,
      block: 'BLOCKED' as const,
    };

    return this.connectionRepository.updateStatus(connectionId, statusMap[action]);
  }

  async removeConnection(connectionId: string, userId: string): Promise<void> {
    const connection = await this.connectionRepository.findById(connectionId);
    
    if (!connection) {
      throw new Error('Connection not found');
    }

    // Only involved users can remove connection
    if (connection.senderId !== userId && connection.receiverId !== userId) {
      throw new Error('You can only remove your own connections');
    }

    await this.connectionRepository.delete(connectionId);
  }

  async getUserConnections(
    userId: string,
    params: PaginationParams,
    status?: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED'
  ): Promise<{ connections: Connection[]; total: number }> {
    return this.connectionRepository.getUserConnections(userId, params, status);
  }

  async getPendingRequests(
    userId: string,
    params: PaginationParams
  ): Promise<{ connections: Connection[]; total: number }> {
    return this.connectionRepository.getPendingRequests(userId, params);
  }

  async getConnectionStatus(userId1: string, userId2: string): Promise<{
    status: string | null;
    canSendRequest: boolean;
    isPending: boolean;
    isConnected: boolean;
  }> {
    const status = await this.connectionRepository.getConnectionStatus(userId1, userId2);
    
    return {
      status,
      canSendRequest: !status,
      isPending: status === 'PENDING',
      isConnected: status === 'ACCEPTED',
    };
  }

  async getConnectionStats(userId: string): Promise<{
    totalConnections: number;
    pendingRequests: number;
    sentRequests: number;
  }> {
    const [totalConnections, pendingRequests, sentRequests] = await Promise.all([
      this.connectionRepository.countConnections(userId),
      this.connectionRepository.getPendingRequests(userId, { page: 1, limit: 1, skip: 0 }),
      this.connectionRepository.getUserConnections(userId, { page: 1, limit: 1, skip: 0 }, 'PENDING'),
    ]);

    return {
      totalConnections,
      pendingRequests: pendingRequests.total,
      sentRequests: sentRequests.total,
    };
  }
}