import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Star,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react';

const trendingTopics = [
  { name: 'React 19', posts: '1.2k posts', growth: '+25%' },
  { name: 'AI/ML Jobs', posts: '856 posts', growth: '+18%' },
  { name: 'Remote Work', posts: '2.1k posts', growth: '+12%' },
  { name: 'Web3 Development', posts: '432 posts', growth: '+35%' },
  { name: 'Design Systems', posts: '678 posts', growth: '+8%' },
];

const suggestedConnections = [
  {
    id: 1,
    name: 'Sarah Chen',
    title: 'Senior Frontend Developer at Google',
    avatar: null,
    mutualConnections: 12,
    skills: ['React', 'TypeScript', 'Next.js']
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    title: 'Product Manager at Stripe',
    avatar: null,
    mutualConnections: 8,
    skills: ['Product Strategy', 'Agile', 'Analytics']
  },
  {
    id: 3,
    name: 'Lisa Wang',
    title: 'UX Designer at Figma',
    avatar: null,
    mutualConnections: 15,
    skills: ['Design Systems', 'Prototyping', 'User Research']
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'React Conference 2024',
    date: 'Dec 15, 2024',
    time: '9:00 AM',
    attendees: 1250,
    type: 'Virtual'
  },
  {
    id: 2,
    title: 'Tech Meetup: AI in Web Dev',
    date: 'Dec 18, 2024',
    time: '6:00 PM',
    attendees: 85,
    type: 'In-person'
  },
];

const recentActivity = [
  {
    id: 1,
    user: 'Alex Rodriguez',
    action: 'liked your post about Next.js 15',
    time: '2h ago',
    avatar: '/avatars/alex.jpg'
  },
  {
    id: 2,
    user: 'Team Alpha',
    action: 'invited you to join their project',
    time: '4h ago',
    avatar: '/avatars/team.jpg'
  },
  {
    id: 3,
    user: 'Jessica Miller',
    action: 'commented on your achievement',
    time: '6h ago',
    avatar: '/avatars/jessica.jpg'
  },
];

export default function RightSidebar() {
  const [activeTab, setActiveTab] = useState('trending');

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
            {/* Trending Topics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{topic.name}</div>
                      <div className="text-xs text-gray-500">{topic.posts}</div>
                    </div>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {topic.growth}
                    </Badge>
                  </div>
                ))}
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
                {suggestedConnections.map((person) => (
                  <div key={person.id} className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.avatar ? person.avatar : ''} alt={person.name} />
                        <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {person.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {person.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {person.mutualConnections} mutual connections
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {person.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Connect
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <Users className="h-3 w-3 mr-1" />
                          {event.attendees} attending
                          <Badge variant="outline" className="ml-2 text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback className="text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-600 dark:text-gray-400"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
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