import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../models/Task';

const priorityEnum = z.enum(TASK_PRIORITIES as [string, ...string[]]);
const statusEnum = z.enum(TASK_STATUSES as [string, ...string[]]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  dueDate: z.string().datetime().optional().or(z.string().length(0)).optional(),
  assignedTo: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  dueDate: z.string().datetime().optional().or(z.string().length(0)).optional(),
  assignedTo: z.string().optional(),
});

export const listTasksQuerySchema = z.object({
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  q: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
