import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTaskSchema, listTasksQuerySchema, updateTaskSchema } from '../dtos/taskDto';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks visible to the current user
 *     description: Admins see all tasks. Regular users see tasks they created or that are assigned to them.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Open, "In Progress", Testing, Done] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [Low, Medium, High] }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Case-insensitive title search
 *       - in: query
 *         name: assignedTo
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Task' }
 */
router.get('/', validate(listTasksQuerySchema, 'query'), taskController.list);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task by id
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.get('/:id', taskController.getById);

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     security: [ { bearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateTaskInput' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 */
router.post('/', validate(createTaskSchema), taskController.create);

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update a task
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateTaskInput' }
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 */
router.put('/:id', validate(updateTaskSchema), taskController.update);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     security: [ { bearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 */
router.delete('/:id', taskController.remove);

export default router;
