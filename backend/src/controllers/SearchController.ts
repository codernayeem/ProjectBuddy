import { Response } from 'express';
import { SearchService } from '../services/SearchService';
import { AuthRequest } from '../types';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';

export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  // Unified search across users and teams
  unifiedSearch = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { page, limit, skip } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );
      
      const query = req.query.q as string || '';
      const searchType = req.query.type as 'all' | 'users' | 'teams' || 'all';
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';

      // Parse filters
      const filters: any = {};
      
      if (req.query.userType) filters.userType = req.query.userType;
      if (req.query.teamType) filters.teamType = req.query.teamType;
      if (req.query.country) filters.country = req.query.country;
      if (req.query.city) filters.city = req.query.city;
      if (req.query.skills) {
        filters.skills = Array.isArray(req.query.skills) 
          ? req.query.skills 
          : (req.query.skills as string).split(',');
      }
      if (req.query.interests) {
        filters.interests = Array.isArray(req.query.interests) 
          ? req.query.interests 
          : (req.query.interests as string).split(',');
      }
      if (req.query.teamVisibility) filters.teamVisibility = req.query.teamVisibility;
      if (req.query.isRecruiting !== undefined) {
        filters.isRecruiting = req.query.isRecruiting === 'true';
      }

      const result = await this.searchService.unifiedSearch(
        {
          query,
          searchType,
          page,
          limit,
          skip,
          sortBy,
          sortOrder,
          filters,
        },
        userId
      );

      res.json(createResponse(
        true,
        'Search completed successfully',
        result,
        { page, limit, skip, total: result.totalUsers + result.totalTeams }
      ));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };

  // Search users only
  searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );
      
      const query = req.query.q as string || '';
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';

      // Parse filters
      const filters: any = {};
      
      if (req.query.userType) filters.userType = req.query.userType;
      if (req.query.country) filters.country = req.query.country;
      if (req.query.city) filters.city = req.query.city;
      if (req.query.skills) {
        filters.skills = Array.isArray(req.query.skills) 
          ? req.query.skills 
          : (req.query.skills as string).split(',');
      }
      if (req.query.interests) {
        filters.interests = Array.isArray(req.query.interests) 
          ? req.query.interests 
          : (req.query.interests as string).split(',');
      }

      const result = await this.searchService.searchUsers({
        query,
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        filters,
      });

      res.json(createResponse(
        true,
        'Users found successfully',
        result.users,
        { page, limit, skip, total: result.total }
      ));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };

  // Search teams only
  searchTeams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { page, limit, skip } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );
      
      const query = req.query.q as string || '';
      const sortBy = req.query.sortBy as string;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc';

      // Parse filters
      const filters: any = {};
      
      if (req.query.type) filters.type = req.query.type;
      if (req.query.visibility) filters.visibility = req.query.visibility;
      if (req.query.country) filters.country = req.query.country;
      if (req.query.city) filters.city = req.query.city;
      if (req.query.isRecruiting !== undefined) {
        filters.isRecruiting = req.query.isRecruiting === 'true';
      }
      if (req.query.skills) {
        filters.skills = Array.isArray(req.query.skills) 
          ? req.query.skills 
          : (req.query.skills as string).split(',');
      }

      const result = await this.searchService.searchTeams(
        {
          query,
          page,
          limit,
          skip,
          sortBy,
          sortOrder,
          filters,
        },
        userId
      );

      res.json(createResponse(
        true,
        'Teams found successfully',
        result.teams,
        { page, limit, skip, total: result.total }
      ));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };

  // Get recommended users
  getRecommendedUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json(createErrorResponse('Unauthorized'));
        return;
      }

      const { page, limit, skip } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const result = await this.searchService.getRecommendedUsers(userId, {
        page,
        limit,
        skip,
      });

      res.json(createResponse(
        true,
        'Recommended users found successfully',
        result.users,
        { page, limit, skip, total: result.total }
      ));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };

  // Get suggested teams
  getSuggestedTeams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json(createErrorResponse('Unauthorized'));
        return;
      }

      const { page, limit, skip } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const result = await this.searchService.getSuggestedTeams(userId, {
        page,
        limit,
        skip,
      });

      res.json(createResponse(
        true,
        'Suggested teams found successfully',
        result.teams,
        { page, limit, skip, total: result.total }
      ));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };

  // Get popular skills
  getPopularSkills = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      
      const skills = await this.searchService.getPopularSkills(limit);

      res.json(createResponse(true, 'Popular skills retrieved successfully', skills));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };

  // Get popular universities
  getPopularUniversities = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      
      const universities = await this.searchService.getPopularUniversities(limit);

      res.json(createResponse(true, 'Popular universities retrieved successfully', universities));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  };
}
