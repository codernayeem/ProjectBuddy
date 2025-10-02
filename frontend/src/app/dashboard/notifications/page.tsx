'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-new';
import { 
  Bell, Check, X, Trash2, Users, Heart, MessageCircle, 
  Share, UserPlus, Briefcase, Award, Calendar, Settings,
  MoreHorizontal, CheckCircle, Filter
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const { user } = useAuth();

  // Mock data - replace with real API calls
  const notifications = [
    {
      id: '1',
      type: 'CONNECTION_REQUEST',
      title: 'New connection request',
      message: 'Sarah Johnson wants to connect with you',
      actor: {
        id: 'user-1',
        name: 'Sarah Johnson',
        username: 'sarahjdev',
        avatar: '/avatars/sarah.jpg'
      },
      isRead: false,
      createdAt: '2024-03-15T10:30:00Z',
      actionUrl: '/connections',
      metadata: {
        connectionId: 'conn-1'
      }
    },
    {
      id: '2',
      type: 'TEAM_INVITATION',
      title: 'Team invitation',
      message: 'You have been invited to join Frontend Masters team',
      actor: {
        id: 'user-2',
        name: 'Alex Chen',
        username: 'alexchen',
        avatar: '/avatars/alex.jpg'
      },
      team: {
        id: 'team-1',
        name: 'Frontend Masters',
        logo: '/teams/frontend-masters.jpg'
      },
      isRead: false,
      createdAt: '2024-03-15T09:15:00Z',
      actionUrl: '/teams/team-1',
      metadata: {
        invitationId: 'inv-1'
      }
    },
    {
      id: '3',
      type: 'POST_REACTION',
      title: 'Someone liked your post',
      message: 'Maria Garcia liked your post about React best practices',
      actor: {
        id: 'user-3',
        name: 'Maria Garcia',
        username: 'mariagarcia',
        avatar: '/avatars/maria.jpg'
      },
      isRead: true,
      createdAt: '2024-03-15T08:45:00Z',
      actionUrl: '/dashboard#post-123',
      metadata: {
        postId: 'post-123',
        reactionType: 'like'
      }
    },
    {
      id: '4',
      type: 'POST_COMMENT',
      title: 'New comment on your post',
      message: 'David Kumar commented: "Great insights! Could you share more about the performance optimizations?"',
      actor: {
        id: 'user-4',
        name: 'David Kumar',
        username: 'davidkumar',
        avatar: '/avatars/david.jpg'
      },
      isRead: true,
      createdAt: '2024-03-14T16:20:00Z',
      actionUrl: '/dashboard#post-456',
      metadata: {
        postId: 'post-456',
        commentId: 'comment-789'
      }
    },
    {
      id: '5',
      type: 'PROJECT_MILESTONE',
      title: 'Project milestone completed',
      message: 'E-commerce Dashboard project reached 75% completion',
      project: {
        id: 'project-1',
        name: 'E-commerce Dashboard',
        logo: '/projects/ecommerce.jpg'
      },
      isRead: true,
      createdAt: '2024-03-14T14:10:00Z',
      actionUrl: '/projects/project-1',
      metadata: {
        milestoneId: 'milestone-1',
        percentage: 75
      }
    },
    {
      id: '6',
      type: 'ACHIEVEMENT_UNLOCKED',
      title: 'Achievement unlocked!',
      message: 'You earned the "Collaboration Master" badge for contributing to 10+ projects',
      isRead: false,
      createdAt: '2024-03-14T12:00:00Z',
      actionUrl: '/profile/achievements',
      metadata: {
        achievementId: 'collab-master',
        badgeName: 'Collaboration Master'
      }
    }
  ];

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
    if (selectedTab === 'connections' && !['CONNECTION_REQUEST', 'TEAM_INVITATION'].includes(notification.type)) return false;
    if (selectedTab === 'posts' && !['POST_REACTION', 'POST_COMMENT', 'POST_SHARE'].includes(notification.type)) return false;
    if (selectedTab === 'projects' && !['PROJECT_MILESTONE', 'ACHIEVEMENT_UNLOCKED'].includes(notification.type)) return false;
    if (showUnreadOnly && notification.isRead) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    console.log('Marking as read:', notificationId);
    // TODO: Implement mark as read API call
  };

  const handleMarkAllAsRead = () => {
    console.log('Marking all as read');
    // TODO: Implement mark all as read API call
  };

  const handleDeleteNotification = (notificationId: string) => {
    console.log('Deleting notification:', notificationId);
    // TODO: Implement delete notification API call
  };

  const handleAcceptInvitation = (invitationId: string) => {
    console.log('Accepting invitation:', invitationId);
    // TODO: Implement accept invitation API call
  };

  const handleDeclineInvitation = (invitationId: string) => {
    console.log('Declining invitation:', invitationId);
    // TODO: Implement decline invitation API call
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
                  
                  {notification.actor && (
                    <div className="flex items-center space-x-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                        <AvatarFallback className="text-xs">
                          {notification.actor.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>@{notification.actor.username}</span>
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

            {/* Action Buttons for specific notification types */}
            {notification.type === 'CONNECTION_REQUEST' && (
              <div className="flex space-x-2 mt-3">
                <Button size="sm" onClick={() => handleAcceptInvitation(notification.metadata.connectionId)}>
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeclineInvitation(notification.metadata.connectionId)}>
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </div>
            )}

            {notification.type === 'TEAM_INVITATION' && (
              <div className="flex space-x-2 mt-3">
                <Button size="sm" onClick={() => handleAcceptInvitation(notification.metadata.invitationId)}>
                  <Check className="w-4 h-4 mr-1" />
                  Join Team
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeclineInvitation(notification.metadata.invitationId)}>
                  <X className="w-4 h-4 mr-1" />
                  Decline
                </Button>
              </div>
            )}

            {/* Team/Project info */}
            {notification.team && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={notification.team.logo} alt={notification.team.name} />
                  <AvatarFallback className="text-xs">{notification.team.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{notification.team.name}</span>
              </div>
            )}

            {notification.project && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-gray-50 rounded-lg">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{notification.project.name}</span>
                {notification.metadata.percentage && (
                  <Badge variant="outline" className="text-xs">
                    {notification.metadata.percentage}% Complete
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
          <Button
            variant="outline"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={showUnreadOnly ? 'bg-blue-50 border-blue-200' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </Button>
          
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          
          <Button variant="outline" asChild>
            <Link href="/settings#notifications">
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
    </div>
  );
}