import { Types, FilterQuery } from 'mongoose';
import { taskRepository, SortField, SortDir } from '../repositories/taskRepository';
import { userRepository } from '../repositories/userRepository';
import { HttpError } from '../utils/httpError';
import { ITask, TaskPriority, TaskStatus } from '../models/Task';
import { UserRole } from '../models/User';

interface Actor {
  id: string;
  role: UserRole;
}

interface ListFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  q?: string;
  assignedTo?: string;
  sortBy?: SortField;
  sortDir?: SortDir;
}

interface CreateInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
}

interface UpdateInput extends Partial<CreateInput> {}

function resolveId(field: unknown): string {
  if (field && typeof field === 'object' && '_id' in field) {
    return (field as { _id: { toString(): string } })._id.toString();
  }
  return field?.toString?.() ?? String(field ?? '');
}

function isOwnerOrAssignee(task: ITask, userId: string): boolean {
  return resolveId(task.createdBy) === userId || resolveId(task.assignedTo) === userId;
}

async function ensureAssigneeAllowed(actor: Actor, assignedTo?: string) {
  if (!assignedTo) return;
  if (!Types.ObjectId.isValid(assignedTo)) throw new HttpError(400, 'Invalid assignedTo');
  if (actor.role !== 'admin' && assignedTo !== actor.id) {
    throw new HttpError(403, 'Users can only assign tasks to themselves');
  }
  const user = await userRepository.findById(assignedTo);
  if (!user) throw new HttpError(404, 'Assignee not found');
}

export const taskService = {
  async list(actor: Actor, filters: ListFilters) {
    const query: FilterQuery<ITask> = {};

    if (actor.role !== 'admin') {
      query.$or = [{ createdBy: actor.id }, { assignedTo: actor.id }];
    }
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.assignedTo && Types.ObjectId.isValid(filters.assignedTo)) {
      query.assignedTo = new Types.ObjectId(filters.assignedTo);
    }
    if (filters.q) {
      query.title = { $regex: filters.q, $options: 'i' };
    }

    return taskRepository.list(query, filters.sortBy, filters.sortDir);
  },

  async getById(actor: Actor, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new HttpError(400, 'Invalid task id');
    const task = await taskRepository.findById(id);
    if (!task) throw new HttpError(404, 'Task not found');
    if (actor.role !== 'admin' && !isOwnerOrAssignee(task, actor.id)) {
      throw new HttpError(403, 'Forbidden');
    }
    return task;
  },

  async create(actor: Actor, input: CreateInput) {
    await ensureAssigneeAllowed(actor, input.assignedTo);
    const task = await taskRepository.create({
      title: input.title,
      description: input.description ?? '',
      priority: input.priority ?? 'Medium',
      status: input.status ?? 'Open',
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      createdBy: new Types.ObjectId(actor.id),
      assignedTo: input.assignedTo ? new Types.ObjectId(input.assignedTo) : undefined,
    });
    return taskRepository.findById(task._id.toString());
  },

  async update(actor: Actor, id: string, input: UpdateInput) {
    if (!Types.ObjectId.isValid(id)) throw new HttpError(400, 'Invalid task id');
    const existing = await taskRepository.findById(id);
    if (!existing) throw new HttpError(404, 'Task not found');
    if (actor.role !== 'admin' && !isOwnerOrAssignee(existing, actor.id)) {
      throw new HttpError(403, 'Forbidden');
    }
    if (input.assignedTo !== undefined) {
      await ensureAssigneeAllowed(actor, input.assignedTo || undefined);
    }

    const update: Partial<ITask> = {};
    if (input.title !== undefined) update.title = input.title;
    if (input.description !== undefined) update.description = input.description;
    if (input.priority !== undefined) update.priority = input.priority;
    if (input.status !== undefined) update.status = input.status;
    if (input.dueDate !== undefined) {
      update.dueDate = input.dueDate ? new Date(input.dueDate) : undefined;
    }
    if (input.assignedTo !== undefined) {
      update.assignedTo = input.assignedTo ? new Types.ObjectId(input.assignedTo) : undefined;
    }

    return taskRepository.update(id, update);
  },

  async remove(actor: Actor, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new HttpError(400, 'Invalid task id');
    const existing = await taskRepository.findById(id);
    if (!existing) throw new HttpError(404, 'Task not found');
    if (actor.role !== 'admin' && resolveId(existing.createdBy) !== actor.id) {
      throw new HttpError(403, 'Only the creator or an admin can delete this task');
    }
    await taskRepository.delete(id);
  },
};
