'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Edit3,
  Settings,
  Users,
  Calendar,
  Globe,
  Lock,
  MapPin,
  Clock,
  Trash2,
  UserPlus,
  MoreVertical
} from 'lucide-react'
import { projectService } from '@/lib/projects'
import { useAuthStore } from '@/store/authStore'
import { formatDateTime, getInitials } from '@/lib/utils'
import { ProjectMemberRole, TeamMemberRole } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const projectId = params.id as string

  // Fetch project details
  const { data: data, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !!projectId,
  })

  // Fetch project members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => projectService.getProjectMembers(projectId),
    enabled: !!projectId,
  })

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: () => projectService.deleteProject(projectId),
    onSuccess: () => {
      toast.success('Project deleted successfully')
      router.push('/projects')
    },
    onError: () => {
      toast.error('Failed to delete project')
    },
  })

  const handleDeleteProject = () => {
    deleteProjectMutation.mutate()
    setShowDeleteModal(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="h-6 w-6 bg-gray-200 rounded mr-4"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data || !data.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/dashboard/projects" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const project = data.data!

  const isOwner = project.id === user?.id
  const userMember = members?.data?.find(member => member.user.id === user?.id)
  const canEdit = isOwner || userMember?.role === ProjectMemberRole.ADMIN

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/dashboard/projects"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full mr-3 ${
                    project.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'PLANNING'
                      ? 'bg-blue-100 text-blue-800'
                      : project.status === 'COMPLETED'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                  {project.isPublic ? (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      Public
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      Private
                    </div>
                  )}
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/projects/${projectId}/edit`}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <Button
                  onClick={() => setShowInviteModal(true)}
                  size="sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
                {isOwner && (
                  <div className="relative">
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Description */}
            <div className="p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="p-6 border rounded-lg bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Technologies & Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">{project?.startDate ? formatDateTime(project.startDate) : 'Not set'}</span>
                </div>
                {project?.endDate && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">End Date:</span>
                    <span className="ml-2 font-medium">{project?.endDate ? formatDateTime(project.endDate) : 'Not set'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Owner */}
            <div className="p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Owner</h2>
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  {project?.owner.avatar ? (
                    <img
                      className="h-12 w-12 rounded-full"
                      src={project.owner.avatar}
                      alt={project.owner.firstName}
                    />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {getInitials(project?.owner.firstName, project?.owner.lastName)}
                    </span>
                  )}
                </div>
                <div className="ml-3">
                  <Link 
                    href={`/profile/${project.owner.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    {project.owner.firstName} {project.owner.lastName}
                  </Link>
                  <p className="text-sm text-gray-500">@{project.owner.username}</p>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="p-6 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                <span className="text-sm text-gray-500">
                  {members?.data?.length || 0} members
                </span>
              </div>
              
              {membersLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : members?.data?.length ? (
                <div className="space-y-3">
                  {members.data.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          {member.user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={member.user.avatar}
                              alt={member.user.firstName}
                            />
                          ) : (
                            <span className="text-xs font-medium text-white">
                              {getInitials(member.user.firstName, member.user.lastName)}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <Link 
                            href={`/profile/${member.user.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {member.user.firstName} {member.user.lastName}
                          </Link>
                          <p className="text-xs text-gray-500">@{member.user.username}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                              member.role === ProjectMemberRole.OWNER
                                ? 'bg-purple-100 text-purple-800'
                                : member.role === ProjectMemberRole.ADMIN
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No team members yet.</p>
              )}
            </div>

            {/* Project Stats */}
            <div className="p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{formatDateTime(project.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{formatDateTime(project.updatedAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Team Size</span>
                  <span className="font-medium">{members?.data?.length || 0} members</span>
                </div>
              </div>
            </div>

            {/* Danger Zone (for owners) */}
            {isOwner && (
              <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete a project, there is no going back. Please be certain.
                </p>
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Project</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteProject}
                disabled={deleteProjectMutation.isPending}
                variant="destructive"
              >
                {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}