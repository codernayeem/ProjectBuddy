import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import { uploadAvatar } from '../middlewares/upload';
import { updateUserSchema, searchUsersSchema } from '../utils/validation';

const router = Router();
const userController = new UserController();

// Protected routes
router.use(authenticate);

router.put('/profile', validate(updateUserSchema), userController.updateProfile);

router.post('/avatar', uploadAvatar.single('avatar'), userController.uploadAvatar);

router.get('/search', validateQuery(searchUsersSchema), userController.searchUsers);

router.get('/check-email', userController.checkEmailAvailability);

router.get('/check-username', userController.checkUsernameAvailability);

router.get('/:id', userController.getUserById);

router.delete('/account', authenticate, userController.deleteAccount);

export default router;