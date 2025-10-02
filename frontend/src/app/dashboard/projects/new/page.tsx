'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Calendar,
  Tag,
  Globe,
  Lock,
  Plus,
  X
} from 'lucide-react'
import { projectService } from '@/lib/projects'
import { CreateProjectData } from '@/types'

const PROJECT_STATUSES = [
  { value: 'PLANNING', label: 'Planning', description: 'Project is in planning phase' },
  { value: 'ACTIVE', label: 'Active', description: 'Project is actively being worked on' },
  { value: 'ON_HOLD', label: 'On Hold', description: 'Project is temporarily paused' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isPublic: true,
    tags: []
  })
  const [newTag, setNewTag] = useState('')

  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectData) => projectService.createProject(data),
    onSuccess: (project) => {
      toast.success('Project created successfully!')
      router.push(`/projects/${project.id}`)
    },
    onError: () => {
      toast.error('Failed to create project')
    },
  })

  const handleInputChange = (field: keyof CreateProjectData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
    
    if (!formData.title.trim()) {
      toast.error('Project title is required')
      return
    }
    
    if (!formData.description.trim()) {
      toast.error('Project description is required')
      return
    }

    createProjectMutation.mutate(formData)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link 
          href="/projects"
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">
            Start a new project and invite collaborators to join
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input w-full"
                    placeholder="Enter project title..."
                    maxLength={100}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="input w-full resize-none"
                    placeholder="Describe your project, its goals, and what you're looking for in collaborators..."
                    maxLength={1000}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.description.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Timeline</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.startDate}
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
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={formData.startDate}
                      className="input pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies & Skills */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Technologies & Skills</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags <span className="text-gray-400">(Press Enter to add)</span>
                </label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="input pl-10 w-full"
                      placeholder="e.g., react, nodejs, design..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn btn-outline ml-2"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-primary-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visibility */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Visibility</h2>
              
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

            {/* Tips */}
            <div className="card p-6 bg-blue-50 border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">💡 Tips for Success</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Write a clear, descriptive title</li>
                <li>• Include specific goals and requirements</li>
                <li>• Add relevant technologies and skills</li>
                <li>• Set realistic timelines</li>
                <li>• Make it public to attract collaborators</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link 
            href="/projects"
            className="btn btn-outline"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="btn btn-primary"
          >
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}