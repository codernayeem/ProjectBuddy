import { prisma } from '../config/database';
import { PaginationParams } from '../types';

type AIRecommendation = {
  id: string;
  type: 'USER' | 'PROJECT';
  userId: string;
  targetId: string;
  score: number;
  reason: string;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
};

export class AIRecommendationRepository {
  async create(data: {
    type: 'USER' | 'PROJECT';
    userId: string;
    targetId: string;
    score: number;
    reason: string;
    isActive?: boolean;
    expiresAt?: Date;
  }): Promise<AIRecommendation> {
    return prisma.aIRecommendation.create({ data }) as Promise<AIRecommendation>;
  }

  async findById(id: string): Promise<AIRecommendation | null> {
    return prisma.aIRecommendation.findUnique({
      where: { id },
    }) as Promise<AIRecommendation | null>;
  }

  async findByUserAndTarget(
    userId: string,
    targetId: string,
    type: 'USER' | 'PROJECT'
  ): Promise<AIRecommendation | null> {
    return prisma.aIRecommendation.findUnique({
      where: {
        userId_targetId_type: {
          userId,
          targetId,
          type,
        },
      },
    }) as Promise<AIRecommendation | null>;
  }

  async getUserRecommendations(
    userId: string,
    type: 'USER' | 'PROJECT',
    params: PaginationParams
  ): Promise<{ recommendations: AIRecommendation[]; total: number }> {
    const where = {
      userId,
      type,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    const [recommendations, total] = await Promise.all([
      prisma.aIRecommendation.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy: { score: 'desc' },
      }),
      prisma.aIRecommendation.count({ where }),
    ]);

    return { recommendations: recommendations as AIRecommendation[], total };
  }

  async deactivate(id: string): Promise<AIRecommendation> {
    return prisma.aIRecommendation.update({
      where: { id },
      data: { isActive: false },
    }) as Promise<AIRecommendation>;
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.aIRecommendation.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  async updateScore(id: string, score: number): Promise<AIRecommendation> {
    return prisma.aIRecommendation.update({
      where: { id },
      data: { score },
    }) as Promise<AIRecommendation>;
  }
}