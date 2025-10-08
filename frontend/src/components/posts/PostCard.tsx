import { formatDistanceToNow } from 'date-fns';
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

interface PostCardProps {
  post: Post;
  onReact?: (postId: string, type: ReactionType) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  showActions?: boolean;
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
                  className="flex items-center space-x-1"
                  onClick={() => onReact?.(post.id, ReactionType.LIKE)}
                >
                  <Heart className="w-4 h-4" />
                  <span>{post.likesCount || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-1"
                  disabled
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
    </Card>
  );
}