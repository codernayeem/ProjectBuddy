import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Post, ReactionType } from '@/types/types';
import { getInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useReactToPost, useRemoveReaction, useUpdatePost } from '@/hooks/usePosts';
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
  isOwner = false 
}: PostCardProps) {
  const { user: currentUser } = useAuthStore();
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  // Post mutations
  const updatePostMutation = useUpdatePost();

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

  const handleEditPost = async () => {
    if (!editContent.trim() && (!post.media || post.media.length === 0)) {
      return; // Don't allow empty posts
    }
    
    await updatePostMutation.mutateAsync({
      id: post.id,
      data: { content: editContent }
    });
    
    setShowEditDialog(false);
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
          <Link to={`/dashboard/profile/${post.author?.id}`} className="flex-shrink-0">
            <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
              <AvatarImage 
                src={post.author?.avatar || undefined} 
                alt={post.author ? `${post.author.firstName} ${post.author.lastName}` : 'User'}
              />
              <AvatarFallback>
                {post.author ? getInitials(post.author.firstName, post.author.lastName) : 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <Link to={`/dashboard/profile/${post.author?.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown User'}
                  </h3>
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>@{post.author?.username || 'unknown'}</span>
                  {post.team && (
                    <>
                      <span>•</span>
                      <span>posted in</span>
                      <Link to={`/dashboard/teams/${post.team.id}`} className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
                        <Users className="w-3 h-3" />
                        <span>{post.team.name}</span>
                      </Link>
                    </>
                  )}
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <PostTypeIcon type={post.type} />
                  <span className="capitalize">{post.type.replace('_', ' ').toLowerCase()}</span>
                </Badge>
                {currentUser && post.author && currentUser.id === post.author.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <DropdownMenuItem 
                        onClick={() => {
                          setEditContent(post.content || '');
                          setShowEditDialog(true);
                        }}
                        className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Post</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap">{post.content}</p>
            
            {/* Media Display */}
            {post.media && post.media.length > 0 && (
              <div className={`mb-3 grid gap-2 ${
                post.media.length === 1 ? 'grid-cols-1' : 
                post.media.length === 2 ? 'grid-cols-2' : 
                post.media.length === 3 ? 'grid-cols-3' : 
                'grid-cols-2'
              }`}>
                {post.media.map((mediaUrl, index) => {
                  const isVideo = mediaUrl.includes('.mp4') || mediaUrl.includes('.mov') || mediaUrl.includes('.webm');
                  return (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {isVideo ? (
                        <video 
                          src={mediaUrl} 
                          controls 
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      ) : (
                        <img 
                          src={mediaUrl} 
                          alt={`Post media ${index + 1}`} 
                          className="w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(mediaUrl, '_blank')}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
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
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 pb-6">
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

      {/* Edit Post Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Edit Post</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Make changes to your post here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[150px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditPost}
              disabled={!editContent.trim() && (!post.media || post.media.length === 0)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Post</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(post.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}