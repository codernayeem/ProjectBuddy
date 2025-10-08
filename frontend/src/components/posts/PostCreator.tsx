import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Image, 
  Video, 
  FileText, 
  Award,
  TrendingUp,
  Users,
  Briefcase,
  MessageCircle,
  Calendar,
  Heart
} from 'lucide-react';
import { useCreatePost } from '@/hooks/usePosts';
import { PostType } from '@/types/types';

interface PostCreatorProps {
  className?: string;
  onPostCreated?: () => void;
}

export function PostCreator({ className, onPostCreated }: PostCreatorProps) {
  const [postContent, setPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<PostType>(PostType.GENERAL);
  
  const createPostMutation = useCreatePost();

  const postTypes = [
    { id: PostType.GENERAL, label: 'General Update', icon: FileText },
    { id: PostType.ACHIEVEMENT, label: 'Achievement', icon: Award },
    { id: PostType.MILESTONE_COMPLETED, label: 'Milestone Completed', icon: TrendingUp },
    { id: PostType.NEW_MEMBER, label: 'New Member', icon: Users },
    { id: PostType.RECRUITMENT, label: 'Recruitment', icon: Users },
    { id: PostType.PROJECT_SHOWCASE, label: 'Project Showcase', icon: TrendingUp },
    { id: PostType.PROJECT_UPDATE, label: 'Project Update', icon: Briefcase },
    { id: PostType.SKILL_SHARE, label: 'Skill Share', icon: Award },
    { id: PostType.RESOURCE_SHARE, label: 'Resource Share', icon: FileText },
    { id: PostType.QUESTION, label: 'Question', icon: MessageCircle },
    { id: PostType.POLL, label: 'Poll', icon: MessageCircle },
    { id: PostType.EVENT, label: 'Event', icon: Calendar },
    { id: PostType.CELEBRATION, label: 'Celebration', icon: Heart },
  ];

  const extractTags = (content: string): string[] => {
    const hashtags = content.match(/#[a-zA-Z0-9_-]+/g);
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    try {
      await createPostMutation.mutateAsync({
        content: postContent,
        type: selectedPostType,
        tags: extractTags(postContent),
      });
      setPostContent('');
      onPostCreated?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Share an update</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {postTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedPostType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPostType(type.id)}
              className="flex items-center space-x-1"
            >
              <type.icon className="w-4 h-4" />
              <span>{type.label}</span>
            </Button>
          ))}
        </div>
        
        <Textarea
          placeholder="What's on your mind? Share your projects, achievements, or team updates... Use #hashtags to make your post discoverable!"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="min-h-[100px]"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Image className="w-4 h-4 mr-1" />
              Photo
            </Button>
            <Button variant="outline" size="sm" disabled>
              <Video className="w-4 h-4 mr-1" />
              Video
            </Button>
            <Button variant="outline" size="sm" disabled>
              <FileText className="w-4 h-4 mr-1" />
              Document
            </Button>
          </div>
          
          <Button 
            onClick={handleCreatePost} 
            disabled={!postContent.trim() || createPostMutation.isPending}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {createPostMutation.isPending ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : null}
            Share Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}