'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Calendar,
  Tag,
  Globe,
  Lock,
  Plus,
  X,
  Save
} from 'lucide-react'
import { projectService } from '@/lib/projects'
import { ProjectStatus, UpdateProjectData } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const PROJECT_STATUSES = [
  { value: ProjectStatus.PLANNING, label: 'Planning', description: 'Project is in planning phase' },
  { value: ProjectStatus.ACTIVE, label: 'Active', description: 'Project is actively being worked on' },
  { value: ProjectStatus.ON_HOLD, label: 'On Hold', description: 'Project is temporarily paused' },
  { value: ProjectStatus.COMPLETED, label: 'Completed', description: 'Project has been completed' },
]

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [formData, setFormData] = useState<UpdateProjectData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: ProjectStatus.PLANNING,
    isPublic: true,
    tags: []
  })
  const [newTag, setNewTag] = useState('')

  // Fetch project details
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById(projectId),
    enabled: !!projectId,
  })

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (data: UpdateProjectData) => projectService.updateProject(projectId, data),
    onSuccess: () => {
      toast.success('Project updated successfully!')
      router.push(`/dashboard/projects/${projectId}`)
    },
    onError: () => {
      toast.error('Failed to update project')
    },
  })

  // Initialize form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.data?.title,
        description: project.data?.description,
        startDate: project.data?.startDate?.split('T')[0], // Convert to YYYY-MM-DD format
        endDate: project.data?.endDate ? project.data?.endDate.split('T')[0] : '',
        status: project.data?.status,
        isPublic: project.data?.isPublic,
        tags: project.data?.tags || []
      })
    }
  }, [project])

  const handleInputChange = (field: keyof UpdateProjectData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim().toLowerCase()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title?.trim()) {
      toast.error('Project title is required')
      return
    }
    
    if (!formData.description?.trim()) {
      toast.error('Project description is required')
      return
    }

    updateProjectMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="h-6 w-6 bg-gray-200 rounded mr-4"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-6">
            The project you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Link href="/dashboard/projects" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link 
              href={`/dashboard/projects/${projectId}`}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
              <p className="text-gray-600">
                Update your project details and settings
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6 p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter project title..."
                    maxLength={100}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {(formData.title || '').length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="input w-full resize-none"
                    placeholder="Describe your project, its goals, and what you're looking for in collaborators..."
                    maxLength={1000}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {(formData.description || '').length}/1000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className="text-gray-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={formData.startDate}
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies & Skills */}
            <div className="space-y-6 p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Technologies & Skills</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags <span className="text-gray-400">(Press Enter to add)</span>
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10"
                      placeholder="e.g., react, nodejs, design..."
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Status */}
            <div className="space-y-6 p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Project Status</h2>
              
              <div className="space-y-4">
                {PROJECT_STATUSES.map((status) => (
                  <label key={status.value} className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={() => handleInputChange('status', status.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{status.label}</div>
                      <p className="text-sm text-gray-500">{status.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-6 p-6 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Visibility</h2>
              
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={formData.isPublic}
                    onChange={() => handleInputChange('isPublic', true)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium text-gray-900">Public</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Anyone can discover and view this project
                    </p>
                  </div>
                </label>

                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!formData.isPublic}
                    onChange={() => handleInputChange('isPublic', false)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-900">Private</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Only you and invited members can access
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/projects/${projectId}`}>
                  Cancel
                </Link>
              </Button>
              
              <Button
                type="submit"
                disabled={updateProjectMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}