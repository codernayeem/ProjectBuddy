import { useEffect } from 'react';
import { X, Home, Users, Briefcase, MessageSquare, Bell, Hash} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Connections', href: '/dashboard/connections', icon: Users },
  { name: 'Projects', href: '/dashboard/projects', icon: Briefcase },
  { name: 'Teams', href: '/dashboard/teams', icon: Hash },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
];

interface MobileNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function MobileNavigation({ sidebarOpen, setSidebarOpen }: MobileNavigationProps) {
  const location = useLocation();
  const { user } = useAuth();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, setSidebarOpen]);

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
      
      {/* Sidebar */}
      <div 
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} alt={user?.firstName} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'group flex items-center gap-x-3 rounded-md p-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    <item.icon className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                    )} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}