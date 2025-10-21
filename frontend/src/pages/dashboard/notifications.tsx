import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, Check, Trash2, Users, Heart, MessageCircle, 
  Share, UserPlus, Briefcase, Award, Calendar, Settings,
  MoreHorizontal, CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';
import { useUnreadNotificationCount, useNotifications } from '@/hooks/useNotifications';
import { notificationService } from '@/lib/notifications';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [page] = useState(1);
  const queryClient = useQueryClient();

  // Fetch notifications based on selected tab
  const getFilters = () => {
    if (selectedTab === 'unread') return { isRead: false };
    if (selectedTab === 'connections') return { category: 'social' };
    if (selectedTab === 'posts') return { category: 'social' };
    if (selectedTab === 'projects') return { category: 'team' };
    return undefined;
  };

  const { data: notificationsData, isLoading } = useNotifications(page, 20, getFilters());
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const notifications = notificationsData?.data || [];

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONNECTION_REQUEST': return <UserPlus className="w-5 h-5 text-blue-600" />;
      case 'TEAM_INVITATION': return <Users className="w-5 h-5 text-green-600" />;
      case 'POST_REACTION': return <Heart className="w-5 h-5 text-red-600" />;
      case 'POST_COMMENT': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'POST_SHARE': return <Share className="w-5 h-5 text-purple-600" />;
      case 'PROJECT_MILESTONE': return <Briefcase className="w-5 h-5 text-orange-600" />;
      case 'ACHIEVEMENT_UNLOCKED': return <Award className="w-5 h-5 text-yellow-600" />;
      case 'EVENT_REMINDER': return <Calendar className="w-5 h-5 text-indigo-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'CONNECTION_REQUEST': return 'bg-blue-100';
      case 'TEAM_INVITATION': return 'bg-green-100';
      case 'POST_REACTION': return 'bg-red-100';
      case 'POST_COMMENT': return 'bg-blue-100';
      case 'POST_SHARE': return 'bg-purple-100';
      case 'PROJECT_MILESTONE': return 'bg-orange-100';
      case 'ACHIEVEMENT_UNLOCKED': return 'bg-yellow-100';
      case 'EVENT_REMINDER': return 'bg-indigo-100';
      default: return 'bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedTab === 'unread' && notification.isRead) return false;
    if (selectedTab === 'connections' && !['CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'TEAM_INVITATION', 'TEAM_JOIN_REQUEST'].includes(notification.type)) return false;
    if (selectedTab === 'posts' && !['POST_REACTION', 'POST_COMMENT', 'POST_SHARED', 'COMMENT_REACTION', 'COMMENT_REPLY', 'POST_MENTION'].includes(notification.type)) return false;
    if (selectedTab === 'projects' && !['TEAM_MILESTONE_COMPLETED', 'ACHIEVEMENT_UNLOCKED', 'PROJECT_MILESTONE'].includes(notification.type)) return false;
    return true;
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card className={`hover:shadow-md transition-shadow ${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Notification Icon */}
          <div className={`p-2 rounded-full ${getNotificationTypeColor(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {notification.title}
                  </h4>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                  
                  {(notification.data as any)?.senderUsername && (
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={(notification.data as any).senderAvatar} alt={(notification.data as any).senderUsername} />
                        <AvatarFallback className="text-xs">
                          {(notification.data as any).senderUsername?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>@{(notification.data as any).senderUsername}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 ml-2">
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteNotification(notification.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Team/Project info */}
            {(notification.data as any)?.team && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={(notification.data as any).team.logo} alt={(notification.data as any).team.name} />
                  <AvatarFallback className="text-xs">{(notification.data as any).team.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{(notification.data as any).team.name}</span>
              </div>
            )}

            {(notification.data as any)?.project && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded-lg">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{(notification.data as any).project.name}</span>
                {(notification.data as any).percentage && (
                  <Badge variant="outline" className="text-xs">
                    {(notification.data as any).percentage}% Complete
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">
                Stay updated with your connections, teams, and projects.
              </p>
              {unreadCount > 0 && (
                <Badge variant="default" className="mt-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              
              <Button variant="outline" asChild>
                <Link to="/settings#notifications">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="connections">
            Connections
          </TabsTrigger>
          <TabsTrigger value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger value="projects">
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <CardContent>
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">
                  You don't have any notifications at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <CardContent>
                <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">
                  You don't have any unread notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No connection notifications</h3>
                <p className="text-gray-600">
                  You don't have any connection or team-related notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <CardContent>
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No post notifications</h3>
                <p className="text-gray-600">
                  You don't have any post-related notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <CardContent>
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No project notifications</h3>
                <p className="text-gray-600">
                  You don't have any project-related notifications.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}