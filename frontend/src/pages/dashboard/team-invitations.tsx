import { useParams, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Send, Clock, Check, X, AlertCircle } from 'lucide-react';
import { useTeam } from '@/hooks/useTeams';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function TeamInvitationsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: teamData, isLoading } = useTeam(teamId!);

  const team = teamData?.data;

  // Mock invitations data (replace with actual API call)
  const pendingInvitations: any[] = [];
  const acceptedInvitations: any[] = [];
  const declinedInvitations: any[] = [];

  const handleResend = async (_invitationId: string) => {
    // TODO: Call API to resend invitation
    toast.success('Invitation resent');
  };

  const handleCancel = async (_invitationId: string) => {
    // TODO: Call API to cancel invitation
    toast.success('Invitation cancelled');
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
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team not found</h3>
            <p className="text-gray-600 mb-4">
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

  const renderInvitationCard = (invitation: any, status: 'pending' | 'accepted' | 'declined') => (
    <div
      key={invitation.id}
      className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-start space-x-4 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarImage src={invitation.invitee?.avatar} />
          <AvatarFallback>
            {invitation.invitee?.firstName?.[0]}{invitation.invitee?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="font-semibold">
              {invitation.invitee?.firstName} {invitation.invitee?.lastName}
            </p>
            {status === 'pending' && (
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
            {status === 'accepted' && (
              <Badge variant="default" className="bg-green-500">
                <Check className="w-3 h-3 mr-1" />
                Accepted
              </Badge>
            )}
            {status === 'declined' && (
              <Badge variant="destructive">
                <X className="w-3 h-3 mr-1" />
                Declined
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{invitation.invitee?.email}</p>
          <p className="text-xs text-gray-500 mt-1">
            Sent {formatDistanceToNow(new Date(invitation.createdAt), { addSuffix: true })}
            {invitation.invitedBy && ` by ${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`}
          </p>
          {invitation.message && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{invitation.message}</p>
            </div>
          )}
        </div>
      </div>

      {status === 'pending' && (
        <div className="flex space-x-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResend(invitation.id)}
          >
            <Send className="w-4 h-4 mr-1" />
            Resend
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleCancel(invitation.id)}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/dashboard/teams/${teamId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {team.name}
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Invitations</h1>
            <p className="text-gray-600 mt-2">
              Manage invitations sent to join {team.name}
            </p>
          </div>
        </div>
      </div>

      {/* Invitations Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="declined">
            Declined ({declinedInvitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingInvitations.length > 0 ? (
                <div className="space-y-3">
                  {pendingInvitations.map((invitation) =>
                    renderInvitationCard(invitation, 'pending')
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No pending invitations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Invitations you send will appear here until they're accepted or declined.
                  </p>
                  <Button asChild>
                    <Link to={`/dashboard/teams/${teamId}`}>
                      Go back and invite members
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accepted Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              {acceptedInvitations.length > 0 ? (
                <div className="space-y-3">
                  {acceptedInvitations.map((invitation) =>
                    renderInvitationCard(invitation, 'accepted')
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Check className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No accepted invitations yet
                  </h3>
                  <p className="text-gray-600">
                    Invitations that have been accepted will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declined" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Declined Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              {declinedInvitations.length > 0 ? (
                <div className="space-y-3">
                  {declinedInvitations.map((invitation) =>
                    renderInvitationCard(invitation, 'declined')
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <X className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No declined invitations
                  </h3>
                  <p className="text-gray-600">
                    Invitations that have been declined will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">About Invitations</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Pending invitations will expire after 7 days if not responded to</li>
                <li>You can resend invitations to remind users</li>
                <li>Accepted invitations mean the user has joined your team</li>
                <li>Declined invitations can be sent again after 30 days</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
