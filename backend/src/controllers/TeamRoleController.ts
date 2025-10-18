import { Request, Response, NextFunction } from 'express';
import { TeamRoleService } from '../services/TeamRoleService';
import { AuthRequest } from '../types';

export class TeamRoleController {
  private teamRoleService: TeamRoleService;

  constructor() {
    this.teamRoleService = new TeamRoleService();
  }

  /**
   * Get all roles for a team
   * GET /teams/:teamId/roles
   */
  getTeamRoles = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId } = req.params;
      const userId = req.user!.id;

      const roles = await this.teamRoleService.getTeamRoles(teamId, userId);

      res.json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new custom role
   * POST /teams/:teamId/roles
   * Body: { name, description?, color?, isAdmin }
   */
  createRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { teamId } = req.params;
      const userId = req.user!.id;
      const { name, description, color, isAdmin } = req.body;

      // Validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Role name is required',
        });
      }

      if (name.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Role name must be 50 characters or less',
        });
      }

      if (description && description.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Description must be 200 characters or less',
        });
      }

      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({
          success: false,
          message: 'Color must be a valid hex color code (e.g., #FF5733)',
        });
      }

      if (isAdmin !== undefined && typeof isAdmin !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isAdmin must be a boolean value',
        });
      }

      const role = await this.teamRoleService.createRole(teamId, userId, {
        name: name.trim(),
        description: description?.trim(),
        color,
        isAdmin: isAdmin || false,
      });

      return res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a role
   * PUT /teams/:teamId/roles/:roleId
   * Body: { name?, description?, color?, isAdmin? }
   */
  updateRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { roleId } = req.params;
      const userId = req.user!.id;
      const { name, description, color, isAdmin } = req.body;

      // Validation
      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Role name cannot be empty',
          });
        }
        if (name.trim().length > 50) {
          return res.status(400).json({
            success: false,
            message: 'Role name must be 50 characters or less',
          });
        }
      }

      if (description !== undefined && description.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Description must be 200 characters or less',
        });
      }

      if (color !== undefined && color !== null && !/^#[0-9A-F]{6}$/i.test(color)) {
        return res.status(400).json({
          success: false,
          message: 'Color must be a valid hex color code (e.g., #FF5733)',
        });
      }

      if (isAdmin !== undefined && typeof isAdmin !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isAdmin must be a boolean value',
        });
      }

      const updates: any = {};
      if (name !== undefined) updates.name = name.trim();
      if (description !== undefined) updates.description = description?.trim();
      if (color !== undefined) updates.color = color;
      if (isAdmin !== undefined) updates.isAdmin = isAdmin;

      const role = await this.teamRoleService.updateRole(roleId, userId, updates);

      return res.json({
        success: true,
        message: 'Role updated successfully',
        data: role,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a role
   * DELETE /teams/:teamId/roles/:roleId
   */
  deleteRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { roleId } = req.params;
      const userId = req.user!.id;

      await this.teamRoleService.deleteRole(roleId, userId);

      res.json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Assign a role to a team member
   * POST /teams/:teamId/members/:memberId/roles/:roleId
   */
  assignRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId, memberId, roleId } = req.params;
      const userId = req.user!.id;

      const member = await this.teamRoleService.assignRole(
        teamId,
        memberId,
        roleId,
        userId
      );

      res.json({
        success: true,
        message: 'Role assigned successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove a role from a team member
   * DELETE /teams/:teamId/members/:memberId/roles/:roleId
   */
  removeRole = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { teamId, memberId, roleId } = req.params;
      const userId = req.user!.id;

      const member = await this.teamRoleService.removeRole(
        teamId,
        memberId,
        roleId,
        userId
      );

      res.json({
        success: true,
        message: 'Role removed successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get roles for a specific member
   * GET /teams/:teamId/members/:memberId/roles
   */
  getMemberRoles = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { memberId } = req.params;

      const roles = await this.teamRoleService.getMemberRoles(memberId);

      res.json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  };
}
