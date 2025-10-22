import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  Camera,
  Mail,
  Calendar,
  MapPin,
  Users,
  Settings,
  Globe,
  Github,
  Linkedin,
  Building,
  Award,
  Clock,
  FileText,
  Plus,
  UserPlus,
  UserCheck,
  UserX,
  UserMinus,
  MessageSquare,
  GraduationCap
} from 'lucide-react'
import { userService } from '@/lib/auth'
import { connectionService } from '@/lib/connections'
import { postService } from '@/lib/posts'
import { teamService } from '@/lib/teams'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Badge as UIBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatDateShort, getInitials, formatEnumValue } from '@/lib/utils'
import { PostCard } from '@/components/posts/PostCard'
import { useDeletePost } from '@/hooks/usePosts'
import { useParams, Link, useNavigate } from 'react-router'

export default function ProfilePage() {
  const { userId } = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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

  // Fetch connection stats
  const { data: connectionStats } = useQuery({
    queryKey: ['connection-stats', profileUserId],
    queryFn: () => connectionService.getConnectionStats(),
    enabled: !!profileUserId && isOwnProfile, // Only fetch for own profile for now
  })

  // Fetch user teams count (TODO: Add to team service)
  const { data: userTeams } = useQuery({
    queryKey: ['user-teams', profileUserId],
    queryFn: () => teamService.getUserTeams(1, 100), // Fetch up to 100 teams
    enabled: !!profileUserId,
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
      <div className="container mx-auto">
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
    <div className="container mx-auto">
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
              <div className="flex-1 space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">@{profileData.username}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
                    {/* Message button - show for connected users */}
                    {connectionStatus?.data?.isConnected && (
                      <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard/messages')}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {profileData.bio && (
              <div className="mt-6">
                <p className="text-gray-700 dark:text-gray-300 max-w-4xl">{profileData.bio}</p>
              </div>
            )}

            {/* Skills and Interests */}
            <div className="mt-6 space-y-4">
              {profileData.skills && profileData.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</h3>
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
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest: string) => (
                      <UIBadge key={interest} variant="secondary">
                        {interest}
                      </UIBadge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Universities Section */}
              {(profileData as any).universities && (profileData as any).universities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h3>
                  <div className="space-y-2">
                    {(profileData as any).universities.map((university: any) => (
                      <div key={university.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{university.universityName}</h4>
                            <UIBadge variant={university.status === 'CURRENT' ? 'default' : 'secondary'} className="text-xs">
                              {university.status === 'CURRENT' ? 'Current' : 'Graduated'}
                            </UIBadge>
                          </div>
                          {(university.startYear || university.endYear) && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {university.startYear && `${university.startYear}`}
                              {university.startYear && university.endYear && ' - '}
                              {university.endYear && `${university.endYear}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile ? (connectionStats?.data?.totalConnections || 0) : '—'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              Connections
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {userTeams?.pagination?.total || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              Teams
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

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
                  <FileText className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {isOwnProfile ? 'No posts yet' : 'No posts to show'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
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

        <TabsContent value="about" className="space-y-6">
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
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</h3>
                  {profileData.bio ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{profileData.bio}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic text-sm">No bio added yet.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">User Type</label>
                    <p className="text-gray-900 dark:text-white mt-1">{formatEnumValue(profileData.userType)}</p>
                  </div>
                  {profileData.company && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                      <p className="text-gray-900 dark:text-white mt-1">{profileData.company}</p>
                    </div>
                  )}
                  {profileData.position && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
                      <p className="text-gray-900 dark:text-white mt-1">{profileData.position}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</label>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {profileData.isActive ? '✅ Active' : '❌ Inactive'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</label>
                    <p className="text-gray-900 dark:text-white mt-1">{formatDateShort(profileData.createdAt)}</p>
                  </div>
                </div>

                {/* Education Section */}
                {(profileData as any).universities && (profileData as any).universities.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </h3>
                    <div className="space-y-3">
                      {(profileData as any).universities.map((university: any) => (
                        <div key={university.id} className="flex items-start justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">{university.universityName}</h4>
                              <UIBadge variant={university.status === 'CURRENT' ? 'default' : 'secondary'}>
                                {university.status === 'CURRENT' ? 'Current' : 'Graduated'}
                              </UIBadge>
                            </div>
                            {(university.startYear || university.endYear) && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {university.startYear && `${university.startYear}`}
                                {university.startYear && university.endYear && ' - '}
                                {university.endYear && `${university.endYear}`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Links */}
            <div className="space-y-6">
              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profileData.website && (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">Website</span>
                    </a>
                  )}
                  {profileData.github && (
                    <a
                      href={profileData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Github className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">GitHub</span>
                    </a>
                  )}
                  {profileData.linkedin && (
                    <a
                      href={profileData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">LinkedIn</span>
                    </a>
                  )}
                  {profileData.portfolio && (
                    <a
                      href={profileData.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Award className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                      <span className="text-sm text-gray-900 dark:text-white">Portfolio</span>
                    </a>
                  )}
                  {!profileData.website && !profileData.github && !profileData.linkedin && !profileData.portfolio && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No links added</p>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info - Only for own profile */}
              {isOwnProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="text-sm text-gray-900 dark:text-white">{profileData.email}</p>
                      </div>
                    </div>

                    {profileData.city && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">City</label>
                          <p className="text-sm text-gray-900 dark:text-white">{profileData.city}</p>
                        </div>
                      </div>
                    )}

                    {profileData.country && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Country</label>
                          <p className="text-sm text-gray-900 dark:text-white">{profileData.country}</p>
                        </div>
                      </div>
                    )}

                    {profileData.timezone && (
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Timezone</label>
                          <p className="text-sm text-gray-900 dark:text-white">{profileData.timezone}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {isOwnProfile ? 'My Teams' : `${profileData?.firstName}'s Teams`} ({userTeams?.pagination?.total || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userTeams?.data && userTeams.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTeams.data.map((team: any) => (
                    <Link
                      key={team.id}
                      to={`/dashboard/teams/${team.id}`}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={team.avatar || undefined} alt={team.name} />
                          <AvatarFallback>{team.name[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{team.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {team.memberCount || 0} members
                          </p>
                        </div>
                      </div>
                      {team.shortDescription && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {team.shortDescription}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {isOwnProfile ? 'No teams yet' : 'No teams to show'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {isOwnProfile 
                      ? 'Join or create a team to get started.' 
                      : `${profileData?.firstName} hasn't joined any teams yet.`
                    }
                  </p>
                  {isOwnProfile && (
                    <Button asChild>
                      <Link to="/dashboard/teams">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Teams
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}