import { Response } from 'express';
import { UserService } from '../services/UserService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { firstName, lastName, bio, username } = req.body;

      const updatedUser = await this.userService.updateUser(req.user.id, {
        firstName,
        lastName,
        bio,
        username,
      });

      res.json(createResponse(true, 'Profile updated successfully', updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  uploadAvatar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      if (!req.file) {
        res.status(400).json(createErrorResponse('No file uploaded'));
        return;
      }

      const avatarUrl = (req.file as any).path;
      const updatedUser = await this.userService.updateAvatar(req.user.id, avatarUrl);

      res.json(createResponse(true, 'Avatar uploaded successfully', updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json(createErrorResponse('User not found'));
        return;
      }

      res.json(createResponse(true, 'User retrieved successfully', user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  searchUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { query, sortBy, sortOrder } = req.query;
      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);

      const result = await this.userService.searchUsers({
        ...pagination,
        query: query as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json(createResponse(
        true,
        'Users retrieved successfully',
        result.users,
        { ...pagination, total: result.total }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      await this.userService.deleteUser(req.user.id);

      res.json(createResponse(true, 'Account deleted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };
}