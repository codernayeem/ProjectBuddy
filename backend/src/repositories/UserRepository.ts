import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, SearchParams, UserFilters } from '../types';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string, includeDetails = false): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: includeDetails ? {
        teamMemberships: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                avatar: true,
                visibility: true,
              },
            },
          },
        },
        ownedTeams: {
          select: {
            id: true,
            name: true,
            avatar: true,
            memberCount: true,
          },
        },
        teamFollows: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            sentConnections: true,
            receivedConnections: true,
            followers: true,
            following: true,
            teamMemberships: true,
            ownedTeams: true,
            posts: true,
          },
        },
      } : undefined,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async search(
    params: SearchParams & PaginationParams & { filters?: UserFilters }
  ): Promise<{ users: Partial<User>[]; total: number }> {
    const where: Prisma.UserWhereInput = {
      AND: [
        params.query
          ? {
              OR: [
                { firstName: { contains: params.query, mode: 'insensitive' } },
                { lastName: { contains: params.query, mode: 'insensitive' } },
                { username: { contains: params.query, mode: 'insensitive' } },
                { bio: { contains: params.query, mode: 'insensitive' } },
                { skills: { hasSome: [params.query] } },
                { interests: { hasSome: [params.query] } },
              ],
            }
          : {},
        params.filters?.userType ? { userType: params.filters.userType } : {},
        params.filters?.country ? { country: params.filters.country } : {},
        params.filters?.city ? { city: params.filters.city } : {},
        params.filters?.skills ? { skills: { hasSome: params.filters.skills } } : {},
        params.filters?.isActive !== undefined ? { isActive: params.filters.isActive } : {},
        { isActive: true }, // Only show active users
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatar: true,
          country: true,
          city: true,
          userType: true,
          skills: true,
          interests: true,
          company: true,
          position: true,
          createdAt: true,
          _count: {
            select: {
              followers: true,
              following: true,
              teamMemberships: true,
              ownedTeams: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async getRecommendedUsers(
    userId: string,
    params: PaginationParams
  ): Promise<{ users: Partial<User>[]; total: number }> {
    // Get current user's skills and interests for recommendations
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { skills: true, interests: true, country: true, city: true },
    });

    if (!currentUser) {
      return { users: [], total: 0 };
    }

    const where: Prisma.UserWhereInput = {
      AND: [
        { id: { not: userId } }, // Exclude current user
        { isActive: true },
        {
          OR: [
            // Users with similar skills
            currentUser.skills.length > 0 ? { skills: { hasSome: currentUser.skills } } : {},
            // Users with similar interests
            currentUser.interests.length > 0 ? { interests: { hasSome: currentUser.interests } } : {},
            // Users from same location
            currentUser.country ? { country: currentUser.country } : {},
          ],
        },
        // Exclude users already connected
        {
          sentConnections: {
            none: {
              receiverId: userId,
            },
          },
        },
        {
          receivedConnections: {
            none: {
              senderId: userId,
            },
          },
        },
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatar: true,
          country: true,
          city: true,
          userType: true,
          skills: true,
          interests: true,
          company: true,
          position: true,
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) return true;
    if (excludeUserId && user.id === excludeUserId) return true;
    
    return false;
  }

  async isEmailAvailable(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) return true;
    if (excludeUserId && user.id === excludeUserId) return true;
    
    return false;
  }

  // Social features
  async getUserConnections(userId: string, type: 'sent' | 'received' | 'accepted' = 'accepted'): Promise<any[]> {
    if (type === 'sent') {
      return prisma.connection.findMany({
        where: { senderId: userId },
        include: {
          receiver: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (type === 'received') {
      return prisma.connection.findMany({
        where: { receiverId: userId, status: 'PENDING' },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // accepted connections
    return prisma.connection.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getUserFollowers(userId: string, params: PaginationParams): Promise<{ users: Partial<User>[]; total: number }> {
    const where = {
      following: {
        some: {
          followingId: userId,
        },
      },
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          country: true,
          city: true,
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async getUserFollowing(userId: string, params: PaginationParams): Promise<{ users: Partial<User>[]; total: number }> {
    const where = {
      followers: {
        some: {
          followerId: userId,
        },
      },
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
          country: true,
          city: true,
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }
}