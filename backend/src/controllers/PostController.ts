import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthRequest } from '../types';
import { ReactionType, PostType } from '@prisma/client';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // Create a new post
  createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { content, type, teamId, media, tags, mentions, hashtags, visibility } = req.body;

      const postData = {
        content,
        type: type as PostType,
        teamId,
        media,
        tags,
        mentions,
        hashtags,
        visibility,
      };

      const post = await this.postService.createPost(req.user.id, postData);

      res.status(201).json(createResponse(true, 'Post created successfully', post));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // Create a team post
  createTeamPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { content, type, teamId, media, tags, mentions, hashtags, visibility } = req.body;

      if (!teamId) {
        res.status(400).json(createErrorResponse('Team ID is required for team posts'));
        return;
      }

      const postData = {
        content,
        type: type as PostType,
        teamId,
        media,
        tags,
        mentions,
        hashtags,
        visibility,
      };

      const post = await this.postService.createPost(null, postData);

      res.status(201).json(createResponse(true, 'Team post created successfully', post));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team post';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts with search and filters
  searchPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
        query: req.query.search as string || '',
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        filters: {
          type: req.query.type as PostType,
          authorId: req.query.authorId as string,
          teamId: req.query.teamId as string,
          tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
          visibility: req.query.visibility as any,
        },
      };

      const userId = (req as AuthRequest).user?.id;
      const result = await this.postService.searchPosts(params, userId);

      res.json(createResponse(
        true, 
        'Posts retrieved successfully', 
        result.data,
        result.pagination,
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get a specific post by ID
  getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as AuthRequest).user?.id;

      const post = await this.postService.getPostById(id, userId);

      if (!post) {
        res.status(404).json(createErrorResponse('Post not found'));
        return;
      }

      res.json(createResponse(true, 'Post retrieved successfully', post));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get post';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Update a post
  updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { content, media, tags, mentions, hashtags, visibility } = req.body;

      const updateData = {
        content,
        media,
        tags,
        mentions,
        hashtags,
        visibility,
      };

      const post = await this.postService.updatePost(id, req.user.id, updateData);

      res.json(createResponse(true, 'Post updated successfully', post));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('permission') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Delete a post
  deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      await this.postService.deletePost(id, req.user.id);

      res.json(createResponse(true, 'Post deleted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('permission') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // React to a post
  reactToPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { type } = req.body;

      const reaction = await this.postService.reactToPost(id, req.user.id, type as ReactionType);

      res.json(createResponse(true, 'Reaction added successfully', reaction));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to react to post';
      const statusCode = errorMessage.includes('not found') ? 404 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Remove reaction from a post
  removeReaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      await this.postService.removeReaction(id, req.user.id);

      res.json(createResponse(true, 'Reaction removed successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove reaction';
      const statusCode = errorMessage.includes('not found') ? 404 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Get post reactions
  getPostReactions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const reactions = await this.postService.getPostReactions(id);

      res.json(createResponse(true, 'Post reactions retrieved successfully', reactions));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get post reactions';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Add a comment to a post
  addComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { content, parentId } = req.body;

      const comment = await this.postService.addComment(id, req.user.id, content, parentId);

      res.status(201).json(createResponse(true, 'Comment added successfully', comment));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      const statusCode = errorMessage.includes('not found') ? 404 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Get post comments
  getPostComments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
      };

      const result = await this.postService.getPostComments(id, params);

      res.json(createResponse(true, 'Comments retrieved successfully', result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get comments';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Share a post
  sharePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { comment } = req.body;

      const share = await this.postService.sharePost(id, req.user.id, comment);

      res.status(201).json(createResponse(true, 'Post shared successfully', share));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share post';
      const statusCode = errorMessage.includes('not found') ? 404 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Unshare a post
  unsharePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      await this.postService.unsharePost(id, req.user.id);

      res.json(createResponse(true, 'Post unshared successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unshare post';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // Bookmark a post
  bookmarkPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      const bookmark = await this.postService.bookmarkPost(id, req.user.id);

      res.status(201).json(createResponse(true, 'Post bookmarked successfully', bookmark));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to bookmark post';
      const statusCode = errorMessage.includes('not found') ? 404 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Unbookmark a post
  unbookmarkPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      await this.postService.unbookmarkPost(id, req.user.id);

      res.json(createResponse(true, 'Post unbookmarked successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unbookmark post';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // Get user bookmarks
  getUserBookmarks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
      };

      const result = await this.postService.getUserBookmarks(req.user.id, params);

      res.json(createResponse(true, 'Bookmarks retrieved successfully', result.data, result.pagination));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get bookmarks';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get user's personalized feed
  getUserFeed = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
        filters: {
          type: req.query.type as PostType,
        },
      };

      const result = await this.postService.getUserFeed(req.user.id, params);

      res.json(createResponse(true, 'Feed retrieved successfully', result.data, result.pagination));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user feed';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get trending posts
  getTrendingPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const timeframe = req.query.timeframe as string || '24h';

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
        timeframe,
      };

      const result = await this.postService.getTrendingPosts(params);

      res.json(createResponse(true, 'Trending posts retrieved successfully', result.data, result.pagination));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get trending posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts by user
  getUserPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const currentUserId = (req as AuthRequest).user?.id;
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
      };

      const result = await this.postService.getUserPosts(userId, currentUserId, params);

      res.json(createResponse(true, 'User posts retrieved successfully', result.data, result.pagination));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts by team
  getTeamPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params;
      const userId = (req as AuthRequest).user?.id;
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const params = {
        page,
        limit,
        skip: (page - 1) * limit,
      };

      const result = await this.postService.getTeamPosts(teamId, userId, params);

      res.json(createResponse(true, 'Team posts retrieved successfully', result.data, result.pagination));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get team posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get post analytics (for post authors)
  getPostAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;

      const analytics = await this.postService.getPostAnalytics(id, req.user.id);

      res.json(createResponse(true, 'Post analytics retrieved successfully', analytics));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get post analytics';
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('only view analytics') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };
}
