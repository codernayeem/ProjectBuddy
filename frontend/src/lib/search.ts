import api from './api';
import { User, Team } from '../types/types';

export interface SearchFilters {
  // User filters
  userType?: string;
  country?: string;
  city?: string;
  university?: string;
  skills?: string[];
  interests?: string[];
  
  // Team filters
  type?: string;
  visibility?: string;
  isRecruiting?: boolean;
}

export interface UnifiedSearchResponse {
  users: User[];
  teams: Team[];
  totalUsers: number;
  totalTeams: number;
  pagination: {
    page: number;
    limit: number;
  };
}

export const searchService = {
  // Unified search
  unifiedSearch: async (
    query: string,
    type: 'all' | 'users' | 'teams' = 'all',
    page = 1,
    limit = 20,
    filters?: SearchFilters
  ) => {
    const params = new URLSearchParams({
      q: query,
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.userType) params.append('userType', filters.userType);
    if (filters?.type) params.append('teamType', filters.type);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.visibility) params.append('teamVisibility', filters.visibility);
    if (filters?.isRecruiting !== undefined) params.append('isRecruiting', filters.isRecruiting.toString());
    if (filters?.skills) params.append('skills', filters.skills.join(','));
    if (filters?.interests) params.append('interests', filters.interests.join(','));

    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },

  // Search users only
  searchUsers: async (
    query: string,
    page = 1,
    limit = 20,
    filters?: SearchFilters
  ) => {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters?.userType) params.append('userType', filters.userType);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.university) params.append('university', filters.university);
    if (filters?.skills) params.append('skills', filters.skills.join(','));
    if (filters?.interests) params.append('interests', filters.interests.join(','));

    const response = await api.get(`/search/users?${params.toString()}`);
    return response.data;
  },

  // Search teams only
  searchTeams: async (
    query: string,
    page = 1,
    limit = 20,
    filters?: SearchFilters
  ) => {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters?.type) params.append('type', filters.type);
    if (filters?.visibility) params.append('visibility', filters.visibility);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.isRecruiting !== undefined) params.append('isRecruiting', filters.isRecruiting.toString());
    if (filters?.skills) params.append('skills', filters.skills.join(','));

    const response = await api.get(`/search/teams?${params.toString()}`);
    return response.data;
  },

  // Get recommended users
  getRecommendedUsers: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/search/recommended-users?${params.toString()}`);
    return response.data;
  },

  // Get suggested teams
  getSuggestedTeams: async (page = 1, limit = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get(`/search/suggested-teams?${params.toString()}`);
    return response.data;
  },

  // Get popular skills
  getPopularSkills: async (limit = 20) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await api.get(`/search/skills?${params.toString()}`);
    return response.data;
  },

  // Get popular universities
  getPopularUniversities: async (limit = 20) => {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await api.get(`/search/universities?${params.toString()}`);
    return response.data;
  },
};
