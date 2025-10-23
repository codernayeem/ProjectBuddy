import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import { uploadAvatar, uploadBanner } from '../middlewares/upload';
import { updateUserSchema, searchUsersSchema } from '../utils/validation';

const router = Router();
const userController = new UserController();

// Protected routes
router.use(authenticate);

router.get('/recommendations', userController.getUserRecommendations);

router.put('/profile', validate(updateUserSchema), userController.updateProfile);

router.post('/avatar', uploadAvatar.single('avatar'), userController.uploadAvatar);

router.post('/banner', uploadBanner.single('banner'), userController.uploadBanner);

router.get('/search', validateQuery(searchUsersSchema), userController.searchUsers);

router.get('/check-email', userController.checkEmailAvailability);

router.get('/check-username', userController.checkUsernameAvailability);

router.get('/:id', userController.getUserById);

router.delete('/account', authenticate, userController.deleteAccount);

// University routes
router.get('/me/universities', userController.getUserUniversities);
router.post('/me/universities', userController.addUniversity);
router.put('/me/universities/:universityId', userController.updateUniversity);
router.delete('/me/universities/:universityId', userController.deleteUniversity);

export default router;