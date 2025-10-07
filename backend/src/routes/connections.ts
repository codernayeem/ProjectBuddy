import { Router } from 'express';
import { ConnectionController } from '../controllers/ConnectionController';
import { authenticate } from '../middlewares/auth';
import { validate, validateQuery } from '../middlewares/validation';
import {
  connectionRequestSchema,
  connectionResponseSchema,
  paginationSchema,
  connectionPaginationSchema,
} from '../utils/validation';

const router = Router();
const connectionController = new ConnectionController();

router.use(authenticate);


router.get('/stats', connectionController.getConnectionStats);

router.get('/status/:userId', connectionController.getConnectionStatus);

router.get('/', validateQuery(connectionPaginationSchema), connectionController.getConnections);

router.get('/pending', validateQuery(paginationSchema), connectionController.getPendingRequests);

router.post('/send', validate(connectionRequestSchema), connectionController.sendRequest);

router.put('/:id/respond', validate(connectionResponseSchema), connectionController.respondToRequest);

router.delete('/:id', connectionController.removeConnection);

export default router;