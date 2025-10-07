import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';
import { registerSchema, loginSchema, refreshTokenSchema } from '../utils/validation';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);

router.post('/login', validate(loginSchema), authController.login);

router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

router.post('/logout', authenticate, authController.logout);

router.get('/me', authenticate, authController.getProfile);

router.get('/check-email', authController.checkEmailAvailability);
    
router.get('/check-username', authController.checkUsernameAvailability);

export default router;