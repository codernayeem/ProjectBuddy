import express from 'express';
import { TeamRoleController } from '../controllers/TeamRoleController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();
const teamRoleController = new TeamRoleController();

// All routes require authentication
router.use(authenticate);

// Role management routes
router.get('/teams/:teamId/roles', teamRoleController.getTeamRoles);
router.post('/teams/:teamId/roles', teamRoleController.createRole);
router.put('/teams/:teamId/roles/:roleId', teamRoleController.updateRole);
router.delete('/teams/:teamId/roles/:roleId', teamRoleController.deleteRole);

// Member role assignment routes
router.get('/teams/:teamId/members/:memberId/roles', teamRoleController.getMemberRoles);
router.post('/teams/:teamId/members/:memberId/roles/:roleId', teamRoleController.assignRole);
router.delete('/teams/:teamId/members/:memberId/roles/:roleId', teamRoleController.removeRole);

export default router;
