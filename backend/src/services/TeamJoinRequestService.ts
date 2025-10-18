import { TeamJoinRequestRepository } from '../repositories/TeamJoinRequestRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { JoinRequestStatus } from '@prisma/client';

interface CreateRequestData {
  teamId: string;
  userId: string;
  message?: string;
}

interface RequestFilters {
  status?: JoinRequestStatus;
  page?: number;
  limit?: number;
}

export class TeamJoinRequestService {
  private teamJoinRequestRepository: TeamJoinRequestRepository;
  private teamRepository: TeamRepository;

  constructor() {
    this.teamJoinRequestRepository = new TeamJoinRequestRepository();
    this.teamRepository = new TeamRepository();
  }

  /**
   * Check if user is team admin or has admin role
   */
  private async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const member = await this.teamRepository.getTeamMember(teamId, userId);
    if (!member) return false;

    // Check if member is team admin
    if (member.status === 'ADMIN') return true;

    // Check if member has any admin role
    const hasAdminRole = member.customRoles?.some(
      (mr) => mr.customRole.isAdmin
    );
    return hasAdminRole || false;
  }

  /**
   * Create a join request for a public team
   */
  async createRequest(data: CreateRequestData) {
    const { teamId, userId, message } = data;

    // Get team details
    const team = await this.teamRepository.findById(teamId, false);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check if team allows join requests
    if (!team.allowJoinRequests) {
      throw new Error('This team does not accept join requests');
    }

    // Check if team is public or allows join requests
    if (team.visibility === 'PRIVATE') {
      throw new Error('You cannot request to join a private team');
    }

    // Check if user is already a member
    const existingMember = await this.teamRepository.getTeamMember(
      teamId,
      userId
    );
    if (existingMember) {
      throw new Error('You are already a member of this team');
    }

    // Check for existing pending request
    const existingRequest = await this.teamJoinRequestRepository.checkRequestExists(
      teamId,
      userId
    );
    if (existingRequest) {
      throw new Error('You already have a pending request for this team');
    }

    // Create the join request
    return this.teamJoinRequestRepository.createRequest({
      teamId,
      userId,
      message,
    });
  }

  /**
   * Accept a join request (admin only)
   */
  async acceptRequest(requestId: string, adminUserId: string) {
    // Get the request
    const request = await this.teamJoinRequestRepository.getRequestById(
      requestId
    );

    if (!request) {
      throw new Error('Join request not found');
    }

    // Check if request is still pending
    if (request.status !== 'PENDING') {
      throw new Error(
        `This request has already been ${request.status.toLowerCase()}`
      );
    }

    // Check if admin has permission
    const isAdmin = await this.isTeamAdmin(request.teamId, adminUserId);
    if (!isAdmin) {
      throw new Error('Only team admins can accept join requests');
    }

    // Check if user is already a member (race condition prevention)
    const existingMember = await this.teamRepository.getTeamMember(
      request.teamId,
      request.userId
    );
    if (existingMember) {
      throw new Error('User is already a member of this team');
    }

    // Accept the request
    await this.teamJoinRequestRepository.updateRequest(requestId, 'ACCEPTED');

    // Add user to team as member
    return this.teamRepository.addMember(
      request.teamId,
      request.userId,
      'MEMBER'
    );
  }

  /**
   * Reject a join request (admin only)
   */
  async rejectRequest(requestId: string, adminUserId: string) {
    // Get the request
    const request = await this.teamJoinRequestRepository.getRequestById(
      requestId
    );

    if (!request) {
      throw new Error('Join request not found');
    }

    // Check if request is still pending
    if (request.status !== 'PENDING') {
      throw new Error(
        `This request has already been ${request.status.toLowerCase()}`
      );
    }

    // Check if admin has permission
    const isAdmin = await this.isTeamAdmin(request.teamId, adminUserId);
    if (!isAdmin) {
      throw new Error('Only team admins can reject join requests');
    }

    // Reject the request
    return this.teamJoinRequestRepository.updateRequest(requestId, 'DECLINED');
  }

  /**
   * Cancel a join request (by requester)
   */
  async cancelRequest(requestId: string, userId: string) {
    // Get the request
    const request = await this.teamJoinRequestRepository.getRequestById(
      requestId
    );

    if (!request) {
      throw new Error('Join request not found');
    }

    // Verify the request is from this user
    if (request.userId !== userId) {
      throw new Error('You can only cancel your own join requests');
    }

    // Check if request is still pending
    if (request.status !== 'PENDING') {
      throw new Error(
        `This request has already been ${request.status.toLowerCase()}`
      );
    }

    // Cancel the request by deleting it
    return this.teamJoinRequestRepository.deleteRequest(requestId);
  }

  /**
   * Get join requests for a team (admin only)
   */
  async getTeamRequests(
    teamId: string,
    userId: string,
    filters: RequestFilters = {}
  ) {
    // Verify user is a team admin
    const isAdmin = await this.isTeamAdmin(teamId, userId);
    if (!isAdmin) {
      throw new Error('Only team admins can view join requests');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return this.teamJoinRequestRepository.getTeamRequests(
      teamId,
      filters.status,
      {
        page,
        limit,
        skip: (page - 1) * limit,
      }
    );
  }

  /**
   * Get user's join requests
   */
  async getUserRequests(userId: string, filters: RequestFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    return this.teamJoinRequestRepository.getUserRequests(userId, filters.status, {
      page,
      limit,
      skip: (page - 1) * limit,
    });
  }

  /**
   * Get pending requests count for a team
   */
  async getPendingCount(teamId: string, userId: string): Promise<number> {
    // Verify user is a team member
    const member = await this.teamRepository.getTeamMember(teamId, userId);
    if (!member) {
      throw new Error('You are not a member of this team');
    }

    return this.teamJoinRequestRepository.getPendingCount(teamId);
  }
}
