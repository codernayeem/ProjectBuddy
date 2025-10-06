import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService } from '@/lib/teams';
import { Team, CreateTeamData, UpdateTeamData, TeamInvitation, InvitationStatus, TeamMemberRole } from '@/types';
import { toast } from 'sonner';

// Query keys
export const teamKeys = {
  all: ['teams'] as const,
  lists: () => [...teamKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...teamKeys.lists(), filters] as const,
  details: () => [...teamKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
  userTeams: () => [...teamKeys.all, 'user-teams'] as const,
  invitations: () => [...teamKeys.all, 'invitations'] as const,
  recommendations: () => [...teamKeys.all, 'recommendations'] as const,
};

// Get teams
export function useTeams(page = 1, limit = 10, filters?: {
  search?: string;
  tags?: string[];
  skills?: string[];
  status?: string;
  visibility?: string;
  creatorId?: string;
}) {
  return useQuery({
    queryKey: teamKeys.list({ page, limit, ...filters }),
    queryFn: () => teamService.getTeams({ page, limit, ...filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get user's teams
export function useUserTeams(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...teamKeys.userTeams(), page, limit],
    queryFn: () => teamService.getUserTeams(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get team by ID
export function useTeam(id: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => teamService.getTeamById(id),
    enabled: !!id,
  });
}

// Get team recommendations
export function useTeamRecommendations(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...teamKeys.recommendations(), page, limit],
    queryFn: () => teamService.getRecommendations(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get user invitations
export function useUserInvitations(status?: InvitationStatus) {
  return useQuery({
    queryKey: [...teamKeys.invitations(), status],
    queryFn: () => teamService.getUserInvitations(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Create team
export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamData) => teamService.createTeam(data),
    onSuccess: (response) => {
      // Invalidate and refetch teams
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.userTeams() });
      
      // Add the new team to the cache
      if (response.data) {
        queryClient.setQueryData(teamKeys.detail(response.data.id), response.data);
      }
      
      toast.success('Team created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create team';
      toast.error(message);
    },
  });
}

// Update team
export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamData }) =>
      teamService.updateTeam(id, data),
    onSuccess: (response, { id }) => {
      // Update the team in cache
      if (response.data) {
        queryClient.setQueryData(teamKeys.detail(id), response.data);
      }
      
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.userTeams() });
      
      toast.success('Team updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update team';
      toast.error(message);
    },
  });
}

// Delete team
export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: teamKeys.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.userTeams() });
      
      toast.success('Team deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete team';
      toast.error(message);
    },
  });
}

// Join team
export function useJoinTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamService.joinTeam(id),
    onSuccess: (_, id) => {
      // Invalidate the specific team and lists
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.userTeams() });
      
      toast.success('Successfully joined the team!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to join team';
      toast.error(message);
    },
  });
}

// Leave team
export function useLeaveTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamService.leaveTeam(id),
    onSuccess: (_, id) => {
      // Invalidate the specific team and lists
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.userTeams() });
      
      toast.success('Successfully left the team!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to leave team';
      toast.error(message);
    },
  });
}

// Invite to team
export function useInviteToTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, data }: { 
      teamId: string; 
      data: { inviteeId?: string; email?: string; roleId?: string; message?: string; }
    }) => teamService.inviteToTeam(teamId, data),
    onSuccess: (_, { teamId }) => {
      // Invalidate invitations
      queryClient.invalidateQueries({ queryKey: teamKeys.invitations() });
      
      toast.success('Invitation sent successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send invitation';
      toast.error(message);
    },
  });
}

// Respond to invitation
export function useRespondToInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invitationId, action }: { invitationId: string; action: 'accept' | 'decline' }) =>
      teamService.respondToInvitation(invitationId, action),
    onSuccess: (_, { action }) => {
      // Invalidate invitations and user teams
      queryClient.invalidateQueries({ queryKey: teamKeys.invitations() });
      queryClient.invalidateQueries({ queryKey: teamKeys.userTeams() });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      
      const message = action === 'accept' ? 'Invitation accepted!' : 'Invitation declined!';
      toast.success(message);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to respond to invitation';
      toast.error(message);
    },
  });
}

// Update member role
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId, role }: { teamId: string; userId: string; role: TeamMemberRole }) =>
      teamService.updateMemberRole(teamId, userId, role),
    onSuccess: (_, { teamId }) => {
      // Invalidate the specific team
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      
      toast.success('Member role updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update member role';
      toast.error(message);
    },
  });
}

// Remove member
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: string; userId: string }) =>
      teamService.removeMember(teamId, userId),
    onSuccess: (_, { teamId }) => {
      // Invalidate the specific team
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(teamId) });
      
      toast.success('Member removed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove member';
      toast.error(message);
    },
  });
}