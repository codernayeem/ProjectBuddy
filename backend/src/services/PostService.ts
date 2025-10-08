import { PostRepository } from '../repositories/PostRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { 
  CreatePostData, 
  UpdatePostData, 
  PaginationParams,
  SearchParams,
  PostFilters 
} from '../types';
import { Post, Comment, Reaction, Share, Bookmark } from '@prisma/client';

export class PostService {
  private postRepository: PostRepository;
  private notificationRepository: NotificationRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.notificationRepository = new NotificationRepository();
  }

  // Post CRUD operations
  async createPost(authorId: string | null, data: CreatePostData): Promise<Post> {
    // Validate that either authorId or teamId is provided
    if (!authorId && !data.teamId) {
      throw new Error('Post must have either an author or be posted by a team');
    }

    if (authorId && data.teamId) {
      throw new Error('Post cannot have both an author and be posted by a team');
    }

    const post = await this.postRepository.create({
      content: data.content,
      type: data.type || 'GENERAL',
      ...(authorId && { author: { connect: { id: authorId } } }),
      ...(data.teamId && { team: { connect: { id: data.teamId } } }),
      media: data.media || [],
      tags: data.tags || [],
      mentions: data.mentions || [],
      hashtags: data.hashtags || [],
      visibility: data.visibility || 'public',
    });

    // Handle mentions - create notifications for mentioned users
    if (data.mentions && data.mentions.length > 0) {
      await this.notificationRepository.createPostNotification(
        post.id,
        authorId || 'system',
        'POST_MENTION',
        'You were mentioned in a post',
        'Someone mentioned you in their post',
        data.mentions,
        { postId: post.id }
      );
    }

    return post;
  }

  async getPostById(postId: string, userId?: string): Promise<Post | null> {
    const post = await this.postRepository.findById(postId, userId);
    
    if (post && userId) {
      // Increment view count
      await this.postRepository.incrementViewCount(postId);
    }
    
    return post;
  }

  async updatePost(postId: string, userId: string, data: UpdatePostData): Promise<Post> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user can edit this post
    if (post.authorId !== userId) {
      // If it's a team post, check if user can manage the team
      if (post.teamId) {
        // TODO: Add team management check
        throw new Error('You do not have permission to edit this team post');
      } else {
        throw new Error('You can only edit your own posts');
      }
    }

    return this.postRepository.update(postId, data);
  }

  async deletePost(postId: string, userId: string): Promise<void> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user can delete this post
    if (post.authorId !== userId) {
      // If it's a team post, check if user can manage the team
      if (post.teamId) {
        // TODO: Add team management check
        throw new Error('You do not have permission to delete this team post');
      } else {
        throw new Error('You can only delete your own posts');
      }
    }

    await this.postRepository.delete(postId);
  }

  // Feed and Discovery
  async getUserFeed(
    userId: string, 
    params: PaginationParams & { filters?: PostFilters }
  ): Promise<{ data: Post[]; pagination: any }> {
    const result = await this.postRepository.getFeed(userId, params);
    
    return {
      data: result.posts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  async searchPosts(
    params: SearchParams & PaginationParams & { filters?: PostFilters },
    userId?: string
  ): Promise<{ data: Post[]; pagination: any }> {
    const result = await this.postRepository.search(params, userId);
    
    return {
      data: result.posts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  async getUserPosts(
    targetUserId: string,
    currentUserId?: string,
    params: PaginationParams = { page: 1, limit: 20, skip: 0 }
  ): Promise<{ data: Post[]; pagination: any }> {
    const result = await this.postRepository.getUserPosts(targetUserId, currentUserId, params);
    
    return {
      data: result.posts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  async getTeamPosts(
    teamId: string,
    userId?: string,
    params: PaginationParams = { page: 1, limit: 20, skip: 0 }
  ): Promise<{ data: Post[]; pagination: any }> {
    const result = await this.postRepository.getTeamPosts(teamId, userId, params);
    
    return {
      data: result.posts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  // Reactions
  async reactToPost(postId: string, userId: string, type: any): Promise<Reaction> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    const reaction = await this.postRepository.addReaction(postId, userId, type);

    // Create notification for post author (if not reacting to own post)
    if (post.authorId && post.authorId !== userId) {
      await this.notificationRepository.create({
        type: 'POST_REACTION',
        title: 'Someone reacted to your post',
        message: `Someone ${type.toLowerCase()}d your post`,
        userId: post.authorId,
        data: { postId, reactionType: type },
        category: 'social',
      });
    }

    // Update post reaction count
    await this.postRepository.updateCounts(postId);

    return reaction;
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    await this.postRepository.removeReaction(postId, userId);
    
    // Update post reaction count
    await this.postRepository.updateCounts(postId);
  }

  async getPostReactions(postId: string): Promise<Reaction[]> {
    return this.postRepository.getPostReactions(postId);
  }

  // Comments
  async addComment(
    postId: string, 
    userId: string, 
    content: string, 
    parentId?: string
  ): Promise<Comment> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    const comment = await this.postRepository.addComment({
      content,
      author: { connect: { id: userId } },
      post: { connect: { id: postId } },
      ...(parentId && { parent: { connect: { id: parentId } } }),
    });

    // Create notification for post author (if not commenting on own post)
    if (post.authorId && post.authorId !== userId) {
      await this.notificationRepository.create({
        type: 'POST_COMMENT',
        title: 'New comment on your post',
        message: 'Someone commented on your post',
        userId: post.authorId,
        data: { postId, commentId: comment.id },
        category: 'social',
      });
    }

    // If it's a reply, notify the parent comment author
    if (parentId) {
      // TODO: Get parent comment author and notify
    }

    // Update post comment count
    await this.postRepository.updateCounts(postId);

    return comment;
  }

  async getPostComments(
    postId: string, 
    params: PaginationParams
  ): Promise<{ comments: Comment[]; total: number }> {
    return this.postRepository.getPostComments(postId, params);
  }

  // Shares
  async sharePost(postId: string, userId: string, comment?: string): Promise<Share> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    const share = await this.postRepository.sharePost(postId, userId, comment);

    // Create notification for post author (if not sharing own post)
    if (post.authorId && post.authorId !== userId) {
      await this.notificationRepository.create({
        type: 'POST_SHARED',
        title: 'Your post was shared',
        message: 'Someone shared your post',
        userId: post.authorId,
        data: { postId, shareId: share.id },
        category: 'social',
      });
    }

    // Update post share count
    await this.postRepository.updateCounts(postId);

    return share;
  }

  async unsharePost(postId: string, userId: string): Promise<void> {
    await this.postRepository.unsharePost(postId, userId);
    
    // Update post share count
    await this.postRepository.updateCounts(postId);
  }

  // Bookmarks
  async bookmarkPost(postId: string, userId: string): Promise<Bookmark> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    return this.postRepository.bookmarkPost(postId, userId);
  }

  async unbookmarkPost(postId: string, userId: string): Promise<void> {
    await this.postRepository.unbookmarkPost(postId, userId);
  }

  async getUserBookmarks(
    userId: string, 
    params: PaginationParams
  ): Promise<{ data: Post[]; pagination: any }> {
    const result = await this.postRepository.getUserBookmarks(userId, params);
    
    return {
      data: result.posts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  // Trending and Discovery
  async getTrendingPosts(
    params: PaginationParams & { timeframe?: string }
  ): Promise<{ data: Post[]; pagination: any }> {
    // Calculate time range based on timeframe
    let timeRange = new Date();
    switch (params.timeframe) {
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

    // Use search with filters for trending posts
    const result = await this.postRepository.search({
      query: '',
      page: params.page,
      limit: params.limit,
      skip: params.skip,
      sortBy: 'likesCount',
      sortOrder: 'desc',
      filters: {
        // Add time filter here if needed
      },
    });
    
    return {
      data: result.posts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / params.limit),
      },
    };
  }

  // Analytics
  async getPostAnalytics(postId: string, userId: string): Promise<any> {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user owns the post
    if (post.authorId !== userId) {
      throw new Error('You can only view analytics for your own posts');
    }

    const [reactions, comments] = await Promise.all([
      this.postRepository.getPostReactions(postId),
      this.postRepository.getPostComments(postId, { page: 1, limit: 1000, skip: 0 }),
    ]);

    return {
      views: post.viewsCount,
      reactions: reactions.length,
      comments: comments.total,
      shares: post.sharesCount,
      reactionsByType: reactions.reduce((acc, reaction) => {
        acc[reaction.type] = (acc[reaction.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}