import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/dashboard/Sidebar'
import TopNavbar from '@/components/dashboard/TopNavbar'
import RightSidebar from '@/components/dashboard/RightSidebar'
import MobileNavigation from '@/components/dashboard/MobileNavigation'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 ml-64 mr-80">
          {/* Top Navigation */}
          <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
            <TopNavbar setSidebarOpen={setSidebarOpen} />
          </div>
          
          {/* Page Content */}
          <main className="py-8 px-6">
            <div className="max-w-4xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Right Sidebar */}
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-sm border-l border-gray-200">
          <RightSidebar />
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Top Navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <TopNavbar setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Mobile Main Content */}
        <main className="py-4 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}