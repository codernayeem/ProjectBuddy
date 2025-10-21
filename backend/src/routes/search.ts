import { Router } from 'express';
import { SearchController } from '../controllers/SearchController';
import { authenticate } from '../middlewares/auth';

const router = Router();
const searchController = new SearchController();

// All search routes can be accessed without authentication, but some results may vary based on auth status
// Unified search
router.get('/', searchController.unifiedSearch);

// Search users
router.get('/users', searchController.searchUsers);

// Search teams
router.get('/teams', searchController.searchTeams);

// Recommended users (requires authentication)
router.get('/recommended-users', authenticate, searchController.getRecommendedUsers);

// Suggested teams (requires authentication)
router.get('/suggested-teams', authenticate, searchController.getSuggestedTeams);

// Get popular skills
router.get('/skills', searchController.getPopularSkills);

// Get popular universities
router.get('/universities', searchController.getPopularUniversities);

export default router;
