import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { toast } from 'react-hot-toast'
import {
  Users,
  Search,
  UserPlus,
  Clock,
  Check,
  X,
  Mail,
  UserCheck,
  Loader2
} from 'lucide-react'
import { connectionService } from '@/lib/connections'
import { userService } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { ConnectionStatus } from '@/types/types'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/Badge'

export default function ConnectionsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Fetch connections
  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionService.getConnections(1, 50, ConnectionStatus.ACCEPTED),
  })

  // Fetch pending requests
  const { data: pendingRequests, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: () => connectionService.getPendingRequests(1, 50),
  })

  // Fetch user recommendations
  const { data: recommendations } = useQuery({
    queryKey: ['user-recommendations'],
    queryFn: () => userService.getUserRecommendations(1, 10),
  })

  // Fetch connection stats
  const { data: stats } = useQuery({
    queryKey: ['connection-stats'],
    queryFn: () => connectionService.getConnectionStats(),
  })

  // Send connection request mutation
  const sendRequestMutation = useMutation({
    mutationFn: (userId: string) => connectionService.sendRequest(userId),
    onSuccess: () => {
      toast.success('Connection request sent!')
      queryClient.invalidateQueries({ queryKey: ['connection-stats'] })
      queryClient.invalidateQueries({ queryKey: ['user-recommendations'] })
    },
    onError: () => {
      toast.error('Failed to send connection request')
    },
  })

  // Respond to request mutation
  const respondMutation = useMutation({
    mutationFn: ({ connectionId, action }: { connectionId: string; action: 'accept' | 'decline' }) =>
      connectionService.respondToRequest(connectionId, action),
    onSuccess: (_, { action }) => {
      toast.success(action === 'accept' ? 'Connection accepted!' : 'Connection declined')
      queryClient.invalidateQueries({ queryKey: ['pending-requests'] })
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['connection-stats'] })
    },
    onError: () => {
      toast.error('Failed to respond to request')
    },
  })

  // Remove connection mutation  
  const removeConnectionMutation = useMutation({
    mutationFn: (connectionId: string) => connectionService.removeConnection(connectionId),
    onSuccess: () => {
      toast.success('Connection removed')
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['connection-stats'] })
    },
    onError: () => {
      toast.error('Failed to remove connection')
    },
  })

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch()
      } else {
        setSearchResults([])
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await userService.searchUsers({ query: searchQuery, page: 1, limit: 20 })
      setSearchResults(results.data?.users || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setIsSearching(true)
    try {
      const results = await userService.searchUsers({ query: searchQuery, page: 1, limit: 20 })
      setSearchResults(results.data?.users || [])
      if (!results.data?.users || results.data.users.length === 0) {
        toast('No users found matching your search')
      }
    } catch (error) {
      toast.error('Failed to search users')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const UserCard = ({ userData, action }: { userData: any; action?: React.ReactNode }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Link to={`/dashboard/profile/${userData.id}`}>
              <Avatar className="h-14 w-14 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                <AvatarImage src={userData.avatar} alt={userData.firstName} />
                <AvatarFallback className="text-lg">
                  {getInitials(userData.firstName, userData.lastName)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/dashboard/profile/${userData.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors truncate">
                  {userData.firstName} {userData.lastName}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{userData.username}</p>
              {userData.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{userData.bio}</p>
              )}
              {userData.skills && userData.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {userData.skills.slice(0, 3).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {userData.skills.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">+{userData.skills.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {action}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connections</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Build your professional network and collaborate with others
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats?.data?.totalConnections || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats?.data?.pendingRequests || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats?.data?.sentRequests || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sent Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connections">
            <Users className="h-4 w-4 mr-2" />
            My Connections
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending ({stats?.data?.pendingRequests || 0})
          </TabsTrigger>
          <TabsTrigger value="find">
            <Search className="h-4 w-4 mr-2" />
            Find People
          </TabsTrigger>
        </TabsList>

        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          {connectionsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !connections?.data?.length ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No connections yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start building your professional network by connecting with other users.
                </p>
              </CardContent>
            </Card>
          ) : (
            connections.data.map((connection: any) => {
              const otherUser = connection.sender.id === user?.id ? connection.receiver : connection.sender
              return (
                <UserCard
                  key={connection.id}
                  userData={otherUser}
                  action={
                    <>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">
                        {formatRelativeTime(connection.createdAt)}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/profile/${otherUser.id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConnectionMutation.mutate(connection.id)}
                        disabled={removeConnectionMutation.isPending}
                        title="Remove connection"
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    </>
                  }
                />
              )
            })
          )}
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="pending" className="space-y-4">
          {pendingLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !pendingRequests?.data?.length ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pending requests</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You don't have any pending connection requests at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.data.map((request: any) => (
              <UserCard
                key={request.id}
                userData={request.sender}
                action={
                  <>
                    <div className="text-right mr-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(request.createdAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => respondMutation.mutate({ connectionId: request.id, action: 'accept' })}
                      disabled={respondMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => respondMutation.mutate({ connectionId: request.id, action: 'decline' })}
                      disabled={respondMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </>
                }
              />
            ))
          )}
        </TabsContent>

        {/* Find People Tab */}
        <TabsContent value="find" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    placeholder="Search by name, username, or skills... (auto-search enabled)"
                  />
                  {isSearching && (
                    <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  )}
                </div>
                <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Search Results ({searchResults.length})
              </h3>
              {searchResults.map((foundUser) => (
                <UserCard
                  key={foundUser.id}
                  userData={foundUser}
                  action={
                    <>
                      {foundUser.id !== user?.id && (
                        <Button
                          size="sm"
                          onClick={() => sendRequestMutation.mutate(foundUser.id)}
                          disabled={sendRequestMutation.isPending}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/profile/${foundUser.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or browse recommended users below.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {/* Recommended Users */}
          {recommendations?.data?.users && recommendations.data.users.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suggested Connections
              </h3>
              {recommendations.data.users.map((recommendedUser: any) => (
                <UserCard
                  key={recommendedUser.id}
                  userData={recommendedUser}
                  action={
                    <>
                      <Button
                        size="sm"
                        onClick={() => sendRequestMutation.mutate(recommendedUser.id)}
                        disabled={sendRequestMutation.isPending}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/profile/${recommendedUser.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
