import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  Camera,
  Mail,
  Calendar,
  MapPin,
  Users,
  FolderOpen,
  Settings,
  Globe,
  Github,
  Linkedin,
  Building,
  Award,
  Clock,
  BookOpen,
  Target,
  FileText,
  Plus,
  UserPlus,
  UserCheck,
  UserX,
  UserMinus
} from 'lucide-react'
import { userService } from '@/lib/auth'
import { projectService } from '@/lib/projects'
import { connectionService } from '@/lib/connections'
import { postService } from '@/lib/posts'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge as UIBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatRelativeTime, formatDateShort, getInitials, formatEnumValue } from '@/lib/utils'
import { PostCard } from '@/components/posts/PostCard'
import { useDeletePost } from '@/hooks/usePosts'
import { useParams, Link } from 'react-router'

export default function ProfilePage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)

  // Determine which user's profile to show
  const profileUserId = userId || user?.id
  const isOwnProfile = !userId || userId === user?.id

  // Fetch current user's complete profile
  const { data: fullProfile, isLoading } = useQuery({
    queryKey: ['profile', profileUserId],
    queryFn: () => userService.getUserById(profileUserId!),
    enabled: !!profileUserId,
  })

  // Fetch user's projects
  const { data: userProjects } = useQuery({
    queryKey: ['user-projects', profileUserId],
    queryFn: () => projectService.getUserProjects(),
    enabled: !!profileUserId && isOwnProfile, // Only fetch for own profile for now
  })

  // Fetch connection stats
  const { data: connectionStats } = useQuery({
    queryKey: ['connection-stats', profileUserId],
    queryFn: () => connectionService.getConnectionStats(),
    enabled: !!profileUserId && isOwnProfile, // Only fetch for own profile for now
  })

  // Fetch user teams count (TODO: Add to team service)
  const { data: userTeams } = useQuery({
    queryKey: ['user-teams', profileUserId],
    queryFn: () => {
      // TODO: Implement getUserTeams in team service
      return Promise.resolve({ data: [], pagination: { total: 0 } })
    },
    enabled: !!profileUserId && isOwnProfile, // Only fetch for own profile for now
  })

  // Upload avatar mutation (only for own profile)
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: () => {
      toast.success('Avatar updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth-profile'] })
    },
    onError: () => {
      toast.error('Failed to upload avatar')
    },
    onSettled: () => {
      setUploading(false)
    }
  })

  // Upload banner mutation (only for own profile)
  const uploadBannerMutation = useMutation({
    mutationFn: (file: File) => userService.uploadBanner(file),
    onSuccess: () => {
      toast.success('Banner updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => {
      toast.error('Failed to upload banner')
    },
  })

  const handleFileUpload = (file: File, type: 'avatar' | 'banner') => {
    if (!isOwnProfile) return // Only allow uploads for own profile
    
    if (type === 'avatar') {
      setUploading(true)
      uploadAvatarMutation.mutate(file)
    } else {
      uploadBannerMutation.mutate(file)
    }
  }

  const profileData = fullProfile?.data || (isOwnProfile ? user : null)

  // Fetch user posts
  const { data: userPosts } = useQuery({
    queryKey: ['user-posts', profileData?.id],
    queryFn: () => postService.getUserPosts(profileData!.id),
    enabled: !!profileData?.id,
  })

  // Fetch connection status with this user (if viewing someone else's profile)
  const { data: connectionStatus } = useQuery({
    queryKey: ['connection-status', profileUserId],
    queryFn: () => connectionService.getConnectionStatus(profileUserId!),
    enabled: !isOwnProfile && !!profileUserId,
  })

  // Send connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: (userId: string) => connectionService.sendRequest(userId),
    onSuccess: () => {
      toast.success('Connection request sent!')
      queryClient.invalidateQueries({ queryKey: ['connection-status', profileUserId] })
    },
    onError: () => {
      toast.error('Failed to send connection request')
    },
  })

  // Respond to connection request mutation
  const respondToConnectionMutation = useMutation({
    mutationFn: ({ connectionId, action }: { connectionId: string; action: 'accept' | 'decline' }) =>
      connectionService.respondToRequest(connectionId, action),
    onSuccess: (_data, variables) => {
      toast.success(variables.action === 'accept' ? 'Connection request accepted!' : 'Connection request declined')
      queryClient.invalidateQueries({ queryKey: ['connection-status', profileUserId] })
      queryClient.invalidateQueries({ queryKey: ['connections'] })
    },
    onError: () => {
      toast.error('Failed to respond to connection request')
    },
  })

  // Remove connection mutation
  const removeConnectionMutation = useMutation({
    mutationFn: (connectionId: string) => connectionService.removeConnection(connectionId),
    onSuccess: () => {
      toast.success('Connection removed')
      queryClient.invalidateQueries({ queryKey: ['connection-status', profileUserId] })
      queryClient.invalidateQueries({ queryKey: ['connections'] })
    },
    onError: () => {
      toast.error('Failed to remove connection')
    },
  })

  // Delete post mutation
  const deletePostMutation = useDeletePost()

  if (isLoading || !profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Banner Section */}
      <Card className="mb-6 overflow-hidden">
        <div className="relative">
          {/* Banner Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {profileData.banner && (
              <img
                src={profileData.banner}
                alt="Profile banner"
                className="w-full h-full object-cover"
              />
            )}
            {isOwnProfile && (
              <input
                type="file"
                id="banner-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, 'banner')
                }}
              />
            )}
            <Button
              variant="secondary"
              size="sm"
              className={`absolute top-4 right-4 ${!isOwnProfile ? 'hidden' : ''}`}
              onClick={() => document.getElementById('banner-upload')?.click()}
              disabled={uploadBannerMutation.isPending}
            >
              <Camera className="h-4 w-4 mr-2" />
              {uploadBannerMutation.isPending ? 'Uploading...' : 'Change Banner'}
            </Button>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4 sm:mb-0">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.avatar} alt={profileData.firstName} />
                  <AvatarFallback className="text-2xl font-semibold">
                    {getInitials(profileData.firstName, profileData.lastName)}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'avatar')
                    }}
                  />
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className={`absolute bottom-2 right-2 rounded-full p-2 ${!isOwnProfile ? 'hidden' : ''}`}
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Name and Basic Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                </div>
                <p className="text-lg text-gray-600">@{profileData.username}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {formatDateShort(profileData.createdAt)}
                  </span>
                  {(profileData.city || profileData.country) && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {[profileData.city, profileData.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-4 sm:mt-0">
                {isOwnProfile ? (
                  <Button asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                ) : (
                  <>
                    {/* Connection action buttons for other users */}
                    {connectionStatus?.data?.isConnected && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (connectionStatus.data?.connectionId) {
                            removeConnectionMutation.mutate(connectionStatus.data.connectionId)
                          }
                        }}
                        disabled={removeConnectionMutation.isPending}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Connected
                      </Button>
                    )}
                    {connectionStatus?.data?.isPending && !connectionStatus?.data?.isSentByMe && (
                      <>
                        {/* Request received from this user */}
                        <Button
                          variant="default"
                          onClick={() => {
                            if (connectionStatus.data?.connectionId) {
                              respondToConnectionMutation.mutate({
                                connectionId: connectionStatus.data.connectionId,
                                action: 'accept',
                              })
                            }
                          }}
                          disabled={respondToConnectionMutation.isPending}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (connectionStatus.data?.connectionId) {
                              respondToConnectionMutation.mutate({
                                connectionId: connectionStatus.data.connectionId,
                                action: 'decline',
                              })
                            }
                          }}
                          disabled={respondToConnectionMutation.isPending}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    )}
                    {connectionStatus?.data?.isPending && connectionStatus?.data?.isSentByMe && (
                      <Button variant="outline" disabled>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Request Sent
                      </Button>
                    )}
                    {connectionStatus?.data?.canSendRequest && (
                      <Button
                        onClick={() => sendConnectionMutation.mutate(profileUserId!)}
                        disabled={sendConnectionMutation.isPending}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {profileData.bio && (
              <div className="mt-6">
                <p className="text-gray-700 max-w-4xl">{profileData.bio}</p>
              </div>
            )}

            {/* Skills and Interests */}
            <div className="mt-6 space-y-4">
              {profileData.skills && profileData.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill: string) => (
                      <UIBadge key={skill} variant="outline">
                        {skill}
                      </UIBadge>
                    ))}
                  </div>
                </div>
              )}
              {profileData.interests && profileData.interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest: string) => (
                      <UIBadge key={interest} variant="secondary">
                        {interest}
                      </UIBadge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-bold text-gray-700">
              {isOwnProfile ? (connectionStats?.data?.totalConnections || 0) : '—'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              Connections
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-bold text-gray-700">
              {isOwnProfile ? (userTeams?.pagination?.total || 0) : '—'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              Teams
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-bold text-gray-700">
              {isOwnProfile ? (userProjects?.pagination?.total || 0) : '—'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <FolderOpen className="h-4 w-4 mr-1" />
              Projects
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-bold text-gray-700">
              {profileData?.lastLoginAt ? formatRelativeTime(profileData.lastLoginAt) : 'Never'}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              Last Active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-5' : 'grid-cols-3'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="projects">Projects</TabsTrigger>}
          <TabsTrigger value="about">About</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="contact">Contact</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Professional Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">User Type</label>
                    <p className="text-gray-900 mt-1">{formatEnumValue(profileData.userType)}</p>
                  </div>
                  {profileData.company && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company</label>
                      <p className="text-gray-900 mt-1">{profileData.company}</p>
                    </div>
                  )}
                  {profileData.position && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Position</label>
                      <p className="text-gray-900 mt-1">{profileData.position}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileData.website && (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm">Website</span>
                  </a>
                )}
                {profileData.github && (
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Github className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {profileData.linkedin && (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Linkedin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {profileData.portfolio && (
                  <a
                    href={profileData.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Award className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm">Portfolio</span>
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {isOwnProfile ? 'My Posts' : `${profileData?.firstName}'s Posts`} ({userPosts?.pagination?.total || 0})
                </span>
                {isOwnProfile && (
                  <Button asChild>
                    <Link to="/dashboard">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Link>
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userPosts?.data?.length ? (
                <div className="space-y-6">
                  {userPosts.data.map((post: any) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      showActions={true}
                      isOwner={post.authorId === user?.id}
                      onDelete={(postId) => deletePostMutation.mutate(postId)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isOwnProfile ? 'No posts yet' : 'No posts to show'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isOwnProfile 
                      ? 'Share your first post to get started.' 
                      : `${profileData?.firstName} hasn't shared any posts yet.`
                    }
                  </p>
                  {isOwnProfile && (
                    <Button asChild>
                      <Link to="/dashboard">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Post
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2" />
                    My Projects ({userProjects?.pagination?.total || 0})
                  </span>
                  <Button asChild>
                    <Link to="/dashboard/projects/new">
                      <Target className="h-4 w-4 mr-2" />
                      New Project
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userProjects?.data?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProjects.data.map((project: any) => (
                      <Link key={project.id} to={`/dashboard/projects/${project.id}`}>
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
                                {project.currentMembers}
                              </div>
                            </div>

                            {project.tags && project.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {project.tags.slice(0, 3).map((tag: string) => (
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
                      <Link to="/dashboard/projects/new">
                        <Target className="h-4 w-4 mr-2" />
                        Create Project
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Bio</h3>
                {profileData.bio ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{profileData.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio added yet.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Status</label>
                    <p className="text-gray-900 mt-1">
                      {profileData.isActive ? '✅ Active' : '❌ Inactive'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-gray-900 mt-1">{formatDateShort(profileData.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{profileData.email}</p>
                      </div>
                    </div>

                    {profileData.city && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-700">City</label>
                          <p className="text-gray-900">{profileData.city}</p>
                        </div>
                      </div>
                    )}

                    {profileData.country && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-700">Country</label>
                          <p className="text-gray-900">{profileData.country}</p>
                        </div>
                      </div>
                    )}

                    {profileData.address && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-700">Address</label>
                          <p className="text-gray-900">{profileData.address}</p>
                        </div>
                      </div>
                    )}

                    {profileData.timezone && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-700">Timezone</label>
                          <p className="text-gray-900">{profileData.timezone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {profileData.company && (
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-700">Company</label>
                          <p className="text-gray-900">{profileData.company}</p>
                        </div>
                      </div>
                    )}

                    {profileData.position && (
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-700">Position</label>
                          <p className="text-gray-900">{profileData.position}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}