import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, Post, CreatePostData, PostsResponse } from '@/lib/posts';
import { toast } from 'sonner';

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  feed: () => [...postKeys.all, 'feed'] as const,
  trending: () => [...postKeys.all, 'trending'] as const,
};

// Get posts
export function usePosts(page = 1, limit = 10, filters?: {
  type?: string;
  authorId?: string;
  projectId?: string;
  teamId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: postKeys.list({ page, limit, ...filters }),
    queryFn: () => postService.getPosts(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get user feed
export function useFeed(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...postKeys.feed(), page, limit],
    queryFn: () => postService.getFeed(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get trending posts
export function useTrendingPosts(page = 1, limit = 10, timeframe = '24h') {
  return useQuery({
    queryKey: [...postKeys.trending(), page, limit, timeframe],
    queryFn: () => postService.getTrendingPosts(page, limit, timeframe),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get post by ID
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPostById(id),
    enabled: !!id,
  });
}

// Create post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postService.createPost(data),
    onSuccess: (newPost) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      
      // Add the new post to the cache
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost);
      
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
    },
  });
}

// Update post
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostData> }) =>
      postService.updatePost(id, data),
    onSuccess: (updatedPost, { id }) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(id), updatedPost);
      
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
    },
  });
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      
      toast.success('Post deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete post';
      toast.error(message);
    },
  });
}

// React to post
export function useReactToPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type }: { id: string; type: string }) =>
      postService.reactToPost(id, type),
    onSuccess: (_, { id }) => {
      // Invalidate the specific post and lists
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to react to post';
      toast.error(message);
    },
  });
}

// Remove reaction
export function useRemoveReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postService.removeReaction(id),
    onSuccess: (_, id) => {
      // Invalidate the specific post and lists
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove reaction';
      toast.error(message);
    },
  });
}

// Share post
export function useSharePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      postService.sharePost(id, comment),
    onSuccess: (_, { id }) => {
      // Invalidate the specific post and lists
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      
      toast.success('Post shared successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to share post';
      toast.error(message);
    },
  });
}

// Add comment
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content, parentId }: { id: string; content: string; parentId?: string }) =>
      postService.addComment(id, content, parentId),
    onSuccess: (_, { id }) => {
      // Invalidate the specific post
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    },
  });
}