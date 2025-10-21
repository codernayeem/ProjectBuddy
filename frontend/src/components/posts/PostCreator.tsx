import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
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
  Heart,
  X
} from 'lucide-react';
import { useCreatePost } from '@/hooks/usePosts';
import { PostType } from '@/types/types';
import { postService } from '@/lib/posts';
import { toast } from 'react-hot-toast';

interface PostCreatorProps {
  className?: string;
  onPostCreated?: () => void;
  teamId?: string;
}

export function PostCreator({ className, onPostCreated, teamId }: PostCreatorProps) {
  const [postContent, setPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<PostType>(PostType.GENERAL);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Limit to 5 files
      if (selectedFiles.length + fileArray.length > 5) {
        toast.error('You can only upload up to 5 files');
        return;
      }
      setSelectedFiles([...selectedFiles, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadMedia = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    setUploadingMedia(true);
    try {
      const response = await postService.uploadMedia(selectedFiles);
      return response.data?.media || [];
    } catch (error) {
      toast.error('Failed to upload media');
      return [];
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) {
      toast.error('Please add some content or media to your post');
      return;
    }
    
    try {
      // Upload media first if any
      const mediaUrls = await uploadMedia();
      
      await createPostMutation.mutateAsync({
        content: postContent,
        type: selectedPostType,
        teamId: teamId,
        tags: extractTags(postContent),
        media: mediaUrls,
      });
      setPostContent('');
      setSelectedFiles([]);
      onPostCreated?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Share an update</CardTitle>
          {teamId && (
            <Badge variant="default" className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>Posting as Team</span>
            </Badge>
          )}
        </div>
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

        {/* Media Preview */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type.startsWith('video/') ? (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedFiles.length >= 5}
            >
              <Image className="w-4 h-4 mr-1" />
              Photo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={selectedFiles.length >= 5}
            >
              <Video className="w-4 h-4 mr-1" />
              Video
            </Button>
          </div>
          
          <Button 
            onClick={handleCreatePost} 
            disabled={(!postContent.trim() && selectedFiles.length === 0) || createPostMutation.isPending || uploadingMedia}
            className="bg-primary-600 hover:bg-primary-700"
          >
            {(createPostMutation.isPending || uploadingMedia) ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : null}
            {uploadingMedia ? 'Uploading...' : 'Share Update'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}