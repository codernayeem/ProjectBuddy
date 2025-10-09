import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  FileText, 
  Users,
  Trash2,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Post, ReactionType } from '@/types/types';
import { getInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useReactToPost, useRemoveReaction } from '@/hooks/usePosts';
import { 
  useComments, 
  useAddComment,
  useUpdateComment,
  useDeleteComment,
  useReactToComment,
  useRemoveCommentReaction 
} from '@/hooks/useComments';
import { CommentsList } from './CommentsList';

interface PostCardProps {
  post: Post;
  onReact?: (postId: string, type: ReactionType) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showActions?: boolean;
  showComments?: boolean;
  isOwner?: boolean;
}

export function PostCard({ 
  post, 
  onReact, 
  onEdit, 
  onDelete, 
  showActions = false, 
  showComments = true,
  isOwner = false 
}: PostCardProps) {
  const { user: currentUser } = useAuthStore();
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);

  // Comments hooks
  const { data: commentsData, isLoading: commentsLoading } = useComments(
    post.id, 
    commentsPage, 
    10
  );
  
  const addCommentMutation = useAddComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();
  const reactToCommentMutation = useReactToComment();
  const removeCommentReactionMutation = useRemoveCommentReaction();

  // Post reaction hooks
  const reactToPostMutation = useReactToPost();
  const removePostReactionMutation = useRemoveReaction();

  const handlePostReact = () => {
    // Check if user has already reacted to this post
    const userReaction = post.reactions?.find(r => r.userId === currentUser?.id);
    
    if (userReaction) {
      // User has reacted, so remove the reaction
      if (onReact) {
        // Custom handler provided
        onReact(post.id, ReactionType.LIKE);
      } else {
        removePostReactionMutation.mutate(post.id);
      }
    } else {
      // User hasn't reacted, so add reaction
      if (onReact) {
        onReact(post.id, ReactionType.LIKE);
      } else {
        reactToPostMutation.mutate({ id: post.id, type: ReactionType.LIKE });
      }
    }
  };

  const handleToggleComments = () => {
    setShowCommentsSection(!showCommentsSection);
  };

  const handleAddComment = async (content: string) => {
    await addCommentMutation.mutateAsync({ 
      postId: post.id, 
      content 
    });
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    await addCommentMutation.mutateAsync({ 
      postId: post.id, 
      content, 
      parentId: commentId 
    });
  };

  const handleEditComment = async (commentId: string, content: string) => {
    await updateCommentMutation.mutateAsync({ commentId, content });
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId);
  };

  const handleReactToComment = async (commentId: string, type: ReactionType) => {
    await reactToCommentMutation.mutateAsync({ commentId, type });
  };

  const handleRemoveCommentReaction = async (commentId: string) => {
    await removeCommentReactionMutation.mutateAsync(commentId);
  };

  const comments = commentsData?.data || [];
  const commentsTotal = commentsData?.pagination?.total || 0;
  const hasMoreComments = comments.length < commentsTotal;
  
  // Check if current user has reacted to this post
  const userReaction = post.reactions?.find(r => r.userId === currentUser?.id);
  const hasUserReacted = !!userReaction;
  const PostTypeIcon = ({ type: _type }: { type: string }) => {
    return <FileText className="w-3 h-3" />;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={post.author?.avatar || undefined} 
              alt={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'User'}
            />
            <AvatarFallback>
              {post.author ? getInitials(post.author.firstName, post.author.lastName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold">
                  {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown User'}
                </h3>
                <p className="text-sm text-gray-600">
                  @{post.author?.username || 'unknown'} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <PostTypeIcon type={post.type} />
                  <span className="capitalize">{post.type.replace('_', ' ').toLowerCase()}</span>
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {post.team && (
              <div className="mb-3">
                <Badge variant="outline" className="flex items-center space-x-1 w-fit">
                  <Users className="w-3 h-3" />
                  <span>{post.team.name}</span>
                </Badge>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex space-x-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center space-x-1 ${hasUserReacted ? 'text-red-500' : ''}`}
                  onClick={handlePostReact}
                >
                  <Heart className={`w-4 h-4 ${hasUserReacted ? 'fill-current' : ''}`} />
                  <span>{post.likesCount || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-1"
                  onClick={handleToggleComments}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCount || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-1"
                  disabled
                >
                  <Share className="w-4 h-4" />
                  <span>{post.sharesCount || 0}</span>
                </Button>
              </div>
              {showActions && isOwner && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => onEdit?.(post.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDelete?.(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Comments Section */}
      {showCommentsSection && (
        <div className="border-t px-6 pb-6">
          <CommentsList
            postId={post.id}
            comments={comments}
            total={commentsTotal}
            loading={commentsLoading}
            onAddComment={handleAddComment}
            onReactToComment={handleReactToComment}
            onRemoveCommentReaction={handleRemoveCommentReaction}
            onReplyToComment={handleReplyToComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            hasMore={hasMoreComments}
            onLoadMore={() => setCommentsPage(prev => prev + 1)}
          />
        </div>
      )}
    </Card>
  );
}