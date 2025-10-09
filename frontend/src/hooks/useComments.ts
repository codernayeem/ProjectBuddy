import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/lib/posts';
import { ReactionType } from '@/types/types';
import { toast } from 'sonner';

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (postId: string, page: number) => [...commentKeys.lists(), postId, page] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  replies: (commentId: string, page: number) => [...commentKeys.all, 'replies', commentId, page] as const,
  reactions: (commentId: string) => [...commentKeys.all, 'reactions', commentId] as const,
};

// Get comments for a post
export function useComments(postId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: commentKeys.list(postId, page),
    queryFn: () => postService.getComments(postId, page, limit),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get comment by ID
export function useComment(commentId: string) {
  return useQuery({
    queryKey: commentKeys.detail(commentId),
    queryFn: () => postService.getCommentById(commentId),
    enabled: !!commentId,
  });
}

// Get comment replies
export function useCommentReplies(commentId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: commentKeys.replies(commentId, page),
    queryFn: () => postService.getCommentReplies(commentId, page, limit),
    enabled: !!commentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get comment reactions
export function useCommentReactions(commentId: string) {
  return useQuery({
    queryKey: commentKeys.reactions(commentId),
    queryFn: () => postService.getCommentReactions(commentId),
    enabled: !!commentId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Add comment
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) =>
      postService.addComment(postId, content, parentId),
    onSuccess: (_, { postId, parentId }) => {
      // Invalidate comments for the post
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      
      // If it's a reply, invalidate parent comment replies
      if (parentId) {
        queryClient.invalidateQueries({ queryKey: commentKeys.all });
      }
      
      // Invalidate post details to update comment count
      queryClient.invalidateQueries({ queryKey: ['posts', 'detail', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
      
      toast.success('Comment added successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
    },
  });
}

// Update comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      postService.updateComment(commentId, content),
    onSuccess: (response, { commentId }) => {
      // Update the comment in cache
      if (response.data) {
        queryClient.setQueryData(commentKeys.detail(commentId), response.data);
      }
      
      // Invalidate comment lists
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      
      toast.success('Comment updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update comment';
      toast.error(message);
    },
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => postService.deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(commentId) });
      
      // Invalidate comment lists and post data
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast.success('Comment deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete comment';
      toast.error(message);
    },
  });
}

// React to comment
export function useReactToComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, type }: { commentId: string; type: ReactionType }) =>
      postService.reactToComment(commentId, type),
    onSuccess: (_, { commentId }) => {
      // Invalidate the specific comment and its reactions
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(commentId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.reactions(commentId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to react to comment';
      toast.error(message);
    },
  });
}

// Remove comment reaction
export function useRemoveCommentReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => postService.removeCommentReaction(commentId),
    onSuccess: (_, commentId) => {
      // Invalidate the specific comment and its reactions
      queryClient.invalidateQueries({ queryKey: commentKeys.detail(commentId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.reactions(commentId) });
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove reaction';
      toast.error(message);
    },
  });
}