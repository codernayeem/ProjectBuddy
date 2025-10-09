import { Router } from 'express';
import { PostController } from '../controllers/PostController';
import { authenticate } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import { 
  createCommentSchema, 
  updateCommentSchema, 
  createReactionSchema,
  paginationSchema 
} from '../utils/validation';

const router = Router();
const postController = new PostController();

// All comment routes require authentication
router.use(authenticate);

// Comment CRUD operations
router.get('/:id', postController.getCommentById);
router.put('/:id', validate(updateCommentSchema), postController.updateComment);
router.delete('/:id', postController.deleteComment);

// Comment replies
router.get('/:id/replies', validateQuery(paginationSchema), postController.getCommentReplies);

// Comment reactions
router.post('/:id/react', validate(createReactionSchema), postController.reactToComment);
router.delete('/:id/react', postController.removeCommentReaction);
router.get('/:id/reactions', postController.getCommentReactions);

export default router;