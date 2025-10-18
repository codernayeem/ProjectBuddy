import { TeamInvitationRepository } from '../repositories/TeamInvitationRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { InvitationStatus } from '@prisma/client';

interface InviteUserData {
  teamId: string;
  inviterId: string;
  inviteeId?: string;
  email?: string;
  message?: string;
}

interface InvitationFilters {
  status?: InvitationStatus;
  page?: number;
  limit?: number;
}

export class TeamInvitationService {
  private teamInvitationRepository: TeamInvitationRepository;
  private teamRepository: TeamRepository;

  constructor() {
    this.teamInvitationRepository = new TeamInvitationRepository();
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
   * Invite a user to join the team
   */
  async inviteUser(data: InviteUserData) {
    const { teamId, inviterId, inviteeId, email, message } = data;

    // Verify inviter is a member
    const inviter = await this.teamRepository.getTeamMember(teamId, inviterId);
    if (!inviter) {
      throw new Error('You are not a member of this team');
    }

    // Get team details
    const team = await this.teamRepository.findById(teamId, false);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check if invitee is already a member
    if (inviteeId) {
      const existingMember = await this.teamRepository.getTeamMember(
        teamId,
        inviteeId
      );
      if (existingMember) {
        throw new Error('User is already a member of this team');
      }

      // Check for existing pending invitation
      const existingInvitation = await this.teamInvitationRepository.checkInvitationExists(
        teamId,
        inviteeId
      );
      if (existingInvitation) {
        throw new Error('An invitation has already been sent to this user');
      }
    } else if (email) {
      // Check for existing email invitation
      const existingInvitation = await this.teamInvitationRepository.checkInvitationExists(
        teamId,
        undefined,
        email
      );
      if (existingInvitation) {
        throw new Error('An invitation has already been sent to this email');
      }
    } else {
      throw new Error('Either inviteeId or email must be provided');
    }

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.teamInvitationRepository.createInvitation({
      teamId,
      inviterId,
      inviteeId,
      email,
      message,
      expiresAt,
    });
  }

  /**
   * Accept an invitation
   */
  async acceptInvitation(invitationId: string, userId: string) {
    // Get invitation
    const invitation = await this.teamInvitationRepository.getInvitationById(
      invitationId
    );

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Verify the invitation is for this user
    if (invitation.inviteeId !== userId) {
      throw new Error('This invitation is not for you');
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      throw new Error(
        `This invitation has already been ${invitation.status.toLowerCase()}`
      );
    }

    // Check if invitation has expired
    if (invitation.expiresAt && new Date(invitation.expiresAt) < new Date()) {
      await this.teamInvitationRepository.updateInvitation(
        invitationId,
        'EXPIRED'
      );
      throw new Error('This invitation has expired');
    }

    // Check if user is already a member
    const existingMember = await this.teamRepository.getTeamMember(
      invitation.teamId,
      userId
    );
    if (existingMember) {
      throw new Error('You are already a member of this team');
    }

    // Accept the invitation
    await this.teamInvitationRepository.updateInvitation(
      invitationId,
      'ACCEPTED'
    );

    // Add user to team as member
    return this.teamRepository.addMember(
      invitation.teamId,
      userId,
      'MEMBER'
    );
  }

  /**
   * Decline an invitation
   */
  async declineInvitation(invitationId: string, userId: string) {
    // Get invitation
    const invitation = await this.teamInvitationRepository.getInvitationById(
      invitationId
    );

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Verify the invitation is for this user
    if (invitation.inviteeId !== userId) {
      throw new Error('This invitation is not for you');
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      throw new Error(
        `This invitation has already been ${invitation.status.toLowerCase()}`
      );
    }

    // Decline the invitation
    return this.teamInvitationRepository.updateInvitation(
      invitationId,
      'DECLINED'
    );
  }

  /**
   * Cancel an invitation (by inviter or admin)
   */
  async cancelInvitation(invitationId: string, userId: string) {
    // Get invitation
    const invitation = await this.teamInvitationRepository.getInvitationById(
      invitationId
    );

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Check if user is the inviter or a team admin
    const isInviter = invitation.inviterId === userId;
    const isAdmin = await this.isTeamAdmin(invitation.teamId, userId);

    if (!isInviter && !isAdmin) {
      throw new Error(
        'Only the inviter or team admins can cancel this invitation'
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      throw new Error(
        `This invitation has already been ${invitation.status.toLowerCase()}`
      );
    }

    // Cancel the invitation
    return this.teamInvitationRepository.deleteInvitation(invitationId);
  }

  /**
   * Get team invitations (for team admins)
   */
  async getTeamInvitations(
    teamId: string,
    userId: string,
    filters: InvitationFilters = {}
  ) {
    // Verify user is a team member
    const member = await this.teamRepository.getTeamMember(teamId, userId);
    if (!member) {
      throw new Error('You are not a member of this team');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    return this.teamInvitationRepository.getTeamInvitations(
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
   * Get user's invitations
   */
  async getUserInvitations(userId: string, filters: InvitationFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    return this.teamInvitationRepository.getUserInvitations(
      userId,
      filters.status,
      {
        page,
        limit,
        skip: (page - 1) * limit,
      }
    );
  }

  /**
   * Resend an invitation (create a new one)
   */
  async resendInvitation(invitationId: string, userId: string) {
    // Get original invitation
    const invitation = await this.teamInvitationRepository.getInvitationById(
      invitationId
    );

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    // Check if user is the inviter or a team admin
    const isInviter = invitation.inviterId === userId;
    const isAdmin = await this.isTeamAdmin(invitation.teamId, userId);

    if (!isInviter && !isAdmin) {
      throw new Error(
        'Only the inviter or team admins can resend this invitation'
      );
    }

    // Delete old invitation
    await this.teamInvitationRepository.deleteInvitation(invitationId);

    // Create new invitation with same details
    return this.inviteUser({
      teamId: invitation.teamId,
      inviterId: userId,
      inviteeId: invitation.inviteeId || undefined,
      email: invitation.email || undefined,
      message: invitation.message || undefined,
    });
  }
}
