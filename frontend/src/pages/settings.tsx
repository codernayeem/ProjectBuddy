'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  User,
  Shield,
  Bell,
  Palette,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Settings as SettingsIcon,
  Lock,
  Mail,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { userService } from '@/lib/auth'
import { notificationService } from '@/lib/notifications'
import { useAuth, useRequireAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { LoadingPage } from '@/components/ui/LoadingSpinner'
import { Link } from 'react-router'
import { ArrowLeft, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/Badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Separator } from '@/components/ui/separator'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  UserType,
  UpdateProfileData
} from '@/types/types'
import { formatEnumValue, getInitials } from '@/lib/utils'

// Form schemas
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
  company: z.string().optional(),
  position: z.string().optional(),
  userType: z.nativeEnum(UserType),
  skills: z.string().optional(),
  interests: z.string().optional(),
  timezone: z.string().optional()
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { user } = useAuth()
  const { isAuthenticated, isLoading } = useRequireAuth()
  const queryClient = useQueryClient()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingPage />
  }

  // Don't render settings if not authenticated
  if (!isAuthenticated) {
    return <LoadingPage />
  }

  // Fetch notification preferences
  const { data: notificationPrefs } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: () => notificationService.getPreferences()
  })

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      country: user?.country || '',
      city: user?.city || '',
      address: user?.address || '',
      website: user?.website || '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      portfolio: user?.portfolio || '',
      company: user?.company || '',
      position: user?.position || '',
      userType: user?.userType || UserType.UNDERGRADUATE,
      skills: user?.skills?.join(', ') || '',
      interests: user?.interests?.join(', ') || '',
      timezone: user?.timezone || ''
    }
  })

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['auth-profile'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => 
      authService.changePassword(data.currentPassword, data.newPassword),
    onSuccess: () => {
      toast.success('Password changed successfully!')
      passwordForm.reset()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password')
    }
  })

  // Update notification preferences mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: (preferences: Record<string, boolean>) => 
      notificationService.updatePreferences(preferences),
    onSuccess: () => {
      toast.success('Notification preferences updated!')
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
    },
    onError: () => {
      toast.error('Failed to update notification preferences')
    }
  })

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: () => {
      toast.success('Account deleted successfully')
      // Redirect to login or home page
      window.location.href = '/auth/login'
    },
    onError: () => {
      toast.error('Failed to delete account')
    }
  })

  const onProfileSubmit = (data: ProfileFormData) => {
    const updateData: UpdateProfileData = {
      ...data,
      skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      interests: data.interests ? data.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
      website: data.website || undefined,
      github: data.github || undefined,
      linkedin: data.linkedin || undefined,
      portfolio: data.portfolio || undefined,
      company: data.company || undefined,
      position: data.position || undefined,
      country: data.country || undefined,
      city: data.city || undefined,
      address: data.address || undefined,
      timezone: data.timezone || undefined,
    }
    updateProfileMutation.mutate(updateData)
  }

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    const currentPrefs = notificationPrefs?.data || {}
    updateNotificationsMutation.mutate({
      ...currentPrefs,
      [key]: value
    })
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.firstName} />
                    <AvatarFallback className="text-xl">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      JPG, GIF or PNG. Max size of 5MB.
                    </p>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline" size="sm">
                        Upload Photo
                      </Button>
                      <Button type="button" variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register('firstName')}
                      className="mt-1"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register('lastName')}
                      className="mt-1"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...profileForm.register('username')}
                      className="mt-1"
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...profileForm.register('city')}
                      placeholder="City"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...profileForm.register('country')}
                      placeholder="Country"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...profileForm.register('address')}
                    placeholder="Full address (optional)"
                    className="mt-1"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...profileForm.register('bio')}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {profileForm.watch('bio')?.length || 0}/500 characters
                  </p>
                  {profileForm.formState.errors.bio && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileForm.formState.errors.bio.message}
                    </p>
                  )}
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="userType">User Type</Label>
                      <Select value={profileForm.watch('userType')} onValueChange={(value: string) => profileForm.setValue('userType', value as UserType)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(UserType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {formatEnumValue(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        {...profileForm.register('timezone')}
                        placeholder="e.g., Asia/Kolkata"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        {...profileForm.register('company')}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        {...profileForm.register('position')}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills, Interests, Languages */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skills & Interests</h3>
                  
                  <div>
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      {...profileForm.register('skills')}
                      placeholder="React, Node.js, Python, etc."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interests">Interests (comma-separated)</Label>
                    <Input
                      id="interests"
                      {...profileForm.register('interests')}
                      placeholder="Web Development, AI, Blockchain, etc."
                      className="mt-1"
                    />
                  </div>
                  
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Social Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        {...profileForm.register('website')}
                        placeholder="https://yourwebsite.com"
                        className="mt-1"
                      />
                      {profileForm.formState.errors.website && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.website.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        {...profileForm.register('github')}
                        placeholder="https://github.com/username"
                        className="mt-1"
                      />
                      {profileForm.formState.errors.github && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.github.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        {...profileForm.register('linkedin')}
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1"
                      />
                      {profileForm.formState.errors.linkedin && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.linkedin.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="portfolio">Portfolio</Label>
                      <Input
                        id="portfolio"
                        {...profileForm.register('portfolio')}
                        placeholder="https://portfolio.com"
                        className="mt-1"
                      />
                      {profileForm.formState.errors.portfolio && (
                        <p className="text-red-500 text-sm mt-1">
                          {profileForm.formState.errors.portfolio.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Email Address</Label>
                  <div className="flex items-center mt-1">
                    <Input value={user.email} disabled className="flex-1" />
                  </div>
                </div>

                <div>
                  <Label>Account Status</Label>
                  <div className="flex items-center mt-1">
                    <Badge variant={user.isActive ? "default" : "destructive"}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Account Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted dark:bg-muted/50 rounded-lg border border-border">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">0</div>
                    <div className="text-sm text-muted-foreground">Projects Created</div>
                  </div>
                  <div className="text-center p-4 bg-muted dark:bg-muted/50 rounded-lg border border-border">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                    <div className="text-sm text-muted-foreground">Connections</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...passwordForm.register('currentPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...passwordForm.register('newPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    className="mt-1"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={changePasswordMutation.isPending}
                    className="flex items-center"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">Delete Account</h3>
                <p className="text-red-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteAccountMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Yes, delete my account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                { key: 'projectUpdates', label: 'Project Updates', description: 'Get notified about project activity' },
                { key: 'connectionRequests', label: 'Connection Requests', description: 'Get notified when someone wants to connect' },
                { key: 'teamInvitations', label: 'Team Invitations', description: 'Get notified when invited to teams' },
                { key: 'messageNotifications', label: 'Messages', description: 'Get notified about new messages' },
                { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates about new features and tips' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{setting.label}</Label>
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  </div>
                  <Switch
                    checked={notificationPrefs?.data?.[setting.key] ?? true}
                    onCheckedChange={(checked: boolean) => handleNotificationChange(setting.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Appearance & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <Select value={'light'} onValueChange={(_value: 'light' | 'dark' | 'system') => null}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium mb-3 block">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Privacy Settings</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Make profile public</Label>
                      <p className="text-sm text-gray-500">Allow others to find your profile</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Show online status</Label>
                      <p className="text-sm text-gray-500">Let others see when you're online</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Allow direct messages</Label>
                      <p className="text-sm text-gray-500">Let others send you direct messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}