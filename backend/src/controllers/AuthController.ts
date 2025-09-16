import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { createResponse, createErrorResponse } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        email, 
        username, 
        firstName, 
        lastName, 
        password, 
        bio,
        userType,
        preferredRole,
        experienceLevel,
        skills,
        interests,
        location,
        linkedin,
        github,
        portfolio
      } = req.body;

      const result = await this.userService.register({
        email,
        username,
        firstName,
        lastName,
        password,
        bio,
        userType,
        preferredRole,
        experienceLevel,
        skills,
        interests,
        location,
        linkedin,
        github,
        portfolio,
      });

      res.status(201).json(createResponse(true, 'User registered successfully', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const result = await this.userService.login(email, password);

      res.json(createResponse(true, 'Login successful', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json(createErrorResponse(errorMessage));
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const tokens = await this.authService.refreshTokens(refreshToken);

      res.json(createResponse(true, 'Tokens refreshed successfully', tokens));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      res.status(401).json(createErrorResponse(errorMessage));
    }
  };

  logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      await this.userService.logout(req.user.id);

      res.json(createResponse(true, 'Logout successful'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const user = await this.userService.getUserById(req.user.id);
      
      if (!user) {
        res.status(404).json(createErrorResponse('User not found'));
        return;
      }

      res.json(createResponse(true, 'Profile retrieved successfully', user));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  checkEmailAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        res.status(400).json(createErrorResponse('Email is required'));
        return;
      }

      const isAvailable = await this.userService.checkEmailAvailability(email);

      res.json(createResponse(true, 'Email availability checked', { available: isAvailable }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check email availability';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  checkUsernameAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.query;
      
      if (!username || typeof username !== 'string') {
        res.status(400).json(createErrorResponse('Username is required'));
        return;
      }

      const isAvailable = await this.userService.checkUsernameAvailability(username);

      res.json(createResponse(true, 'Username availability checked', { available: isAvailable }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check username availability';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };
}