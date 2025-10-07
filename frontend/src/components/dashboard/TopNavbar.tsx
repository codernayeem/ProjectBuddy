import { useState } from 'react';
import { Menu, Search, Bell, MessageSquare, Home, Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import MobileSearch from './MobileSearch';

interface TopNavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function TopNavbar({ setSidebarOpen }: TopNavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0 h-9 w-9 md:h-10 md:w-10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-primary-600">
              <Home className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="hidden text-lg md:text-xl font-bold text-gray-900 dark:text-white sm:block truncate">
              ProjectBuddy
            </span>
          </Link>

          {/* Search - Responsive width */}
          <div className="relative hidden md:block flex-1 max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className={`h-4 w-4 ${searchFocused ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              className={`w-full pl-10 pr-4 h-9 text-sm transition-all duration-200 ${
                searchFocused 
                  ? 'ring-2 ring-primary-500 border-primary-300' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Search button for mobile/tablet */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-9 w-9"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Create button - Hidden on small screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10 hidden sm:flex">
                <Plus className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Start Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10 ">
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 text-xs flex items-center justify-center text-white"
            >
              3
            </Badge>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 text-xs flex items-center justify-center text-white"
            >
              5
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 pl-1 sm:pl-2 pr-2 sm:pr-3 h-9 md:h-10">
                <Avatar className="h-7 w-7 md:h-8 md:w-8">
                  <AvatarImage src={user?.avatar} alt={user?.firstName} />
                  <AvatarFallback className="text-xs md:text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-gray-900 dark:text-white lg:block max-w-20 truncate">
                  {user?.firstName}
                </span>
                <ChevronDown className="h-3 w-3 md:h-4 md:w-4 text-gray-400 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-gray-500">@{user?.username}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">View Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/help">Help & Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Modal */}
      <MobileSearch 
        isOpen={mobileSearchOpen} 
        onClose={() => setMobileSearchOpen(false)} 
      />
    </header>
  );
}