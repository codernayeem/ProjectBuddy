import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Briefcase, Bell } from 'lucide-react'

export default function DashboardHomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your projects and teams today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-blue-600" />
              New Project
            </CardTitle>
            <CardDescription>
              Create a new project and start collaborating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Create Project</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-600" />
              Join Team
            </CardTitle>
            <CardDescription>
              Join an existing team or create your own
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Find Teams</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-purple-600" />
              My Projects
            </CardTitle>
            <CardDescription>
              View and manage your active projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Projects</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Check your latest updates and messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View All</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your recently accessed projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent projects</p>
                <p className="text-sm">Create your first project to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Latest updates from your teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No team activity</p>
                <p className="text-sm">Join a team to see updates here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}