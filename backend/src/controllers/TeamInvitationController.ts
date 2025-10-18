import { Request, Response, NextFunction } from 'express';
import { TeamInvitationService } from '../services/TeamInvitationService';
import { AuthRequest } from '../types';
import { InvitationStatus } from '@prisma/client';

export class TeamInvitationController {
  private teamInvitationService: TeamInvitationService;

  constructor() {
    this.teamInvitationService = new TeamInvitationService();
  }

  /**
   * Invite a user to join the team
   * POST /teams/:teamId/invitations
   * Body: { inviteeId?, email?, message? }
   */
  inviteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { teamId } = req.params;
      const inviterId = req.user!.id;
      const { inviteeId, email, message } = req.body;

      // Validation
      if (!inviteeId && !email) {
        return res.status(400).json({
          success: false,
          message: 'Either inviteeId or email is required',
        });
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
      }

      if (message && message.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Message must be 500 characters or less',
        });
      }

      const invitation = await this.teamInvitationService.inviteUser({
        teamId,
        inviterId,
        inviteeId,
        email,
        message,
      });

      return res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get team's invitations
   * GET /teams/:teamId/invitations?status=PENDING&page=1&limit=20
   */
  getTeamInvitations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const userId = req.user!.id;
      const { status, page, limit } = req.query;

      const filters: any = {};
      if (status) filters.status = status as InvitationStatus;
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await this.teamInvitationService.getTeamInvitations(
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
   * Get user's invitations
   * GET /users/me/invitations?status=PENDING&page=1&limit=20
   */
  getUserInvitations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { status, page, limit } = req.query;

      const filters: any = {};
      if (status) filters.status = status as InvitationStatus;
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await this.teamInvitationService.getUserInvitations(
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
   * Accept an invitation
   * POST /invitations/:invitationId/accept
   */
  acceptInvitation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { invitationId } = req.params;
      const userId = req.user!.id;

      const member = await this.teamInvitationService.acceptInvitation(
        invitationId,
        userId
      );

      res.json({
        success: true,
        message: 'Invitation accepted successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Decline an invitation
   * POST /invitations/:invitationId/decline
   */
  declineInvitation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { invitationId } = req.params;
      const userId = req.user!.id;

      const invitation = await this.teamInvitationService.declineInvitation(
        invitationId,
        userId
      );

      res.json({
        success: true,
        message: 'Invitation declined',
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel an invitation
   * DELETE /invitations/:invitationId
   */
  cancelInvitation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { invitationId } = req.params;
      const userId = req.user!.id;

      await this.teamInvitationService.cancelInvitation(invitationId, userId);

      res.json({
        success: true,
        message: 'Invitation cancelled successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend an invitation
   * POST /invitations/:invitationId/resend
   */
  resendInvitation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { invitationId } = req.params;
      const userId = req.user!.id;

      const invitation = await this.teamInvitationService.resendInvitation(
        invitationId,
        userId
      );

      res.json({
        success: true,
        message: 'Invitation resent successfully',
        data: invitation,
      });
    } catch (error) {
      next(error);
    }
  };
}
