import api from './api';

export interface TeamProject {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  category?: string;
  startDate?: string;
  endDate?: string;
  estimatedDuration?: string;
  requiredSkills?: string[];
  tags?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  images?: string[];
  teamId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  milestones?: TeamMilestone[];
}

export interface TeamMilestone {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  completedAt?: string;
  teamId: string;
  projectId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  project?: TeamProject;
}

export interface TeamAchievement {
  id: string;
  title: string;
  description: string;
  teamId: string;
  milestoneId?: string;
  isShared: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  milestone?: TeamMilestone;
}

export interface CreateTeamProjectData {
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  estimatedDuration?: string;
  requiredSkills?: string[];
  tags?: string[];
  repositoryUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  images?: string[];
}

export interface CreateTeamMilestoneData {
  title: string;
  description?: string;
  dueDate?: string;
  projectId?: string;
}

export interface CreateTeamAchievementData {
  title: string;
  description: string;
  milestoneId?: string;
  isShared?: boolean;
}

// Team Projects
export const getTeamProjects = async (teamId: string): Promise<TeamProject[]> => {
  const response = await api.get(`/teams/${teamId}/projects`);
  return response.data.data;
};

export const createTeamProject = async (teamId: string, data: CreateTeamProjectData): Promise<TeamProject> => {
  const response = await api.post(`/teams/${teamId}/projects`, data);
  return response.data.data;
};

export const updateTeamProject = async (
  teamId: string,
  projectId: string,
  data: Partial<CreateTeamProjectData>
): Promise<TeamProject> => {
  const response = await api.put(`/teams/${teamId}/projects/${projectId}`, data);
  return response.data.data;
};

export const deleteTeamProject = async (teamId: string, projectId: string): Promise<void> => {
  await api.delete(`/teams/${teamId}/projects/${projectId}`);
};

// Team Milestones
export const getTeamMilestones = async (teamId: string): Promise<TeamMilestone[]> => {
  const response = await api.get(`/teams/${teamId}/milestones`);
  return response.data.data;
};

export const createTeamMilestone = async (teamId: string, data: CreateTeamMilestoneData): Promise<TeamMilestone> => {
  const response = await api.post(`/teams/${teamId}/milestones`, data);
  return response.data.data;
};

export const updateTeamMilestone = async (
  teamId: string,
  milestoneId: string,
  data: Partial<CreateTeamMilestoneData>
): Promise<TeamMilestone> => {
  const response = await api.put(`/teams/${teamId}/milestones/${milestoneId}`, data);
  return response.data.data;
};

export const completeMilestone = async (teamId: string, milestoneId: string): Promise<TeamMilestone> => {
  const response = await api.post(`/teams/${teamId}/milestones/${milestoneId}/complete`);
  return response.data.data;
};

// Team Achievements
export const getTeamAchievements = async (teamId: string): Promise<TeamAchievement[]> => {
  const response = await api.get(`/teams/${teamId}/achievements`);
  return response.data.data;
};

export const createTeamAchievement = async (teamId: string, data: CreateTeamAchievementData): Promise<TeamAchievement> => {
  const response = await api.post(`/teams/${teamId}/achievements`, data);
  return response.data.data;
};
