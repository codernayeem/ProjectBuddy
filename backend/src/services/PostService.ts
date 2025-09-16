import { PrismaClient, Post, Comment, Reaction, Share, PostType, ReactionType } from '@prisma/client';

export interface CreatePostData {
  content: string;
  type?: PostType;
  projectId?: string;
  teamId?: string;
  media?: string[];
  tags?: string[];
}

export interface UpdatePostData {
  content?: string;
  media?: string[];
  tags?: string[];
}

export interface PostFilters {
  page: number;
  limit: number;
  type?: PostType;
  authorId?: string;
  projectId?: string;
  teamId?: string;
  search?: string;
}

export interface FeedOptions {
  page: number;
  limit: number;
}

export interface TrendingOptions {
  page: number;
  limit: number;
  timeframe: string;
}

export class PostService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createPost(authorId: string, data: CreatePostData): Promise<Post> {
    return await this.prisma.post.create({
      data: {
        ...data,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        },
        team: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            shares: true
          }
        }
      }
    });
  }

  async getPosts(filters: PostFilters) {
    const { page, limit, type, authorId, projectId, teamId, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (teamId) {
      where.teamId = teamId;
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              title: true
            }
          },
          team: {
            select: {
              id: true,
              name: true
            }
          },
          reactions: {
            select: {
              id: true,
              type: true,
              userId: true
            }
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              shares: true
            }
          }
        }
      }),
      this.prisma.post.count({ where })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPostById(postId: string) {
    return await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        team: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        shares: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            shares: true
          }
        }
      }
    });
  }

  async updatePost(postId: string, userId: string, data: UpdatePostData): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('You can only update your own posts');
    }

    return await this.prisma.post.update({
      where: { id: postId },
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true,
            shares: true
          }
        }
      }
    });
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    if (post.authorId !== userId) {
      throw new Error('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id: postId }
    });
  }

  async reactToPost(postId: string, userId: string, type: ReactionType): Promise<Reaction> {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user already reacted
    const existingReaction = await this.prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingReaction) {
      // Update existing reaction
      return await this.prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
    } else {
      // Create new reaction
      return await this.prisma.reaction.create({
        data: {
          type,
          userId,
          postId
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });
    }
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    const reaction = await this.prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (!reaction) {
      throw new Error('Reaction not found');
    }

    await this.prisma.reaction.delete({
      where: { id: reaction.id }
    });
  }

  async addComment(postId: string, userId: string, content: string, parentId?: string): Promise<Comment> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return await this.prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId,
        parentId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  }

  async updateComment(commentId: string, userId: string, content: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new Error('You can only update your own comments');
    }

    return await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new Error('You can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id: commentId }
    });
  }

  async sharePost(postId: string, userId: string, comment?: string): Promise<Share> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user already shared this post
    const existingShare = await this.prisma.share.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingShare) {
      throw new Error('You have already shared this post');
    }

    return await this.prisma.share.create({
      data: {
        userId,
        postId,
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  }

  async getUserFeed(userId: string, options: FeedOptions) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Get user's connections and teams
    const [connections, teams] = await Promise.all([
      this.prisma.connection.findMany({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' }
          ]
        }
      }),
      this.prisma.teamMember.findMany({
        where: { userId },
        select: { teamId: true }
      })
    ]);

    const connectedUserIds = connections.map(conn => 
      conn.senderId === userId ? conn.receiverId : conn.senderId
    );
    const teamIds = teams.map(t => t.teamId);

    // Include user's own posts and posts from connections and teams
    const authorIds = [userId, ...connectedUserIds];

    const where = {
      OR: [
        { authorId: { in: authorIds } },
        { teamId: { in: teamIds } }
      ]
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              title: true
            }
          },
          team: {
            select: {
              id: true,
              name: true
            }
          },
          reactions: {
            select: {
              id: true,
              type: true,
              userId: true
            }
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              shares: true
            }
          }
        }
      }),
      this.prisma.post.count({ where })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getTrendingPosts(options: TrendingOptions) {
    const { page, limit, timeframe } = options;
    const skip = (page - 1) * limit;

    // Calculate time range based on timeframe
    let timeRange = new Date();
    switch (timeframe) {
      case '1h':
        timeRange.setHours(timeRange.getHours() - 1);
        break;
      case '6h':
        timeRange.setHours(timeRange.getHours() - 6);
        break;
      case '24h':
        timeRange.setDate(timeRange.getDate() - 1);
        break;
      case '7d':
        timeRange.setDate(timeRange.getDate() - 7);
        break;
      default:
        timeRange.setDate(timeRange.getDate() - 1);
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          createdAt: {
            gte: timeRange
          }
        },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              title: true
            }
          },
          team: {
            select: {
              id: true,
              name: true
            }
          },
          reactions: {
            select: {
              id: true,
              type: true,
              userId: true
            }
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              shares: true
            }
          }
        },
        orderBy: [
          { reactions: { _count: 'desc' } },
          { comments: { _count: 'desc' } },
          { shares: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
      }),
      this.prisma.post.count({
        where: {
          createdAt: {
            gte: timeRange
          }
        }
      })
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}