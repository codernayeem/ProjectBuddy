import { Response } from 'express';
import { ConnectionService } from '../services/ConnectionService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

export class ConnectionController {
  private connectionService: ConnectionService;

  constructor() {
    this.connectionService = new ConnectionService();
  }

  sendRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { receiverId } = req.body;

      const connection = await this.connectionService.sendConnectionRequest(
        req.user.id,
        receiverId
      );

      res.status(201).json(createResponse(true, 'Connection request sent successfully', connection));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send connection request';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  respondToRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { action } = req.body;

      const connection = await this.connectionService.respondToConnectionRequest(
        id,
        req.user.id,
        action
      );

      res.json(createResponse(true, `Connection request ${action}ed successfully`, connection));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to respond to connection request';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  removeConnection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      await this.connectionService.removeConnection(id, req.user.id);

      res.json(createResponse(true, 'Connection removed successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove connection';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  getConnections = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { status } = req.query;
      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);

      const result = await this.connectionService.getUserConnections(
        req.user.id,
        pagination,
        status as 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED' | undefined
      );

      res.json(createResponse(
        true,
        'Connections retrieved successfully',
        result.connections,
        { ...pagination, total: result.total }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get connections';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getPendingRequests = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);

      const result = await this.connectionService.getPendingRequests(req.user.id, pagination);

      res.json(createResponse(
        true,
        'Pending requests retrieved successfully',
        result.connections,
        { ...pagination, total: result.total }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get pending requests';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getConnectionStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { userId } = req.params;

      const status = await this.connectionService.getConnectionStatus(req.user.id, userId);

      res.json(createResponse(true, 'Connection status retrieved successfully', status));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get connection status';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getConnectionStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const stats = await this.connectionService.getConnectionStats(req.user.id);

      res.json(createResponse(true, 'Connection stats retrieved successfully', stats));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get connection stats';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };
}