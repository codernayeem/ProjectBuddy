import { Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  createProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { title, description, startDate, endDate, isPublic, tags } = req.body;

      const project = await this.projectService.createProject(req.user.id, {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isPublic,
        tags,
      });

      res.status(201).json(createResponse(true, 'Project created successfully', project));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  getProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const project = await this.projectService.getProjectById(id, userId);

      if (!project) {
        res.status(404).json(createErrorResponse('Project not found'));
        return;
      }

      res.json(createResponse(true, 'Project retrieved successfully', project));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get project';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { title, description, status, startDate, endDate, isPublic, tags } = req.body;

      const project = await this.projectService.updateProject(id, req.user.id, {
        title,
        description,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isPublic,
        tags,
      });

      res.json(createResponse(true, 'Project updated successfully', project));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      await this.projectService.deleteProject(id, req.user.id);

      res.json(createResponse(true, 'Project deleted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  searchProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { query, sortBy, sortOrder } = req.query;
      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);
      const userId = req.user?.id;

      const result = await this.projectService.searchProjects(
        {
          ...pagination,
          query: query as string,
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc',
        },
        userId
      );

      res.json(createResponse(
        true,
        'Projects retrieved successfully',
        result.projects,
        { ...pagination, total: result.total }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search projects';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getUserProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);

      const result = await this.projectService.getUserProjects(req.user.id, pagination);

      res.json(createResponse(
        true,
        'User projects retrieved successfully',
        result.projects,
        { ...pagination, total: result.total }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user projects';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  inviteToProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { userId, role } = req.body;

      const member = await this.projectService.inviteToProject(id, req.user.id, userId, role);

      res.status(201).json(createResponse(true, 'User invited to project successfully', member));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite user';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  removeFromProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id, userId } = req.params;

      await this.projectService.removeFromProject(id, req.user.id, userId);

      res.json(createResponse(true, 'User removed from project successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove user';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  updateMemberRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id, userId } = req.params;
      const { role } = req.body;

      const member = await this.projectService.updateMemberRole(id, req.user.id, userId, role);

      res.json(createResponse(true, 'Member role updated successfully', member));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member role';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  getProjectMembers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      const members = await this.projectService.getProjectMembers(id, req.user.id);

      res.json(createResponse(true, 'Project members retrieved successfully', members));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get project members';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };
}