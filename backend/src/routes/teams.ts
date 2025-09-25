import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const teamController = new TeamController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         shortDescription:
 *           type: string
 *         visibility:
 *           type: string
 *           enum: [PUBLIC, PRIVATE, INVITE_ONLY]
 *         type:
 *           type: string
 *           enum: [PROJECT_BASED, SKILL_BASED, STARTUP, FREELANCE, OPEN_SOURCE, HACKATHON, STUDY_GROUP, NETWORKING, MENTORSHIP]
 *         avatar:
 *           type: string
 *         banner:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         location:
 *           type: string
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
 *         website:
 *           type: string
 *         social:
 *           type: object
 *         ownerId:
 *           type: string
 *           format: uuid
 *         viewCount:
 *           type: integer
 *         memberCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         teamId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         role:
 *           type: string
 *           enum: [OWNER, ADMIN, LEAD, MEMBER, CONTRIBUTOR]
 *         title:
 *           type: string
 *         joinedAt:
 *           type: string
 *           format: date-time
 *     TeamInvitation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         teamId:
 *           type: string
 *           format: uuid
 *         inviterId:
 *           type: string
 *           format: uuid
 *         inviteeId:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *         roleId:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, DECLINED, EXPIRED]
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Public routes
/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [PROJECT_BASED, SKILL_BASED, STARTUP, FREELANCE, OPEN_SOURCE, HACKATHON, STUDY_GROUP, NETWORKING, MENTORSHIP]
 *       - in: query
 *         name: isRecruiting
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, memberCount, viewCount, name]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
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
router.get('/', teamController.getTeams);

// Protected routes
router.use(authenticate);

// User-specific routes (must come before parameterized routes)
/**
 * @swagger
 * /teams/my-teams:
 *   get:
 *     summary: Get current user's teams
 *     tags: [Teams]
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
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [OWNER, ADMIN, LEAD, MEMBER, CONTRIBUTOR]
 *     responses:
 *       200:
 *         description: User teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 */
router.get('/my-teams', teamController.getUserTeams);

/**
 * @swagger
 * /teams/recommendations:
 *   get:
 *     summary: Get recommended teams for user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Recommended teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 */
router.get('/recommendations', teamController.getRecommendedTeams);

/**
 * @swagger
 * /teams/invitations:
 *   get:
 *     summary: Get user's team invitations
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, DECLINED, EXPIRED]
 *           default: PENDING
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
 *         description: Team invitations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamInvitation'
 *       401:
 *         description: User not authenticated
 */
router.get('/invitations', teamController.getUserInvitations);

// Team management
/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               shortDescription:
 *                 type: string
 *                 maxLength: 200
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE, INVITE_ONLY]
 *                 default: PUBLIC
 *               type:
 *                 type: string
 *                 enum: [PROJECT_BASED, SKILL_BASED, STARTUP, FREELANCE, OPEN_SOURCE, HACKATHON, STUDY_GROUP, NETWORKING, MENTORSHIP]
 *                 default: PROJECT_BASED
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               isRecruiting:
 *                 type: boolean
 *                 default: true
 *               maxMembers:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1000
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               website:
 *                 type: string
 *               social:
 *                 type: object
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid team data
 *       401:
 *         description: User not authenticated
 */
router.post('/', teamController.createTeam);

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
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
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               shortDescription:
 *                 type: string
 *                 maxLength: 200
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE, INVITE_ONLY]
 *               type:
 *                 type: string
 *                 enum: [PROJECT_BASED, SKILL_BASED, STARTUP, FREELANCE, OPEN_SOURCE, HACKATHON, STUDY_GROUP, NETWORKING, MENTORSHIP]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               isRecruiting:
 *                 type: boolean
 *               maxMembers:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 1000
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               website:
 *                 type: string
 *               social:
 *                 type: object
 *     responses:
 *       200:
 *         description: Team updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Invalid team data
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to update this team
 *       404:
 *         description: Team not found
 */
router.put('/:id', teamController.updateTeam);

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
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
 *         description: Team deleted successfully
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to delete this team
 *       404:
 *         description: Team not found
 */
router.delete('/:id', teamController.deleteTeam);

// Team details (must come after user routes)
/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
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
 *         description: Team retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Team not found
 */
router.get('/:id', teamController.getTeamById);

/**
 * @swagger
 * /teams/{id}/members:
 *   get:
 *     summary: Get team members
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *           default: 20
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [OWNER, ADMIN, LEAD, MEMBER, CONTRIBUTOR]
 *     responses:
 *       200:
 *         description: Team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMember'
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to view team members
 *       404:
 *         description: Team not found
 */
router.get('/:id/members', teamController.getTeamMembers);

// Team membership
/**
 * @swagger
 * /teams/{id}/join:
 *   post:
 *     summary: Join a team
 *     tags: [Teams]
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
 *               message:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Successfully joined team
 *       400:
 *         description: Cannot join team (team full, already member, etc.)
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Team is private or invite-only
 *       404:
 *         description: Team not found
 */
router.post('/:id/join', teamController.joinTeam);

/**
 * @swagger
 * /teams/{id}/leave:
 *   post:
 *     summary: Leave a team
 *     tags: [Teams]
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
 *         description: Successfully left team
 *       400:
 *         description: Cannot leave team (owner cannot leave, etc.)
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Team not found or user not a member
 */
router.post('/:id/leave', teamController.leaveTeam);

/**
 * @swagger
 * /teams/{id}/members/{memberId}/role:
 *   put:
 *     summary: Update team member role
 *     tags: [Teams]
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
 *         name: memberId
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
 *                 enum: [ADMIN, LEAD, MEMBER, CONTRIBUTOR]
 *               title:
 *                 type: string
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *       400:
 *         description: Invalid role or cannot update role
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to update member roles
 *       404:
 *         description: Team or member not found
 */
router.put('/:id/members/:memberId/role', teamController.updateMemberRole);

/**
 * @swagger
 * /teams/{id}/members/{memberId}:
 *   delete:
 *     summary: Remove team member
 *     tags: [Teams]
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
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       400:
 *         description: Cannot remove member (owner cannot be removed, etc.)
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to remove members
 *       404:
 *         description: Team or member not found
 */
router.delete('/:id/members/:memberId', teamController.removeMember);

// Team invitations
/**
 * @swagger
 * /teams/{id}/invite:
 *   post:
 *     summary: Send team invitation
 *     tags: [Teams]
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
 *               userId:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *               roleId:
 *                 type: string
 *                 format: uuid
 *               message:
 *                 type: string
 *                 maxLength: 500
 *             oneOf:
 *               - required: [userId]
 *               - required: [email]
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvitation'
 *       400:
 *         description: Invalid invitation data or user already invited/member
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to send invitations
 *       404:
 *         description: Team or invitee not found
 */
router.post('/:id/invite', teamController.sendInvitation);

/**
 * @swagger
 * /teams/invitations/{invitationId}/respond:
 *   put:
 *     summary: Respond to team invitation
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invitationId
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
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, decline]
 *     responses:
 *       200:
 *         description: Invitation response processed successfully
 *       400:
 *         description: Invalid response or invitation expired
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Not authorized to respond to this invitation
 *       404:
 *         description: Invitation not found
 */
router.put('/invitations/:invitationId/respond', teamController.respondToInvitation);

export default router;