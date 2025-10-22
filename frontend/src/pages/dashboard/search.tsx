import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, Filter, X, MapPin, Briefcase, Users as UsersIcon, 
  Code, ChevronDown, Loader2, GraduationCap, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { searchService, SearchFilters } from '@/lib/search';
import { Link } from 'react-router-dom';
import { UserType, TeamType } from '@/types/types';
import { Label } from '@/components/ui/label';

export default function SearchPage() {
  const [searchType, setSearchType] = useState<'users' | 'teams'>('users');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Separate search fields
  const [nameQuery, setNameQuery] = useState('');
  const [universityQuery, setUniversityQuery] = useState('');
  const [teamNameQuery, setTeamNameQuery] = useState('');
  
  // Debounced queries
  const [debouncedNameQuery, setDebouncedNameQuery] = useState('');
  const [debouncedUniversityQuery, setDebouncedUniversityQuery] = useState('');
  const [debouncedTeamNameQuery, setDebouncedTeamNameQuery] = useState('');

  // Filters
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Debounce name query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameQuery(nameQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameQuery]);

  // Debounce university query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUniversityQuery(universityQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [universityQuery]);

  // Debounce team name query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTeamNameQuery(teamNameQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [teamNameQuery]);

  // Fetch user search results
  const { data: userSearchResults, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['searchUsers', debouncedNameQuery, debouncedUniversityQuery, page, filters, selectedSkills],
    queryFn: () => searchService.searchUsers(
      debouncedNameQuery, 
      page, 
      20, 
      { 
        ...filters, 
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        university: debouncedUniversityQuery || undefined
      }
    ),
    enabled: searchType === 'users' && (debouncedNameQuery.length >= 2 || debouncedUniversityQuery.length >= 2 || selectedSkills.length > 0),
  });

  // Fetch team search results
  const { data: teamSearchResults, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['searchTeams', debouncedTeamNameQuery, page, filters, selectedSkills],
    queryFn: () => searchService.searchTeams(
      debouncedTeamNameQuery,
      page,
      20,
      {
        ...filters,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined
      }
    ),
    enabled: searchType === 'teams' && (debouncedTeamNameQuery.length >= 2 || selectedSkills.length > 0),
  });

  // Fetch recommended users (when no search query)
  const { data: recommendedUsersData } = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: () => searchService.getRecommendedUsers(1, 6),
    enabled: !debouncedNameQuery,
  });

  // Fetch suggested teams (when no search query)
  const { data: suggestedTeamsData } = useQuery({
    queryKey: ['suggestedTeams'],
    queryFn: () => searchService.getSuggestedTeams(1, 6),
    enabled: !debouncedNameQuery,
  });

  // Fetch popular skills for autocomplete
  const { data: popularSkillsData } = useQuery({
    queryKey: ['popularSkills'],
    queryFn: () => searchService.getPopularSkills(50),
  });

  const popularSkills = popularSkillsData?.data || [];
  const recommendedUsers = recommendedUsersData?.data || [];
  const suggestedTeams = suggestedTeamsData?.data || [];

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      setFilters({ ...filters, skills: newSkills });
      setPage(1);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(newSkills);
    setFilters({ ...filters, skills: newSkills.length > 0 ? newSkills : undefined });
    setPage(1);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSelectedSkills([]);
    setPage(1);
  };

  const handleSkillSearch = (skill: string) => {
    handleAddSkill(skill);
    setDebouncedNameQuery(skill);
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || selectedSkills.length > 0;

  const users = userSearchResults?.data || [];
  const teams = teamSearchResults?.data || [];
  const totalUsers = userSearchResults?.pagination?.total || 0;
  const totalTeams = teamSearchResults?.pagination?.total || 0;
  
  const isLoading = searchType === 'users' ? isLoadingUsers : isLoadingTeams;
  const hasSearchQuery = searchType === 'users' 
    ? (debouncedNameQuery.length >= 2 || debouncedUniversityQuery.length >= 2 || selectedSkills.length > 0)
    : (debouncedTeamNameQuery.length >= 2 || selectedSkills.length > 0);

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Discover & Connect
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find people to connect with, teams to join, and opportunities to explore
        </p>
      </div>

      {/* Search Type Tabs */}
      <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'users' | 'teams')} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <UsersIcon className="w-4 h-4" />
            Search People
          </TabsTrigger>
          <TabsTrigger value="teams" className="gap-2">
            <Building2 className="w-4 h-4" />
            Search Teams
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Advanced Search Fields */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {searchType === 'users' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name-search" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search by Name / Username
                </Label>
                <div className="relative">
                  <Input
                    id="name-search"
                    type="text"
                    placeholder="Enter person's name or username..."
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    className="pr-10"
                  />
                  {nameQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setNameQuery('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="university-search" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Search by University
                </Label>
                <div className="relative">
                  <Input
                    id="university-search"
                    type="text"
                    placeholder="Enter university name..."
                    value={universityQuery}
                    onChange={(e) => setUniversityQuery(e.target.value)}
                    className="pr-10"
                  />
                  {universityQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setUniversityQuery('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="team-search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search by Team Name
              </Label>
              <div className="relative">
                <Input
                  id="team-search"
                  type="text"
                  placeholder="Enter team name or description..."
                  value={teamNameQuery}
                  onChange={(e) => setTeamNameQuery(e.target.value)}
                  className="pr-10"
                />
                {teamNameQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setTeamNameQuery('')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {Object.keys(filters).length + selectedSkills.length}
            </Badge>
          )}
        </Button>

        {/* User Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Briefcase className="w-4 h-4" />
              {filters.userType || 'User Type'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filter by User Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilters({ ...filters, userType: undefined })}>
              All Types
            </DropdownMenuItem>
            {Object.values(UserType).map((type) => (
              <DropdownMenuItem
                key={type}
                onClick={() => setFilters({ ...filters, userType: type })}
              >
                {type.replace(/_/g, ' ')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Team Type Filter */}
        {searchType !== 'users' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UsersIcon className="w-4 h-4" />
                {filters.type || 'Team Type'}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Team Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilters({ ...filters, type: undefined })}>
                All Types
              </DropdownMenuItem>
              {Object.values(TeamType).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setFilters({ ...filters, type })}
                >
                  {type.replace(/_/g, ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Skills Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Code className="w-4 h-4" />
              Skills
              {selectedSkills.length > 0 && (
                <Badge variant="secondary">{selectedSkills.length}</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Select Skills</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {popularSkills.map((skill: string) => (
              <DropdownMenuItem
                key={skill}
                onClick={() => handleAddSkill(skill)}
                className={selectedSkills.includes(skill) ? 'bg-primary-50' : ''}
              >
                {skill}
                {selectedSkills.includes(skill) && ' ✓'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Recruiting Filter (for teams) */}
        {searchType !== 'users' && (
          <Button
            variant={filters.isRecruiting ? "default" : "outline"}
            onClick={() => setFilters({
              ...filters,
              isRecruiting: filters.isRecruiting ? undefined : true
            })}
          >
            Recruiting Now
          </Button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Selected Skills Tags */}
      {selectedSkills.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="px-3 py-1 gap-1 cursor-pointer hover:bg-gray-300"
              onClick={() => handleRemoveSkill(skill)}
            >
              {skill}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-6">
        {/* Results Count */}
        {hasSearchQuery && !isLoading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {searchType === 'users' ? totalUsers : totalTeams} {searchType === 'users' ? 'people' : 'teams'}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Suggestions when no search query */}
        {!isLoading && !hasSearchQuery && (
          <div className="space-y-8">
            {/* Recommended People */}
            {recommendedUsers.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">People You May Know</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/connections">View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedUsers.slice(0, 6).map((user: any) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Teams */}
            {suggestedTeams.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Teams For You</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/teams">View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedTeams.slice(0, 4).map((team: any) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </div>
            )}

            {/* Popular Skills */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trending Skills</h2>
              <p className="text-sm text-gray-600 mb-3">Click any skill to search for people and teams</p>
              <div className="flex flex-wrap gap-2">
                {popularSkills.slice(0, 20).map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-4 py-2 cursor-pointer hover:bg-primary-100 hover:text-primary-700 transition-colors"
                    onClick={() => handleSkillSearch(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Searches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSearchType('teams');
                    setFilters({ ...filters, isRecruiting: true });
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <UsersIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Recruiting Teams</h3>
                    <p className="text-xs text-gray-600 mt-1">Find teams hiring now</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSearchType('users');
                    setFilters({ ...filters, userType: UserType.FREELANCER });
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Freelancers</h3>
                    <p className="text-xs text-gray-600 mt-1">Connect with freelancers</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSearchType('teams');
                    handleSkillSearch('Open Source');
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Open Source</h3>
                    <p className="text-xs text-gray-600 mt-1">Join open source projects</p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setSearchType('users');
                    setFilters({ ...filters, userType: UserType.STARTUP_FOUNDER });
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <UsersIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">Founders</h3>
                    <p className="text-xs text-gray-600 mt-1">Find startup founders</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Search Tips */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Search Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Find People</h3>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Search by name, username, or skills</li>
                      <li>• Filter by user type and location</li>
                      <li>• Add skills to find experts</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Find Teams</h3>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Search by team name or description</li>
                      <li>• Filter by team type and skills</li>
                      <li>• Toggle "Recruiting Now" for opportunities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* No recommendations fallback */}
            {recommendedUsers.length === 0 && suggestedTeams.length === 0 && (
              <Card className="p-12 text-center">
                <CardContent>
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Your Search
                  </h3>
                  <p className="text-gray-600">
                    Enter at least 2 characters to search for people, teams, and more
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading && hasSearchQuery && (
          searchType === 'users' ? users.length === 0 : teams.length === 0
        ) && (
          <Card className="p-12 text-center">
            <CardContent>
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search query or filters
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {!isLoading && hasSearchQuery && (
          <div>
            {searchType === 'users' && users.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user: any) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}

            {searchType === 'teams' && teams.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team: any) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// User Card Component
function UserCard({ user }: { user: any }) {
  return (
    <Link to={`/dashboard/profile/${user.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{user.bio}</p>
              )}
              {user.userType && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {user.userType.replace(/_/g, ' ')}
                </Badge>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                {user.country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.country}
                  </span>
                )}
                {user._count && (
                  <span>{user._count.followers || 0} connections</span>
                )}
              </div>
            </div>
          </div>
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {user.skills.slice(0, 3).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{user.skills.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// Team Card Component
function TeamCard({ team }: { team: any }) {
  return (
    <Link to={`/dashboard/teams/${team.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={team.logo} alt={team.name} />
              <AvatarFallback>{team.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{team.name}</h3>
                {team.isRecruiting && (
                  <Badge variant="default" className="text-xs">Recruiting</Badge>
                )}
              </div>
              {team.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{team.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                {team._count && (
                  <>
                    <span>{team._count.members || 0} members</span>
                    <span>{team._count.projects || 0} projects</span>
                  </>
                )}
                {team.country && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {team.country}
                  </span>
                )}
              </div>
            </div>
          </div>
          {team.skills && team.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {team.skills.slice(0, 3).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {team.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{team.skills.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
