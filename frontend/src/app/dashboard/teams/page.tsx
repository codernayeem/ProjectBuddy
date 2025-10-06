'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Plus, Users, Globe, Lock, Eye,
  Star, Calendar, MapPin, ExternalLink,
  Settings, UserPlus, LogOut
} from 'lucide-react';
import { useTeams, useUserTeams, useTeamRecommendations, useJoinTeam, useLeaveTeam } from '@/hooks/useTeams';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('discover');
  
  const { user } = useAuth();
  const { data: teamsData, isLoading: teamsLoading } = useTeams(1, 12, {
    search: searchQuery || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });
  const { data: userTeamsData, isLoading: userTeamsLoading } = useUserTeams(1, 12);
  const { data: recommendationsData, isLoading: recommendationsLoading } = useTeamRecommendations(1, 8);
  
  const joinTeamMutation = useJoinTeam();
  const leaveTeamMutation = useLeaveTeam();

  const popularTags = [
    'frontend', 'backend', 'mobile', 'ai-ml', 'blockchain', 
    'startup', 'open-source', 'fintech', 'healthcare', 'education'
  ];

  const handleJoinTeam = async (teamId: string) => {
    try {
      await joinTeamMutation.mutateAsync(teamId);
    } catch (error) {
      console.error('Failed to join team:', error);
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    try {
      await leaveTeamMutation.mutateAsync(teamId);
    } catch (error) {
      console.error('Failed to leave team:', error);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC': return <Globe className="w-4 h-4" />;
      case 'PRIVATE': return <Lock className="w-4 h-4" />;
      case 'INVITE_ONLY': return <Eye className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC': return 'text-green-600 bg-green-50 border-green-200';
      case 'PRIVATE': return 'text-red-600 bg-red-50 border-red-200';
      case 'INVITE_ONLY': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const TeamCard = ({ team, showMembershipActions = true }: { team: any; showMembershipActions?: boolean }) => {
    const isUserMember = team.members?.some((member: any) => member.userId === user?.id);
    const userRole = team.members?.find((member: any) => member.userId === user?.id)?.role;
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={team.logo || undefined} alt={team.name} />
                <AvatarFallback>{team.name[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  <Link href={`/teams/${team.id}`} className="hover:text-blue-600">
                    {team.name}
                  </Link>
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{team.currentMemberCount} members</span>
                  <span>•</span>
                  <span>By {team.creator.firstName} {team.creator.lastName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`flex items-center space-x-1 ${getVisibilityColor(team.visibility)}`}>
                {getVisibilityIcon(team.visibility)}
                <span className="capitalize">{team.visibility.toLowerCase()}</span>
              </Badge>
              {isUserMember && userRole && (
                <Badge variant="default" className="text-xs">
                  {userRole}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-3">
            {team.description || 'No description available.'}
          </p>

          {team.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {team.tags.slice(0, 4).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {team.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{team.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {(team.requiredSkills.length > 0 || team.preferredSkills.length > 0) && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {team.requiredSkills.slice(0, 3).map((skill: string) => (
                  <Badge key={skill} variant="default" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {team.preferredSkills.slice(0, 2).map((skill: string) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}</span>
              </span>
              {team._count.projects > 0 && (
                <span>{team._count.projects} projects</span>
              )}
            </div>

            {showMembershipActions && (
              <div className="flex space-x-2">
                {isUserMember ? (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/teams/${team.id}`}>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    {userRole !== 'OWNER' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleLeaveTeam(team.id)}
                        disabled={leaveTeamMutation.isPending}
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Leave
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/teams/${team.id}`}>
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    {team.visibility === 'PUBLIC' && (
                      <Button 
                        size="sm"
                        onClick={() => handleJoinTeam(team.id)}
                        disabled={joinTeamMutation.isPending}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">
            Discover and join amazing teams, or create your own to collaborate on projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/teams/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Link>
        </Button>
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover Teams</TabsTrigger>
          <TabsTrigger value="my-teams">My Teams</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search teams by name, description, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Popular Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams Grid */}
          {teamsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamsData?.teams?.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}

          {teamsData?.teams?.length === 0 && !teamsLoading && (
            <Card className="p-12 text-center">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all teams.
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-teams" className="space-y-6">
          {userTeamsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTeamsData?.data?.map((team) => (
                <TeamCard key={team.id} team={team} showMembershipActions={false} />
              ))}
            </div>
          )}

          {userTeamsData?.data?.length === 0 && !userTeamsLoading && (
            <Card className="p-12 text-center">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">You haven't joined any teams yet</h3>
                <p className="text-gray-600 mb-4">
                  Discover teams to collaborate on exciting projects!
                </p>
                <Button onClick={() => setSelectedTab('discover')}>
                  Discover Teams
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommended" className="space-y-6">
          {recommendationsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendationsData?.data?.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}

          {recommendationsData?.data?.length === 0 && !recommendationsLoading && (
            <Card className="p-12 text-center">
              <CardContent>
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recommendations available</h3>
                <p className="text-gray-600 mb-4">
                  Complete your profile and join some teams to get personalized recommendations.
                </p>
                <Button onClick={() => setSelectedTab('discover')}>
                  Browse All Teams
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}