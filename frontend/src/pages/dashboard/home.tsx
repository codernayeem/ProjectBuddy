'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  TrendingUp, Users, Briefcase, Award,
  Plus, Calendar
} from 'lucide-react';
import { useFeed, useReactToPost } from '@/hooks/usePosts';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { ReactionType } from '@/types/types';
import { PostCard } from '@/components/posts/PostCard';
import { PostCreator } from '@/components/posts/PostCreator';

export default function DashboardHomePage() {
  const { user } = useAuth();
  const { data: feedData, isLoading: feedLoading, error: feedError } = useFeed(1, 10);
  const { data: userTeamsData } = useTeams(1, 10);
  const reactToPostMutation = useReactToPost();

  // Calculate stats from real data
  const stats = {
    connections: 0, // TODO: Add connections API
    teams: userTeamsData?.pagination?.total || 0,
    projects: 0, // TODO: Add projects API
  };

  const handleReaction = async (postId: string, reactionType: ReactionType) => {
    try {
      await reactToPostMutation.mutateAsync({ id: postId, type: reactionType });
    } catch (error) {
      console.error('Failed to react to post:', error);
    }
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
        {/* Main Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Create Post */}
          <PostCreator />

          {/* Feed */}
          <div className="space-y-6">
            {!feedData?.data || feedData.data.length === 0 ? (
              <Card className="p-6 text-center">
                <CardContent>
                  <p className="text-gray-600">No posts in your feed yet. Start following teams and users to see their updates!</p>
                </CardContent>
              </Card>
            ) : (
              Array.isArray(feedData.data) && feedData.data.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onReact={handleReaction}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}