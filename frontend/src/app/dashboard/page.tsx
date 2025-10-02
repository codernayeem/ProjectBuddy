'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Heart, MessageCircle, Share, MoreHorizontal, 
  TrendingUp, Users, Briefcase, Award,
  Image, Video, FileText, MapPin, Plus, Calendar
} from 'lucide-react';
import { useFeed, useCreatePost, useReactToPost } from '@/hooks/usePosts';
import { useUserTeams } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const [postContent, setPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState('GENERAL');
  
  const { user } = useAuth();
  const { data: feedData, isLoading: feedLoading, error: feedError } = useFeed(1, 10);
  const { data: userTeamsData } = useUserTeams(1, 10);
  const createPostMutation = useCreatePost();
  const reactToPostMutation = useReactToPost();

  const postTypes = [
    { id: 'GENERAL', label: 'General Update', icon: FileText },
    { id: 'PROJECT_UPDATE', label: 'Project Update', icon: Briefcase },
    { id: 'ACHIEVEMENT', label: 'Achievement', icon: Award },
    { id: 'TEAM_FORMATION', label: 'Team Formation', icon: Users },
    { id: 'FIND_TEAMMATES', label: 'Find Teammates', icon: Users },
    { id: 'MILESTONE', label: 'Milestone', icon: TrendingUp },
  ];

  // Calculate stats from real data
  const stats = {
    connections: 0, // TODO: Add connections API
    teams: userTeamsData?.pagination?.total || 0,
    projects: 0, // TODO: Add projects API
    achievements: feedData?.data?.data?.filter(p => p.type === 'ACHIEVEMENT').length || 0
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
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      await reactToPostMutation.mutateAsync({ id: postId, type: reactionType });
    } catch (error) {
      console.error('Failed to react to post:', error);
    }
  };

  const extractTags = (content: string): string[] => {
    const hashtags = content.match(/#[a-zA-Z0-9_-]+/g);
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  };

  const PostTypeIcon = ({ type }: { type: string }) => {
    const typeConfig = postTypes.find(t => t.id === type);
    const IconComponent = typeConfig?.icon || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  if (feedLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (feedError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <CardContent>
            <p className="text-red-600 text-center">Failed to load feed. Please try again.</p>
            <Button 
              className="w-full mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-white ">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-primary-100">
                You have 3 new connection requests and 5 team invitations waiting.
              </p>
            </div>
            <div className="hidden md:flex space-x-2">
              <Button variant="secondary" size="sm">
                <Users className="h-4 w-4 mr-2" />
                View Requests
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-white hover:text-primary-600">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-600">Connections</p>
                  <p className="text-2xl font-bold">{stats.connections}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Teams</p>
                  <p className="text-2xl font-bold">{stats.teams}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Projects</p>
                  <p className="text-2xl font-bold">{stats.projects}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Achievements</p>
                  <p className="text-2xl font-bold">{stats.achievements}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Create Post */}
          <Card>
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

          {/* Feed */}
          <div className="space-y-6">
            {feedData?.data?.data?.length === 0 ? (
              <Card className="p-6 text-center">
                <CardContent>
                  <p className="text-gray-600">No posts in your feed yet. Start following teams and users to see their updates!</p>
                </CardContent>
              </Card>
            ) : (
              feedData?.data?.data?.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={post.author.avatar || undefined} 
                          alt={`${post.author.firstName} ${post.author.lastName}`}
                        />
                        <AvatarFallback>
                          {`${post.author.firstName[0]}${post.author.lastName[0]}`}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {post.author.firstName} {post.author.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              @{post.author.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
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
                        
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {post.project && (
                          <div className="mb-3">
                            <Badge variant="outline" className="flex items-center space-x-1 w-fit">
                              <Briefcase className="w-3 h-3" />
                              <span>{post.project.title}</span>
                            </Badge>
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
                              onClick={() => handleReaction(post.id, 'like')}
                              disabled={reactToPostMutation.isPending}
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Find Teammates
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>John liked your post</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span>Team Alpha invited you</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>New project milestone</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Teams */}
          {userTeamsData?.data?.data && userTeamsData?.data?.data.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTeamsData.data.data.slice(0, 3).map((team) => (
                    <div key={team.id} className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary-600" />
                        </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{team.name}</p>
                        <p className="text-xs text-gray-500">{team.memberCount} members</p>
                      </div>
                    </div>
                  ))}
                  {userTeamsData.data.data.length > 3 && (
                    <Button variant="ghost" className="w-full text-sm">
                      View all teams
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}