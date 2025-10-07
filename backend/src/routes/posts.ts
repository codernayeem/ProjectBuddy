import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate } from '../middlewares/auth';
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

// Protected routes
router.use(authenticate);

router.get('/', validateQuery(paginationSchema), postController.searchPosts);

router.post('/', validate(createPostSchema), postController.createPost);

router.post('/team', validate(createPostSchema), postController.createTeamPost);

router.get('/bookmarks', validateQuery(paginationSchema), postController.getUserBookmarks);

router.get('/trending', validateQuery(paginationSchema), postController.getTrendingPosts);

router.get('/user/:userId', validateQuery(paginationSchema), postController.getUserPosts);

router.get('/team/:teamId', validateQuery(paginationSchema), postController.getTeamPosts);

router.get('/feed', validateQuery(paginationSchema), postController.getUserFeed);

router.put('/:id', validate(updatePostSchema), postController.updatePost);

router.delete('/:id', postController.deletePost);

router.get('/:id', postController.getPostById);

router.post('/:id/react', validate(createReactionSchema), postController.reactToPost);

router.delete('/:id/react', postController.removeReaction);

router.post('/:id/share', validate(sharePostSchema), postController.sharePost);

router.delete('/:id/share', postController.unsharePost);

router.post('/:id/bookmark', postController.bookmarkPost);

router.delete('/:id/bookmark', postController.unbookmarkPost);

router.get('/:id/reactions', postController.getPostReactions);

router.get('/:id/analytics', postController.getPostAnalytics);

router.get('/:id/comments', validateQuery(paginationSchema), postController.getPostComments);

router.post('/:id/comments', validate(createCommentSchema), postController.addComment);


export default router;