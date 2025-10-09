import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitLabel?: string;
  initialValue?: string;
  autoFocus?: boolean;
}

export function CommentForm({ 
  onSubmit, 
  onCancel,
  placeholder = "Write a comment...",
  submitLabel = "Comment",
  initialValue = "",
  autoFocus = false
}: CommentFormProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    onCancel?.();
  };

  if (!user) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage 
            src={user.avatar || undefined} 
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            maxLength={2000}
          />
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {content.length}/2000
            </span>
            
            <div className="flex items-center space-x-2">
              {onCancel && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit"
                size="sm"
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}