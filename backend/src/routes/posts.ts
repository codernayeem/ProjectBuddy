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

// Public routes
router.get('/', optionalAuth, validateQuery(paginationSchema), postController.getPosts);
router.get('/trending', validateQuery(paginationSchema), postController.getTrendingPosts);
router.get('/author/:authorId', validateQuery(paginationSchema), postController.getPostsByAuthor);
router.get('/project/:projectId', validateQuery(paginationSchema), postController.getPostsByProject);
router.get('/team/:teamId', validateQuery(paginationSchema), postController.getPostsByTeam);

// Protected routes
router.use(authenticate);

// User-specific routes (must come before parameterized routes)
router.get('/user/feed', validateQuery(paginationSchema), postController.getUserFeed);

// Post management
router.post('/', validate(createPostSchema), postController.createPost);
router.put('/:id', validate(updatePostSchema), postController.updatePost);
router.delete('/:id', postController.deletePost);

// Post details (must come after user routes)
router.get('/:id', postController.getPostById);

// Post interactions
router.post('/:id/react', validate(createReactionSchema), postController.reactToPost);
router.delete('/:id/react', postController.removeReaction);
router.post('/:id/share', validate(sharePostSchema), postController.sharePost);

// Comments
router.post('/:id/comments', validate(createCommentSchema), postController.addComment);
router.put('/comments/:commentId', validate(updateCommentSchema), postController.updateComment);
router.delete('/comments/:commentId', postController.deleteComment);

export default router;