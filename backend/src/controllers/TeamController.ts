import { Request, Response } from 'express';
import { TeamService } from '../services/TeamService';
import { AuthRequest } from '../types';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  // Create a new team
  public createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
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
  public getTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = '1',
        limit = '10',
        search,
        type,
        skills,
        country,
        city,
        isRecruiting,
        sortBy,
        sortOrder
      } = req.query;

      const params = {
        page: Number(page),
        limit: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
        query: search as string || '',
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        filters: {
          type: type as any,
          skills: skills ? (skills as string).split(',') : undefined,
          country: country as string,
          city: city as string,
          isRecruiting: isRecruiting === 'true' ? true : isRecruiting === 'false' ? false : undefined,
        }
      };

      const result = await this.teamService.getTeams(params);
      res.json({
        message: 'Teams fetched successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get team by ID
  public getTeamById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id; // Optional for public teams
      
      const team = await this.teamService.getTeamById(id, userId);
      
      if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
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
  public updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
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
  public deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await this.teamService.deleteTeam(id, userId);
      res.json({ message: 'Team deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Team membership management
  public joinTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
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

  public createJoinRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { message } = req.body;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const request = await this.teamService.createJoinRequest(id, userId, message);
      res.status(201).json({
        message: 'Join request sent successfully',
        data: request
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public respondToJoinRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const request = await this.teamService.respondToJoinRequest(requestId, userId, status);
      res.json({
        message: `Join request ${status.toLowerCase()} successfully`,
        data: request
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public leaveTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await this.teamService.removeMember(id, userId, userId);
      res.json({ message: 'Successfully left team' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id, memberId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await this.teamService.removeMember(id, memberId, userId);
      res.json({ message: 'Member removed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Custom roles
  public createCustomRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const role = await this.teamService.createCustomRole(id, userId, req.body);
      res.status(201).json({
        message: 'Custom role created successfully',
        data: role
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public updateCustomRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { roleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const role = await this.teamService.updateCustomRole(roleId, userId, req.body);
      res.json({
        message: 'Custom role updated successfully',
        data: role
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public deleteCustomRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { roleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await this.teamService.deleteCustomRole(roleId, userId);
      res.json({ message: 'Custom role deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Invitations
  public sendInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const invitation = await this.teamService.sendInvitation(id, userId, req.body);
      res.status(201).json({
        message: 'Invitation sent successfully',
        data: invitation
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public respondToInvitation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { invitationId } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const invitation = await this.teamService.respondToInvitation(invitationId, userId, status);
      res.json({
        message: `Invitation ${status.toLowerCase()} successfully`,
        data: invitation
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public getUserInvitations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
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

  // Team following
  public followTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await this.teamService.followTeam(id, userId);
      res.json({ message: 'Team followed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public unfollowTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      await this.teamService.unfollowTeam(id, userId);
      res.json({ message: 'Team unfollowed successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // User's teams
  public getUserTeams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const {
        page = '1',
        limit = '20'
      } = req.query;

      const params = {
        page: Number(page),
        limit: Number(limit),
        skip: (Number(page) - 1) * Number(limit)
      };

      const result = await this.teamService.getUserTeams(userId, params);
      res.json({
        message: 'User teams fetched successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Team projects
  public getTeamProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const projects = await this.teamService.getTeamProjects(id);
      res.json({
        message: 'Team projects fetched successfully',
        data: projects
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public createTeamProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      const project = await this.teamService.createProject(id, userId, req.body);
      res.status(201).json({
        message: 'Team project created successfully',
        data: project
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Recommendations
  public getRecommendedTeams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      // TODO: Implement AI-based recommendations
      res.json({
        message: 'Recommended teams fetched successfully',
        data: { teams: [], total: 0 }
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}