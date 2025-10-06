'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Users,
  Globe,
  Lock,
  FolderOpen,
  Target
} from 'lucide-react'
import { projectService } from '@/lib/projects'
import { formatDateShort, formatEnumValue } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge as UIBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['user-projects'],
    queryFn: () => projectService.getUserProjects(),
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              My Projects ({projects?.pagination?.total || 0})
            </span>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Target className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : projects?.data?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.data
                .filter(project => 
                  statusFilter === 'all' || project.status === statusFilter
                )
                .filter(project =>
                  searchQuery === '' || 
                  project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  project.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((project) => (
                  <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <UIBadge variant={
                            project.status === 'ACTIVE' ? 'default' :
                            project.status === 'COMPLETED' ? 'secondary' :
                            project.status === 'PLANNING' ? 'outline' : 'destructive'
                          }>
                            {formatEnumValue(project.status)}
                          </UIBadge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {project.startDate ? formatDateShort(project.startDate) : 'No date'}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {project.currentMembers || project.members?.length || 0}
                          </div>
                        </div>

                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag, index) => (
                              <UIBadge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </UIBadge>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{project.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-24 w-24 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Create your first project to get started.</p>
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Target className="h-4 w-4 mr-2" />
                  Create Project
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}