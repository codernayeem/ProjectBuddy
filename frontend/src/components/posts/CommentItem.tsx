import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Heart, 
  Trash2, 
  Edit, 
  Reply 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Comment, ReactionType } from '@/types/types';
import { getInitials } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReact?: (commentId: string, type: ReactionType) => void;
  onRemoveReact?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  showReplies?: boolean;
  level?: number;
}

export function CommentItem({ 
  comment, 
  postId,
  onReact, 
  onRemoveReact,
  onReply,
  onEdit, 
  onDelete, 
  showReplies = true,
  level = 0
}: CommentItemProps) {
  const { user: currentUser } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const isOwner = currentUser?.id === comment.authorId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const displayedReplies = showAllReplies ? comment.replies : comment.replies?.slice(0, 3);
  
  // Check if current user has reacted to this comment
  const userReaction = comment.reactions?.find(r => r.userId === currentUser?.id);
  const hasUserReacted = !!userReaction;

  const handleReply = (content: string) => {
    onReply?.(comment.id, content);
    setIsReplying(false);
  };

  const handleEdit = (content: string) => {
    onEdit?.(comment.id, content);
    setIsEditing(false);
  };

  const handleReact = () => {
    if (hasUserReacted) {
      // User has reacted, so remove the reaction
      onRemoveReact?.(comment.id);
    } else {
      // User hasn't reacted, so add reaction
      onReact?.(comment.id, ReactionType.LIKE);
    }
  };

  // Limit nesting depth
  const shouldShowReplies = showReplies && level < 3;

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-8 pl-4 border-l border-gray-200' : ''}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={comment.author?.avatar || undefined} 
            alt={`${comment.author.firstName} ${comment.author.lastName}`}
          />
          <AvatarFallback>
            {getInitials(comment.author.firstName, comment.author.lastName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">
                  {comment.author.firstName} {comment.author.lastName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
              {isOwner && (
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete?.(comment.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <CommentForm
                initialValue={comment.content}
                placeholder="Edit your comment..."
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                submitLabel="Save"
              />
            ) : (
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleReact}
              className={`flex items-center space-x-1 h-6 px-2 ${hasUserReacted ? 'text-red-500' : ''}`}
            >
              <Heart className={`w-3 h-3 ${hasUserReacted ? 'fill-current' : ''}`} />
              <span>{comment.likesCount || 0}</span>
            </Button>
            
            {level < 2 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsReplying(true)}
                className="flex items-center space-x-1 h-6 px-2"
              >
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </Button>
            )}
            
            {hasReplies && (
              <span className="text-gray-400">
                {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
          
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                placeholder={`Reply to ${comment.author.firstName}...`}
                onSubmit={handleReply}
                onCancel={() => setIsReplying(false)}
                submitLabel="Reply"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {shouldShowReplies && hasReplies && (
        <div className="space-y-3">
          {displayedReplies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReact={onReact}
              onRemoveReact={onRemoveReact}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              showReplies={level < 2}
              level={level + 1}
            />
          ))}
          
          {comment.replies && comment.replies.length > 3 && !showAllReplies && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAllReplies(true)}
              className="text-blue-600 hover:text-blue-700 ml-11"
            >
              Show {comment.repliesCount - 3} more replies
            </Button>
          )}
        </div>
      )}
    </div>
  );
}