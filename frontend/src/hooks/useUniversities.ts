import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserUniversities,
  addUniversity,
  updateUniversity,
  deleteUniversity,
  CreateUniversityData,
  UpdateUniversityData,
} from '../lib/universities';
import { toast } from 'sonner';

export const useUserUniversities = () => {
  return useQuery({
    queryKey: ['userUniversities'],
    queryFn: getUserUniversities,
  });
};

export const useAddUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUniversityData) => addUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userUniversities'] });
      toast.success('University added successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add university');
    },
  });
};

export const useUpdateUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ universityId, data }: { universityId: string; data: UpdateUniversityData }) =>
      updateUniversity(universityId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userUniversities'] });
      toast.success('University updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update university');
    },
  });
};

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (universityId: string) => deleteUniversity(universityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userUniversities'] });
      toast.success('University removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove university');
    },
  });
};
