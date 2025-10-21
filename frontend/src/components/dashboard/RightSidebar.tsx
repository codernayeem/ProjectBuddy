import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  ExternalLink,
  MessageSquare,
  Heart,
  Share2,
  UserPlus,
  Loader2
} from 'lucide-react';
import { userService } from '@/lib/auth';
import { connectionService } from '@/lib/connections';
import { postService } from '@/lib/posts';
import { notificationService } from '@/lib/notifications';
import { getInitials } from '@/lib/utils';

// Removed hardcoded suggestedConnections and trendingTopics - now using real API data

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState('trending');
  const queryClient = useQueryClient();

  // Fetch real user recommendations
  const { data: recommendationsData, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['user-recommendations'],
    queryFn: () => userService.getUserRecommendations(1, 3),
  });

  // Fetch trending hashtags
  const { data: trendingData, isLoading: loadingTrending } = useQuery({
    queryKey: ['trending-hashtags'],
    queryFn: () => postService.getTrendingHashtags(5),
  });

  // Fetch recent notifications
  const { data: notificationsData, isLoading: loadingNotifications } = useQuery({
    queryKey: ['recent-notifications'],
    queryFn: () => notificationService.getNotifications(1, 5),
  });

  // Mutation for sending connection requests
  const sendRequestMutation = useMutation({
    mutationFn: (userId: string) => connectionService.sendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-recommendations'] });
      toast.success('Connection request sent!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send connection request');
    },
  });

  const suggestedConnections = recommendationsData?.data?.users || [];
  const trendingHashtags = trendingData?.data || [];
  const recentNotifications = notificationsData?.data || [];

  // Helper function to get time ago
  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with Tabs */}
      <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={activeTab === 'trending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('trending')}
            className="flex-1 text-xs md:text-sm"
          >
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Trending
          </Button>
          <Button
            variant={activeTab === 'activity' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('activity')}
            className="flex-1 text-xs md:text-sm"
          >
            <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            Activity
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
        {activeTab === 'trending' && (
          <>
            {/* Trending Hashtags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingTrending ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : trendingHashtags.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No trending hashtags at the moment
                  </p>
                ) : (
                  trendingHashtags.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-200">{item.hashtag}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.count} posts</div>
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400">
                        {item.growth}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Suggested Connections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                    People You May Know
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingRecommendations ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : suggestedConnections.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recommendations available at the moment.
                  </p>
                ) : (
                  suggestedConnections.map((person) => {
                    const fullName = `${person.firstName} ${person.lastName}`;
                    const initials = getInitials(person.firstName, person.lastName);

                    return (
                      <div key={person.id} className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Link to={`/dashboard/profile/${person.id}`}>
                            <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all">
                              <AvatarImage src={person.avatar || ''} alt={fullName} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/dashboard/profile/${person.id}`}
                              className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                            >
                              {fullName}
                            </Link>
                            {person.position && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {person.position}{person.company ? ` at ${person.company}` : ''}
                              </p>
                            )}
                            {person.skills && person.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {person.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => sendRequestMutation.mutate(person.id)}
                          disabled={sendRequestMutation.isPending}
                        >
                          {sendRequestMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingNotifications ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent notifications
                  </p>
                ) : (
                  recentNotifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.user?.avatar || ''} alt={notification.title} />
                        <AvatarFallback className="text-xs">
                          {notification.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">{notification.title}</span>
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Like recent posts
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send messages
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share updates
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}