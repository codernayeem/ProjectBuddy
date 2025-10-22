import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { Link, useSearchParams } from 'react-router'
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Smile,
  Check,
  CheckCheck,
  Loader2,
  ArrowLeft,
  Users,
  Trash2
} from 'lucide-react'
import { messageService } from '@/lib/messages'
import { connectionService } from '@/lib/connections'
import { ConnectionStatus } from '@/types/types'
import { useAuthStore } from '@/store/authStore'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function MessagesPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const teamId = searchParams.get('teamId')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch conversations
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(1, 50),
    refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
  })

  // Fetch connections to show as potential message recipients
  const { data: connectionsData, isLoading: connectionsLoading } = useQuery({
    queryKey: ['connections-for-messaging'],
    queryFn: () => connectionService.getConnections(1, 100, ConnectionStatus.ACCEPTED),
  })

  // Fetch messages for selected conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => messageService.getMessages(selectedConversationId!, 1, 100),
    enabled: !!selectedConversationId,
    refetchInterval: selectedConversationId ? 2000 : false, // Refetch every 2 seconds when conversation is selected
  })

  // Start conversation mutation (for new direct messages)
  const startConversationMutation = useMutation({
    mutationFn: (userId: string) => messageService.getDirectConversation(userId),
    onSuccess: (data) => {
      if (data?.data?.id) {
        setSelectedConversationId(data.data.id)
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      }
    },
    onError: () => {
      toast.error('Failed to start conversation')
    },
  })

  // Start team chat mutation
  const startTeamChatMutation = useMutation({
    mutationFn: (teamId: string) => messageService.getTeamConversation(teamId),
    onSuccess: (data) => {
      if (data?.data?.id) {
        setSelectedConversationId(data.data.id)
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      }
    },
    onError: () => {
      toast.error('Failed to open team chat')
    },
  })

  // Load team chat if teamId is present
  useEffect(() => {
    if (teamId && !selectedConversationId) {
      startTeamChatMutation.mutate(teamId)
    }
  }, [teamId])

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { content: string }) =>
      messageService.sendMessage(selectedConversationId!, data),
    onSuccess: () => {
      setMessageText('')
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      scrollToBottom()
    },
    onError: () => {
      toast.error('Failed to send message')
    },
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (conversationId: string) => 
      messageService.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: string) => 
      messageService.deleteConversation(conversationId),
    onSuccess: () => {
      setSelectedConversationId(null)
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      toast.success('Conversation deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete conversation')
    },
  })

  const conversations = conversationsData?.data?.conversations || []
  const connections = connectionsData?.data || []
  const messages = messagesData?.data?.messages || []
  const selectedConversation = conversations.find((c: any) => c.id === selectedConversationId)

  // Get other participant in direct conversation
  const getOtherParticipant = (conversation: any) => {
    return conversation.participants?.find((p: any) => p.userId !== user?.id)?.user
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedConversationId) {
      markAsReadMutation.mutate(selectedConversationId)
    }
  }, [selectedConversationId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversationId) return
    
    sendMessageMutation.mutate({ content: messageText })
  }

  const filteredConversations = conversations
    .filter((conv: any) => {
      if (!searchQuery.trim()) return true
      
      // For team chats, search in title
      if (conv.type === 'TEAM_CHAT') {
        const title = (conv.title || '').toLowerCase()
        return title.includes(searchQuery.toLowerCase())
      }
      
      // For direct messages, search in other user's name
      const otherUser = getOtherParticipant(conv)
      const fullName = `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase()
      return fullName.includes(searchQuery.toLowerCase())
    })
    .sort((a: any, b: any) => {
      // Conversations with messages come first
      const aHasMessages = a.messages && a.messages.length > 0
      const bHasMessages = b.messages && b.messages.length > 0
      
      if (aHasMessages && !bHasMessages) return -1
      if (!aHasMessages && bHasMessages) return 1
      
      // If both have messages or both don't, sort by lastMessageAt
      const aTime = a.messages?.[0]?.createdAt || a.createdAt
      const bTime = b.messages?.[0]?.createdAt || b.createdAt
      
      return new Date(bTime).getTime() - new Date(aTime).getTime()
    })

  // Get unread count for a conversation
  const getUnreadCount = (conversation: any) => {
    const lastMessage = conversation.messages?.[0]
    if (!lastMessage) return 0
    
    // If the current user sent the message, it's not unread for them
    if (lastMessage.senderId === user?.id) return 0
    
    // Otherwise, check if they've read it
    return lastMessage.readBy?.includes(user?.id) ? 0 : 1
  }

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full md:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${
        selectedConversationId && 'hidden md:flex'
      }`}>
        {/* Header - Fixed */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Messages</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs for Messages and All Connections - Scrollable */}
        <Tabs defaultValue="messages" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <TabsTrigger value="messages" className="flex-1">
              Messages {conversations.length > 0 && `(${conversations.length})`}
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex-1">
              All Connections {connections.length > 0 && `(${connections.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="flex-1 overflow-y-auto mt-0 min-h-0">
            {conversationsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-sm text-gray-500">
                  Click on a connection to start messaging
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation: any) => {
              const isTeamChat = conversation.type === 'TEAM_CHAT'
              const otherUser = getOtherParticipant(conversation)
              const lastMessage = conversation.messages?.[0]
              const unreadCount = getUnreadCount(conversation)
              
              // For team chats, use conversation title and avatar
              const displayName = isTeamChat 
                ? (conversation.title || 'Team Chat')
                : `${otherUser?.firstName} ${otherUser?.lastName}`
              const displayAvatar = isTeamChat 
                ? conversation.avatar 
                : otherUser?.avatar
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                    selectedConversationId === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={displayAvatar || ''} alt={displayName} />
                    <AvatarFallback>
                      {isTeamChat ? <Users className="w-6 h-6" /> : getInitials(otherUser?.firstName, otherUser?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {displayName}
                      </h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                          {formatRelativeTime(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    {lastMessage && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                          {lastMessage.senderId === user?.id && 'You: '}
                          {lastMessage.content}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              )
            })
            )}
          </TabsContent>

          {/* All Connections Tab */}
          <TabsContent value="connections" className="flex-1 overflow-y-auto mt-0 min-h-0">
            {connectionsLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : connections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                <p className="text-sm text-gray-500">
                  Connect with people to start messaging
                </p>
              </div>
            ) : (
              connections.map((connection: any) => {
                // Get the other user (not the current user)
                const connectionUser = connection.senderId === user?.id ? connection.receiver : connection.sender
                const fullName = `${connectionUser?.firstName} ${connectionUser?.lastName}`
                
                return (
                  <button
                    key={connection.id}
                    onClick={() => startConversationMutation.mutate(connectionUser?.id)}
                    disabled={startConversationMutation.isPending || !connectionUser}
                    className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={connectionUser?.avatar || ''} alt={fullName} />
                      <AvatarFallback>{getInitials(connectionUser?.firstName, connectionUser?.lastName)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {fullName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{connectionUser?.username}
                      </p>
                    </div>

                    <MessageSquare className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  </button>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      {selectedConversationId ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
          {/* Chat Header - Fixed */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSelectedConversationId(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              {selectedConversation && (() => {
                const isTeamChat = selectedConversation.type === 'TEAM_CHAT'
                const otherUser = getOtherParticipant(selectedConversation)
                
                if (isTeamChat) {
                  const teamName = selectedConversation.title || 'Team Chat'
                  return (
                    <>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.avatar || ''} alt={teamName} />
                        <AvatarFallback><Users className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {teamName}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedConversation.participants?.length || 0} members
                        </p>
                      </div>
                    </>
                  )
                }
                
                const fullName = `${otherUser?.firstName} ${otherUser?.lastName}`
                return (
                  <>
                    <Link to={`/dashboard/profile/${otherUser?.id}`}>
                      <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                        <AvatarImage src={otherUser?.avatar || ''} alt={fullName} />
                        <AvatarFallback>{getInitials(otherUser?.firstName, otherUser?.lastName)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link
                        to={`/dashboard/profile/${otherUser?.id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {fullName}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {otherUser?.isActive ? 'Active' : 'Offline'}
                      </p>
                    </div>
                  </>
                )
              })()}
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      if (selectedConversationId && confirm('Are you sure you want to delete this conversation?')) {
                        deleteConversationMutation.mutate(selectedConversationId)
                      }
                    }}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Conversation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messagesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-sm text-gray-500">
                  Send a message to start the conversation
                </p>
              </div>
            ) : (
              messages.map((message: any) => {
                const isOwnMessage = message.senderId === user?.id
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-[70%] ${
                      isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {!isOwnMessage && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.sender?.avatar || ''} alt={message.sender?.firstName} />
                          <AvatarFallback>
                            {getInitials(message.sender?.firstName, message.sender?.lastName)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-gray-800 dark:bg-gray-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(message.createdAt)}
                          </span>
                          {isOwnMessage && (
                            <span className="text-gray-500 dark:text-gray-400">
                              {message.readBy?.length > 1 ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input - Fixed */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-end space-x-2">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 min-h-[40px] max-h-32 resize-none"
                rows={1}
              />
              
              <div className="relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5" />
                </Button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 grid grid-cols-8 gap-2 z-10">
                    {['😀', '😂', '😊', '😍', '🥰', '😎', '🤔', '😮', '😢', '😡', '👍', '👎', '👏', '🙌', '💪', '🎉', '❤️', '🔥', '✨', '💯', '🚀', '👀', '💬', '📌'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageText(messageText + emoji)
                          setShowEmojiPicker(false)
                        }}
                        className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="px-4"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 text-center">
          <MessageSquare className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Select a conversation</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Choose a conversation from the list to start messaging, or visit a user's profile to send them a message
          </p>
        </div>
      )}
    </div>
  )
}
