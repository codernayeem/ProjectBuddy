import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import { 
  createPostSchema, 
  updatePostSchema, 
  createCommentSchema, 
  updateCommentSchema,
  createReactionSchema,
  sharePostSchema,
  paginationSchema
} from '../utils/validation';

const router = Router();
const postController = new PostController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         type:
 *           type: string
 *           enum: [GENERAL, PROJECT_UPDATE, PROJECT_ANNOUNCEMENT, ACHIEVEMENT, MILESTONE_COMPLETED, GOAL_COMPLETED, TEAM_FORMATION, FIND_TEAMMATES, FIND_TEAM, FIND_PROJECT, PROJECT_SHOWCASE, SKILL_SHARE, RESOURCE_SHARE, QUESTION, POLL, EVENT, CELEBRATION]
 *         authorId:
 *           type: string
 *           format: uuid
 *         projectId:
 *           type: string
 *           format: uuid
 *         teamId:
 *           type: string
 *           format: uuid
 *         media:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *         isEdited:
 *           type: boolean
 *         editedAt:
 *           type: string
 *           format: date-time
 *         visibility:
 *           type: string
 *           enum: [public, connections, team, project]
 *         likesCount:
 *           type: integer
 *         commentsCount:
 *           type: integer
 *         sharesCount:
 *           type: integer
 *         viewsCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         authorId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *         parentId:
 *           type: string
 *           format: uuid
 *         isEdited:
 *           type: boolean
 *         editedAt:
 *           type: string
 *           format: date-time
 *         likesCount:
 *           type: integer
 *         repliesCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Reaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [LIKE, LOVE, CELEBRATE, SUPPORT, INSIGHTFUL, FUNNY, AMAZING]
 *         userId:
 *           type: string
 *           format: uuid
 *         postId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 */

// Public routes
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, likesCount, commentsCount, viewsCount]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [GENERAL, PROJECT_UPDATE, PROJECT_ANNOUNCEMENT, ACHIEVEMENT, MILESTONE_COMPLETED, GOAL_COMPLETED, TEAM_FORMATION, FIND_TEAMMATES, FIND_TEAM, FIND_PROJECT, PROJECT_SHOWCASE, SKILL_SHARE, RESOURCE_SHARE, QUESTION, POLL, EVENT, CELEBRATION]
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', optionalAuth, validateQuery(paginationSchema), postController.getPosts);

/**
 * @swagger
 * /posts/trending:
 *   get:
 *     summary: Get trending posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [day, week, month, all]
 *           default: week
 *     responses:
 *       200:
 *         description: Trending posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/trending', validateQuery(paginationSchema), postController.getTrendingPosts);

/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Get posts by author
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Author posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Author not found
 */
router.get('/author/:authorId', validateQuery(paginationSchema), postController.getPostsByAuthor);

/**
 * @swagger
 * /posts/project/{projectId}:
 *   get:
 *     summary: Get posts by project
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Project posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Project not found
 */
router.get('/project/:projectId', validateQuery(paginationSchema), postController.getPostsByProject);

/**
 * @swagger
 * /posts/team/{teamId}:
 *   get:
 *     summary: Get posts by team
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Team posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Team not found
 */
router.get('/team/:teamId', validateQuery(paginationSchema), postController.getPostsByTeam);

// Protected routes
router.use(authenticate);

// User-specific routes (must come before parameterized routes)
/**
 * @swagger
 * /posts/user/feed:
 *   get:
 *     summary: Get user personalized feed
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: User feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: User not authenticated
 */
router.get('/user/feed', validateQuery(paginationSchema), postController.getUserFeed);

// Post management
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *               type:
 *                 type: string
 *                 enum: [GENERAL, PROJECT_UPDATE, PROJECT_ANNOUNCEMENT, ACHIEVEMENT, MILESTONE_COMPLETED, GOAL_COMPLETED, TEAM_FORMATION, FIND_TEAMMATES, FIND_TEAM, FIND_PROJECT, PROJECT_SHOWCASE, SKILL_SHARE, RESOURCE_SHARE, QUESTION, POLL, EVENT, CELEBRATION]
 *                 default: GENERAL
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               teamId:
 *                 type: string
 *                 format: uuid
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               mentions:
 *                 type: array
 *                 items:
 *                   type: string
 *               hashtags:
 *                 type: array
 *                 items:
 *                   type: string
 *               visibility:
 *                 type: string
 *                 enum: [public, connections, team, project]
 *                 default: public
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post data
 *       401:
 *         description: User not authenticated
 */
router.post('/', validate(createPostSchema), postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *               type:
 *                 type: string
 *                 enum: [GENERAL, PROJECT_UPDATE, PROJECT_ANNOUNCEMENT, ACHIEVEMENT, MILESTONE_COMPLETED, GOAL_COMPLETED, TEAM_FORMATION, FIND_TEAMMATES, FIND_TEAM, FIND_PROJECT, PROJECT_SHOWCASE, SKILL_SHARE, RESOURCE_SHARE, QUESTION, POLL, EVENT, CELEBRATION]
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               hashtags:
 *                 type: array
 *                 items:
 *                   type: string
 *               visibility:
 *                 type: string
 *                 enum: [public, connections, team, project]
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid post data
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to update this post
 *       404:
 *         description: Post not found
 */
router.put('/:id', validate(updatePostSchema), postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to delete this post
 *       404:
 *         description: Post not found
 */
router.delete('/:id', postController.deletePost);

// Post details (must come after user routes)
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post not found
 */
router.get('/:id', postController.getPostById);

// Post interactions
/**
 * @swagger
 * /posts/{id}/react:
 *   post:
 *     summary: React to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [LIKE, LOVE, CELEBRATE, SUPPORT, INSIGHTFUL, FUNNY, AMAZING]
 *     responses:
 *       201:
 *         description: Reaction added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reaction'
 *       400:
 *         description: Invalid reaction data
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post not found
 */
router.post('/:id/react', validate(createReactionSchema), postController.reactToPost);

/**
 * @swagger
 * /posts/{id}/react:
 *   delete:
 *     summary: Remove reaction from a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Reaction removed successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post or reaction not found
 */
router.delete('/:id/react', postController.removeReaction);

/**
 * @swagger
 * /posts/{id}/share:
 *   post:
 *     summary: Share a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Post shared successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post not found
 */
router.post('/:id/share', validate(sharePostSchema), postController.sharePost);

// Comments
/**
 * @swagger
 * /posts/{id}/comments:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of parent comment for replies
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment data
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post not found
 */
router.post('/:id/comments', validate(createCommentSchema), postController.addComment);

/**
 * @swagger
 * /posts/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid comment data
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to update this comment
 *       404:
 *         description: Comment not found
 */
router.put('/comments/:commentId', validate(updateCommentSchema), postController.updateComment);

/**
 * @swagger
 * /posts/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 */
router.delete('/comments/:commentId', postController.deleteComment);

export default router;