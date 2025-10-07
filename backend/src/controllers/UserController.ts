import { Response } from 'express';
import { UserService } from '../services/UserService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthRequest } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Profile Management
  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        bio: req.body.bio,
        username: req.body.username,
        email: req.body.email,
        country: req.body.country,
        city: req.body.city,
        address: req.body.address,
        userType: req.body.userType,
        preferredRole: req.body.preferredRole,
        experienceLevel: req.body.experienceLevel,
        skills: req.body.skills,
        interests: req.body.interests,
        linkedin: req.body.linkedin,
        github: req.body.github,
        portfolio: req.body.portfolio,
        website: req.body.website,
      };

      const updatedUser = await this.userService.updateUser(req.user.id, updateData);

      res.json(createResponse(true, 'Profile updated successfully', updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
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

  // User Retrieval
  getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
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

  searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { query, sortBy, sortOrder, skills, interests, country, city, userType, experienceLevel } = req.query;
      const pagination = getPaginationParams(req.query.page as string, req.query.limit as string);

      const params = {
        ...pagination,
        skip: (pagination.page - 1) * pagination.limit,
        query: query as string || '',
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        filters: {
          skills: skills ? (skills as string).split(',') : undefined,
          interests: interests ? (interests as string).split(',') : undefined,
          country: country as string,
          city: city as string,
          userType: userType as any,
          experienceLevel: experienceLevel as any,
        },
      };

      const result = await this.userService.searchUsers(params);

      res.json(createResponse(true, 'Users retrieved successfully', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search users';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Account Management
  deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
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

  // Availability Checks
  checkEmailAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email } = req.query;
      const excludeUserId = req.user?.id;

      const isAvailable = await this.userService.checkEmailAvailability(email as string, excludeUserId);

      res.json(createResponse(true, 'Email availability checked', { available: isAvailable }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check email availability';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  checkUsernameAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { username } = req.query;
      const excludeUserId = req.user?.id;

      const isAvailable = await this.userService.checkUsernameAvailability(username as string, excludeUserId);

      res.json(createResponse(true, 'Username availability checked', { available: isAvailable }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check username availability';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };
}