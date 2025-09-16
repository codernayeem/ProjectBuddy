import { ApiResponse, PaginationParams } from '../types';

export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  pagination?: PaginationParams & { total: number }
): ApiResponse<T> => {
  const response: ApiResponse<T> = { success, message };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  if (pagination) {
    response.pagination = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    };
  }
  
  return response;
};

export const createErrorResponse = (message: string, error?: string): ApiResponse => {
  const response: ApiResponse = { success: false, message };
  if (error) response.error = error;
  return response;
};

export const getPaginationParams = (page?: string, limit?: string): PaginationParams => {
  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '10', 10);
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum)),
    skip: (Math.max(1, pageNum) - 1) * Math.min(100, Math.max(1, limitNum)),
  };
};

export const generateUsername = (firstName: string, lastName: string): string => {
  const base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const randomSuffix = Math.floor(Math.random() * 10000);
  return `${base}${randomSuffix}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};