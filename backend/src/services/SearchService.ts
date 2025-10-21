import { UserRepository } from '../repositories/UserRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { PaginationParams, SearchParams } from '../types';
import { User, Team } from '@prisma/client';

export interface UnifiedSearchFilters {
  // User filters
  userType?: string;
  country?: string;
  city?: string;
  skills?: string[];
  interests?: string[];
  universities?: string[];
  
  // Team filters
  teamType?: string;
  teamVisibility?: string;
  isRecruiting?: boolean;
  
  // Common
  minMembers?: number;
  maxMembers?: number;
}

export interface UnifiedSearchParams extends SearchParams, PaginationParams {
  filters?: UnifiedSearchFilters;
  searchType?: 'all' | 'users' | 'teams';
}

export class SearchService {
  private userRepository: UserRepository;
  private teamRepository: TeamRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.teamRepository = new TeamRepository();
  }

  // Unified search across users and teams
  async unifiedSearch(
    params: UnifiedSearchParams,
    currentUserId?: string
  ): Promise<{
    users: Partial<User>[];
    teams: Team[];
    totalUsers: number;
    totalTeams: number;
  }> {
    const searchType = params.searchType || 'all';

    let users: Partial<User>[] = [];
    let totalUsers = 0;
    let teams: Team[] = [];
    let totalTeams = 0;

    // Search users
    if (searchType === 'all' || searchType === 'users') {
      const userResult = await this.searchUsers({
        query: params.query,
        page: params.page,
        limit: searchType === 'users' ? params.limit : Math.floor(params.limit / 2),
        skip: params.skip,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        filters: {
          userType: params.filters?.userType,
          country: params.filters?.country,
          city: params.filters?.city,
          skills: params.filters?.skills,
          interests: params.filters?.interests,
        },
      });
      users = userResult.users;
      totalUsers = userResult.total;
    }

    // Search teams
    if (searchType === 'all' || searchType === 'teams') {
      const teamResult = await this.searchTeams(
        {
          query: params.query,
          page: params.page,
          limit: searchType === 'teams' ? params.limit : Math.floor(params.limit / 2),
          skip: params.skip,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          filters: {
            type: params.filters?.teamType,
            visibility: params.filters?.teamVisibility,
            country: params.filters?.country,
            city: params.filters?.city,
            isRecruiting: params.filters?.isRecruiting,
            skills: params.filters?.skills,
          },
        },
        currentUserId
      );
      teams = teamResult.teams;
      totalTeams = teamResult.total;
    }

    return {
      users,
      teams,
      totalUsers,
      totalTeams,
    };
  }

  // Search users with advanced filters
  async searchUsers(params: SearchParams & PaginationParams & { filters?: any }): Promise<{
    users: Partial<User>[];
    total: number;
  }> {
    return this.userRepository.search(params);
  }

  // Search teams with advanced filters
  async searchTeams(
    params: SearchParams & PaginationParams & { filters?: any },
    userId?: string
  ): Promise<{
    teams: Team[];
    total: number;
  }> {
    return this.teamRepository.search(params, userId);
  }

  // Get recommended users based on skills, interests, location
  async getRecommendedUsers(
    userId: string,
    params: PaginationParams
  ): Promise<{
    users: Partial<User>[];
    total: number;
  }> {
    return this.userRepository.getRecommendedUsers(userId, params);
  }

  // Get suggested teams for user
  async getSuggestedTeams(
    userId: string,
    params: PaginationParams
  ): Promise<{
    teams: Team[];
    total: number;
  }> {
    // Get user's skills and interests for recommendations
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return { teams: [], total: 0 };
    }

    // Search for teams with matching skills
    const filters: any = {};
    if (user.skills && user.skills.length > 0) {
      filters.skills = user.skills;
    }

    return this.teamRepository.search(
      {
        query: '',
        page: params.page,
        limit: params.limit,
        skip: params.skip,
        filters,
      },
      userId
    );
  }

  // Advanced user search with university filter
  async searchUsersByUniversity(
    universityName: string,
    params: SearchParams & PaginationParams & { filters?: any }
  ): Promise<{
    users: Partial<User>[];
    total: number;
  }> {
    // Enhance the search to include university filter
    const searchParams = {
      ...params,
      query: params.query || universityName,
    };
    
    return this.userRepository.search(searchParams);
  }

  // Search potential teammates (users not in a specific team)
  async searchPotentialTeammates(
    teamId: string,
    params: SearchParams & PaginationParams & { filters?: any }
  ): Promise<{
    users: Partial<User>[];
    total: number;
  }> {
    // This would need a custom query to exclude current team members
    // For now, returning general user search
    return this.userRepository.search(params);
  }

  // Get popular skills for autocomplete
  async getPopularSkills(limit: number = 20): Promise<string[]> {
    // This would aggregate skills from users and teams
    // For now, returning a predefined list
    return [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'Java',
      'C++',
      'Go',
      'Rust',
      'SQL',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'AWS',
      'Azure',
      'Machine Learning',
      'Data Science',
      'UI/UX Design',
      'Mobile Development',
    ];
  }

  // Get popular universities for autocomplete
  async getPopularUniversities(limit: number = 20): Promise<string[]> {
    // This would query from user universities
    // For now, returning a predefined list
    return [
      'MIT',
      'Stanford University',
      'Harvard University',
      'UC Berkeley',
      'Carnegie Mellon University',
      'University of Oxford',
      'University of Cambridge',
      'ETH Zurich',
      'National University of Singapore',
      'Tsinghua University',
    ];
  }
}
