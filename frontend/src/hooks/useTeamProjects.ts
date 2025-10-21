import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTeamProjects,
  createTeamProject,
  updateTeamProject,
  deleteTeamProject,
  getTeamMilestones,
  createTeamMilestone,
  updateTeamMilestone,
  completeMilestone,
  getTeamAchievements,
  createTeamAchievement,
  CreateTeamProjectData,
  CreateTeamMilestoneData,
  CreateTeamAchievementData,
} from '../lib/teamProjects';
import { toast } from 'sonner';

// Team Projects
export const useTeamProjects = (teamId: string) => {
  return useQuery({
    queryKey: ['teamProjects', teamId],
    queryFn: () => getTeamProjects(teamId),
    enabled: !!teamId,
  });
};

export const useCreateTeamProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: CreateTeamProjectData }) =>
      createTeamProject(teamId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamProjects', variables.teamId] });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });
};

export const useUpdateTeamProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, projectId, data }: { teamId: string; projectId: string; data: Partial<CreateTeamProjectData> }) =>
      updateTeamProject(teamId, projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamProjects', variables.teamId] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });
};

export const useDeleteTeamProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, projectId }: { teamId: string; projectId: string }) =>
      deleteTeamProject(teamId, projectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamProjects', variables.teamId] });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });
};

// Team Milestones
export const useTeamMilestones = (teamId: string) => {
  return useQuery({
    queryKey: ['teamMilestones', teamId],
    queryFn: () => getTeamMilestones(teamId),
    enabled: !!teamId,
  });
};

export const useCreateTeamMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: CreateTeamMilestoneData }) =>
      createTeamMilestone(teamId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamMilestones', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['teamProjects', variables.teamId] });
      toast.success('Milestone created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create milestone');
    },
  });
};

export const useUpdateTeamMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, milestoneId, data }: { teamId: string; milestoneId: string; data: Partial<CreateTeamMilestoneData> }) =>
      updateTeamMilestone(teamId, milestoneId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamMilestones', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['teamProjects', variables.teamId] });
      toast.success('Milestone updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update milestone');
    },
  });
};

export const useCompleteMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, milestoneId }: { teamId: string; milestoneId: string }) =>
      completeMilestone(teamId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamMilestones', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['teamProjects', variables.teamId] });
      toast.success('Milestone marked as completed!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete milestone');
    },
  });
};

// Team Achievements
export const useTeamAchievements = (teamId: string) => {
  return useQuery({
    queryKey: ['teamAchievements', teamId],
    queryFn: () => getTeamAchievements(teamId),
    enabled: !!teamId,
  });
};

export const useCreateTeamAchievement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: string; data: CreateTeamAchievementData }) =>
      createTeamAchievement(teamId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teamAchievements', variables.teamId] });
      toast.success('Achievement created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create achievement');
    },
  });
};
