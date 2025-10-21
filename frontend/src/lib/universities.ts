import api from './api';

export interface UserUniversity {
  id: string;
  userId: string;
  universityName: string;
  status: 'CURRENT' | 'GRADUATED';
  startYear?: number;
  endYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUniversityData {
  universityName: string;
  status: 'CURRENT' | 'GRADUATED';
  startYear?: number;
  endYear?: number;
}

export interface UpdateUniversityData {
  universityName?: string;
  status?: 'CURRENT' | 'GRADUATED';
  startYear?: number;
  endYear?: number;
}

export const getUserUniversities = async (): Promise<UserUniversity[]> => {
  const response = await api.get('/users/me/universities');
  return response.data.data;
};

export const addUniversity = async (data: CreateUniversityData): Promise<UserUniversity> => {
  const response = await api.post('/users/me/universities', data);
  return response.data.data;
};

export const updateUniversity = async (
  universityId: string,
  data: UpdateUniversityData
): Promise<UserUniversity> => {
  const response = await api.put(`/users/me/universities/${universityId}`, data);
  return response.data.data;
};

export const deleteUniversity = async (universityId: string): Promise<void> => {
  await api.delete(`/users/me/universities/${universityId}`);
};
