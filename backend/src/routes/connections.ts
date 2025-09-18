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

/**
 * @swagger
 * components:
 *   schemas:
 *     Connection:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         senderId:
 *           type: string
 *           format: uuid
 *         receiverId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, DECLINED, BLOCKED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /connections/send:
 *   post:
 *     summary: Send connection request
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Connection request sent successfully
 *       400:
 *         description: Failed to send request
 *       401:
 *         description: User not authenticated
 */
router.post('/send', authenticate, validate(connectionRequestSchema), connectionController.sendRequest);

/**
 * @swagger
 * /connections/{id}/respond:
 *   put:
 *     summary: Respond to connection request
 *     tags: [Connections]
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
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, decline, block]
 *     responses:
 *       200:
 *         description: Connection request responded successfully
 *       400:
 *         description: Failed to respond to request
 *       401:
 *         description: User not authenticated
 */
router.put('/:id/respond', authenticate, validate(connectionResponseSchema), connectionController.respondToRequest);

/**
 * @swagger
 * /connections/{id}:
 *   delete:
 *     summary: Remove connection
 *     tags: [Connections]
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
 *         description: Connection removed successfully
 *       400:
 *         description: Failed to remove connection
 *       401:
 *         description: User not authenticated
 */
router.delete('/:id', authenticate, connectionController.removeConnection);

/**
 * @swagger
 * /connections:
 *   get:
 *     summary: Get user connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, DECLINED, BLOCKED]
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
 *         description: Connections retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get('/', authenticate, validateQuery(connectionPaginationSchema), connectionController.getConnections);

/**
 * @swagger
 * /connections/pending:
 *   get:
 *     summary: Get pending connection requests
 *     tags: [Connections]
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
 *         description: Pending requests retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get('/pending', authenticate, validateQuery(paginationSchema), connectionController.getPendingRequests);

/**
 * @swagger
 * /connections/status/{userId}:
 *   get:
 *     summary: Get connection status with another user
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Connection status retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get('/status/:userId', authenticate, connectionController.getConnectionStatus);

/**
 * @swagger
 * /connections/stats:
 *   get:
 *     summary: Get connection statistics
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connection stats retrieved successfully
 *       401:
 *         description: User not authenticated
 */
router.get('/stats', authenticate, connectionController.getConnectionStats);

export default router;