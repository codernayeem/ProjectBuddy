'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  Users,
  Search,
  UserPlus,
  Clock,
  Check,
  X,
  Mail,
  Calendar,
  Filter
} from 'lucide-react'
import { connectionService } from '@/lib/connections'
import { userService } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { ConnectionStatus } from '@/types'

const CONNECTION_TABS = [
  { id: 'connections', label: 'My Connections', icon: Users },
  { id: 'pending', label: 'Pending Requests', icon: Clock },
  { id: 'find', label: 'Find People', icon: Search },
]

export default function ConnectionsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('connections')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Fetch connections
  const { data: connections, isLoading: connectionsLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionService.getConnections(1, 20, ConnectionStatus.ACCEPTED),
    enabled: activeTab === 'connections',
  })

  // Fetch pending requests
  const { data: pendingRequests, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-requests'],
    queryFn: () => connectionService.getPendingRequests(1, 20),
    enabled: activeTab === 'pending',
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await userService.searchUsers({query: searchQuery, page: 1, limit: 20})
      setSearchResults(results.data?.data || [])
    } catch (error) {
      toast.error('Failed to search users')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSendRequest = (userId: string) => {
    sendRequestMutation.mutate(userId)
  }

  const handleRespondToRequest = (connectionId: string, action: 'accept' | 'decline') => {
    respondMutation.mutate({ connectionId, action })
  }

  const renderConnections = () => {
    if (connectionsLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (!connections?.data?.data?.length) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your professional network by connecting with other users.
          </p>
          <button
            onClick={() => setActiveTab('find')}
            className="btn btn-primary"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Find People
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {connections?.data?.data?.map((connection) => {
          const otherUser = connection.sender.id === user?.id ? connection.receiver : connection.sender
          return (
            <div key={connection.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                    {otherUser.avatar ? (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={otherUser.avatar}
                        alt={otherUser.firstName}
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {getInitials(otherUser.firstName, otherUser.lastName)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/profile/${otherUser.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                    >
                      {otherUser.firstName} {otherUser.lastName}
                    </Link>
                    <p className="text-sm text-gray-500">@{otherUser.username}</p>
                    {otherUser.bio && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{otherUser.bio}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Connected {formatRelativeTime(connection.updatedAt)}
                  </span>
                  <Link
                    href={`/profile/${otherUser.id}`}
                    className="btn btn-outline btn-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderPendingRequests = () => {
    if (pendingLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (!pendingRequests?.data?.data?.length) {
      return (
        <div className="text-center py-12">
          <Clock className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
          <p className="text-gray-600">
            You don't have any pending connection requests at the moment.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {pendingRequests?.data?.data?.map((request) => (
          <div key={request.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                  {request.sender.avatar ? (
                    <img
                      className="h-12 w-12 rounded-full"
                      src={request.sender.avatar}
                      alt={request.sender.firstName}
                    />
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {getInitials(request.sender.firstName, request.sender.lastName)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/profile/${request.sender.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {request.sender.firstName} {request.sender.lastName}
                  </Link>
                  <p className="text-sm text-gray-500">@{request.sender.username}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sent {formatRelativeTime(request.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRespondToRequest(request.id, 'accept')}
                  disabled={respondMutation.isPending}
                  className="btn btn-primary btn-sm"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </button>
                <button
                  onClick={() => handleRespondToRequest(request.id, 'decline')}
                  disabled={respondMutation.isPending}
                  className="btn btn-outline btn-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderFindPeople = () => {
    return (
      <div className="space-y-6">
        {/* Search */}
        <div className="card p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input w-full"
                placeholder="Search by name, username, or skills..."
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn btn-primary"
            >
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((foundUser) => (
              <div key={foundUser.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                      {foundUser.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full"
                          src={foundUser.avatar}
                          alt={foundUser.firstName}
                        />
                      ) : (
                        <span className="text-sm font-medium text-white">
                          {getInitials(foundUser.firstName, foundUser.lastName)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/profile/${foundUser.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {foundUser.firstName} {foundUser.lastName}
                      </Link>
                      <p className="text-sm text-gray-500">@{foundUser.username}</p>
                      {foundUser.bio && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{foundUser.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {foundUser.id !== user?.id && (
                      <button
                        onClick={() => handleSendRequest(foundUser.id)}
                        disabled={sendRequestMutation.isPending}
                        className="btn btn-primary btn-sm"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </button>
                    )}
                    <Link
                      href={`/profile/${foundUser.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery && (!searchResults || searchResults.length === 0) && !isSearching && (
          <div className="text-center py-12">
            <Search className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse recommended users below.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Connections</h1>
        <p className="mt-2 text-gray-600">
          Build your professional network and collaborate with others
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.data?.totalConnections}</p>
                <p className="text-sm text-gray-600">Total Connections</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.data?.pendingRequests}</p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.data?.sentRequests}</p>
                <p className="text-sm text-gray-600">Sent Requests</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {CONNECTION_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'connections' && renderConnections()}
        {activeTab === 'pending' && renderPendingRequests()}
        {activeTab === 'find' && renderFindPeople()}
      </div>
    </div>
  )
}