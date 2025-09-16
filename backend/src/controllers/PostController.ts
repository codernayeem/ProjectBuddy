import { Request, Response } from 'express';
import { PostService } from '../services/PostService';
import { createResponse, createErrorResponse, getPaginationParams } from '../utils/helpers';
import { AuthenticatedRequest } from '../types';
import { ReactionType, PostType } from '@prisma/client';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  // Create a new post
  createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { content, type, projectId, teamId, media, tags } = req.body;

      const postData = {
        content,
        type: type as PostType,
        projectId,
        teamId,
        media,
        tags,
      };

      const post = await this.postService.createPost(req.user.id, postData);

      res.status(201).json(createResponse(true, 'Post created successfully', post));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      res.status(400).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts with filters
  getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const filters = {
        page,
        limit,
        type: req.query.type as PostType,
        authorId: req.query.authorId as string,
        projectId: req.query.projectId as string,
        teamId: req.query.teamId as string,
        search: req.query.search as string,
      };

      const result = await this.postService.getPosts(filters);

      res.json(createResponse(
        true, 
        'Posts retrieved successfully', 
        result.posts,
        { 
          page: result.pagination.page, 
          limit: result.pagination.limit, 
          total: result.pagination.total,
          skip: (result.pagination.page - 1) * result.pagination.limit
        }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get a specific post by ID
  getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const post = await this.postService.getPostById(id);

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
  updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { id } = req.params;
      const { content, media, tags } = req.body;

      const updateData = {
        content,
        media,
        tags,
      };

      const post = await this.postService.updatePost(id, req.user.id, updateData);

      res.json(createResponse(true, 'Post updated successfully', post));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('only update your own') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Delete a post
  deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
                        errorMessage.includes('only delete your own') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // React to a post
  reactToPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
  removeReaction = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

  // Add a comment to a post
  addComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

  // Update a comment
  updateComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { commentId } = req.params;
      const { content } = req.body;

      const comment = await this.postService.updateComment(commentId, req.user.id, content);

      res.json(createResponse(true, 'Comment updated successfully', comment));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update comment';
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('only update your own') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Delete a comment
  deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { commentId } = req.params;

      await this.postService.deleteComment(commentId, req.user.id);

      res.json(createResponse(true, 'Comment deleted successfully'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete comment';
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('only delete your own') ? 403 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Share a post
  sharePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      const statusCode = errorMessage.includes('not found') ? 404 : 
                        errorMessage.includes('already shared') ? 409 : 400;
      res.status(statusCode).json(createErrorResponse(errorMessage));
    }
  };

  // Get user's personalized feed
  getUserFeed = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json(createErrorResponse('User not authenticated'));
        return;
      }

      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const result = await this.postService.getUserFeed(req.user.id, { page, limit });

      res.json(createResponse(
        true, 
        'Feed retrieved successfully', 
        result.posts,
        { 
          page: result.pagination.page, 
          limit: result.pagination.limit, 
          total: result.pagination.total,
          skip: (result.pagination.page - 1) * result.pagination.limit
        }
      ));
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

      const result = await this.postService.getTrendingPosts({ page, limit, timeframe });

      res.json(createResponse(
        true, 
        'Trending posts retrieved successfully', 
        result.posts,
        { 
          page: result.pagination.page, 
          limit: result.pagination.limit, 
          total: result.pagination.total,
          skip: (result.pagination.page - 1) * result.pagination.limit
        }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get trending posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts by author
  getPostsByAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { authorId } = req.params;
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const filters = {
        page,
        limit,
        authorId,
        type: req.query.type as PostType,
        search: req.query.search as string,
      };

      const result = await this.postService.getPosts(filters);

      res.json(createResponse(
        true, 
        'Author posts retrieved successfully', 
        result.posts,
        { 
          page: result.pagination.page, 
          limit: result.pagination.limit, 
          total: result.pagination.total,
          skip: (result.pagination.page - 1) * result.pagination.limit
        }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get author posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts by project
  getPostsByProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const filters = {
        page,
        limit,
        projectId,
        type: req.query.type as PostType,
        search: req.query.search as string,
      };

      const result = await this.postService.getPosts(filters);

      res.json(createResponse(
        true, 
        'Project posts retrieved successfully', 
        result.posts,
        { 
          page: result.pagination.page, 
          limit: result.pagination.limit, 
          total: result.pagination.total,
          skip: (result.pagination.page - 1) * result.pagination.limit
        }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get project posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };

  // Get posts by team
  getPostsByTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params;
      const { page, limit } = getPaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      const filters = {
        page,
        limit,
        teamId,
        type: req.query.type as PostType,
        search: req.query.search as string,
      };

      const result = await this.postService.getPosts(filters);

      res.json(createResponse(
        true, 
        'Team posts retrieved successfully', 
        result.posts,
        { 
          page: result.pagination.page, 
          limit: result.pagination.limit, 
          total: result.pagination.total,
          skip: (result.pagination.page - 1) * result.pagination.limit
        }
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get team posts';
      res.status(500).json(createErrorResponse(errorMessage));
    }
  };
}
