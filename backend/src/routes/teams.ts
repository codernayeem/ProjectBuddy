import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const teamController = new TeamController();

// Public routes
router.get('/', teamController.getTeams);

// Protected routes
router.use(authenticate);

// User-specific routes (must come before parameterized routes)
router.get('/my-teams', teamController.getUserTeams);
router.get('/recommendations', teamController.getRecommendedTeams);
router.get('/invitations', teamController.getUserInvitations);

// Team management
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team details (must come after user routes)
router.get('/:id', teamController.getTeamById);
router.get('/:id/members', teamController.getTeamMembers);

// Team membership
router.post('/:id/join', teamController.joinTeam);
router.post('/:id/leave', teamController.leaveTeam);
router.put('/:id/members/:memberId/role', teamController.updateMemberRole);
router.delete('/:id/members/:memberId', teamController.removeMember);

// Team invitations
router.post('/:id/invite', teamController.sendInvitation);
router.put('/invitations/:invitationId/respond', teamController.respondToInvitation);

export default router;