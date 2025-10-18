import { Request, Response, NextFunction } from 'express';
import { TeamJoinRequestService } from '../services/TeamJoinRequestService';
import { AuthRequest } from '../types';
import { JoinRequestStatus } from '@prisma/client';

export class TeamJoinRequestController {
  private teamJoinRequestService: TeamJoinRequestService;

  constructor() {
    this.teamJoinRequestService = new TeamJoinRequestService();
  }

  /**
   * Create a join request for a team
   * POST /teams/:teamId/join-requests
   * Body: { message? }
   */
  createRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { teamId } = req.params;
      const userId = req.user!.id;
      const { message } = req.body;

      // Validation
      if (message && message.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Message must be 500 characters or less',
        });
      }

      const request = await this.teamJoinRequestService.createRequest({
        teamId,
        userId,
        message,
      });

      return res.status(201).json({
        success: true,
        message: 'Join request sent successfully',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get team's join requests (admin only)
   * GET /teams/:teamId/join-requests?status=PENDING&page=1&limit=20
   */
  getTeamRequests = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const userId = req.user!.id;
      const { status, page, limit } = req.query;

      const filters: any = {};
      if (status) filters.status = status as JoinRequestStatus;
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await this.teamJoinRequestService.getTeamRequests(
        teamId,
        userId,
        filters
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's join requests
   * GET /users/me/join-requests?status=PENDING&page=1&limit=20
   */
  getUserRequests = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { status, page, limit } = req.query;

      const filters: any = {};
      if (status) filters.status = status as JoinRequestStatus;
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await this.teamJoinRequestService.getUserRequests(
        userId,
        filters
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Accept a join request (admin only)
   * POST /join-requests/:requestId/accept
   */
  acceptRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { requestId } = req.params;
      const adminUserId = req.user!.id;

      const member = await this.teamJoinRequestService.acceptRequest(
        requestId,
        adminUserId
      );

      res.json({
        success: true,
        message: 'Join request accepted successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reject a join request (admin only)
   * POST /join-requests/:requestId/reject
   */
  rejectRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { requestId } = req.params;
      const adminUserId = req.user!.id;

      const request = await this.teamJoinRequestService.rejectRequest(
        requestId,
        adminUserId
      );

      res.json({
        success: true,
        message: 'Join request rejected',
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel a join request
   * DELETE /join-requests/:requestId
   */
  cancelRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { requestId } = req.params;
      const userId = req.user!.id;

      await this.teamJoinRequestService.cancelRequest(requestId, userId);

      res.json({
        success: true,
        message: 'Join request cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get pending requests count for a team
   * GET /teams/:teamId/join-requests/count
   */
  getPendingCount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const userId = req.user!.id;

      const count = await this.teamJoinRequestService.getPendingCount(
        teamId,
        userId
      );

      res.json({
        success: true,
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  };
}
