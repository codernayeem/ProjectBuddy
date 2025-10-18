import { TeamRoleRepository } from '../repositories/TeamRoleRepository';
import { TeamRepository } from '../repositories/TeamRepository';

export class TeamRoleService {
  private teamRoleRepository: TeamRoleRepository;
  private teamRepository: TeamRepository;

  constructor() {
    this.teamRoleRepository = new TeamRoleRepository();
    this.teamRepository = new TeamRepository();
  }

  // Check if user is team admin
  private async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const member = await this.teamRepository.getTeamMember(teamId, userId);
    if (!member) return false;

    // Check if user has ADMIN status
    if (member.status === 'ADMIN') return true;

    // Check if user has any admin role
    const roles = await this.teamRoleRepository.getMemberRoles(member.id);
    return roles.some(r => r.customRole.isAdmin);
  }

  // Get team roles
  async getTeamRoles(teamId: string, userId: string) {
    // Verify user is team member
    const member = await this.teamRepository.getTeamMember(teamId, userId);
    if (!member) {
      throw new Error('You are not a member of this team');
    }

    return this.teamRoleRepository.getTeamRoles(teamId);
  }

  // Create role
  async createRole(
    teamId: string,
    userId: string,
    roleData: {
      name: string;
      description?: string;
      color?: string;
      isAdmin?: boolean;
    }
  ) {
    // Verify user is team admin
    const isAdmin = await this.isTeamAdmin(teamId, userId);
    if (!isAdmin) {
      throw new Error('Only team admins can create roles');
    }

    // Check if role name already exists
    const roles = await this.teamRoleRepository.getTeamRoles(teamId);
    if (roles.some(r => r.name.toLowerCase() === roleData.name.toLowerCase())) {
      throw new Error('A role with this name already exists');
    }

    return this.teamRoleRepository.createRole({
      teamId,
      ...roleData,
    });
  }

  // Update role
  async updateRole(
    roleId: string,
    userId: string,
    updates: {
      name?: string;
      description?: string;
      color?: string;
      isAdmin?: boolean;
    }
  ) {
    const role = await this.teamRoleRepository.getRoleById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Verify user is team admin
    const isAdmin = await this.isTeamAdmin(role.teamId, userId);
    if (!isAdmin) {
      throw new Error('Only team admins can update roles');
    }

    // If updating name, check uniqueness
    if (updates.name) {
      const roles = await this.teamRoleRepository.getTeamRoles(role.teamId);
      if (roles.some(r => r.id !== roleId && r.name.toLowerCase() === updates.name!.toLowerCase())) {
        throw new Error('A role with this name already exists');
      }
    }

    return this.teamRoleRepository.updateRole(roleId, updates);
  }

  // Delete role
  async deleteRole(roleId: string, userId: string) {
    const role = await this.teamRoleRepository.getRoleById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Verify user is team admin
    const isAdmin = await this.isTeamAdmin(role.teamId, userId);
    if (!isAdmin) {
      throw new Error('Only team admins can delete roles');
    }

    // Check if role has members
    if (role.members.length > 0) {
      throw new Error('Cannot delete a role that has members assigned. Please reassign members first.');
    }

    return this.teamRoleRepository.deleteRole(roleId);
  }

  // Assign role to member
  async assignRole(teamId: string, teamMemberId: string, roleId: string, userId: string) {
    // Verify user is team admin
    const isAdmin = await this.isTeamAdmin(teamId, userId);
    if (!isAdmin) {
      throw new Error('Only team admins can assign roles');
    }

    // Verify role exists and belongs to team
    const role = await this.teamRoleRepository.getRoleById(roleId);
    if (!role || role.teamId !== teamId) {
      throw new Error('Role not found in this team');
    }

    // Check if member already has this role
    const memberRoles = await this.teamRoleRepository.getMemberRoles(teamMemberId);
    if (memberRoles.some(r => r.customRoleId === roleId)) {
      throw new Error('Member already has this role');
    }

    return this.teamRoleRepository.assignRoleToMember(teamMemberId, roleId);
  }

  // Remove role from member
  async removeRole(teamId: string, teamMemberId: string, roleId: string, userId: string) {
    // Verify user is team admin
    const isAdmin = await this.isTeamAdmin(teamId, userId);
    if (!isAdmin) {
      throw new Error('Only team admins can remove roles');
    }

    return this.teamRoleRepository.removeRoleFromMember(teamMemberId, roleId);
  }

  // Get member roles
  async getMemberRoles(teamMemberId: string) {
    return this.teamRoleRepository.getMemberRoles(teamMemberId);
  }
}
