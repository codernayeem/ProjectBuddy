import express from 'express';
import { TeamJoinRequestController } from '../controllers/TeamJoinRequestController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();
const teamJoinRequestController = new TeamJoinRequestController();

// All routes require authentication
router.use(authenticate);

// Team join request routes
router.post('/teams/:teamId/join-requests', teamJoinRequestController.createRequest);
router.get('/teams/:teamId/join-requests', teamJoinRequestController.getTeamRequests);
router.get('/teams/:teamId/join-requests/count', teamJoinRequestController.getPendingCount);

// User join request routes
router.get('/users/me/join-requests', teamJoinRequestController.getUserRequests);

// Join request actions
router.post('/join-requests/:requestId/accept', teamJoinRequestController.acceptRequest);
router.post('/join-requests/:requestId/reject', teamJoinRequestController.rejectRequest);
router.delete('/join-requests/:requestId', teamJoinRequestController.cancelRequest);

export default router;
