import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Search,
  Plus,
  Hash,
  Calendar,
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Connections', href: '/connections', icon: Hash },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Events', href: '/events', icon: Calendar },
];

const quickActions = [
  { name: 'Start a post', action: 'post' },
  { name: 'Create team', action: 'team' },
  { name: 'New project', action: 'project' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* User Profile Section */}
      <div className="flex flex-col items-center p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <Avatar className="h-12 w-12 lg:h-16 lg:w-16 mb-2 lg:mb-3">
          <AvatarImage src={user?.avatar} alt={user?.firstName} />
          <AvatarFallback className="text-sm lg:text-lg">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white text-center">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 text-center">
          @{user?.username}
        </p>
        <div className="flex space-x-3 lg:space-x-4 mt-2 lg:mt-3 text-xs lg:text-sm text-gray-600 dark:text-gray-300">
          <div className="text-center">
            <div className="font-semibold">245</div>
            <div className="text-xs">Connections</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">12</div>
            <div className="text-xs">Teams</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 lg:py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 lg:px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <item.icon className={cn(
                'mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0',
                isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              )} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 lg:mb-3">
          Quick Actions
        </h4>
        <div className="space-y-1 lg:space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left text-sm px-2 lg:px-3"
            >
              <Plus className="mr-2 h-4 w-4" />
              {action.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Settings and Profile */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <Link
          to="/profile"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          Profile
        </Link>
        <Link
          to="/settings"
          className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          Settings
        </Link>
      </div>
    </div>
  );
}