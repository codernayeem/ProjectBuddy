import { Post, Comment, Reaction, Share, Bookmark, Mention, CommentReaction, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { PaginationParams, SearchParams, PostFilters } from '../types';

export class PostRepository {
  // Post CRUD operations
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
            shares: true,
            bookmarks: true,
          },
        },
      },
    });
  }

  async findById(id: string, userId?: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reactions: userId ? {
          where: { userId },
          take: 1,
        } : false,
        bookmarks: userId ? {
          where: { userId },
          take: 1,
        } : false,
        _count: {
          select: {
            reactions: true,
            comments: true,
            shares: true,
            bookmarks: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data: {
        ...data,
        isEdited: true,
        editedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<Post> {
    return prisma.post.delete({
      where: { id },
    });
  }

  async getFeed(
    userId: string,
    params: PaginationParams & { filters?: PostFilters }
  ): Promise<{ posts: Post[]; total: number }> {
    // Get user's connections, teams they're a member of, and teams they follow
    const [connections, teamMemberships, teamFollows] = await Promise.all([
      prisma.connection.findMany({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' },
          ],
        },
        select: {
          senderId: true,
          receiverId: true,
        },
      }),
      prisma.teamMember.findMany({
        where: { userId },
        select: { teamId: true },
      }),
      prisma.teamFollow.findMany({
        where: { userId },
        select: { teamId: true },
      }),
    ]);

    const connectedUserIds = connections.map(conn => 
      conn.senderId === userId ? conn.receiverId : conn.senderId
    );
    const memberTeamIds = teamMemberships.map(tm => tm.teamId);
    const followedTeamIds = teamFollows.map(tf => tf.teamId);
    const allTeamIds = [...new Set([...memberTeamIds, ...followedTeamIds])];

    const where: Prisma.PostWhereInput = {
      AND: [
        {
          OR: [
            // User's own posts
            { authorId: userId },
            // Posts from connected users
            { authorId: { in: connectedUserIds } },
            // Posts from teams user is member of or follows
            { teamId: { in: allTeamIds } },
            // Public posts (if visibility is public)
            { visibility: 'public', authorId: { not: userId } },
          ],
        },
        params.filters?.type ? { type: params.filters.type } : {},
        params.filters?.authorId ? { authorId: params.filters.authorId } : {},
        params.filters?.teamId ? { teamId: params.filters.teamId } : {},
        params.filters?.hashtags ? { hashtags: { hasSome: params.filters.hashtags } } : {},
        params.filters?.visibility ? { visibility: params.filters.visibility } : {},
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reactions: {
            where: { userId },
            take: 1,
          },
          bookmarks: {
            where: { userId },
            take: 1,
          },
          _count: {
            select: {
              reactions: true,
              comments: true,
              shares: true,
              bookmarks: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  async search(
    params: SearchParams & PaginationParams & { filters?: PostFilters },
    userId?: string
  ): Promise<{ posts: Post[]; total: number }> {
    const where: Prisma.PostWhereInput = {
      AND: [
        params.query
          ? {
              OR: [
                { content: { contains: params.query, mode: 'insensitive' } },
                { hashtags: { hasSome: [params.query] } },
                { tags: { hasSome: [params.query] } },
              ],
            }
          : {},
        params.filters?.type ? { type: params.filters.type } : {},
        params.filters?.authorId ? { authorId: params.filters.authorId } : {},
        params.filters?.teamId ? { teamId: params.filters.teamId } : {},
        params.filters?.hashtags ? { hashtags: { hasSome: params.filters.hashtags } } : {},
        params.filters?.visibility ? { visibility: params.filters.visibility } : {},
        // Only show posts user has access to
        userId
          ? {
              OR: [
                { authorId: userId },
                { visibility: 'public' },
                { visibility: 'connections', author: { 
                    OR: [
                      { sentConnections: { some: { receiverId: userId, status: 'ACCEPTED' } } },
                      { receivedConnections: { some: { senderId: userId, status: 'ACCEPTED' } } },
                    ]
                  }
                },
                { teamId: { in: await this.getUserAccessibleTeamIds(userId) } },
              ],
            }
          : { visibility: 'public' },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reactions: userId ? {
            where: { userId },
            take: 1,
          } : false,
          bookmarks: userId ? {
            where: { userId },
            take: 1,
          } : false,
          _count: {
            select: {
              reactions: true,
              comments: true,
              shares: true,
              bookmarks: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortOrder || 'asc' } : { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  async getUserPosts(
    targetUserId: string,
    currentUserId?: string,
    params: PaginationParams = { page: 1, limit: 20, skip: 0 }
  ): Promise<{ posts: Post[]; total: number }> {
    const where: Prisma.PostWhereInput = {
      authorId: targetUserId,
      // Show posts based on visibility and relationship
      ...(currentUserId === targetUserId
        ? {} // Show all posts if viewing own profile
        : {
            OR: [
              { visibility: 'public' },
              // Add connection check if needed
            ],
          }),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reactions: currentUserId ? {
            where: { userId: currentUserId },
            take: 1,
          } : false,
          bookmarks: currentUserId ? {
            where: { userId: currentUserId },
            take: 1,
          } : false,
          _count: {
            select: {
              reactions: true,
              comments: true,
              shares: true,
              bookmarks: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  async getTeamPosts(
    teamId: string,
    userId?: string,
    params: PaginationParams = { page: 1, limit: 20, skip: 0 }
  ): Promise<{ posts: Post[]; total: number }> {
    const where: Prisma.PostWhereInput = {
      teamId,
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reactions: userId ? {
            where: { userId },
            take: 1,
          } : false,
          bookmarks: userId ? {
            where: { userId },
            take: 1,
          } : false,
          _count: {
            select: {
              reactions: true,
              comments: true,
              shares: true,
              bookmarks: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  // Reactions
  async addReaction(postId: string, userId: string, type: any): Promise<Reaction> {
    return prisma.reaction.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: { type },
      create: {
        postId,
        userId,
        type,
      },
    });
  }

  async removeReaction(postId: string, userId: string): Promise<Reaction> {
    return prisma.reaction.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async getPostReactions(postId: string): Promise<Reaction[]> {
    return prisma.reaction.findMany({
      where: { postId },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  // Comments
  async addComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    return prisma.comment.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        reactions: true,
        _count: {
          select: {
            replies: true,
            reactions: true,
          },
        },
      },
    });
  }

  async getPostComments(postId: string, params: PaginationParams, userId?: string): Promise<{ comments: Comment[]; total: number }> {
    const where = {
      postId,
      parentId: null, // Only top-level comments
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          reactions: userId ? {
            where: { userId },
            take: 1,
          } : true,
          replies: {
            take: 3, // Show first few replies
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
              reactions: userId ? {
                where: { userId },
                take: 1,
              } : true,
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              replies: true,
              reactions: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments, total };
  }

  // Get comment by ID
  async getCommentById(commentId: string): Promise<Comment | null> {
    return prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            authorId: true,
          },
        },
        parent: {
          include: {
            author: {
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
        replies: {
          take: 3,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        reactions: {
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
        _count: {
          select: {
            replies: true,
            reactions: true,
          },
        },
      },
    });
  }

  // Update comment
  async updateComment(commentId: string, content: string): Promise<Comment> {
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        reactions: true,
        _count: {
          select: {
            replies: true,
            reactions: true,
          },
        },
      },
    });
  }

  // Delete comment
  async deleteComment(commentId: string): Promise<Comment> {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  }

  // Get comment replies
  async getCommentReplies(commentId: string, params: PaginationParams): Promise<{ comments: Comment[]; total: number }> {
    const where = {
      parentId: commentId,
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          reactions: {
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
          _count: {
            select: {
              replies: true,
              reactions: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments, total };
  }

  // Comment reactions
  async addCommentReaction(commentId: string, userId: string, type: any): Promise<CommentReaction> {
    return prisma.commentReaction.upsert({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
      update: { type },
      create: {
        commentId,
        userId,
        type,
      },
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
    });
  }

  async removeCommentReaction(commentId: string, userId: string): Promise<CommentReaction> {
    return prisma.commentReaction.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
  }

  async getCommentReactions(commentId: string): Promise<CommentReaction[]> {
    return prisma.commentReaction.findMany({
      where: { commentId },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update comment counts
  async updateCommentCounts(commentId: string): Promise<void> {
    const [likesCount, repliesCount] = await Promise.all([
      prisma.commentReaction.count({ where: { commentId } }),
      prisma.comment.count({ where: { parentId: commentId } }),
    ]);

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        likesCount,
        repliesCount,
      },
    });
  }

  // Shares
  async sharePost(postId: string, userId: string, comment?: string): Promise<Share> {
    return prisma.share.create({
      data: {
        postId,
        userId,
        comment,
      },
    });
  }

  async unsharePost(postId: string, userId: string): Promise<Share> {
    return prisma.share.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  // Bookmarks
  async bookmarkPost(postId: string, userId: string): Promise<Bookmark> {
    return prisma.bookmark.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async unbookmarkPost(postId: string, userId: string): Promise<Bookmark> {
    return prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async getUserBookmarks(userId: string, params: PaginationParams): Promise<{ posts: Post[]; total: number }> {
    const where = {
      bookmarks: {
        some: {
          userId,
        },
      },
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          bookmarks: {
            where: { userId },
            take: 1,
          },
          _count: {
            select: {
              reactions: true,
              comments: true,
              shares: true,
              bookmarks: true,
            },
          },
        },
        skip: params.skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  }

  // Helper methods
  private async getUserAccessibleTeamIds(userId: string): Promise<string[]> {
    const [teamMemberships, teamFollows] = await Promise.all([
      prisma.teamMember.findMany({
        where: { userId },
        select: { teamId: true },
      }),
      prisma.teamFollow.findMany({
        where: { userId },
        select: { teamId: true },
      }),
    ]);

    const memberTeamIds = teamMemberships.map(tm => tm.teamId);
    const followedTeamIds = teamFollows.map(tf => tf.teamId);
    
    return [...new Set([...memberTeamIds, ...followedTeamIds])];
  }

  async incrementViewCount(postId: string): Promise<void> {
    await prisma.post.update({
      where: { id: postId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
  }

  async updateCounts(postId: string): Promise<void> {
    const [likesCount, commentsCount, sharesCount] = await Promise.all([
      prisma.reaction.count({ where: { postId } }),
      prisma.comment.count({ where: { postId } }),
      prisma.share.count({ where: { postId } }),
    ]);

    await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount,
        commentsCount,
        sharesCount,
      },
    });
  }
}