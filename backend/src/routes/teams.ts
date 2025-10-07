import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const teamController = new TeamController();

// Protected routes
router.use(authenticate);

router.get('/', teamController.getTeams);

router.get('/my-teams', teamController.getUserTeams);

router.get('/recommendations', teamController.getRecommendedTeams);

router.get('/invitations', teamController.getUserInvitations);

router.post('/', teamController.createTeam);

router.put('/:id', teamController.updateTeam);

router.delete('/:id', teamController.deleteTeam);

router.get('/:id', teamController.getTeamById);

router.post('/:id/join', teamController.joinTeam);

router.post('/:id/join-request', teamController.createJoinRequest);

router.put('/join-requests/:requestId/respond', teamController.respondToJoinRequest);

router.post('/:id/leave', teamController.leaveTeam);

router.delete('/:id/members/:memberId', teamController.removeMember);

router.post('/:id/invite', teamController.sendInvitation);

router.put('/invitations/:invitationId/respond', teamController.respondToInvitation);

// Team following
router.post('/:id/follow', teamController.followTeam);

router.delete('/:id/follow', teamController.unfollowTeam);

// Custom roles
router.post('/:id/roles', teamController.createCustomRole);

router.put('/roles/:roleId', teamController.updateCustomRole);

router.delete('/roles/:roleId', teamController.deleteCustomRole);

// Team projects
router.get('/:id/projects', teamController.getTeamProjects);

router.post('/:id/projects', teamController.createTeamProject);

export default router;