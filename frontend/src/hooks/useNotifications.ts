import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/lib/notifications';

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['unreadNotificationCount'],
    queryFn: async () => {
      const response = await notificationService.getUnreadCount();
      return response.count;
    },
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });
};

export const useNotifications = (
  page = 1,
  limit = 20,
  filters?: { category?: string; isRead?: boolean }
) => {
  return useQuery({
    queryKey: ['notifications', page, limit, filters],
    queryFn: async () => {
      const response = await notificationService.getNotifications(page, limit, filters);
      return response;
    },
  });
};
