import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Comment, ReactionType } from '@/types/types';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentsListProps {
  postId: string;
  comments: Comment[];
  total: number;
  loading?: boolean;
  onLoadMore?: () => void;
  onAddComment?: (content: string) => void;
  onReactToComment?: (commentId: string, type: ReactionType) => void;
  onRemoveCommentReaction?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, content: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  hasMore?: boolean;
}

export function CommentsList({ 
  postId,
  comments, 
  total,
  loading = false,
  onLoadMore,
  onAddComment,
  onReactToComment,
  onRemoveCommentReaction,
  onReplyToComment,
  onEditComment,
  onDeleteComment,
  hasMore = false
}: CommentsListProps) {
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleAddComment = async (content: string) => {
    await onAddComment?.(content);
    setShowCommentForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Comment form toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Comments ({total})
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          {showCommentForm ? 'Cancel' : 'Add Comment'}
        </Button>
      </div>

      {/* Comment form */}
      {showCommentForm && (
        <div className="border-t pt-4">
          <CommentForm 
            onSubmit={handleAddComment}
            onCancel={() => setShowCommentForm(false)}
            autoFocus
          />
        </div>
      )}

      {/* Comments list */}
      {loading && comments.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-gray-500">Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet.</p>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReact={onReactToComment}
              onRemoveReact={onRemoveCommentReaction}
              onReply={onReplyToComment}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
            />
          ))}
          
          {/* Load more button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline"
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Comments'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}