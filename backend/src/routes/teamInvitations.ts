import express from 'express';
import { TeamInvitationController } from '../controllers/TeamInvitationController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();
const teamInvitationController = new TeamInvitationController();

// All routes require authentication
router.use(authenticate);

// Team invitation routes
router.post('/teams/:teamId/invitations', teamInvitationController.inviteUser);
router.get('/teams/:teamId/invitations', teamInvitationController.getTeamInvitations);

// User invitation routes
router.get('/users/me/invitations', teamInvitationController.getUserInvitations);

// Invitation actions
router.post('/invitations/:invitationId/accept', teamInvitationController.acceptInvitation);
router.post('/invitations/:invitationId/decline', teamInvitationController.declineInvitation);
router.post('/invitations/:invitationId/resend', teamInvitationController.resendInvitation);
router.delete('/invitations/:invitationId', teamInvitationController.cancelInvitation);

export default router;
