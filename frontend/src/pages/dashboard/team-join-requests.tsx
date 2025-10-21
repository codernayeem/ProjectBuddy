import { useParams, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Check, X, Clock, User } from 'lucide-react';
import { useTeam } from '@/hooks/useTeams';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function TeamJoinRequestsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: teamData, isLoading } = useTeam(teamId!);

  const team = teamData?.data;

  // Mock join requests data (replace with actual API call)
  const joinRequests: any[] = [
    // Will be populated from API
  ];

  const handleApprove = async (_requestId: string) => {
    // TODO: Call API to approve join request
    toast.success('Join request approved');
  };

  const handleReject = async (_requestId: string) => {
    // TODO: Call API to reject join request
    toast.success('Join request rejected');
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <h1 className="text-3xl font-bold text-gray-900">Join Requests</h1>
            <p className="text-gray-600 mt-2">
              Review and manage requests to join {team.name}
            </p>
          </div>
        </div>
      </div>

      {/* Join Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests ({joinRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {joinRequests.length > 0 ? (
            <div className="space-y-4">
              {joinRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.user?.avatar} />
                      <AvatarFallback>
                        {request.user?.firstName?.[0]}{request.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">
                          {request.user?.firstName} {request.user?.lastName}
                        </p>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">@{request.user?.username}</p>
                      {request.message && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}
                      {request.user?.bio && (
                        <p className="text-sm text-gray-500 mt-2">{request.user.bio}</p>
                      )}
                      {request.user?.skills && request.user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {request.user.skills.slice(0, 5).map((skill: string) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(request.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">
                When users request to join your team, they'll appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions Card */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">About Join Requests</h4>
              <p className="text-sm text-blue-800">
                Join requests are submitted by users who want to join your team. 
                Review their profile and approve or reject based on your team's needs.
                Approved members will be added to the team immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
