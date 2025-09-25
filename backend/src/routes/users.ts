import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import { uploadAvatar } from '../middlewares/upload';
import { updateUserSchema, searchUsersSchema } from '../utils/validation';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         bio:
 *           type: string
 *         avatar:
 *           type: string
 *         banner:
 *           type: string
 *         location:
 *           type: string
 *         website:
 *           type: string
 *         linkedin:
 *           type: string
 *         github:
 *           type: string
 *         portfolio:
 *           type: string
 *         company:
 *           type: string
 *         position:
 *           type: string
 *         userType:
 *           type: string
 *           enum: [UNDERGRADUATE, GRADUATE, FREELANCER, PROFESSIONAL, STARTUP_FOUNDER, ENTREPRENEUR]
 *         preferredRole:
 *           type: string
 *           enum: [PROJECT_MANAGER, TEAM_LEAD, FRONTEND_DEVELOPER, BACKEND_DEVELOPER, FULLSTACK_DEVELOPER, MOBILE_DEVELOPER, DEVOPS_ENGINEER, UI_UX_DESIGNER, DATA_SCIENTIST, QA_ENGINEER, BUSINESS_ANALYST, PRODUCT_MANAGER, MARKETING_SPECIALIST, CONTENT_CREATOR, OTHER]
 *         experienceLevel:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         isVerified:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         isAvailableForProjects:
 *           type: boolean
 *         timezone:
 *           type: string
 *         lastLoginAt:
 *           type: string
 *           format: date-time
 *         profileViews:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *               userType:
 *                 type: string
 *                 enum: [UNDERGRADUATE, GRADUATE, FREELANCER, PROFESSIONAL, STARTUP_FOUNDER, ENTREPRENEUR]
 *               preferredRole:
 *                 type: string
 *                 enum: [PROJECT_MANAGER, TEAM_LEAD, FRONTEND_DEVELOPER, BACKEND_DEVELOPER, FULLSTACK_DEVELOPER, MOBILE_DEVELOPER, DEVOPS_ENGINEER, UI_UX_DESIGNER, DATA_SCIENTIST, QA_ENGINEER, BUSINESS_ANALYST, PRODUCT_MANAGER, MARKETING_SPECIALIST, CONTENT_CREATOR, OTHER]
 *               experienceLevel:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 20
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 20
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 10
 *               location:
 *                 type: string
 *                 maxLength: 100
 *               website:
 *                 type: string
 *                 format: uri
 *               linkedin:
 *                 type: string
 *                 format: uri
 *               github:
 *                 type: string
 *                 format: uri
 *               portfolio:
 *                 type: string
 *                 format: uri
 *               company:
 *                 type: string
 *                 maxLength: 100
 *               position:
 *                 type: string
 *                 maxLength: 100
 *               isAvailableForProjects:
 *                 type: boolean
 *               timezone:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid profile data
 *       401:
 *         description: User not authenticated
 *       409:
 *         description: Username already taken
 */
router.put('/profile', authenticate, validate(updateUserSchema), userController.updateProfile);

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, WebP). Max size 5MB.
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 avatarUrl:
 *                   type: string
 *                   format: uri
 *                   description: The URL of the uploaded avatar
 *       400:
 *         description: No file uploaded or invalid file format
 *       401:
 *         description: User not authenticated
 *       413:
 *         description: File too large
 */
router.post('/avatar', authenticate, uploadAvatar.single('avatar'), userController.uploadAvatar);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search term for username, name, or bio
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: false
 *         description: Filter by skills (comma-separated)
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [UNDERGRADUATE, GRADUATE, FREELANCER, PROFESSIONAL, STARTUP_FOUNDER, ENTREPRENEUR]
 *         description: Filter by user type
 *       - in: query
 *         name: preferredRole
 *         schema:
 *           type: string
 *           enum: [PROJECT_MANAGER, TEAM_LEAD, FRONTEND_DEVELOPER, BACKEND_DEVELOPER, FULLSTACK_DEVELOPER, MOBILE_DEVELOPER, DEVOPS_ENGINEER, UI_UX_DESIGNER, DATA_SCIENTIST, QA_ENGINEER, BUSINESS_ANALYST, PRODUCT_MANAGER, MARKETING_SPECIALIST, CONTENT_CREATOR, OTHER]
 *         description: Filter by preferred role
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED, EXPERT]
 *         description: Filter by experience level
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: isAvailableForProjects
 *         schema:
 *           type: boolean
 *         description: Filter by availability for projects
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, profileViews, username, firstName, lastName]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserProfile'
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
 *       400:
 *         description: Invalid search parameters
 */
router.get('/search', validateQuery(searchUsersSchema), userController.searchUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/UserProfile'
 *                 - type: object
 *                   properties:
 *                     connectionStatus:
 *                       type: string
 *                       enum: [none, pending, connected, blocked]
 *                       description: Connection status with the requesting user (if authenticated)
 *                     isFollowing:
 *                       type: boolean
 *                       description: Whether the requesting user follows this user (if authenticated)
 *                     mutualConnections:
 *                       type: integer
 *                       description: Number of mutual connections (if authenticated)
 *       404:
 *         description: User not found
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Permanently delete the authenticated user's account and all associated data. This action cannot be undone.
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account deleted successfully
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Failed to delete account
 */
router.delete('/account', authenticate, userController.deleteAccount);

export default router;