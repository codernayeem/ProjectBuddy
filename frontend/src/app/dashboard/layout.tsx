'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import Sidebar from '../../components/dashboard/Sidebar';
import RightSidebar from '../../components/dashboard/RightSidebar';
import TopNavbar from '../../components/dashboard/TopNavbar';
import MobileNavigation from '../../components/dashboard/MobileNavigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useRequireAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  // Don't render dashboard if not authenticated (redirect will happen in useRequireAuth)
  if (!isAuthenticated) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Layout Container */}
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 xl:w-72 lg:flex-col">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:pl-64 xl:pl-72">
          {/* Top Navbar */}
          <div className="flex-shrink-0 xl:pr-80">
            <TopNavbar setSidebarOpen={setSidebarOpen} />
          </div>
          
          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content with proper right padding for sidebar */}
            <div className="flex-1 overflow-y-auto xl:pr-80">
              <main className="flex-1">
                <div className="py-4 sm:py-6">
                  <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                    {children}
                  </div>
                </div>
              </main>
            </div>

            {/* Right Sidebar - Only on very large screens */}
            <div className="hidden xl:fixed xl:inset-y-0 xl:right-0 xl:z-30 xl:flex xl:w-80 xl:flex-col">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}