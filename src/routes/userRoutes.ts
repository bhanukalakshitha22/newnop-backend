import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200:
 *         description: Array of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/User' }
 *       403: { description: Forbidden }
 */
router.get('/', authenticate, requireRole('admin'), userController.list);

export default router;
