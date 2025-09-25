import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import {
  createProjectSchema,
  updateProjectSchema,
  inviteToProjectSchema,
  paginationSchema,
} from '../utils/validation';

const router = Router();
const projectController = new ProjectController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         shortDescription:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PLANNING, RECRUITING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED]
 *         category:
 *           type: string
 *           enum: [WEB_DEVELOPMENT, MOBILE_DEVELOPMENT, GAME_DEVELOPMENT, AI_ML, DATA_SCIENCE, BLOCKCHAIN, IOT, CYBERSECURITY, UI_UX_DESIGN, MARKETING, BUSINESS, RESEARCH, OPEN_SOURCE, STARTUP, EDUCATIONAL, OTHER]
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         estimatedDuration:
 *           type: string
 *         isPublic:
 *           type: boolean
 *         isRecruiting:
 *           type: boolean
 *         maxMembers:
 *           type: integer
 *         currentMembers:
 *           type: integer
 *         requiredSkills:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         repositoryUrl:
 *           type: string
 *         liveUrl:
 *           type: string
 *         documentationUrl:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         ownerId:
 *           type: string
 *           format: uuid
 *         teamId:
 *           type: string
 *           format: uuid
 *         viewCount:
 *           type: integer
 *         likeCount:
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
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               isPublic:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: User not authenticated
 */
router.post('/', authenticate, validate(createProjectSchema), projectController.createProject);

/**
 * @swagger
 * /projects/search:
 *   get:
 *     summary: Search projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
router.get('/search', optionalAuth, validateQuery(paginationSchema), projectController.searchProjects);

/**
 * @swagger
 * /projects/my:
 *   get:
 *     summary: Get current user's projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User projects retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get('/my', authenticate, validateQuery(paginationSchema), projectController.getUserProjects);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', optionalAuth, projectController.getProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
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
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Update failed
 *       401:
 *         description: User not authenticated
 */
router.put('/:id', authenticate, validate(updateProjectSchema), projectController.updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
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
 *         description: Project deleted successfully
 *       400:
 *         description: Delete failed
 *       401:
 *         description: User not authenticated
 */
router.delete('/:id', authenticate, projectController.deleteProject);

/**
 * @swagger
 * /projects/{id}/invite:
 *   post:
 *     summary: Invite user to project
 *     tags: [Projects]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TEAM_LEAD, SENIOR_DEVELOPER, DEVELOPER, DESIGNER, TESTER, BUSINESS_ANALYST, MARKETING, CONTRIBUTOR, VIEWER]
 *     responses:
 *       201:
 *         description: User invited successfully
 *       400:
 *         description: Invitation failed
 *       401:
 *         description: User not authenticated
 */
router.post('/:id/invite', authenticate, validate(inviteToProjectSchema), projectController.inviteToProject);

/**
 * @swagger
 * /projects/{id}/members/{userId}:
 *   delete:
 *     summary: Remove user from project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User removed successfully
 *       400:
 *         description: Removal failed
 *       401:
 *         description: User not authenticated
 */
router.delete('/:id/members/:userId', authenticate, projectController.removeFromProject);

/**
 * @swagger
 * /projects/{id}/members/{userId}/role:
 *   put:
 *     summary: Update member role
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: userId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, TEAM_LEAD, SENIOR_DEVELOPER, DEVELOPER, DESIGNER, TESTER, BUSINESS_ANALYST, MARKETING, CONTRIBUTOR, VIEWER]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Update failed
 *       401:
 *         description: User not authenticated
 */
router.put('/:id/members/:userId/role', authenticate, projectController.updateMemberRole);

/**
 * @swagger
 * /projects/{id}/members:
 *   get:
 *     summary: Get project members
 *     tags: [Projects]
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
 *         description: Members retrieved successfully
 *       400:
 *         description: Access denied
 *       401:
 *         description: User not authenticated
 */
router.get('/:id/members', authenticate, projectController.getProjectMembers);

export default router;