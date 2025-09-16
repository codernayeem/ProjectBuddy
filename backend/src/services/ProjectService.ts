import { Project, ProjectMember } from '@prisma/client';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { UserRepository } from '../repositories/UserRepository';
import { PaginationParams, SearchParams } from '../types';

export class ProjectService {
  private projectRepository: ProjectRepository;
  private userRepository: UserRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.userRepository = new UserRepository();
  }

  async createProject(
    ownerId: string,
    projectData: {
      title: string;
      description: string;
      startDate?: Date;
      endDate?: Date;
      isPublic?: boolean;
      tags?: string[];
    }
  ): Promise<Project> {
    const project = await this.projectRepository.create({
      title: projectData.title,
      description: projectData.description,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      isPublic: projectData.isPublic ?? true,
      tags: projectData.tags || [],
      owner: {
        connect: { id: ownerId },
      },
    });

    return project;
  }

  async getProjectById(id: string, userId?: string): Promise<Project | null> {
    const project = await this.projectRepository.findById(id);
    
    if (!project) return null;

    // Check if user has access to private projects
    if (!project.isPublic && userId) {
      const isOwner = await this.projectRepository.isOwner(id, userId);
      const isMember = await this.projectRepository.isMember(id, userId);
      
      if (!isOwner && !isMember) {
        return null;
      }
    } else if (!project.isPublic && !userId) {
      return null;
    }

    return project;
  }

  async updateProject(
    id: string,
    userId: string,
    updateData: {
      title?: string;
      description?: string;
      status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
      startDate?: Date;
      endDate?: Date;
      isPublic?: boolean;
      tags?: string[];
    }
  ): Promise<Project> {
    // Check if user is owner or admin
    const isOwner = await this.projectRepository.isOwner(id, userId);
    const memberRole = await this.projectRepository.getMemberRole(id, userId);
    
    if (!isOwner && memberRole !== 'ADMIN') {
      throw new Error('Insufficient permissions to update project');
    }

    return this.projectRepository.update(id, updateData);
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    // Only project owner can delete
    const isOwner = await this.projectRepository.isOwner(id, userId);
    
    if (!isOwner) {
      throw new Error('Only project owner can delete project');
    }

    await this.projectRepository.delete(id);
  }

  async searchProjects(
    params: SearchParams & PaginationParams,
    userId?: string
  ): Promise<{ projects: Project[]; total: number }> {
    return this.projectRepository.search(params, userId);
  }

  async getUserProjects(
    userId: string,
    params: PaginationParams
  ): Promise<{ projects: Project[]; total: number }> {
    return this.projectRepository.getUserProjects(userId, params);
  }

  async inviteToProject(
    projectId: string,
    inviterId: string,
    inviteeId: string,
    role: 'ADMIN' | 'MEMBER' | 'VIEWER' = 'MEMBER'
  ): Promise<ProjectMember> {
    // Check if inviter has permission to invite
    const isOwner = await this.projectRepository.isOwner(projectId, inviterId);
    const inviterRole = await this.projectRepository.getMemberRole(projectId, inviterId);
    
    if (!isOwner && inviterRole !== 'ADMIN') {
      throw new Error('Insufficient permissions to invite members');
    }

    // Check if user is already a member
    const isMember = await this.projectRepository.isMember(projectId, inviteeId);
    if (isMember) {
      throw new Error('User is already a member of this project');
    }

    // Check if invitee exists
    const invitee = await this.userRepository.findById(inviteeId);
    if (!invitee) {
      throw new Error('User not found');
    }

    return this.projectRepository.addMember(projectId, inviteeId, role);
  }

  async removeFromProject(
    projectId: string,
    removerId: string,
    memberId: string
  ): Promise<void> {
    // Check permissions
    const isOwner = await this.projectRepository.isOwner(projectId, removerId);
    const removerRole = await this.projectRepository.getMemberRole(projectId, removerId);
    
    if (!isOwner && removerRole !== 'ADMIN' && removerId !== memberId) {
      throw new Error('Insufficient permissions to remove member');
    }

    // Owner cannot be removed
    const isMemberOwner = await this.projectRepository.isOwner(projectId, memberId);
    if (isMemberOwner) {
      throw new Error('Project owner cannot be removed');
    }

    await this.projectRepository.removeMember(projectId, memberId);
  }

  async updateMemberRole(
    projectId: string,
    updaterId: string,
    memberId: string,
    newRole: 'ADMIN' | 'MEMBER' | 'VIEWER'
  ): Promise<ProjectMember> {
    // Only owner can update roles
    const isOwner = await this.projectRepository.isOwner(projectId, updaterId);
    
    if (!isOwner) {
      throw new Error('Only project owner can update member roles');
    }

    // Cannot update owner's role
    const isMemberOwner = await this.projectRepository.isOwner(projectId, memberId);
    if (isMemberOwner) {
      throw new Error('Cannot update project owner role');
    }

    return this.projectRepository.updateMemberRole(projectId, memberId, newRole);
  }

  async getProjectMembers(projectId: string, userId: string): Promise<ProjectMember[]> {
    // Check if user has access to view members
    const isOwner = await this.projectRepository.isOwner(projectId, userId);
    const isMember = await this.projectRepository.isMember(projectId, userId);
    
    if (!isOwner && !isMember) {
      throw new Error('Access denied');
    }

    const project = await this.projectRepository.findById(projectId);
    return (project as any)?.members || [];
  }
}