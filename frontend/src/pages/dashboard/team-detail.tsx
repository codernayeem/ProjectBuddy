import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PostCreator } from '@/components/posts/PostCreator';
import { PostCard } from '@/components/posts/PostCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, Globe, Lock, Eye, MapPin, Link2, Users, Calendar,
  UserPlus, LogOut, Mail, MoreVertical, Shield, Trash2,
  Crown, Plus, X, MessageSquare, Target, CheckCircle2,
  Clock, Rocket, Pause, XCircle, FolderGit2, ExternalLink, Edit
} from 'lucide-react';
import { 
  useTeam, 
  useJoinTeam, 
  useLeaveTeam, 
  useRemoveMember,
  useTeamRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAssignRole,
  useRemoveRoleFromMember,
  useUpdateMemberRole,
  useInviteToTeam
} from '@/hooks/useTeams';
import {
  useTeamProjects,
  useCreateTeamProject,
  useUpdateTeamProject,
  useDeleteTeamProject,
  useTeamMilestones,
  useCreateTeamMilestone,
  useUpdateTeamMilestone,
  useCompleteMilestone
} from '@/hooks/useTeamProjects';
import { TeamProject, CreateTeamProjectData, TeamMilestone, CreateTeamMilestoneData } from '@/lib/teamProjects';
import { useAuth } from '@/hooks/useAuth';
import { usePosts, useDeletePost } from '@/hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const { data: teamData, isLoading } = useTeam(teamId!);
  const { data: rolesData } = useTeamRoles(teamId!);
  const { data: teamPostsData, isLoading: postsLoading, refetch: refetchTeamPosts } = usePosts(1, 20, { teamId: teamId! });
  const joinTeamMutation = useJoinTeam();
  const leaveTeamMutation = useLeaveTeam();
  const removeMemberMutation = useRemoveMember();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();
  const assignRoleMutation = useAssignRole();
  const removeRoleMutation = useRemoveRoleFromMember();
  const updateMemberRoleMutation = useUpdateMemberRole();
  const inviteToTeamMutation = useInviteToTeam();
  const deletePostMutation = useDeletePost();

  // Project mutations
  const { data: projectsData } = useTeamProjects(teamId!);
  const { data: milestonesData } = useTeamMilestones(teamId!);
  const createProjectMutation = useCreateTeamProject();
  const updateProjectMutation = useUpdateTeamProject();
  const deleteProjectMutation = useDeleteTeamProject();
  const createMilestoneMutation = useCreateTeamMilestone();
  const updateMilestoneMutation = useUpdateTeamMilestone();
  const completeMilestoneMutation = useCompleteMilestone();

  // Dialog states
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [roleToEdit, setRoleToEdit] = useState<any>(null);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [memberToAssignRole, setMemberToAssignRole] = useState<any>(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('#6B7280');
  const [newRolePermissions, setNewRolePermissions] = useState({
    canInvite: false,
    canRemove: false,
    canManageRoles: false,
  });

  // Project dialog states
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TeamProject | null>(null);
  const [projectFormData, setProjectFormData] = useState<CreateTeamProjectData>({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    requiredSkills: [],
    tags: [],
    repositoryUrl: '',
    liveUrl: '',
    documentationUrl: '',
  });
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [milestoneFormData, setMilestoneFormData] = useState<CreateTeamMilestoneData>({
    title: '',
    description: '',
    projectId: '',
  });

  const team = teamData?.data;
  const projects = projectsData || [];
  const milestones = milestonesData || [];

  const handleJoinTeam = async () => {
    if (!teamId) return;
    try {
      await joinTeamMutation.mutateAsync(teamId);
    } catch (error) {
      console.error('Failed to join team:', error);
    }
  };

  const handleLeaveTeam = async () => {
    if (!teamId) return;
    try {
      await leaveTeamMutation.mutateAsync(teamId);
    } catch (error) {
      console.error('Failed to leave team:', error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!teamId) return;
    try {
      await removeMemberMutation.mutateAsync({ teamId, userId });
      setMemberToRemove(null);
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    if (!teamId) return;
    
    try {
      await inviteToTeamMutation.mutateAsync({
        teamId,
        data: {
          email: inviteEmail,
          message: inviteMessage || undefined,
        }
      });
      setInviteEmail('');
      setInviteMessage('');
      setInviteDialogOpen(false);
    } catch (error) {
      console.error('Failed to invite member:', error);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    if (!teamId) return;
    
    try {
      await createRoleMutation.mutateAsync({
        teamId,
        data: {
          name: newRoleName,
          description: `Custom role with${newRolePermissions.canInvite ? ' invite,' : ''}${newRolePermissions.canRemove ? ' remove,' : ''}${newRolePermissions.canManageRoles ? ' manage roles' : ''} permissions`,
        }
      });
      setNewRoleName('');
      setNewRolePermissions({ canInvite: false, canRemove: false, canManageRoles: false });
      setRoleDialogOpen(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    if (!teamId) return;
    try {
      await updateMemberRoleMutation.mutateAsync({
        teamId,
        userId,
        isAdmin: !currentIsAdmin,
      });
    } catch (error) {
      console.error('Failed to update member role:', error);
    }
  };

  const handleEditRole = (role: any) => {
    setRoleToEdit(role);
    setNewRoleName(role.name);
    setNewRoleColor(role.color || '#6B7280');
    setEditRoleDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }
    if (!teamId || !roleToEdit) return;
    
    try {
      await updateRoleMutation.mutateAsync({
        teamId,
        roleId: roleToEdit.id,
        data: {
          name: newRoleName,
          color: newRoleColor,
        }
      });
      setEditRoleDialogOpen(false);
      setRoleToEdit(null);
      setNewRoleName('');
      setNewRoleColor('#6B7280');
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteRole = async () => {
    if (!teamId || !roleToDelete) return;
    
    try {
      await deleteRoleMutation.mutateAsync({
        teamId,
        roleId: roleToDelete.id,
      });
      setRoleToDelete(null);
    } catch (error) {
      console.error('Failed to delete role:', error);
    }
  };

  const handleOpenAssignRole = (member: any) => {
    setMemberToAssignRole(member);
    setSelectedRoleId('');
    setAssignRoleDialogOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedRoleId) {
      toast.error('Please select a role');
      return;
    }
    if (!teamId || !memberToAssignRole) return;
    
    try {
      await assignRoleMutation.mutateAsync({
        teamId,
        memberId: memberToAssignRole.id,
        roleId: selectedRoleId,
      });
      setAssignRoleDialogOpen(false);
      setMemberToAssignRole(null);
      setSelectedRoleId('');
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleRemoveRole = async (memberId: string, roleId: string) => {
    if (!teamId) return;
    
    try {
      await removeRoleMutation.mutateAsync({
        teamId,
        memberId,
        roleId,
      });
    } catch (error) {
      console.error('Failed to remove role:', error);
    }
  };

  // Project handlers
  const handleCreateProject = async () => {
    if (!teamId) return;
    
    try {
      await createProjectMutation.mutateAsync({
        teamId,
        data: projectFormData,
      });
      setProjectDialogOpen(false);
      setProjectFormData({
        title: '',
        description: '',
        shortDescription: '',
        category: '',
        requiredSkills: [],
        tags: [],
        repositoryUrl: '',
        liveUrl: '',
        documentationUrl: '',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdateProject = async () => {
    if (!teamId || !selectedProject) return;
    
    try {
      await updateProjectMutation.mutateAsync({
        teamId,
        projectId: selectedProject.id,
        data: projectFormData,
      });
      setEditProjectDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!teamId) return;
    
    try {
      await deleteProjectMutation.mutateAsync({ teamId, projectId });
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleCreateMilestone = async () => {
    if (!teamId) return;
    
    try {
      await createMilestoneMutation.mutateAsync({
        teamId,
        data: milestoneFormData,
      });
      setMilestoneDialogOpen(false);
      setMilestoneFormData({
        title: '',
        description: '',
        projectId: '',
      });
    } catch (error) {
      console.error('Failed to create milestone:', error);
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: string, status: string) => {
    if (!teamId) return;
    
    try {
      if (status === 'COMPLETED') {
        await completeMilestoneMutation.mutateAsync({ teamId, milestoneId });
      } else {
        await updateMilestoneMutation.mutateAsync({
          teamId,
          milestoneId,
          data: { status } as any,
        });
      }
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    if (!teamId) return;
    
    try {
      await updateProjectMutation.mutateAsync({
        teamId,
        projectId,
        data: { status } as any,
      });
    } catch (error) {
      console.error('Failed to update project status:', error);
    }
  };

  const openEditProjectDialog = (project: TeamProject) => {
    setSelectedProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      shortDescription: project.shortDescription,
      category: project.category,
      requiredSkills: project.requiredSkills || [],
      tags: project.tags || [],
      repositoryUrl: project.repositoryUrl,
      liveUrl: project.liveUrl,
      documentationUrl: project.documentationUrl,
    });
    setEditProjectDialogOpen(true);
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
      case 'PUBLIC': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'PRIVATE': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'INVITE_ONLY': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-700';
    }
  };

  const getProjectStatusBadge = (status: string) => {
    const styles = {
      PLANNING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      ACTIVE: { icon: Rocket, color: 'bg-blue-100 text-blue-800 border-blue-200' },
      COMPLETED: { icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-200' },
      ON_HOLD: { icon: Pause, color: 'bg-orange-100 text-orange-800 border-orange-200' },
      CANCELLED: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200' },
    };
    
    const config = styles[status as keyof typeof styles] || styles.PLANNING;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getMilestoneStatusBadge = (status: string) => {
    const styles = {
      PENDING: { icon: Clock, color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600' },
      IN_PROGRESS: { icon: Target, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      COMPLETED: { icon: CheckCircle2, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800' },
      CANCELLED: { icon: XCircle, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' },
    };
    
    const config = styles[status as keyof typeof styles] || styles.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container mx-auto">
        <Card className="p-12 text-center">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Team not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The team you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button asChild>
              <Link to="/dashboard/teams">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Teams
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = team.ownerId === user?.id;
  const isMember = team.members?.some((member: any) => member.userId === user?.id);
  const userMember = team.members?.find((member: any) => member.userId === user?.id);
  const isAdmin = userMember?.isAdmin || isOwner;

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/dashboard/teams">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={team.avatar || undefined} alt={team.name} />
              <AvatarFallback className="text-2xl">{team.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{team.shortDescription || team.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="outline" className={`flex items-center space-x-1 ${getVisibilityColor(team.visibility)}`}>
                  {getVisibilityIcon(team.visibility)}
                  <span className="capitalize">{team.visibility.toLowerCase()}</span>
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {team.members?.length || 0} members
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {isMember && (
              <Button variant="outline" asChild>
                <Link to={`/dashboard/messages?teamId=${teamId}`}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Team Chat
                </Link>
              </Button>
            )}
            {isAdmin && (
              <>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Members
                </Button>
              </>
            )}
            {isMember && !isOwner && (
              <Button 
                variant="outline"
                onClick={handleLeaveTeam}
                disabled={leaveTeamMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Team
              </Button>
            )}
            {!isMember && (
              team.visibility === 'PUBLIC' ? (
                <Button 
                  onClick={handleJoinTeam}
                  disabled={joinTeamMutation.isPending}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Team
                </Button>
              ) : (
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  Request to Join
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Admin Actions Bar */}
      {isAdmin && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-900">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Admin Controls</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => setRoleDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Create Role
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/dashboard/teams/${teamId}/join-requests`}>
                    View Join Requests
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/dashboard/teams/${teamId}/invitations`}>
                    Manage Invitations
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members ({team.memberCount})</TabsTrigger>
          {isAdmin && <TabsTrigger value="roles">Roles</TabsTrigger>}
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">{team.description}</p>
              </div>

              {team.tags && team.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {team.skills && team.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.skills.map((skill: string) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(team.country || team.city) && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
                  <p className="text-gray-700 dark:text-gray-300 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {[team.city, team.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {team.website && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Website</h3>
                  <a 
                    href={team.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    {team.website}
                  </a>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Owner</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={team.owner?.avatar || undefined} />
                    <AvatarFallback>
                      {team.owner?.firstName?.[0]}{team.owner?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {team.owner?.firstName} {team.owner?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{team.owner?.username}</p>
                  </div>
                </div>
              </div>

              {/* Universities Section */}
              {team.members && team.members.length > 0 && (() => {
                const allUniversities = team.members
                  .flatMap((member: any) => member.user?.universities || [])
                  .filter((uni: any) => uni);
                
                if (allUniversities.length === 0) return null;

                // Group universities and count occurrences
                const universityMap = new Map<string, { count: number; status: Set<string> }>();
                allUniversities.forEach((uni: any) => {
                  const existing = universityMap.get(uni.universityName) || { count: 0, status: new Set() };
                  existing.count += 1;
                  existing.status.add(uni.status);
                  universityMap.set(uni.universityName, existing);
                });

                // Sort by count (most common first)
                const sortedUniversities = Array.from(universityMap.entries())
                  .sort((a, b) => b[1].count - a[1].count);

                return (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Team Universities
                    </h3>
                    <div className="space-y-2">
                      {sortedUniversities.map(([name, data]) => (
                        <div key={name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {data.status.has('CURRENT') && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                            {data.status.has('GRADUATED') && (
                              <Badge variant="secondary" className="text-xs">Graduated</Badge>
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {data.count} member{data.count > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          {isMember && (
            <PostCreator 
              teamId={teamId} 
              onPostCreated={() => refetchTeamPosts()}
            />
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Team Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : teamPostsData?.data && teamPostsData.data.length > 0 ? (
                <div className="space-y-4">
                  {teamPostsData.data.map((post: any) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      onDelete={(postId) => deletePostMutation.mutate(postId)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share something!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members ({team.members?.length || 0})</CardTitle>
                {isAdmin && (
                  <Button size="sm" onClick={() => setInviteDialogOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member: any) => {
                    const memberIsOwner = member.userId === team.ownerId;
                    const memberIsAdmin = member.isAdmin || memberIsOwner;
                    
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.user?.avatar || undefined} />
                            <AvatarFallback>
                              {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">
                                {member.user?.firstName} {member.user?.lastName}
                              </p>
                              {memberIsOwner && (
                                <Badge variant="default" className="bg-yellow-500">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Owner
                                </Badge>
                              )}
                              {memberIsAdmin && !memberIsOwner && (
                                <Badge variant="default">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">@{member.user?.username}</p>
                              {member.customRoles && member.customRoles.length > 0 && (
                                <div className="flex gap-1">
                                  {member.customRoles.map((cr: any) => (
                                    <Badge 
                                      key={cr.customRole?.id || cr.id} 
                                      variant="outline"
                                      style={{ 
                                        borderColor: cr.customRole?.color || cr.color || '#6B7280',
                                        color: cr.customRole?.color || cr.color || '#6B7280'
                                      }}
                                    >
                                      {cr.customRole?.name || cr.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            {member.user?.bio && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.user.bio}</p>
                            )}
                          </div>
                        </div>

                        {isAdmin && !memberIsOwner && member.userId !== user?.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleAdmin(member.userId, memberIsAdmin)}>
                                <Shield className="w-4 h-4 mr-2" />
                                {memberIsAdmin ? 'Remove Admin' : 'Make Admin'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenAssignRole(member)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Assign Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => setMemberToRemove(member)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove from Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">No members yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Custom Roles</CardTitle>
                  <Button size="sm" onClick={() => setRoleDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Default Roles */}
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          <h4 className="font-semibold">Owner</h4>
                          <Badge variant="secondary">Default</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Full control over the team</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-semibold">Admin</h4>
                          <Badge variant="secondary">Default</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Can manage members and settings</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <h4 className="font-semibold">Member</h4>
                          <Badge variant="secondary">Default</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Regular team member</p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Roles */}
                  {rolesData?.data && rolesData.data.length > 0 ? (
                    rolesData.data.map((role: any) => (
                      <div key={role.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: role.color || '#6B7280' }}
                              />
                              <h4 className="font-semibold">{role.name}</h4>
                              <Badge variant="outline">Custom</Badge>
                            </div>
                            {role.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{role.description}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {role.members?.length || 0} member{role.members?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEditRole(role)}>
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setRoleToDelete(role)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No custom roles yet. Create one to get started!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Projects</CardTitle>
                {isAdmin && (
                  <Button 
                    size="sm" 
                    onClick={() => setProjectDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <FolderGit2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No projects yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isAdmin 
                      ? "Create your first project to get started!" 
                      : "Projects will appear here once created."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project: TeamProject) => (
                    <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            {getProjectStatusBadge(project.status)}
                          </div>
                          {project.shortDescription && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.shortDescription}</p>
                          )}
                          <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                        </div>
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditProjectDialog(project)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleUpdateProjectStatus(project.id, 'PLANNING')}>
                                <Clock className="w-4 h-4 mr-2" />
                                Set to Planning
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateProjectStatus(project.id, 'ACTIVE')}>
                                <Rocket className="w-4 h-4 mr-2" />
                                Set to Active
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateProjectStatus(project.id, 'COMPLETED')}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Mark as Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateProjectStatus(project.id, 'ON_HOLD')}>
                                <Pause className="w-4 h-4 mr-2" />
                                Put On Hold
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Project
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>

                      {/* Project Details */}
                      <div className="grid grid-cols-2 gap-3 mt-3 mb-3">
                        {project.category && (
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Category:</span>
                            <span className="ml-2 font-medium">{project.category}</span>
                          </div>
                        )}
                        {project.startDate && (
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                            <span className="ml-2 font-medium">
                              {new Date(project.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">End Date:</span>
                            <span className="ml-2 font-medium">
                              {new Date(project.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.repositoryUrl && (
                          <a 
                            href={project.repositoryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <FolderGit2 className="w-4 h-4" />
                            Repository
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Rocket className="w-4 h-4" />
                            Live Demo
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Skills & Tags */}
                      {(project.requiredSkills?.length || project.tags?.length) && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.requiredSkills?.map((skill, idx) => (
                            <Badge key={`skill-${idx}`} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {project.tags?.map((tag, idx) => (
                            <Badge key={`tag-${idx}`} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Milestones */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Milestones
                          </h4>
                          {isAdmin && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setMilestoneFormData({ ...milestoneFormData, projectId: project.id });
                                setMilestoneDialogOpen(true);
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                        {milestones.filter(m => m.projectId === project.id).length === 0 ? (
                          <p className="text-xs text-gray-500 dark:text-gray-400">No milestones yet</p>
                        ) : (
                          <div className="space-y-2">
                            {milestones
                              .filter(m => m.projectId === project.id)
                              .map((milestone: TeamMilestone) => (
                                <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">{milestone.title}</p>
                                      {getMilestoneStatusBadge(milestone.status)}
                                    </div>
                                    {milestone.description && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{milestone.description}</p>
                                    )}
                                    {milestone.dueDate && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  {isAdmin && milestone.status !== 'COMPLETED' && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleUpdateMilestoneStatus(milestone.id, 'COMPLETED')}
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border-l-2 border-blue-500">
                  <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Team created</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">More activity will appear here as the team grows</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join {team.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message">Message (Optional)</Label>
              <Input
                id="message"
                placeholder="Add a personal message..."
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                placeholder="e.g., Moderator, Developer"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRolePermissions.canInvite}
                    onChange={(e) => setNewRolePermissions({
                      ...newRolePermissions,
                      canInvite: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Can invite members</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRolePermissions.canRemove}
                    onChange={(e) => setNewRolePermissions({
                      ...newRolePermissions,
                      canRemove: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Can remove members</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRolePermissions.canManageRoles}
                    onChange={(e) => setNewRolePermissions({
                      ...newRolePermissions,
                      canManageRoles: e.target.checked
                    })}
                    className="rounded"
                  />
                  <span className="text-sm">Can manage roles</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <Dialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToRemove?.user?.firstName} {memberToRemove?.user?.lastName} from the team?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToRemove(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleRemoveMember(memberToRemove?.userId)}
              disabled={removeMemberMutation.isPending}
            >
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role name and color.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Role Name</label>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter role name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Role Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={newRoleColor}
                  onChange={(e) => setNewRoleColor(e.target.value)}
                  className="h-10 w-20 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{newRoleColor}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditRoleDialogOpen(false);
              setRoleToEdit(null);
              setNewRoleName('');
              setNewRoleColor('#6B7280');
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation Dialog */}
      <Dialog open={!!roleToDelete} onOpenChange={() => setRoleToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role "{roleToDelete?.name}"? 
              This role will be removed from all members who have it assigned.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRole}
              disabled={deleteRoleMutation.isPending}
            >
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={assignRoleDialogOpen} onOpenChange={setAssignRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a custom role to {memberToAssignRole?.user?.firstName} {memberToAssignRole?.user?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {memberToAssignRole?.customRoles && memberToAssignRole.customRoles.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Current Roles</label>
                <div className="flex flex-wrap gap-2">
                  {memberToAssignRole.customRoles.map((cr: any) => {
                    const role = cr.customRole || cr;
                    return (
                      <Badge 
                        key={role.id} 
                        style={{ backgroundColor: role.color || '#6B7280', color: 'white' }}
                        className="flex items-center gap-1 pr-1"
                      >
                        <span>{role.name}</span>
                        <button
                          onClick={() => handleRemoveRole(memberToAssignRole.id, role.id)}
                          className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                          disabled={removeRoleMutation.isPending}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Role to Assign</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">-- Choose a role --</option>
                {rolesData?.data
                  ?.filter((role: any) => {
                    const memberRoleIds = memberToAssignRole?.customRoles?.map((cr: any) => 
                      cr.customRole?.id || cr.id
                    ) || [];
                    return !memberRoleIds.includes(role.id);
                  })
                  .map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </select>
              {rolesData?.data?.every((role: any) => {
                const memberRoleIds = memberToAssignRole?.customRoles?.map((cr: any) => 
                  cr.customRole?.id || cr.id
                ) || [];
                return memberRoleIds.includes(role.id);
              }) && rolesData?.data?.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This member already has all available roles.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAssignRoleDialogOpen(false);
              setMemberToAssignRole(null);
              setSelectedRoleId('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleAssignRole} disabled={assignRoleMutation.isPending}>
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add a new project for your team to work on.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-title">Project Title *</Label>
              <Input
                id="project-title"
                value={projectFormData.title}
                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <Label htmlFor="project-short-desc">Short Description</Label>
              <Input
                id="project-short-desc"
                value={projectFormData.shortDescription || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, shortDescription: e.target.value })}
                placeholder="Brief one-liner about the project"
              />
            </div>
            <div>
              <Label htmlFor="project-desc">Description *</Label>
              <textarea
                id="project-desc"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                placeholder="Detailed description of the project"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-category">Category</Label>
                <Input
                  id="project-category"
                  value={projectFormData.category || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                  placeholder="e.g., Web App, Mobile, API"
                />
              </div>
              <div>
                <Label htmlFor="project-duration">Estimated Duration</Label>
                <Input
                  id="project-duration"
                  value={projectFormData.estimatedDuration || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, estimatedDuration: e.target.value })}
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-start">Start Date</Label>
                <Input
                  id="project-start"
                  type="date"
                  value={projectFormData.startDate || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="project-end">End Date</Label>
                <Input
                  id="project-end"
                  type="date"
                  value={projectFormData.endDate || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="project-repo">Repository URL</Label>
              <Input
                id="project-repo"
                value={projectFormData.repositoryUrl || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, repositoryUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label htmlFor="project-live">Live URL</Label>
              <Input
                id="project-live"
                value={projectFormData.liveUrl || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="project-docs">Documentation URL</Label>
              <Input
                id="project-docs"
                value={projectFormData.documentationUrl || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, documentationUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="project-skills">Required Skills (comma-separated)</Label>
              <Input
                id="project-skills"
                value={projectFormData.requiredSkills?.join(', ') || ''}
                onChange={(e) => setProjectFormData({ 
                  ...projectFormData, 
                  requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                })}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <div>
              <Label htmlFor="project-tags">Tags (comma-separated)</Label>
              <Input
                id="project-tags"
                value={projectFormData.tags?.join(', ') || ''}
                onChange={(e) => setProjectFormData({ 
                  ...projectFormData, 
                  tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                })}
                placeholder="frontend, backend, ai"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject} 
              disabled={!projectFormData.title || !projectFormData.description || createProjectMutation.isPending}
            >
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editProjectDialogOpen} onOpenChange={setEditProjectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-project-title">Project Title *</Label>
              <Input
                id="edit-project-title"
                value={projectFormData.title}
                onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <Label htmlFor="edit-project-short-desc">Short Description</Label>
              <Input
                id="edit-project-short-desc"
                value={projectFormData.shortDescription || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, shortDescription: e.target.value })}
                placeholder="Brief one-liner about the project"
              />
            </div>
            <div>
              <Label htmlFor="edit-project-desc">Description *</Label>
              <textarea
                id="edit-project-desc"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                value={projectFormData.description}
                onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                placeholder="Detailed description of the project"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-project-category">Category</Label>
                <Input
                  id="edit-project-category"
                  value={projectFormData.category || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                  placeholder="e.g., Web App, Mobile, API"
                />
              </div>
              <div>
                <Label htmlFor="edit-project-duration">Estimated Duration</Label>
                <Input
                  id="edit-project-duration"
                  value={projectFormData.estimatedDuration || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, estimatedDuration: e.target.value })}
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-project-repo">Repository URL</Label>
              <Input
                id="edit-project-repo"
                value={projectFormData.repositoryUrl || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, repositoryUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label htmlFor="edit-project-live">Live URL</Label>
              <Input
                id="edit-project-live"
                value={projectFormData.liveUrl || ''}
                onChange={(e) => setProjectFormData({ ...projectFormData, liveUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="edit-project-skills">Required Skills (comma-separated)</Label>
              <Input
                id="edit-project-skills"
                value={projectFormData.requiredSkills?.join(', ') || ''}
                onChange={(e) => setProjectFormData({ 
                  ...projectFormData, 
                  requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                })}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>
            <div>
              <Label htmlFor="edit-project-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-project-tags"
                value={projectFormData.tags?.join(', ') || ''}
                onChange={(e) => setProjectFormData({ 
                  ...projectFormData, 
                  tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                })}
                placeholder="frontend, backend, ai"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProject} 
              disabled={!projectFormData.title || !projectFormData.description || updateProjectMutation.isPending}
            >
              Update Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Milestone Dialog */}
      <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Milestone</DialogTitle>
            <DialogDescription>
              Add a new milestone to track project progress.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="milestone-title">Milestone Title *</Label>
              <Input
                id="milestone-title"
                value={milestoneFormData.title}
                onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                placeholder="Enter milestone title"
              />
            </div>
            <div>
              <Label htmlFor="milestone-desc">Description</Label>
              <textarea
                id="milestone-desc"
                className="w-full min-h-[80px] px-3 py-2 border rounded-md"
                value={milestoneFormData.description || ''}
                onChange={(e) => setMilestoneFormData({ ...milestoneFormData, description: e.target.value })}
                placeholder="Describe what needs to be accomplished"
              />
            </div>
            <div>
              <Label htmlFor="milestone-due">Due Date</Label>
              <Input
                id="milestone-due"
                type="date"
                value={milestoneFormData.dueDate || ''}
                onChange={(e) => setMilestoneFormData({ ...milestoneFormData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMilestoneDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateMilestone} 
              disabled={!milestoneFormData.title || createMilestoneMutation.isPending}
            >
              Create Milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
