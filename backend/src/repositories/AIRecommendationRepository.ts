import { AIRecommendation, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams } from '../types';

export class AIRecommendationRepository {
  async create(data: Prisma.AIRecommendationCreateInput): Promise<AIRecommendation> {
    return prisma.aIRecommendation.create({
      data,
    });
  }

  async findById(id: string): Promise<AIRecommendation | null> {
    return prisma.aIRecommendation.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.AIRecommendationUpdateInput): Promise<AIRecommendation> {
    return prisma.aIRecommendation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<AIRecommendation> {
    return prisma.aIRecommendation.delete({
      where: { id },
    });
  }

  async getUserRecommendations(
    userId: string,
    type?: 'USER' | 'TEAM' | 'POST' | 'SKILL' | 'HASHTAG',
    params?: PaginationParams
  ): Promise<{ recommendations: AIRecommendation[]; total: number }> {
    const where = {
      userId,
      isActive: true,
      ...(type && { type }),
      expiresAt: {
        gte: new Date(), // Only active, non-expired recommendations
      },
    };

    const [recommendations, total] = await Promise.all([
      prisma.aIRecommendation.findMany({
        where,
        ...(params && {
          skip: params.skip,
          take: params.limit,
        }),
        orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.aIRecommendation.count({ where }),
    ]);

    return { recommendations, total };
  }

  async markAsClicked(id: string): Promise<AIRecommendation> {
    return prisma.aIRecommendation.update({
      where: { id },
      data: { isClicked: true },
    });
  }

  async markAsDismissed(id: string): Promise<AIRecommendation> {
    return prisma.aIRecommendation.update({
      where: { id },
      data: { isDismissed: true, isActive: false },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.aIRecommendation.deleteMany({
      where: {
        OR: [
          {
            expiresAt: {
              lt: new Date(),
            },
          },
          {
            isDismissed: true,
            createdAt: {
              lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days old dismissed
            },
          },
        ],
      },
    });

    return result.count;
  }

  async updateRecommendationScore(id: string, score: number): Promise<AIRecommendation> {
    return prisma.aIRecommendation.update({
      where: { id },
      data: { score },
    });
  }

  async bulkCreate(recommendations: any[]): Promise<void> {
    await prisma.aIRecommendation.createMany({
      data: recommendations,
      skipDuplicates: true, // Avoid duplicate recommendations
    });
  }

  async refreshUserRecommendations(
    userId: string,
    type: 'USER' | 'TEAM' | 'POST' | 'SKILL' | 'HASHTAG'
  ): Promise<void> {
    // Delete existing recommendations of this type that are older than 24 hours
    await prisma.aIRecommendation.deleteMany({
      where: {
        userId,
        type,
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    // Note: In a real implementation, this would trigger ML/AI recommendation generation
    // The AI service would analyze user behavior, preferences, connections, team memberships
    // and generate personalized recommendations
  }

  async generateTeamRecommendations(userId: string): Promise<void> {
    // Get user data for team recommendations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        skills: true,
        interests: true,
        country: true,
        city: true,
        userType: true,
      },
    });

    if (!user) return;

    // Find teams that match user's skills and interests
    const recommendedTeams = await prisma.team.findMany({
      where: {
        visibility: 'PUBLIC',
        isRecruiting: true,
        OR: [
          { skills: { hasSome: user.skills } },
          { tags: { hasSome: user.interests } },
          { country: user.country },
        ],
        members: {
          none: {
            userId,
          },
        },
        followers: {
          none: {
            userId,
          },
        },
      },
      take: 10,
      orderBy: { memberCount: 'desc' },
    });

    // Create recommendations
    const recommendations: any[] = recommendedTeams.map(
      (team, index) => ({
        type: 'TEAM',
        userId,
        targetId: team.id,
        score: 1 - index * 0.1, // Decreasing score
        reason: `Team matches your skills: ${team.skills.filter(skill => 
          user.skills.includes(skill)
        ).join(', ')}`,
        metadata: {
          teamName: team.name,
          matchingSkills: team.skills.filter(skill => user.skills.includes(skill)),
          teamType: team.type,
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      })
    );

    if (recommendations.length > 0) {
      await this.bulkCreate(recommendations);
    }
  }

  async generateUserRecommendations(userId: string): Promise<void> {
    // Get user data and connections
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        skills: true,
        interests: true,
        country: true,
        city: true,
        userType: true,
        sentConnections: {
          select: { receiverId: true },
        },
        receivedConnections: {
          select: { senderId: true },
        },
      },
    });

    if (!user) return;

    // Get IDs of users already connected
    const connectedUserIds = [
      ...user.sentConnections.map(c => c.receiverId),
      ...user.receivedConnections.map(c => c.senderId),
    ];

    // Find users with similar skills/interests
    const recommendedUsers = await prisma.user.findMany({
      where: {
        id: { not: userId, notIn: connectedUserIds },
        isActive: true,
        OR: [
          { skills: { hasSome: user.skills } },
          { interests: { hasSome: user.interests } },
          { country: user.country },
          { userType: user.userType },
        ],
      },
      take: 10,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        skills: true,
        interests: true,
      },
    });

    // Create recommendations
    const recommendations: any[] = recommendedUsers.map(
      (recommendedUser, index) => ({
        type: 'USER',
        userId,
        targetId: recommendedUser.id,
        score: 1 - index * 0.1,
        reason: `Similar skills and interests`,
        metadata: {
          username: recommendedUser.username,
          name: `${recommendedUser.firstName} ${recommendedUser.lastName}`,
          commonSkills: recommendedUser.skills.filter(skill => 
            user.skills.includes(skill)
          ),
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
    );

    if (recommendations.length > 0) {
      await this.bulkCreate(recommendations);
    }
  }

  async getRecommendationStats(userId: string): Promise<{
    total: number;
    byType: Record<string, number>;
    clicked: number;
    dismissed: number;
  }> {
    const [total, byType, clicked, dismissed] = await Promise.all([
      prisma.aIRecommendation.count({
        where: { userId, isActive: true },
      }),
      prisma.aIRecommendation.groupBy({
        by: ['type'],
        where: { userId, isActive: true },
        _count: { type: true },
      }),
      prisma.aIRecommendation.count({
        where: { userId, isClicked: true },
      }),
      prisma.aIRecommendation.count({
        where: { userId, isDismissed: true },
      }),
    ]);

    const typeStats = byType.reduce((acc, curr) => {
      acc[curr.type] = curr._count.type;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byType: typeStats,
      clicked,
      dismissed,
    };
  }
}