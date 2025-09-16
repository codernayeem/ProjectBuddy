import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService';
import { AuthRequest } from '../types';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  // Create a new team
  public createTeam = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const team = await this.teamService.createTeam(userId, req.body);
      res.status(201).json({
        message: 'Team created successfully',
        data: team
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get all teams with filtering and pagination
  public getTeams = async (req: Request, res: Response) => {
    try {
      const {
        page = '1',
        limit = '10',
        search,
        type,
        skills,
        location,
        isRecruiting
      } = req.query;

      const teams = await this.teamService.getTeams({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        type: type as any,
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        isRecruiting: isRecruiting === 'true'
      });

      res.json({
        message: 'Teams fetched successfully',
        data: teams
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get team by ID
  public getTeamById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getTeamById(id);
      
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }

      res.json({
        message: 'Team fetched successfully',
        data: team
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Update team
  public updateTeam = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const team = await this.teamService.updateTeam(id, userId, req.body);
      res.json({
        message: 'Team updated successfully',
        data: team
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Delete team
  public deleteTeam = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      await this.teamService.deleteTeam(id, userId);
      res.json({ message: 'Team deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Join team
  public joinTeam = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const membership = await this.teamService.joinTeam(id, userId);
      res.json({
        message: 'Successfully joined team',
        data: membership
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Leave team
  public leaveTeam = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      await this.teamService.leaveTeam(id, userId);
      res.json({ message: 'Successfully left team' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get team members
  public getTeamMembers = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const members = await this.teamService.getTeamMembers(id);
      
      res.json({
        message: 'Team members fetched successfully',
        data: members
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Update member role
  public updateMemberRole = async (req: AuthRequest, res: Response) => {
    try {
      const { id, memberId } = req.params;
      const { role } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const member = await this.teamService.updateMemberRole(id, memberId, role, userId);
      res.json({
        message: 'Member role updated successfully',
        data: member
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Remove team member
  public removeMember = async (req: AuthRequest, res: Response) => {
    try {
      const { id, memberId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      await this.teamService.removeMember(id, memberId, userId);
      res.json({ message: 'Member removed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Send team invitation
  public sendInvitation = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { inviteeId, email, message } = req.body;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const invitation = await this.teamService.sendInvitation(
        id,
        userId,
        { inviteeId, email, message }
      );

      res.status(201).json({
        message: 'Invitation sent successfully',
        data: invitation
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Respond to team invitation
  public respondToInvitation = async (req: AuthRequest, res: Response) => {
    try {
      const { invitationId } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const invitation = await this.teamService.respondToInvitation(
        invitationId,
        userId,
        status
      );

      res.json({
        message: `Invitation ${status.toLowerCase()} successfully`,
        data: invitation
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get user's teams
  public getUserTeams = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const teams = await this.teamService.getUserTeams(userId);
      res.json({
        message: 'User teams fetched successfully',
        data: teams
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get recommended teams for user
  public getRecommendedTeams = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const teams = await this.teamService.getRecommendedTeams(userId);
      res.json({
        message: 'Recommended teams fetched successfully',
        data: teams
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get user's invitations
  public getUserInvitations = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { status } = req.query;
      const invitations = await this.teamService.getUserInvitations(userId, status as string);
      res.json({
        message: 'User invitations fetched successfully',
        data: invitations
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}