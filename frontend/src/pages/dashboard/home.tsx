'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Users } from 'lucide-react';
import { useFeed, useDeletePost } from '@/hooks/usePosts';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { PostCard } from '@/components/posts/PostCard';
import { PostCreator } from '@/components/posts/PostCreator';
import { useNavigate } from 'react-router-dom';

export default function DashboardHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: feedData, isLoading: feedLoading, error: feedError } = useFeed(1, 10);
  const { data: userTeamsData } = useTeams(1, 10);
  const deletePostMutation = useDeletePost();

  // Calculate stats from real data
  const stats = {
    connections: 0, // TODO: Add connections API
    teams: userTeamsData?.pagination?.total || 0,
    projects: 0, // TODO: Add projects API
  };

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamic welcome message
  const getWelcomeMessage = () => {
    const teamCount = stats.teams;
    if (teamCount > 0) {
      return `You're part of ${teamCount} team${teamCount === 1 ? '' : 's'}. Keep collaborating!`;
    }
    return "Ready to start collaborating? Join or create a team!";
  };

  if (feedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (feedError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <CardContent>
            <p className="text-red-600 dark:text-red-400 text-center">Failed to load feed. Please try again.</p>
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
                {getGreeting()}, {user?.firstName}! 👋
              </h1>
              <p className="text-primary-100">
                {getWelcomeMessage()}
              </p>
            </div>
            <div className="hidden md:flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/dashboard/connections')}
              >
                <Users className="h-4 w-4 mr-2" />
                View Requests
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
                  <p className="text-gray-600 dark:text-gray-400">No posts in your feed yet. Start following teams and users to see their updates!</p>
                </CardContent>
              </Card>
            ) : (
              Array.isArray(feedData.data) && feedData.data.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onDelete={(postId) => deletePostMutation.mutate(postId)}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}