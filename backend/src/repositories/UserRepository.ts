import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, SearchParams } from '../types';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
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
    params: SearchParams & PaginationParams
  ): Promise<{ users: Partial<User>[]; total: number }> {
    const where: Prisma.UserWhereInput = params.query
      ? {
          OR: [
            { firstName: { contains: params.query, mode: 'insensitive' } },
            { lastName: { contains: params.query, mode: 'insensitive' } },
            { username: { contains: params.query, mode: 'insensitive' } },
            { email: { contains: params.query, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          bio: true,
          avatar: true,
          isVerified: true,
          createdAt: true,
        },
        skip: params.skip,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' },
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
}