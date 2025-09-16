import { Project, ProjectMember, Prisma, ProjectMemberRole } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, SearchParams } from '../types';

export class ProjectRepository {
  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return prisma.project.create({ data });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
        milestones: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            members: true,
            milestones: true,
            posts: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }

  async search(
    params: SearchParams & PaginationParams,
    userId?: string
  ): Promise<{ projects: Project[]; total: number }> {
    const where: Prisma.ProjectWhereInput = {
      AND: [
        params.query
          ? {
              OR: [
                { title: { contains: params.query, mode: 'insensitive' } },
                { description: { contains: params.query, mode: 'insensitive' } },
                { tags: { hasSome: [params.query] } },
              ],
            }
          : {},
        userId
          ? {
              OR: [
                { isPublic: true },
                { ownerId: userId },
                { members: { some: { userId } } },
              ],
            }
          : { isPublic: true },
      ],
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              milestones: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  async getUserProjects(
    userId: string,
    params: PaginationParams
  ): Promise<{ projects: Project[]; total: number }> {
    const where: Prisma.ProjectWhereInput = {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          members: {
            where: { userId },
            select: { role: true },
          },
          _count: {
            select: {
              members: true,
              milestones: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }

  async addMember(projectId: string, userId: string, role: ProjectMemberRole = 'DEVELOPER'): Promise<ProjectMember> {
    return prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
    });
  }

  async removeMember(projectId: string, userId: string): Promise<ProjectMember> {
    return prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async updateMemberRole(projectId: string, userId: string, role: ProjectMemberRole): Promise<ProjectMember> {
    return prisma.projectMember.update({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      data: { role },
    });
  }

  async getMemberRole(projectId: string, userId: string): Promise<string | null> {
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: { role: true },
    });

    return member?.role || null;
  }

  async isMember(projectId: string, userId: string): Promise<boolean> {
    const count = await prisma.projectMember.count({
      where: {
        projectId,
        userId,
      },
    });

    return count > 0;
  }

  async isOwner(projectId: string, userId: string): Promise<boolean> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    return project?.ownerId === userId;
  }
}